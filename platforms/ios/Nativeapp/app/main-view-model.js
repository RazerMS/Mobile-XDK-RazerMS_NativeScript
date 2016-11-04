var Observable = require("data/observable").Observable;
// var webViewModule = require("ui/web-view");

function getMessage(counter) {
    if (counter <= 0) {
        return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    } else {
        return counter + " taps left";
    }
}

// var webView = new webViewModule.WebView();
// webView.on(webViewModule.WebView.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
//     let message;
//     if (!args.error) {
//         message = "WebView finished loading " + args.url;
//     }
//     else {
//         message = "Error loading " + args.url + ": " + args.error;
//     }

// });
// webView.url = "https://github.com/";

// this.set("url", "http://www.nativescript.org");

// function loadAction() {
// this.set("url", "http://www.nativescript.org");

//     console.log("inin");
// }

function createViewModel() {
    var viewModel = new Observable();
    viewModel.counter = 42;
    viewModel.message = getMessage(viewModel.counter);

    viewModel.onTap = function() {
        this.counter--;
        this.set("message", getMessage(this.counter));
    }

    return viewModel;
}

exports.createViewModel = createViewModel;