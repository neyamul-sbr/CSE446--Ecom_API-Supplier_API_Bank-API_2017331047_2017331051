const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const axios = require("axios");
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        // return res.redirect("/login");
        return res.send({ message: "Error: Invalid Email or Password" });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.send({ message: "Successfully Logged In", user: user });
            });
          }
          // req.flash("error", "Invalid email or password.");
          // res.redirect("/login");
          res.send({ message: "Error: Invalid Email or Password" });
        })
        .catch((err) => {
          // console.log(err);
          // res.redirect("/login");
          res.send({ message: "Error: Something Wrong Try again" });
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;

  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userName = req.body.user_name;
  const bankAcc = req.body.bank_acc_no;
  const secret = req.body.secret;

  let balance = Number(req.body.balance);
  console.log(email);
  console.log(password);
  console.log(confirmPassword);
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "E-Mail exists already, please pick a different one."
        );
        return res.send({
          message: "Error: Email/ Bank Account Already Exists..",
        });
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            user_name: userName,
            bank_acc_no: bankAcc,
            secret: secret,
            balance: balance,

            cart: { items: [] },
          });
          axios.post("http://localhost:8000/add_bank_user", {
            email: email,
            name: userName,
            user_acc: bankAcc,
            user_sec: secret,
            balance: balance,
            // recipient: global.Adminacc,
            // hoodie: hoodie,
            // sneakers: sneakers,
            // fitbit: fitbit
          });

          return user.save();
        })
        .then((result) => {
          res.send({ message: "Successfully signed up. Login now" });
          return transporter.sendMail({
            to: email,
            from: "neyamul47@student.sust.edu",
            subject: "Successfully signed up",
            html: "<h1>Congrass</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.send({ message: "SuccessFully Logged Off" });
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "neyamul47@student.sust.edu",
          subject: "Reset Password",
          html: `

          <p>Password Reset Link:</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">http://localhost:3000/reset/${token}</a> to set a new password.</p>
          
          `,
        });
      })

      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
