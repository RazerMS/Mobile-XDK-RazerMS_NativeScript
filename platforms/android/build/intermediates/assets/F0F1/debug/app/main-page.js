var createViewModel = require("./main-view-model").createViewModel;
var observable = require("data/observable");
var pageData = new observable.Observable();
var webViewModule = require("ui/web-view");
var view = require("ui/core/view");
var webViewInterfaceModule = require('nativescript-webview-interface');
var base64 = require('base-64');
var frame = require('ui/frame');

var oWebViewInterface;

var isInternalDebugging = true;
var moduleId = 'molpay-mobile-xdk-nativescript';
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
var testdata;

// Variables
var molpayPaymentDetails;
var transactionResultCallback;
var molpayDiv, mainUiFrame, bankUiWindow, molpayTransactionRequestFrame;
var isClosingMolpay = false;
var isMolpayLoaded = false;
var page;
var midcallback;
var isMidloaded = false;

var molpayPaymentDetails;
// = {
//     mp_amount: "1.10",
//     mp_username: "molpayapi",
//     mp_password: "*M0Lp4y4p1!*",
//     mp_merchant_ID: "molpaymerchant",
//     mp_app_name: "wilwe_makan2",
//     mp_verification_key: "501c4f508cf1c3f486f4f5c820591f41",
//     mp_order_ID: "COR001",
//     mp_currency: "MYR",
//     mp_country: "MY",
//     mp_channel: "",
//     mp_bill_description: "Cordova payment test",
//     mp_bill_name: "Developer",
//     mp_bill_email: "leow@molpay.com",
//     mp_bill_mobile: "+647452",
//     mp_channel_editing: false,
//     mp_editing_enabled: false,
//     mp_transaction_id: "",
//     mp_request_type: "",
//     mp_bin_lock: "",
//     mp_express_mode: false,
//     mp_sandbox_mode: false
//};

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
            evaljs(mainUiFrame, "nativeWebRequestUrlUpdatesOnFinishLoad({ 'requestPath':'"+event.url+"'})")


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
            var overwriteWindowOpen = 'window.open = function (open) {\
        return function (url, name, features) {\
          window.location = url ;\
          return window; \
        }; \
        } (window.open);';

        var overwriteWindowClose = 'window.close = function () {\
        window.location.assign(window.location);\
        };';

            evaljs(bankUiWindow,overwriteWindowOpen);

        //     bankUiWindow.executeScript({
        //             code: 'window.open = function (open) {\
        // return function (url, name, features) {\
        //   window.location = url ;\
        //   return window; \
        // }; \
        // } (window.open);'
        //         },
        //         function(values) {
        //             // Debug
        //             if (isInternalDebugging) {
        //                 console.log('bankUiWindow window.open to window.location inject ok');
        //             }
        //         });
evaljs(bankUiWindow,overwriteWindowClose);
        //     bankUiWindow.executeScript({
        //             code: 'window.close = function () {\
        // window.location.assign(window.location);\
        // };'
        //         },
        //         function(values) {
        //             // Debug
        //             if (isInternalDebugging) {
        //                 console.log('bankUiWindow window.close to window.location.assign inject ok');
        //             }
        //         });
        }

    };
    // bankUiWindow.addEventListener('loadstop', onBankUiLoadstop);
    bankUiWindow.on('loadFinished',onBankUiLoadstop)

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

            evaljs(mainUiFrame, "nativeWebRequestUrlUpdates({ 'requestPath':'"+event.url+"'})")
            // mainUiFrame.contentWindow.nativeWebRequestUrlUpdates({
            //     'requestPath': event.url
            // });

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

        // resultsRegExp = new RegExp(molpaynbepayurl);
        // if (event && resultsRegExp.test(event.url)) {
        //     // Debug
        //     if (isInternalDebugging) {
        //         console.log('onBankUiLoadstart molpaynbepayurl found');
        //     }

        //     var maximumCheckCount = 10;
        //     var currentCheckCount = 0;
        //     var checkResultInt = setInterval(function() {
        //         checkResult()
        //     }, 1000);

        //     var checkResult = function() {
        //         currentCheckCount++;

        //         if (currentCheckCount > maximumCheckCount) {
        //             clearInterval(checkResultInt);
        //         } else {
        //             bankUiWindow.executeScript({
        //                     code: 'document.body.innerHTML'
        //                 },
        //                 function(values) {
        //                     var returnResult = values[0];
        //                     // Debug
        //                     if (isInternalDebugging) {
        //                         console.log('bankUiWindow document.body.innerHTML retrieved = ' + returnResult);
        //                     }

        //                     // B4 results
        //                     var b4RegExp = new RegExp(b4results);
        //                     if (b4RegExp.test(returnResult)) {
        //                         postMolpayResultHandler(returnResult);
        //                         bankUiWindow.removeEventListener('loadstart', onBankUiLoadstart);
        //                         bankUiWindow.close();
        //                         clearInterval(checkResultInt);
        //                     }
        //                 });
        //         }
        //     }
        // }
    };

    bankUiWindow.on('loadStarted',onBankUiLoadstart)

    // bankUiWindow.addEventListener('loadstart', onBankUiLoadstart);
};

var customCall = function(data) {
	midcallback = data;
	console.log(document.URL);
	window.location.assign(window.location.href + "#mpcallback://");
};

var inAppCallback = function(data) {
    var base64HtmlString;
    var regexp;
console.log(data);
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
        // bankUiWindow.destroy();
        bankUiWindow.visibility = "collapsed";
        mainUiFrame.visibility = "visible";
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
            // var resultData = window.atob(base64HtmlString);
            var resultData = base64.decode(base64HtmlString);
            var jsonResult = JSON.stringify(JSON.parse(resultData));
            alert(jsonResult);
            // console.log(jsonResult);
            // transactionResultCallback(jsonResult);

            // CLosing Molpay
            // if (isClosingMolpay) {
            //     molpayDiv.innerHTML = '';
            //     isClosingMolpay = false;
            // }

            // if (molpayTransactionRequestFrame) {
            //     molpayTransactionRequestFrame.remove();
            // }

        }
    }

    // Run script on BankUI 
    if (data && data.indexOf(mprunscriptonpopup) > -1) {
        regexp = new RegExp(mprunscriptonpopup, 'g');
        base64HtmlString = data.replace(regexp, '');
        if (base64HtmlString && base64HtmlString.length > 0) {
            // var script = window.atob(base64HtmlString);
            var script = base64.decode(base64HtmlString);
            // Debug
            if (isInternalDebugging) {
                console.log('run script on popup, script =' + script);
            }
            evaljs(bankUiWindow,script);
            // bankUiWindow.executeScript({
            //         code: script
            //     },
            //     function(values) {
            //         // Debug
            //         if (isInternalDebugging) {
            //             console.log('run script on popup ok');
            //         }
            //     });

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
    // page = args.object;
    setupWebViewInterface();
}

function readFile(path,callback){
	    var fs = require("file-system");
    // var base64 = require("base64-node");
    // console.log(fs);
var documents = fs.knownFolders.currentApp();
var myFile = documents.getFile(path);
var html;
// console.log(myFile);

    myFile.readText()
        .then(function (content) {
        	console.log(typeof content);
        	callback(content);
        	// html = window.btoa(content);
        	// try {
        	
        		
        	// // html = base64.encode(content);
        	// html = window.btoa(content);

        	// console.log(html);	
        	// } catch (e) {
        	// console.log(e);
        	// };

// var url = "data:text/html;base64,"+html;
// console.log(url);
//         mainUiFrame.url = url;
        }, function (error) {
            console.log("Error: " + error);
        });

}

// Initializes plugin with a webView
function setupWebViewInterface() {
	// var base64 = require("base64-node");
    // mainUiFrame = page.getViewById('mainWebView');
    // bankUiWindow = page.getViewById('bankWebView');
    var html;
    // mainUiFrame.url = "file:///android_asset/"+molpaySdkUrl;
    // mainUiFrame.src = "~/" + molpaySdkUrl;
    // mainUiFrame.src = "~/try.html";
    // readFile(molpaySdkUrl,function(data){
    // 	html = data;
    // 	// try {
    // 	// 	var html = window.btoa(data);
    // 	// 	console.log(html);
    // 	// } catch (e) {
    // 	// 	console.log(e);
    // 	// 	try {
    // 	// 		var html = base64.encode(data);
    // 	// 	} catch (e) {
    // 	// 		console.log(e);
    // 	// 	};
    			
    // 	// };
    	    
    		
    // })
    
    console.log("inin")
    if(!mainUiFrame.android){
        setTimeout(function(){
            setupWebViewInterface();
        },1000)
        return;
    }
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(mainUiFrame, '~/'+molpaySdkUrl);

    mainUiFrame.on('loadFinished', (args) => {
    	// console.dir(args);
        if (!args.error) {
        	// console.log(midcallback);
        	// console.log(testdata);
            // console.log("i have loaded this url : " + args.url + args.src);
            // console.log(mainUiFrame.url);
            // console.log(mainUiFrame.src);
            // evaljs(mainUiFrame,"mathAddcount(`"+mainUiFrame+"`);");
            // console.dir(mainUiFrame)
            // if (!isMidloaded) {
            //     isMidloaded = true;
            //     evaljs(mainUiFrame, "mathAddcount(`"+html+"`)");
            //     // evaljs(mainUiFrame, "window.updateSdkData(" + JSON.stringify(molpayPaymentDetails) + ", " + customCall + ");");
            //     // setTimeout(function(){
            //     // evaljs(mainUiFrame, "window.updateSdkData(" + JSON.stringify(molpayPaymentDetails) + ", "+inAppCallback+");");

            //     // },3000)
            // }else if(isMidloaded && !isMolpayLoaded){
            // 	isMolpayLoaded = true;
            //     evaljs(mainUiFrame, "window.updateSdkData(" + JSON.stringify(molpayPaymentDetails) + ", " + customCall + ");");
            if(!isMolpayLoaded){
            	isMolpayLoaded = true;
                // evaljs(mainUiFrame, "runmolpay("+JSON.stringify(molpayPaymentDetails)+");");
                
            }
            //else if(!isMidloaded){
            // 	isMidloaded = true;
            //     // evaljs(mainUiFrame, "window.updateSdkData(" + JSON.stringify(molpayPaymentDetails) + ", " + customCall + ");");
            // 	// evaljs();
            // }

        }
    });

    try {
    	console.log("trying base64");
    	console.log(base64.encode("asasas"));
    	//YXNhc2Fz
    	// console.log(base64.decode(base64.encode("asasas")));
    } catch (e) {
    	console.log(e);
    };
    	
    oWebViewInterface.on('molpayCallback', function(eventData){
        // perform action on event
        console.log("i am here");
        console.log(eventData);
        inAppCallback(eventData);
    });
    oWebViewInterface.on('molpayLoaded',function(){
    	console.log("molpayLoaded call");
    	oWebViewInterface.callJSFunction('startMolpayJS', JSON.stringify(molpayPaymentDetails), function(result){
console.log(result);
    });
    	oWebViewInterface.callJSFunction()
    })
    // var c = byte("ABCD");
    // console.log(c);
    // var c = btoa("dddd");
    // console.log();
// var interval = setInterval(function(){
// 	if(html){
// 		try {
// html =			btoa(html);
// 		console.log(html);
// 		} catch (e) {
// 			console.log(e);
// 		};
			
// 		// console.log();
// 		clearInterval(interval);
// 	}
//     },1000)
    // bankUiWindow.src = "";
    mainUiFrame.visibility = "visible";
    bankUiWindow.visibility = "collapsed";



    // mainUiFrame.on(webViewModule.WebView.srcProperty, function (changeArgs) {
    //     console.log(changeArgs); 
    //     // Do something with the URL here.
    //     // E.g. extract the token and hide the WebView.
    // });

//     mainUiFrame.on('loadStarted', (args) => {
//         console.log("i am in load start : " + args.url);
//     })

//     mainUiFrame.on(webViewModule.WebView.loadFinishedEvent, function (args) {
//     // let message;
//     // if (!args.error) {
//     //     message = "WebView finished loading " + args.url;
//     // }
//     // else {
//     //     message = "Error loading " + args.url + ": " + args.error;
//     // }
//     console.log("try trigger"+args.url);

// });

}

var evaljs = function(webView, evalfunc) {
	// console.log(webvew);
    if (webView.ios) {
        webView.ios.stringByEvaluatingJavaScriptFromString(evalfunc);
    } else if (webView.android) {
        var url = 'javascript:' + evalfunc;
        testdata = webView.android.loadUrl(url);
    }
};

var startMolpay = function(args,paymentDetails,callback){
	console.log("startMolpay");

	var molpayView = args.object.getViewById("molpay");
	// console.dir(molpayView);
	molpayPaymentDetails = paymentDetails;
    mainUiFrame = new webViewModule.WebView();
    // console.log(mainUiFrame.android);
    bankUiWindow = new webViewModule.WebView();
    molpayView.addChild(mainUiFrame);
    molpayView.addChild(bankUiWindow);
    setupWebViewInterface();
}

exports.pageLoaded = pageLoaded;
exports.startMolpay = startMolpay;
exports.onTap = onTap;