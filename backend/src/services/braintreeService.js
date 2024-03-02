const braintree = require("braintree");
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "merchant_id",
  publicKey: "public_key",
  privateKey: "private_key",
});

exports.processPayment = async (paymentDetails) => {
  try {
    const result = await gateway.transaction.sale({
      amount: paymentDetails.amount,
      creditCard: {
        number: paymentDetails.creditCard.number,
        expirationDate: `${paymentDetails.creditCard.expirationMonth}/${paymentDetails.creditCard.expirationYear}`,
        cvv: paymentDetails.creditCard.cvv,
      },
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      return { success: true, transactionId: result.transaction.id };
    } else {
      return {
        success: false,
        message: "Payment failed",
        errors: result.errors,
      };
    }
  } catch (error) {
    console.error("Error processing Braintree payment:", error);
    throw new Error("Payment processing failed");
  }
};
