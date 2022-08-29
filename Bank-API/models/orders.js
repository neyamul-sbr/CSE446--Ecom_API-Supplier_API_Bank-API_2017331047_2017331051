const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    uniqueId:{
        type: String,
        required: true
       },
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
      transactionID: {type: String, required: true},
    }
  ],
  email:{
    type: String,
    required: true
   },
   name:{
    type: String,
    required: true
   },
   user_acc:{
    type: String,
    required: true
   },

  total:{
   type: Number,
   required: true
  },

  time : { type : Date, default: Date.now },

});

module.exports = mongoose.model('Orders', ordersSchema);