const fs = require("fs");
const _ = require("lodash");

function extractColumns(data, columnNames){
    const headers = _.first(data);
    const indexes = _.map(columnNames, column => headers.indexOf(column));
    const extracted = _.map(data, row => _.pullAt(row, indexes));

    return extracted;
}

function loadCSV(filename,
     {converters = {},
      dataColumns = [], 
      labelColumns = []
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
  console.log(data);
  console.log(labels);

}
loadCSV("data.csv", { 
    dataColumns : ['height','value'],
    labelColumns: ['passed'],
    converters : {
        passed: val => val === 'TRUE' ? true : false  //I can use custom logic here to convert values 
    }
});
