
var doubleNumber = require('./double.js');
var p = process.argv.slice(2);
r = 0;
if (typeof p[0] != 'undefined') {
    r = parseInt(p[0]);
}
console.log(doubleNumber(r));