const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const errorController = require("./controllers/error");
const User = require("./models/user");

const DB_URI = "mongodb+srv://admin:admin@cluster0.lla3q.mongodb.net/bank";

const app = express();
const store = new MongoDBStore({
  uri: DB_URI,
  collection: "sessions",
});
const bankRoutes = require("./routes/bank");

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
app.use(flash());

app.use(bankRoutes);
app.use(errorController.get404);
mongoose
  .connect(DB_URI)
  .then((result) => {
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });
