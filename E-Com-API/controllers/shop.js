const Product = require("../models/product");
const Order = require("../models/order");
const axios = require("axios");
const User = require("../models/user");
const crypto = require("crypto");
const ECOM_BANK_ACC = "47854841564711";
const ECOM_SECRET = "0c784951712467fa347379816b770d51";
const SELLER_BANK_ACC = "5865685238655";
const SELLER_SECRET = "7f212cc7451c29aa3a849b99165b57a0";
let total3 = 0;
exports.getAllProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(222);
      res.send({
        message: "Successfully Retrieved All the Products",
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductDescription = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      res.send({
        message: "Successfully Retrieved The selected Product Description",
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.send({ message: "Your Cart Products are", cart: products });
    })
    .catch((err) => res.send({ message: "error on getting the cart" }));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((user) => {
      const products = user.cart.items;
      res.send({
        Message: `Removed 1 ${prodId} product from the cart`,
        updatedCart: products,
      });
    })
    .catch((err) => res.send({ error: err }));
};
exports.addToCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.send({ message: "The Product is added to the Cart" });
    });
};

// exports.postOrder = (req, res, next) => {
//   let flag = false;
//   req.user
//     .populate("cart.items.productId")
//     .execPopulate()
//     .then((user) => {
//       const user_acc = user.bank_acc_no;
//       return user_acc;
//     })
//     .then(async (user_acc) => {
//       const result = await axios.post(
//         "http://localhost:8000/check_user_balance",
//         {
//           user_acc: user_acc,
//         }
//       );
//       console.log(result.data);
//       if (result.data.sta === "success") {
//         console.log(result.data.user_balance);
//         let users_current_balance = Number(result.data.user_balance);
//         return users_current_balance;
//       }
//     })
//     .then(async (users_current_balance) => {
//       const products1 = await req.user.cart.items;
//       let total = 0;
//       let check_total = 0;
//       for (const p of products1) {
//         check_total = check_total + p.quantity * p.productId.price;
//       }
//       const transaction_array = [];
//       var cnt = 1;
//       for (const p of products1) {
//         if (check_total > users_current_balance) {
//           req.flash("error", `Insufficient Balance`);
//           flag = false;
//           break;
//         }

//         let total2 = 0;
//         total2 = p.quantity * p.productId.price;
//         total += total2;
//         console.log("total ", total);
//         const quantity = p.quantity;
//         const product_id = p.productId._id;
//         const product_name = p.productId.title;
//         const seller_id = p.productId.userId;
//         const user_acc = req.user.bank_acc_no;
//         console.log(p.productId._id);
//         //console.log(User.findOne({ _id: seller_id },{bank_acc_no: 1, _id: 0}).bank_acc_no);

//         const doc = await User.findOne(
//           { _id: seller_id },
//           { bank_acc_no: 1, _id: 0 }
//         );

//         const seller_acc = doc.bank_acc_no;
//         const result = await axios.post(
//           "http://localhost:8000/transaction_req",
//           {
//             user_acc: user_acc,
//             seller_acc: seller_acc,
//             amount: total2,
//             product_id: product_id,
//             quantity: quantity,
//             product_name: product_name,
//             // recipient: global.Adminacc,
//             // hoodie: hoodie,
//             // sneakers: sneakers,
//             // fitbit: fitbit
//           }
//         );
//         console.log(result.data);
//         console.log(result.status);
//         console.log("transaction", result.data.t_id);
//         transaction_array.push(result.data.t_id);
//         const transaction_id = result.data.t_id;
//         if (result.data.sta === "success") {
//           flag = true;
//           req.flash(
//             "success",
//             `${cnt} Sucess. After Buying Product ${p.productId.title},  Quantity ${p.quantity}, Your Balance is Now ${result.data.user_balance11}`
//           );
//         }

//         //Requesting Seller API with transaction ID to confirm the order
//         const res3 = await axios.post(
//           "http://localhost:5050/product_delivery_request",
//           {
//             transaction_id: transaction_id,
//             product_id: product_id,
//             quantity: quantity,
//             buyer_account: user_acc,
//             //seller_account: seller_acc,
//           }
//         );

//         console.log(res3.data.status);

//         if (res3.data.status == "failure") {
//           flag = false;
//           break;
//         }

//         console.log(3333);

//         // console.log(seller_id);
//         // console.log(user_id);
//         cnt = cnt + 1;
//         console.log(cnt);
//       }
//       console.log(transaction_array);
//       return [total, transaction_array];
//     })
//     .then(async (res) => {
//       var total = res[0];
//       var t_array = res[1];
//       const time = Date.now();
//       if (flag) {
//         const products = req.user.cart.items.map((i) => {
//           return {
//             quantity: i.quantity,
//             price: i.productId.price,
//             product: { ...i.productId._doc },
//           };
//         });
//         console.log(products);
//         console.log(t_array);
//         console.log(total);

//         let i = 0;
//         for (const element of products) {
//           element.transactionID = t_array[i];
//           i = i + 1;
//         }
//         console.log(products);

//         const res2 = await axios.post("http://localhost:8000/order_id", {
//           products: products,
//           email: req.user.email,
//           name: req.user.user_name,
//           user_acc: req.user.bank_acc_no,
//           total: total,
//           time: time,
//         });

//         console.log(res2.data.unique_id);

//         const unique_id = res2.data.unique_id;

//         console.log("final", total);
//         const order = new Order({
//           uniqueId: unique_id,
//           user: {
//             email: req.user.email,
//             userId: req.user,
//           },
//           products: products,
//           total: total,
//           time: time,
//         });
//         return await order.save();
//       }
//     })
//     .then((order) => {
//       console.log("clear chart");
//       req.user.clearCart();
//       return order;
//     })
//     .then((order) => {
//       if (flag) {
//         console.log("orders");
//         res.send(order);
//       } else {
//         res.send({ message: "Error: Order Can Be completed" });
//       }
//     })
//     .catch((err) => console.log(err));
// };

///*****SINGLE SUPPLIER ORGANIZATION WITH BANK..15% E Commerce COMMISION ***********/

exports.postOrder = (req, res, next) => {
  let flag = false;
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const user_acc = user.bank_acc_no;
      return user_acc;
    })
    .then(async (user_acc) => {
      const secret = req.user.secret;
      const result = await axios.post(
        "http://localhost:8000/check_user_balance",
        {
          user_acc: user_acc,
          secret: secret,
        }
      );
      console.log(result.data);
      if (result.data.sta === "success") {
        console.log(result.data.user_balance);
        let users_current_balance = Number(result.data.user_balance);
        return users_current_balance;
      } else {
        flag = false;
      }
    })
    .then(async (users_current_balance) => {
      const products1 = await req.user.cart.items;
      let total = 0;
      let check_total = 0;
      for (const p of products1) {
        check_total = check_total + p.quantity * p.productId.price;
      }
      const transaction_array = [];
      var cnt = 1;
      if (check_total > users_current_balance) {
        req.flash("error", `Insufficient Balance`);
        flag = false;
      }

      let total2 = 0;
      total2 = check_total;
      //console.log(User.findOne({ _id: seller_id },{bank_acc_no: 1, _id: 0}).bank_acc_no);
      /* Requesting The (BANK API -port 8000)  for the Transaction of money from the User Account 
      To the E-Commerce Account*/
      const secret = await req.user.secret;
      const result1 = await axios.post(
        "http://localhost:8000/transaction_req",
        {
          user_acc: user_acc,
          seller_acc: ECOM_BANK_ACC,
          amount: total2,
          secret: secret,
        }
      );

      total3 = total2 - 0.15 * total2; //15% commission Cutoff for the E commerce

      /* Requesting The (BANK API -port 8000)  for the Transaction of money from the User Account 
      To the Seller Account*/
      const result = await axios.post("http://localhost:8000/transaction_req", {
        user_acc: ECOM_BANK_ACC,
        seller_acc: SELLER_BANK_ACC,
        amount: total3,
        secret: ECOM_SECRET,
      });

      //console.log(result.data);
      console.log(result.status);
      console.log("transaction", result.data.t_id);

      transaction_array.push(result.data.t_id);
      if (result.data.sta === "success") {
        flag = true;
        req.flash(
          "success",
          `Sucess. After Buying Products. Your Balance is Now ${result1.data.user_balance11}`
        );
      }

      console.log(3333);

      // console.log(seller_id);
      // console.log(user_id);
      cnt = cnt + 1;
      console.log(cnt);
      console.log(transaction_array);
      return [total2, transaction_array];
    })
    .then(async (res) => {
      var total = res[0];
      var t_array = res[1];
      const time = Date.now();
      if (flag) {
        const products = req.user.cart.items.map((i) => {
          return {
            quantity: i.quantity,
            price: i.productId.price,
            product: { ...i.productId._doc },
          };
        });
        console.log(products);
        console.log(t_array);
        console.log(total);

        let i = 0;

        const res2 = await axios.post("http://localhost:8000/order_id", {
          products: products,
          email: req.user.email,
          name: req.user.user_name,
          user_acc: req.user.bank_acc_no,
          total: total,
          time: time,
        });

        console.log(res2.data.unique_id);

        const unique_id = res2.data.unique_id;
        const secret = ECOM_SECRET;

        t_id = t_array[0];

        console.log(t_id);

        const res3 = await axios.post(
          "http://localhost:5050/product_delivery_request",
          {
            transaction_id: t_id,
            total: total3,
          }
        );
        console.log(res3.data);

        console.log("final", total);
        const order = new Order({
          uniqueId: unique_id,
          user: {
            email: req.user.email,
            userId: req.user,
          },
          products: products,
          total: total,
          commissioned_total: total3,
          transactionID: t_id,
          time: time,
        });
        req.user.balance = req.user.balance - total;
        return await order.save();
      }
    })
    .then((order) => {
      console.log("clear chart");
      req.user.clearCart();
      return order;
    })
    .then((order) => {
      if (flag) {
        console.log("orders");
        res.send({
          message:
            "Order Successfully Completed. You will get the products anytime",
          order_object: order,
        });
      } else {
        res.send({ message: "Error: Order Cannot Be completed" });
      }
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  console.log("here");

  let message = req.flash("success");

  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.send({
        message: "Succesfully Retrived all the Products",
        orders_description: orders,
      });
    })
    .catch((err) => console.log(err));
};
