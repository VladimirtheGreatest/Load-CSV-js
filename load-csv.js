const fs = require("fs");
const _ = require("lodash");
const shuffleSeed = require('shuffle-seed');

function extractColumns(data, columnNames){
    const headers = _.first(data);
    const indexes = _.map(columnNames, column => headers.indexOf(column));
    const extracted = _.map(data, row => _.pullAt(row, indexes));

    return extracted;
}

function loadCSV(filename,
     {converters = {},
      dataColumns = [], 
      labelColumns = [],
      shuffle = true,
      splitTest = false
    }) {
        console.log(dataColumns);
  let data = fs.readFileSync(filename, { encoding: "utf-8" });
  data = _.map(data.split('\n'), row => row.split(','));
  console.log(data)
//this fucking bullshit loop is necessary because for some reason there is a \r after last column in my csv file
  for(var i = 0; i < data.length; i++){
    console.log(data[i]);
    for(var j = 0; j < data[i].length; j++){
        data[i][j] = data[i][j].replace(/\n|\r/g, "");
        console.log(data[i][j]);
    }
}
  console.log(data)
 // drop extra column in every row start from the right
  data = _.dropRightWhile(data, val => _.isEqual(val, ['']));
  data = _.dropRightWhile(data, val => _.includes('\r', val));
;
  const headers = _.first(data);

  data = data.map((row, index) => {
    if (index === 0) {
      return row;
    }

    return row.map((element, index) => {
        if(converters[headers[index]]){
            const converted = converters[headers[index]](element);
            return _.isNaN(converted) ? element : converted  //if it is not number i will return original element otherwise convert
        }
      const result = parseFloat(element);
     return _.isNaN(result) ? element : result;
    });
  });

  let labels = extractColumns(data, labelColumns);
  data = extractColumns(data, dataColumns);

  data.shift();
  labels.shift();

  if (shuffle) {
    data = shuffleSeed.shuffle(data, 'phrase1');
    labels = shuffleSeed.shuffle(labels, 'phrase1');
  }

  if (splitTest) { 
    const trainSize = _.isNumber(splitTest) 
    ? splitTest
     : Math.floor(data.length / 2);

     return {
       features : data.slice(0, trainSize), //take everything from this number to the end of the array
       labels : labels.slice(0, trainSize),
       testFeatures : data.slice(trainSize),
       testLabels : labels.slice(trainSize)
     }
  } else {
    return {features: data, labels};   //default split 5050
  }


}
const { features, labels, testFeatures, testLabels} = loadCSV("data.csv", { 
    dataColumns : ['height','value'],
    labelColumns: ['passed'],
    shuffle: true,
    splitTest: false,  //number of records that should be in the test set
    converters : {
        passed: val => val === 'TRUE' ? true : false  //I can use custom logic here to convert values 
    }
});

console.log('Features',features);
console.log('Labels',labels);
console.log('Test Features',testFeatures);
console.log('Test labels',testLabels);
