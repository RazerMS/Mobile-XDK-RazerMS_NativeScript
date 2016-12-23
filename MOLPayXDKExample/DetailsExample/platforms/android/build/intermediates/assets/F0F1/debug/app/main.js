var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var molpayPaymentDetails = {
    mp_amount: "1.100000000",
    mp_username: "molpayxdk",
    mp_password: "cT54#Lk@22",
    mp_merchant_ID: "molpayxdk",
    mp_app_name: "molpayxdk",
    mp_verification_key: "4445db44bdb60687a8e7f7903a59c3a9",
    mp_order_ID: "NS 0001",
    mp_currency: "MYR",
    mp_country: "MY",
    mp_channel: "cd",
    mp_bill_description: "NativeScript payment test",
    mp_bill_name: "llll",
    mp_bill_email: "email@email.com",
    mp_bill_mobile: "",
    mp_channel_editing: false,
    mp_editing_enabled: true,
    mp_transaction_id: "",
    mp_request_type: "",
    mp_bin_lock: ["9999"],
    // mp_express_mode: true,
    mp_sandbox_mode: false,
    mp_advanced_email_validation_enabled: false, 
    mp_advanced_phone_validation_enabled: true,
    // mp_credit_card_no: "8888888888888888",
    // mp_credit_card_expiry: "11/22",
    // mp_credit_card_cvv: "111"

};
var object = {
	result: "",
	molpayPaymentDetails : molpayPaymentDetails
};


exports.pageLoaded = function(args) {
    var page = args.object;
    page.bindingContext = {ExampleData : ""};
}

exports.tapAction = function() {
    var navigationOptions = {
        moduleName: 'main-page',
        context: object
    }
    frameModule.topmost().navigate(navigationOptions);
}

exports.onNavigatedTo = function(e) {
    if (e.isBackNavigation) {
        alert(JSON.stringify(object.result));
        var view = new Observable();
        view.set("ExampleData", JSON.stringify(object.result));
        e.object.bindingContext = view;
    }
};