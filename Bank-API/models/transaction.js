const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  sender_name: {
    type: String,
    required: true,
  },
  receiver_name: {
    type: String,
    required: true,
  },
  sender_account: {
    type: String,
    required: true,
  },
  receiver_account: {
    type: String,
    required: true,
  },
  sender_balance_before: {
    type: Number,
    required: true,
  },
  sender_balance_after: {
    type: Number,
    required: true,
  },
  transfer_amount: {
    type: Number,
    required: true,
  },
  receiver_balance_before: {
    type: Number,
    required: true,
  },
  receiver_balance_after: {
    type: Number,
    required: true,
  },

  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
