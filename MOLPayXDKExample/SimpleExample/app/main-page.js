"use strict";
var molpay = require('molpay-mobile-xdk-nativescript');
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
// Event handler for Page "navigatingTo" event attached in main-page.xml
function navigatingTo(args) {
    // Get the event sender
    var page = args.object;
    var molpayView = page.getViewById("molpay");
    molpay.startMolpay(molpayView, molpayPaymentDetails, function (data) {
        // data = JSON.parse(data);
        alert(data);
    });
    // page.bindingContext = new HelloWorldModel();
}
exports.navigatingTo = navigatingTo;
function Close() {
    molpay.closeMolpay();
}
exports.Close = Close;
//# sourceMappingURL=main-page.js.map