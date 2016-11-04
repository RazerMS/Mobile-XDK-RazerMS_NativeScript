var createViewModel = require("./main-view-model").createViewModel;
var observable = require("data/observable");
var pageData = new observable.Observable();
var webViewModule = require("ui/web-view");

var isInternalDebugging = true;
var moduleId = 'molpay-mobile-xdk-cordova';
var wrapperVersion = '0';

// Constants
var molpaySdkUrl = 'molpay-mobile-xdk-www/index.html';
var mpopenmolpaywindow = 'mpopenmolpaywindow:\/\/';
var mptransactionresults = 'mptransactionresults:\/\/';
var mprunscriptonpopup = 'mprunscriptonpopup:\/\/';
var mpcloseallwindows = 'mpcloseallwindows:\/\/';
var mppinstructioncapture = 'mppinstructioncapture:\/\/';
var molpayresulturl = 'https:\/\/www.onlinepayment.com.my/MOLPay/result.php';
var molpaynbepayurl = 'https:\/\/www.onlinepayment.com.my/MOLPay/nbepay.php';
var b4results = '"msgType":"B4"';
var c6results = '"msgType":"C6"';

// Variables
var molpayPaymentDetails;
var transactionResultCallback;
var molpayDiv, mainUiFrame, bankUiWindow, molpayTransactionRequestFrame;
var isClosingMolpay = false;
var isMolpayLoaded = false;
var page;


console.log("i have run");

var createBankUiWindow = function(base64HtmlString) {
    // Open bank transaction window
    // var url = 'data:text/html;base64,' + base64HtmlString;
    // bankUiWindow = window.open(url, '_blank', 'location=no,hardwareback=no,disallowoverscroll=yes,toolbarposition=top,transitionstyle=crossdissolve');

    var url = 'data:text/html;base64,' + base64HtmlString;
    bankUiWindow.url = url;

    bankUiWindow.visibility = "visible";
    mainUiFrame.visibility = "collapsed";

    // Exit event
    var onBankUIExit = function(evt) {
        mainUiFrame.contentWindow.transactionRequest();
        bankUiWindow.removeEventListener('exit', onBankUIExit);
    };
    // bankUiWindow.addEventListener('exit', onBankUIExit);

    var onBankUiLoadstop = function(event) {
        // Debug
        if (isInternalDebugging) {
            console.log('onBankUiLoadstop event.url =' + event.url);
        }

        // mainUiFrame.contentWindow.nativeWebRequestUrlUpdatesOnFinishLoad({
        //     'requestPath': event.url
        // });

        // Capture MOLPay results
        var resultsRegExp;
        var resultObject;
        // resultsRegExp = new RegExp(molpayresulturl);
        // if (event && resultsRegExp.test(event.url))
        // {
        //   // Debug
        //   if(isInternalDebugging) {console.log('onBankUiLoadstop molpayresulturl found');}

        //   bankUiWindow.executeScript(
        //     {code:'document.body.innerHTML'},
        //     function(values) {
        //       var returnResult = values[0];
        //       // Debug
        //       // if(isInternalDebugging) {console.log('bankUiWindow document.body.innerHTML retrieved = '+returnResult);}

        //       postMolpayResultHandler(returnResult);
        //       bankUiWindow.removeEventListener('loadstop', onBankUiLoadstop);
        //       bankUiWindow.close();
        //     }
        //   );
        // }               

        resultsRegExp = new RegExp(molpaynbepayurl);
        if (event && resultsRegExp.test(event.url)) {
            // Debug
            if (isInternalDebugging) {
                console.log('onBankUiLoadstop molpaynbepayurl found');
            }

            bankUiWindow.executeScript({
                    code: 'window.open = function (open) {\
        return function (url, name, features) {\
          window.location = url ;\
          return window; \
        }; \
        } (window.open);'
                },
                function(values) {
                    // Debug
                    if (isInternalDebugging) {
                        console.log('bankUiWindow window.open to window.location inject ok');
                    }
                });

            bankUiWindow.executeScript({
                    code: 'window.close = function () {\
        window.location.assign(window.location);\
        };'
                },
                function(values) {
                    // Debug
                    if (isInternalDebugging) {
                        console.log('bankUiWindow window.close to window.location.assign inject ok');
                    }
                });
        }

    };
    bankUiWindow.addEventListener('loadstop', onBankUiLoadstop);

    // Loadstart event
    var onBankUiLoadstart = function(event) {
        // alert(event.url);
        console.log(event.url);
        // Debug
        if (isInternalDebugging) {
            console.log('onBankUiLoadstart event.url = ' + event.url);
        }

        // Capture MOLPay results
        var resultsRegExp;
        var resultObject;

        resultsRegExp = new RegExp(molpayresulturl);
        if (event && resultsRegExp.test(event.url)) {
            // Debug
            if (isInternalDebugging) {
                console.log('onBankUiLoadstart molpayresulturl found');
            }


            mainUiFrame.contentWindow.nativeWebRequestUrlUpdates({
                'requestPath': event.url
            });

            // bankUiWindow.executeScript(
            //   {code:'document.body.innerHTML'},
            //   function(values) {
            //     var returnResult = values[0];
            //     // Debug
            //     if(isInternalDebugging) {console.log('bankUiWindow document.body.innerHTML retrieved = '+returnResult);}

            //     postMolpayResultHandler(returnResult);
            // bankUiWindow.removeEventListener('loadstop', onBankUiLoadstop);
            // bankUiWindow.close();
            //   }
            // );
        }

        resultsRegExp = new RegExp(molpaynbepayurl);
        if (event && resultsRegExp.test(event.url)) {
            // Debug
            if (isInternalDebugging) {
                console.log('onBankUiLoadstart molpaynbepayurl found');
            }

            var maximumCheckCount = 10;
            var currentCheckCount = 0;
            var checkResultInt = setInterval(function() {
                checkResult()
            }, 1000);

            var checkResult = function() {
                currentCheckCount++;

                if (currentCheckCount > maximumCheckCount) {
                    clearInterval(checkResultInt);
                } else {
                    bankUiWindow.executeScript({
                            code: 'document.body.innerHTML'
                        },
                        function(values) {
                            var returnResult = values[0];
                            // Debug
                            if (isInternalDebugging) {
                                console.log('bankUiWindow document.body.innerHTML retrieved = ' + returnResult);
                            }

                            // B4 results
                            var b4RegExp = new RegExp(b4results);
                            if (b4RegExp.test(returnResult)) {
                                postMolpayResultHandler(returnResult);
                                bankUiWindow.removeEventListener('loadstart', onBankUiLoadstart);
                                bankUiWindow.close();
                                clearInterval(checkResultInt);
                            }
                        });
                }
            }
        }
    };

    bankUiWindow.addEventListener('loadstart', onBankUiLoadstart);
};

var inAppCallback = function(data) {
    var base64HtmlString;
    var regexp;

    // Capture MOLPay results
    if (data && data.indexOf(mpopenmolpaywindow) > -1) {
        regexp = new RegExp(mpopenmolpaywindow, 'g');
        base64HtmlString = data.replace(regexp, '');
        if (base64HtmlString && base64HtmlString.length > 0) {
            // Debug
            if (isInternalDebugging) {
                console.log('inAppCallback base64HtmlString = ', base64HtmlString);
            }
            createBankUiWindow(base64HtmlString);
        }
    }

    // Close bank windows
    else if (data && data.indexOf(mpcloseallwindows) > -1) {
        // Debug
        if (isInternalDebugging) {
            console.log('inAppCallback closing bankUiWindow');
        }
        bankUiWindow.close();
    }

    //capture image
    else if (data && data.indexOf(mppinstructioncapture) > -1) {
        regexp = new RegExp(mppinstructioncapture, 'g');
        base64HtmlString = data.replace(regexp, '');
        var json = JSON.parse(atob(base64HtmlString));

        //debug
        if (isInternalDebugging) {
            console.log('inAppCallback Imagebase64 ' + JSON.stringify(json))
        }

        //param of image
        var params = {
            data: json.base64ImageUrlData,
            prefix: json.filename,
            format: 'PNG',
            quality: 100,
            mediaScanner: true
        };
        window.imageSaver.saveBase64Image(params,
            //save image success callback
            function(filePath) {
                ImageSuccessToast();
            },
            //save image fail callback
            saveImageFailed
        );

        function ImageSuccessToast() {
            window.plugins.toast.showWithOptions({
                message: "Image saved success!",
                duration: 1000, // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                position: "bottom"
            });
        }

        function ImageFailToast() {
            window.plugins.toast.showWithOptions({
                message: "Image saved fail!",
                duration: 1000,
                position: "bottom"
            });
        }

        function saveImageFailed() {
            var permissions = cordova.plugins.permissions;

            ImageFailToast();
            var errorCallback = function() {
                ImageFailToast();
            }

            permissions.requestPermission(
                permissions.WRITE_EXTERNAL_STORAGE,
                function(status) {
                    if (!status.hasPermission) {
                        errorCallback();
                    } else {
                        saveImage();
                    };
                },
                errorCallback);
        }

        var saveImage = function() {
            //plugin save image
            window.imageSaver.saveBase64Image(params,
                //save image success callback
                function(filePath) {
                    ImageSuccessToast();
                },
                //save image fail callback
                function(msg) {
                    ImageFailToast();
                }
            );
        }
    }

    // C6 results
    else if (data && data.indexOf(mptransactionresults) > -1) {
        regexp = new RegExp(mptransactionresults, 'g');
        base64HtmlString = data.replace(regexp, '');
        if (base64HtmlString && base64HtmlString.length > 0) {
            var resultData = window.atob(base64HtmlString);
            var jsonResult = JSON.stringify(JSON.parse(resultData));
            // alert(jsonResult);
            transactionResultCallback(jsonResult);

            // CLosing Molpay
            if (isClosingMolpay) {
                molpayDiv.innerHTML = '';
                isClosingMolpay = false;
            }

            if (molpayTransactionRequestFrame) {
                molpayTransactionRequestFrame.remove();
            }

        }
    }

    // Run script on BankUI 
    if (data && data.indexOf(mprunscriptonpopup) > -1) {
        regexp = new RegExp(mprunscriptonpopup, 'g');
        base64HtmlString = data.replace(regexp, '');
        if (base64HtmlString && base64HtmlString.length > 0) {
            var script = window.atob(base64HtmlString);
            // Debug
            if (isInternalDebugging) {
                console.log('run script on popup, script =' + script);
            }
            bankUiWindow.executeScript({
                    code: script
                },
                function(values) {
                    // Debug
                    if (isInternalDebugging) {
                        console.log('run script on popup ok');
                    }
                });

        }
    }

};

var onTap = function() {
    console.log("hello");
    if (mainUiFrame.visibility !== "visible") {

        mainUiFrame.visibility = "visible";
        bankUiWindow.visibility = "collapsed";
    } else {

        mainUiFrame.visibility = "collapsed";
        bankUiWindow.visibility = "visible";
    }
}

function pageLoaded(args) {
    console.log("i am in");
    page = args.object;
    setupWebViewInterface(page);
}

// Initializes plugin with a webView
function setupWebViewInterface(page) {
    mainUiFrame = page.getViewById('mainWebView');
    bankUiWindow = page.getViewById('bankWebView');
    mainUiFrame.url = "https://www.google.com";
    bankUiWindow.src = "~/try.html";
    mainUiFrame.visibility = "collapsed";

    mainUiFrame.on('loadFinished', (args) => {
        if (!args.error) {
            if (!isMolpayLoaded) {
                isMolpayLoaded = true;
                // evaljs(mainUiFrame, "updateSdkData(" + molpayPaymentDetails + ", " + inAppCallback + ")");
            }
            console.log("i have loaded this url : " + args.url);
        }
    });

    mainUiFrame.on('loadStarted', (args) => {
        console.log("i am in load start : " + args.url);
    })

}

var evaljs = function(webview, evalfunc) {
    if (webView.ios) {
        webView.ios.stringByEvaluatingJavaScriptFromString(evalfunc);
    } else if (webView.android) {
        var url = 'javascript:' + evalfunc;
        webView.android.loadUrl(url);
    }
};

exports.pageLoaded = pageLoaded;
exports.onTap = onTap;