var frameModule = require("tns-core-modules/ui/frame");
var Observable = require("tns-core-modules/data/observable").Observable;
var molpayPaymentDetails = {
    mp_amount: "1.10",
    mp_username: "SB_molpayxdk",
    mp_password: "cT54#Lk@22",
    mp_merchant_ID: "SB_molpayxdk",
    mp_app_name: "molpayxdk",
    mp_verification_key: "4445db44bdb60687a8e7f7903a59c3a9",
    mp_order_ID: "1234",
    mp_currency: "MYR",
    mp_country: "MY",
    mp_channel: "multi",
    mp_bill_description: "description",
    mp_bill_name: "name",
    mp_bill_email: "example@email.com",
    mp_bill_mobile: "+60123456789",
    mp_channel_editing: false,
    mp_editing_enabled: false,
    mp_transaction_id: "",
    mp_request_type: "",
    mp_bin_lock: "",
    mp_express_mode: false,
    mp_sandbox_mode: false,
    mp_dev_mode: true
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