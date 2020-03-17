var frameModule = require("tns-core-modules/ui/frame");
var Observable = require("tns-core-modules/data/observable").Observable;
var molpayPaymentDetails = {
    mp_amount: "",
    mp_username: "",
    mp_password: "",
    mp_merchant_ID: "",
    mp_app_name: "",
    mp_verification_key: "",
    mp_order_ID: "",
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