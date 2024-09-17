const { price } = require('./math');
const { sanitize } = require('./sanitize');

var variable1 = '5' - 3;
var variable2 = '5' + 3;
var variable3 = '5' + - '2';
var variable4 = ['10', '10', '10', '10', '10'].map(parseInt);
var variable5 = 'foo ' + 1 + 1;

console.log(price(variable1));
console.log(price(variable2));
console.log(variable3);
console.log(variable4);
console.log(sanitize(variable5));
