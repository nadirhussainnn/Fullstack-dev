const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  paymentResponse: {
    type: Object,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
