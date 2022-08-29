const dotenv = require("dotenv");
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
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(222);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
exports.addProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      //console.log(result);
      res.redirect("/cart");
    });
};

///***MULTIPLE SUPPLIER.. NO BANK COMMISION */

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
//       const secret = req.user.secret;
//       console.log("secret", secret);
//       const result = await axios.post(
//         "http://localhost:8000/check_user_balance",
//         {
//           user_acc: user_acc,
//           secret: secret,
//         }
//       );
//       console.log("rr", result.data);
//       if (result.data.sta === "success") {
//         console.log(result.data.user_balance);
//         let users_current_balance = Number(result.data.user_balance);
//         return users_current_balance;
//       } else {
//         res.redirect("/");
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
//         const seller_id = p.productId.userId;
//         const user_acc = req.user.bank_acc_no;
//         console.log(p.productId._id);
//         //console.log(User.findOne({ _id: seller_id },{bank_acc_no: 1, _id: 0}).bank_acc_no);
//         var seller_acc;
//         const doc = await User.findOne(
//           { _id: seller_id },
//           { bank_acc_no: 1, _id: 0 }
//         );
//         const result = await axios.post(
//           "http://localhost:8000/transaction_req",
//           {
//             user_acc: user_acc,
//             seller_acc: doc.bank_acc_no,
//             amount: total2,
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
//         if (result.data.sta === "success") {
//           flag = true;
//           req.flash(
//             "success",
//             `${cnt} Sucess. After Buying Product ${p.productId.title},  Quantity ${p.quantity}, Your Balance is Now ${result.data.user_balance11}`
//           );
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
//         req.user.balance = req.user.balance - total;
//         return await order.save();
//       }
//     })
//     .then((result) => {
//       console.log("clear chart");
//       return req.user.clearCart();
//     })
//     .then(() => {
//       if (flag) {
//         console.log("orders");
//         res.redirect("/orders");
//       } else {
//         res.send("no money poor");
//       }
//     })
//     .catch((err) => console.log(err));
// };

//***********MULTIPLE SUPPLIER WITH BANK COMMISION************

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
//       const secret = req.user.secret;
//       console.log("secret", secret);
//       const result = await axios.post(
//         "http://localhost:8000/check_user_balance",
//         {
//           user_acc: user_acc,
//           secret: secret,
//         }
//       );
//       console.log("rr", result.data);
//       if (result.data.sta === "success") {
//         console.log(result.data.user_balance);
//         let users_current_balance = Number(result.data.user_balance);
//         return users_current_balance;
//       } else {
//         flag = false;
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
//         const seller_id = p.productId.userId;
//         const user_acc = req.user.bank_acc_no;
//         console.log(p.productId._id);
//         //console.log(User.findOne({ _id: seller_id },{bank_acc_no: 1, _id: 0}).bank_acc_no);
//         var seller_acc;
//         const doc = await User.findOne(
//           { _id: seller_id },
//           { bank_acc_no: 1, _id: 0 }
//         );
//         const result1 = await axios.post(
//           "http://localhost:8000/transaction_req",
//           {
//             user_acc: user_acc,
//             seller_acc: ECOM_BANK_ACC,
//             amount: total2,
//             // recipient: global.Adminacc,
//             // hoodie: hoodie,
//             // sneakers: sneakers,
//             // fitbit: fitbit
//           }
//         );
//         total2 = total2 - 0.15 * total2; //15% commission
//         const result = await axios.post(
//           "http://localhost:8000/transaction_req",
//           {
//             user_acc: user_acc,
//             seller_acc: seller_acc,
//             amount: total2,
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
//         if (result.data.sta === "success") {
//           flag = true;
//           req.flash(
//             "success",
//             `${cnt} Sucess. After Buying Product ${p.productId.title},  Quantity ${p.quantity}, Your Balance is Now ${result.data.user_balance11}`
//           );
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
//         req.user.balance = req.user.balance - total;
//         return await order.save();
//       }
//     })
//     .then((result) => {
//       console.log("clear chart");
//       return req.user.clearCart();
//     })
//     .then(() => {
//       if (flag) {
//         console.log("orders");
//         res.redirect("/orders");
//       } else {
//         res.send("no money poor");
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
      console.log("secret", secret);
      const result = await axios.post(
        "http://localhost:8000/check_user_balance", ///Check User Balance From The (BANK API)
        {
          user_acc: user_acc,
          secret: secret,
        }
      );
      // console.log("rr", result.data);
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
      if (check_total > users_current_balance) {
        req.flash("error", `Insufficient Balance`);
        flag = false;
      }

      let total2 = 0;
      total2 = check_total;
      const secret = await req.user.secret;

      /* Requesting The (BANK API -port 8000)  for the Transaction of money from the User Account 
      To the E-Commerce Account*/
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

      console.log(result.data);
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
      // cnt = cnt + 1;
      // console.log(cnt);

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

        // let i = 0;
        // for (const element of products) {
        //   element.transactionID = t_array[i];
        //   i = i + 1;
        // }
        console.log(products);

        /** Requesting The (BANK API -port 8000)  for the Transaction ID of the order overall */
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

        /** Requesting The (SELLER API -port 5050)  with the Transaction ID
         * to confirm the Payment and Deliver the products to the USER */
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
          commissioned_total: total3,
          total: total,
          transactionID: t_id,
          time: time,
        });
        req.user.balance = req.user.balance - total;
        return await order.save();
      }
    })
    .then((result) => {
      console.log("clear chart");
      return req.user.clearCart();
    })
    .then(() => {
      if (flag) {
        console.log("orders");
        res.redirect("/orders");
      } else {
        res.send({ message: "Some Error Happend During Transactions" });
      }
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      let total = 0;
      products.forEach((p) => {
        total += p.quantity * p.productId.price;
      });
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
        products: products,
        totalSum: total,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  console.log("here");

  let message = req.flash("success");

  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        errorMessage: message,
      });
    })
    .catch((err) => console.log(err));
};
