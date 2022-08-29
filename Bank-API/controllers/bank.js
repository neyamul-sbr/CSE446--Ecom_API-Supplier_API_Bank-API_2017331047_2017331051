const Product = require("../models/product");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const Orders = require("../models/orders");
const crypto = require("crypto");




// exports.transactionOrder = (req, res, next) => {
//   const user_acc1 = req.body.user_acc;
//   const seller_acc1 = req.body.seller_acc;
//   let total = Number(req.body.amount);
//   console.log(200);
//   console.log(user_acc1);
//   console.log(seller_acc1);
//   console.log(total);
//   let us_bal = 0;
//   let sell_bal = 0;
//   User.findOne(
//     { user_acc: user_acc1 },
//     { user_balance: 1, _id: 0 },
//     function (err, docs) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("1", us_bal);
//         us_bal = Number(docs.user_balance);
//         us_bal = us_bal - total;
//         console.log("2", us_bal);
//       }
//       //return us_bal;
//     }
//   );

//   User.findOne(
//     { user_acc: seller_acc1 },
//     { user_balance: 1, _id: 0 },
//     function (err, docs) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("3", sell_bal);
//         sell_bal = Number(docs.user_balance);
//         sell_bal = sell_bal + total;
//         console.log("4", sell_bal);
//       }
//       //return sell_bal;
//     }
//   );

exports.transactionConfirm = async (req, res, next) => {
  try {
    const transaction_id = req.body.transaction_id;
    // const docs = await Transaction.findOne({ _id: transaction_id });
    const docs = await Transaction.findOne({ _id: transaction_id });
    return res.send({ status: "success", total: docs.total, deatail: docs });

    // us_bal = Number(docs.user_balance);
    // return res.send(200, { sta: "success", user_balance: us_bal });
  } catch (err) {
    res.send({ status: "failure" });
  }
};

exports.transactionOrder = async (req, res, next) => {
  try {
    const user_acc1 = req.body.user_acc;
    const seller_acc1 = req.body.seller_acc;
    const secret = req.body.secret;
    let total = Number(req.body.amount);
    console.log(200);
    console.log(user_acc1);
    console.log(seller_acc1);
    console.log(total);
    let us_bal = 0;
    let sell_bal = 0;
    let us_bal_before = 0;
    let sell_bal_before = 0;

    const docs = await User.findOne(
      { user_acc: user_acc1, user_secret: secret },
      { user_balance: 1, name: 1, _id: 0 }
    );

    us_bal_before = Number(docs.user_balance);
    console.log("1", us_bal);
    const us_name = docs.name;

    //return us_bal;

    const docs2 = await User.findOne(
      { user_acc: seller_acc1 },
      { user_balance: 1, name: 1, _id: 0 }
    );

    sell_bal_before = Number(docs2.user_balance);
    const sell_name = docs2.name;
    console.log("2", sell_bal);
    console.log("2", sell_name);
    //return sell_bal;

    sell_bal = sell_bal_before + total;
    us_bal = us_bal_before - total;

    console.log("3", sell_bal);
    console.log("4", us_bal);

    // myCalculator(myDisplayer(tt));

    //Ekbar
    if (us_bal < 0) {
      throw "No Money On User Account";
    }
    const doc = await User.findOneAndUpdate(
      { user_acc: user_acc1 },
      { $set: { user_balance: us_bal } }
    );

    const doc2 = await User.findOneAndUpdate(
      { user_acc: seller_acc1 },
      { $set: { user_balance: sell_bal } }
    );
    console.log(us_name);

    const transaction = new Transaction({
      sender_name: us_name,
      receiver_name: sell_name,
      sender_account: user_acc1,
      receiver_account: seller_acc1,
      sender_balance_before: us_bal_before,
      sender_balance_after: us_bal,
      transfer_amount: total,
      receiver_balance_before: sell_bal_before,
      receiver_balance_after: sell_bal,

      time: Date.now(),
    });

    const t_id = await transaction.save();
    console.log(t_id._id);
    return res.send(200, {
      sta: "success",
      user_balance11: us_bal,
      t_id: t_id._id,
    });
  } catch (err) {
    console.log(500);
    return res.send({ sta: "no money or secret didnot match" });
  }

  // //Duibar
  // User.findOneAndUpdate(
  //   { user_acc: user_acc1 },
  //   { $set: { user_balance: us_bal } },
  //   function (err, doc) {
  //     if (err) return res.send(500, { error: err });
  //     else {
  //       console.log(5);
  //     }
  //   }
  // );

  // User.findOneAndUpdate(
  //   { user_acc: seller_acc1 },
  //   { $set: { user_balance: sell_bal } },
  //   function (err, doc) {
  //     if (err) return res.send(500, { error: err });
  //     else {
  //       console.log(6);
  //     }
  //   }
  // );

  //res.redirect('/');
};
// exports.transactionRecord = async (req, res, next) => {
//   const sender_acc1 = req.body.user_acc;
//   const reciever_acc1 = req.body.seller_acc;
//   const sender_name = req.body.user_name;
//   const amount = req.boy.amount;
//   const time = Date.now();

//   const transaction = new Transaction({

//     sender_name: sender_name,
//     receiver_nane: receiver_name,
//     sender_account: sender_acc1,
//     receiver_account: reciever_acc1,
//     amount: amount,
//     time: time,

//   })
//  result = await transaction.save();

//  res.send({transaction_id: result_id});

// }
exports.checkBalanceUser = async (req, res, next) => {
  try {
    const user_acc1 = req.body.user_acc;
    const secret = req.body.secret;
    const docs = await User.findOne(
      { user_acc: user_acc1, user_secret: secret },
      { user_balance: 1, _id: 0 }
    );

    us_bal = Number(docs.user_balance);
    return res.send(200, { sta: "success", user_balance: us_bal });
  } catch (err) {
    res.send({ message: "ERROR: Invalid UserID or Secret" });
  }
};

exports.orderId = async (req, res, next) => {
  try {
    const user_acc = req.body.user_acc;
    const email = req.body.email;
    const name = req.body.name;
    const products = req.body.products;
    const total = req.body.total;
    const time = req.body.time;
    console.log(user_acc);
    console.log(products);

    const buffer = crypto.randomBytes(16);
    const id = buffer.toString("hex");
    console.log(id);

    const order = new Orders({
      uniqueId: id,
      prodcuts: products,
      email: email,
      name: name,
      user_acc: user_acc,
      total: total,
      time: time,
    });
    const order_id = await order.save();
    console.log("order", order_id["uniqueId"]);

    return res.send(200, { sta: "success", unique_id: order_id["uniqueId"] });
  } catch (err) {
    res.send({ err });
  }
};

exports.addBankUser = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  //const user_id = req.body.user_id;
  const user_acc = req.body.user_acc;
  const user_sec = req.body.user_sec;
  let balance = Number(req.body.balance);
  User.findOne({ user_acc: user_acc })
    .then((userDoc) => {
      if (userDoc) {
        return res.send({ message: "This Bank Account Already Exists" });
      } else {
        const user = new User({
          email: email,
          name: name,
          //user_id: user_id,
          user_acc: user_acc,
          user_secret: user_sec,
          user_balance: balance,
        });
        return user.save();
      }
      // return bcrypt
      //   .hash(password, 12)
      //   .then(hashedPassword => {
      //     const user = new User({
      //       email: email,
      //       password: hashedPassword,
      //       user_name: userName,
      //       bank_acc_no: bankAcc,
      //       secret: secret,

      //       cart: { items: [] }
      //     });
      //     return user.save();
      //   })
      //   .then(result => {
      //     res.redirect('/login');
      //     return transporter.sendMail({
      //       to: email,
      //       from:'neyamul47@student.sust.edu',
      //       subject: 'Successfully signed up',
      //       html:'<h1>Congrass</h1>',
      //     });

      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    })
    .then((user) => {
      res.send({
        message: " Successfully Created an Bank Account",
        user: user,
      });
    })
    .catch((err) => {
      res.send({ error: err });
    });
};



// exports.postOrder = (req, res, next) => {
//   req.user
//     .populate("cart.items.productId")
//     .execPopulate()
//     .then((user) => {
//       const products1 = user.cart.items;
//       let total = 0;
//       products1.forEach((p) => {
//         total += p.quantity * p.productId.price;
//       });
//       const time = Date.now();
//       console.log(total);
//       const products = user.cart.items.map((i) => {
//         return { quantity: i.quantity, product: { ...i.productId._doc } };
//       });
//       const order = new Order({
//         user: {
//           email: req.user.email,
//           userId: req.user,
//         },
//         products: products,
//         total: total,
//         time: time,
//       });
//       return order.save();
//     })
//     .then((result) => {
//       return req.user.clearCart();
//     })
//     .then(() => {
//       res.redirect("/orders");
//     })
//     .catch((err) => console.log(err));
// };




