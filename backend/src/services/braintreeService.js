const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAIN_TREE_MERCHANT_ID,
  publicKey: process.env.BRAIN_TREE_PUBLIC_KEY,
  privateKey: process.env.BRAIN_TREE_PRIVATE_KEY,
});

exports.processPayment = async (paymentDetails) => {
  try {
    const result = await gateway.transaction.sale({
      amount: paymentDetails.price,
      creditCard: {
        number: paymentDetails.creditCard.number,
        expirationDate: `${Number(
          paymentDetails.creditCard.expirationMonth
        )}/${Number(paymentDetails.creditCard.expirationYear)}`,
        cvv: paymentDetails.creditCard.cvv,
      },
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      return { success: true, transactionId: result.transaction.id };
    } else {
      console.log(result.errors);
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
