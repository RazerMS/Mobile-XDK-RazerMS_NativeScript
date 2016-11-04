var pageLoaded = require("./main-page").pageLoaded;

var pagesModule = require("ui/page");
var labelModule = require("ui/label");
var webViewModule = require("ui/web-view");
var webViewInterfaceModule = require('nativescript-webview-interface');
var molpayPay = require("./main-page");

var molpayPaymentDetails = {
    mp_amount: "1.10",
    mp_username: "molpayapi",
    mp_password: "*M0Lp4y4p1!*",
    mp_merchant_ID: "molpaymerchant",
    mp_app_name: "wilwe_makan2",
    mp_verification_key: "501c4f508cf1c3f486f4f5c820591f41",
    mp_order_ID: "COR001",
    mp_currency: "MYR",
    mp_country: "MY",
    mp_channel: "",
    mp_bill_description: "Cordova payment test",
    mp_bill_name: "Developer",
    mp_bill_email: "leow@molpay.com",
    mp_bill_mobile: "+647452",
    mp_channel_editing: false,
    mp_editing_enabled: false,
    mp_transaction_id: "",
    mp_request_type: "",
    mp_bin_lock: "",
    mp_express_mode: false,
    mp_sandbox_mode: false
};

function loade(args){
	// pageLoaded(args);
	var molpay = args.object.getViewById("molpay");
	var label = new labelModule.Label();
    label.text = "Hello, world!";
    molpayPay.startMolpay(args,molpayPaymentDetails);
    // webView = new webViewModule.WebView();
    // molpay.addChild(webView);
    // var oWebViewInterface = new webViewInterfaceModule.WebViewInterface(webView, '~/molpay-mobile-xdk-www/index.html');
    // console.dir(molpay);
	// createPage();
}
function createPage() {
    var label = new labelModule.Label();
    label.text = "Hello, world!";
    var page = new pagesModule.Page();
    page.content = label;
    return page;
}

exports.loade = loade;