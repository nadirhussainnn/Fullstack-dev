const paypalService = require("../services/paypalService");
const braintreeService = require("../services/braintreeService");
const Order = require("../models/order");

exports.processPayment = async (req, res) => {
  try {
    const paymentDetails = req.body;

    let paymentGateway;
    if (
      paymentDetails.currency === "USD" ||
      paymentDetails.currency === "EUR" ||
      paymentDetails.currency === "AUD"
    ) {
      paymentGateway = "paypal";
    } else {
      paymentGateway = "braintree";
    }

    let paymentResult;
    if (paymentGateway === "paypal") {
      paymentResult = await paypalService.processPayment(paymentDetails);
    } else {
      paymentResult = await braintreeService.processPayment(paymentDetails);
    }

    const order = new Order({
      price: paymentDetails.price,
      currency: paymentDetails.currency,
      customerName: paymentDetails.customerName,
      paymentResponse: paymentResult,
    });
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      paymentResponse: paymentResult,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
