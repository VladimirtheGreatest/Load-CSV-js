const fs = require('fs');
const _ = require('lodash');

function loadCSV(filename, options) {
    let data = fs.readFileSync(filename, {encoding: 'utf-8'});
    console.log(data);
    data = data.split('\n').map(row => row.split(','));
    console.log(data);
    data = data.map(row => _.dropRightWhile(row , val => val === '')); // drop extra column in every row start from the right
    console.log(data);
}

loadCSV('data.csv');