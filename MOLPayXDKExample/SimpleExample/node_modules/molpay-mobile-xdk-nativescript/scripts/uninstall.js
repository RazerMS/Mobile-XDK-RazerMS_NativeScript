var fs = require('fs');
var path = require('path');

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    } else {
        console.error("\x1b[31m", "Remove folder molpay-mobile-xdk-www failed! Please remove app/molpay-mobile-xdk-www folder manually to completly uninstall molpay-mobile-xdk-nativescript.\n");
    }
};


var cwd = process.cwd() + '/';
var primaryDir = path.normalize(cwd + "../../");
var appDir = primaryDir + 'app/';

deleteFolderRecursive(appDir + "molpay-mobile-xdk-www");