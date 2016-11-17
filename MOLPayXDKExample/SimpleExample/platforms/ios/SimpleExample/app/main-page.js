"use strict";
var MOLPay = require('molpay-mobile-xdk-nativescript');
var molpayPaymentDetails = {
    mp_amount: "1.10",
    mp_username: "",
    mp_password: "",
    mp_merchant_ID: "",
    mp_app_name: "",
    mp_verification_key: "",
    mp_order_ID: "NS0001",
    mp_currency: "MYR",
    mp_country: "MY",
    mp_channel: "",
    mp_bill_description: "NativeScript payment test",
    mp_bill_name: "abc",
    mp_bill_email: "email@email.com",
    mp_bill_mobile: "1234567890",
    mp_channel_editing: false,
    mp_editing_enabled: false,
    mp_transaction_id: "",
    mp_request_type: "",
    mp_bin_lock: "",
    mp_express_mode: false,
    mp_sandbox_mode: false
};
// Event handler for Page "navigatingTo" event attached in main-page.xml
function navigatingTo(args) {
    // Get the event sender
    var page = args.object;
    var molpayView = page.getViewById("molpay");
    MOLPay.startMolpay(molpayView, molpayPaymentDetails, function (data) {
        // data = JSON.parse(data);
        alert(data);
    });
    // page.bindingContext = new HelloWorldModel();
}
exports.navigatingTo = navigatingTo;
function Close() {
    MOLPay.closeMolpay();
}
exports.Close = Close;
//# sourceMappingURL=main-page.js.map