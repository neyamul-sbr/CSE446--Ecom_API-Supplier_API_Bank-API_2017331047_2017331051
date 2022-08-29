const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  uniqueId: {
    type: String,
    required: true,
  },
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],

  total: {
    type: Number,
    required: true,
  },
  commissioned_total: {
    type: Number,
    required: true,
  },

  time: { type: Date, default: Date.now },
  transactionID: { type: String, required: true },
  user: {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
