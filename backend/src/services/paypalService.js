const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "client_id",
  client_secret: "client_secret",
});

exports.processPayment = async (paymentDetails) => {
  try {
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
            total: paymentDetails.amount,
            currency: paymentDetails.currency,
          },
        },
      ],
    };

    const payment = await new Promise((resolve, reject) => {
      paypal.payment.create(createPaymentJson, function (error, payment) {
        if (error) {
          reject(error);
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
  } catch (error) {
    console.error("Error processing PayPal payment:", error);
    throw new Error("Payment processing failed");
  }
};
