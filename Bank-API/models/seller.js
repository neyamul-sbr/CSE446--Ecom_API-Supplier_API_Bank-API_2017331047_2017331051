const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  seller_id: {
    type: String,
    required: true
  },
  seller_acc: {
    type: String,
    required: true
  },
  seller_secret: {
    type: String,
    required: true
  },
  seller_balance: {
    type: String,
    required: true
  }
});