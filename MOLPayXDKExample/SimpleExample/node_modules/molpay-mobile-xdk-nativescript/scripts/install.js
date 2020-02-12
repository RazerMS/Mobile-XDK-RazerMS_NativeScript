var fs = require("fs");
var copydir = require('copy-dir');
var path = require('path');
var cwd = process.cwd() + '/';
var primaryDir = path.normalize(cwd + "../../");
var appDir = primaryDir + 'app/';

var packageJsonFile = path.join(primaryDir, 'package.json');
if (fs.existsSync(packageJsonFile)) {
    var packageJsonContent = require(packageJsonFile);
    if (!!packageJsonContent.nativescript && !!packageJsonContent.nativescript.id) {
        copydir(cwd + '/molpay-mobile-xdk-www', appDir + '/molpay-mobile-xdk-www', function(err) {
            if (err) {
                console.error("\x1b[31m","Copy folder molpay-mobile-xdk-www failed! Please copy node_modules/molpay-mobile-xdk-nativescript/molpay-mobile-xdk-www to app folder manually.\n");
            }
        });
    } else {
        console.error("\x1b[31m","Copy folder molpay-mobile-xdk-www failed! Please copy node_modules/molpay-mobile-xdk-nativescript/molpay-mobile-xdk-www to app folder manually.\n");
    }
}else{
        console.error("\x1b[31m","Copy folder molpay-mobile-xdk-www failed! Please copy node_modules/molpay-mobile-xdk-nativescript/molpay-mobile-xdk-www to app folder manually.\n");
}





// fs.copy('molpay-mobile-xdk-www', '../../app/molpay-mobile-xdk-www', function (err) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log("success!");
//   }
// }); //copies directory, even if it has subdirectories or files