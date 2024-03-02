const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Payment API", () => {
  it("should process payment successfully", (done) => {
    const paymentData = {
      price: 100,
      currency: "USD",
      customerName: "John Doe",
      creditCard: {
        holderName: "John Doe",
        number: "4012888888881881",
        expirationMonth: 2,
        expirationYear: 2029,
        cvv: "110",
      },
    };
    chai
      .request(app)
      .post("/payment")
      .send(paymentData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success").to.be.true;
        expect(res.body)
          .to.have.property("message")
          .to.equal("Payment processed successfully");
        expect(res.body).to.have.property("paymentResponse");
        done();
      });
  });

  it("should return error for invalid payment data", (done) => {
    const invalidPaymentData = {
      price: 50, // Invalid price (less than 100)
      currency: "USD",
      customerName: "John Doe",
      creditCard: {
        holderName: "John Doe",
        number: "4111111111111111",
        expirationMonth: "12",
        expirationYear: "2023",
        cvv: "123",
      },
    };

    chai
      .request(app)
      .post("/payment")
      .send(invalidPaymentData)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("success").to.be.false;
        expect(res.body)
          .to.have.property("message")
          .to.equal("Invalid payment data");
        done();
      });
  });
});
