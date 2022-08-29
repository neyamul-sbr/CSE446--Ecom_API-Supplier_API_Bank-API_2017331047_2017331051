const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const axios = require("axios");
const errorController = require("./controllers/error");
const DB_URI = "mongodb+srv://sbr:sbr@seller.9uxcm.mongodb.net/seller";
const app = express();
const store = new MongoDBStore({
  uri: DB_URI,
  collection: "sessions",
});


const sellerRoutes = require("./routes/seller");

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
    secret: "Neyamul123",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());

app.use(sellerRoutes);

app.use(errorController.get404);

mongoose
  .connect(DB_URI)
  .then((result) => {
    app.listen(5050);
  })
  .catch((err) => {
    console.log(err);
  });
