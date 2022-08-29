const Product = require("../models/product");
const axios = require("axios");
const crypto = require("crypto");

///******PRODUCT DELIVERY REQUEST TO THE SELLER */

exports.productDeliveryReq = async (req, res, next) => {
  const transaction_id = req.body.transaction_id;

  // const products = req.body.products;
  // console.log("products", products);
  let total = Number(req.body.total);
  console.log(total);
  // const buyer_acc = req.body.buyer_account;
  //const seller_acc = req.body.seller_account;

  try {
    // const docs = await Product.findOne({ product_id: product_id });

    // let price = docs.price;
    // let seller_calculated_price = price * quantity;
    // if (res1.data.status == "success") {
    //   const transaction_conf_obj = res1.data.transaction_log;
    //   let bank_given_amount = transaction_conf_obj.transfer_amount;

    //   console.log(transaction_conf_obj.sender_account);

    //   if (
    //     seller_calculated_price == bank_given_amount &&
    //     docs.product_id == product_id &&
    //     transaction_conf_obj.sender_account == buyer_acc
    //   ) {
    //     return res.send(200, { status: "success" });
    //   } else {
    //     return res.send(200, { status: "failure" });
    //   }
    // } else {
    //   return res.send(200, { status: "failure" });
    // }

    /** Requesting from SELLER API TO The (BANK API)  with the Transaction ID
     * to confirm the Payment of the users */
    const res1 = await axios.post(
      "http://localhost:8000/transaction_confirmation",
      {
        transaction_id: transaction_id,
      }
    );
    console.log(res1.data);
    console.log(res1.data.deatail.transfer_amount, total);
    ///Compare If the total money is Right
    if (
      res1.data.status === "success" &&
      res1.data.deatail.transfer_amount === total
    ) {
      res.send({
        status: "success",
        message: " Product is being Sent to the User",
        transaction_details: res1.data.deatail,
      });
    } else {
      res.send({
        status: "failure",
        message: "Transaction Confirmation Failed",
      });
    }
  } catch (err) {
    return res.send(200, { status: "failure" });
  }
};

exports.addProdSeller = async (req, res, next) => {
  try {
    const seller_id = req.body.seller_id;
    const product_id = req.body.product_id;
    const title = req.body.title;
    const price = Number(req.body.price);
    console.log(product_id);

    const product = new Product({
      seller_id: seller_id,
      product_id: product_id,
      title: title,
      price: price,
    });
    console.log(price);
    const order_id = await product.save();

    return res.send({
      success: "success",
      order_id: order_id,
      product: product,
    });
  } catch (err) {
    res.send({ err: "err" });
  }
};
