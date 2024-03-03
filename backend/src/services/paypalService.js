const paypal = require("paypal-rest-sdk");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

exports.processPayment = catchAsyncError(async (paymentDetails) => {
  const createPaymentJson = {
    intent: "sale",
    payer: {
      payment_method: "credit_card",
      funding_instruments: [
        {
          credit_card: {
            number: paymentDetails.creditCard.number,
            type: "visa",
            expire_month: paymentDetails.creditCard.expirationMonth,
            expire_year: paymentDetails.creditCard.expirationYear,
            cvv2: paymentDetails.creditCard.cvv,
          },
        },
      ],
    },
    transactions: [
      {
        amount: {
          total: paymentDetails.price,
          currency: paymentDetails.currency,
        },
      },
    ],
  };

  const payment = await new Promise((resolve, reject) => {
    paypal.payment.create(createPaymentJson, function (error, payment) {
      if (error) {
        const { message, httpStatusCode } = error.response;
        reject(new ErrorHandler(message, httpStatusCode));
      } else {
        resolve(payment);
      }
    });
  });

  if (payment.state === "approved") {
    return { success: true, paymentId: payment.id };
  } else {
    return {
      success: false,
      message: "Payment failed",
      errors: payment.failure_reason,
    };
  }
});
