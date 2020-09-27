var fs = require('fs');

var data = JSON.parse(fs.readFileSync('package.json'));

var args = process.argv.slice(2);

var major = parseInt(args[0]);
var minor = parseInt(args[1]);
var pack = parseInt(args[2]);

let version = data.version.split('.');

version[0] = parseInt(version[0])+major;
version[1] = parseInt(version[1])+minor;
version[2] = parseInt(version[2])+pack;

let v = version.join('.');
data.version = v;

fs.writeFileSync('package.json', JSON.stringify(data, '', 2));