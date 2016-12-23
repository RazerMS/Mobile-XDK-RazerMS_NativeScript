var createViewModel = require("./main-view-model").createViewModel;
var frameModule = require("ui/frame");
var application = require('application');


var molpay = require("molpay-mobile-xdk-nativescript");

var param;
var previousPage;
var closeButton = "collapsed";
var cancelButton = "visible";

function onPageLoaded(args) {
    var molpayView = args.object.getViewById("molpay");
    args.object.bindingContext = {
        closeButton: closeButton,
        cancelButton: cancelButton
    };
    param = args.object.navigationContext;

    molpay.startMolpay(molpayView, param.molpayPaymentDetails, function(data) {
        console.log(data);
        data = JSON.parse(data);
        param.result = data;
        if (data.pInstruction === 0 || !data.pInstruction) {
            frameModule.topmost().goBack();
        } else {
            closeButton = "visible";
            cancelButton = "collapsed";
            args.object.bindingContext = {
                closeButton: closeButton,
                cancelButton: cancelButton
            };

        }
    });
    //register back button event for this page
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
}

exports.closePInst = function() {
    frameModule.topmost().goBack();
}

exports.pageUnloaded = function() {
    //un-register back button event for this page
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
};

function backEvent(args) {
    args.cancel = true;
    molpay.closeMolpay();
}

exports.onPageLoaded = onPageLoaded;
exports.closeMolpay = molpay.closeMolpay;