const fs = require("fs");
const _ = require("lodash");

function loadCSV(filename, {converters = {}}) {
  let data = fs.readFileSync(filename, { encoding: "utf-8" });
  data = data.split("\n").map((row) => row.split(","));
  data = data.map((row) => _.dropRightWhile(row, (val) => val === "")); // drop extra column in every row start from the right
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
  console.log(data);
}
loadCSV("data.csv", {  
    converters : {
        passed: val => val === 'TRUE' ? true : false  //I can use custom logic here to convert values 
    }
});
