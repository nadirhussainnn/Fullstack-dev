const request = require("supertest");
const app = require("../src/app");

describe("Payment API", () => {
  it("should process payment successfully", async () => {
    const paymentData = {
      price: 100,
      currency: "SCG",
      customerName: "John Doe",
      creditCard: {
        holderName: "John Doe",
        number: "4111111111111111",
        expirationMonth: "12",
        expirationYear: "2023",
        cvv: "123",
      },
    };

    const response = await request(app).post("/payment").send(paymentData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Payment processed successfully"
    );
    expect(response.body).toHaveProperty("paymentResponse");
  });

  it("should return error for invalid payment data", async () => {
    const invalidPaymentData = {
      // price: 50,
      currency: "SCG",
      customerName: "John Doe",
      creditCard: {
        holderName: "John Doe",
        number: "4111111111111111",
        expirationMonth: "12",
        expirationYear: "2023",
        cvv: "123",
      },
    };

    const response = await request(app)
      .post("/payment")
      .send(invalidPaymentData);

    expect(response.statusCode).toBe(400);
  });
  it("should return error for invalid payment data", async () => {
    const invalidPaymentData = {
      price: 50,
      currency: "USD",
      customerName: "John Doe",
      creditCard: {
        holderName: "John Doe",
        expirationMonth: "12",
        expirationYear: "2023",
        cvv: "123",
      },
    };

    const response = await request(app)
      .post("/payment")
      .send(invalidPaymentData);

    expect(response?.statusCode).toBe(400);
  });
});
