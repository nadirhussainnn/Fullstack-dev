const paypalService = require("../services/paypalService");
const braintreeService = require("../services/braintreeService");
const Order = require("../models/order");
const createAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");

exports.processPayment = createAsyncError(async (req, res) => {
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
  if (paymentResult.success) {
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
  } else {
    throw new ErrorHandler(paymentResult.message, 400);
  }
});
