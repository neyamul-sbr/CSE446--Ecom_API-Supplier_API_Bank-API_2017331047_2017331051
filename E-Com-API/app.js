const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const axios = require("axios");

const errorController = require("./controllers/error");
const User = require("./models/user");

const DB_URI =  "mongodb+srv://neyam:neyam@cluster0.7jnj2qp.mongodb.net/shop";

const app = express();
const store = new MongoDBStore({
  uri: DB_URI,
  collection: "sessions",
});

const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Neyamul1234",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  user_acc = req.session.user.bank_acc_no;
  try {
    const result = await axios.post(
      "http://localhost:8000/check_user_balance",
      {
        user_acc: user_acc,
      }
    );
    res.locals.nowBalance = Number(result.data.user_balance);
  } catch (err) {
    res.locals.nowBalance = undefined;
  }
  next();
});

app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(DB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
