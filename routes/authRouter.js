const routes = require("express").Router();
const Users = require("../models/Users");
const Datastore = require("nedb");
const bcrypt = require("bcrypt");

const db = {
  emailTokens: new Datastore({ filename: "./databases/emailTokens" }),
  resetTokens: new Datastore({ filename: "./databases/resetTokens" }),
};

routes.get("/", (req, res) => {
  res.redirect("/");
});

routes.get("/:authCode", (req, res) => {
  db.emailTokens.loadDatabase();
  const authCode = req.params.authCode;
  db.emailTokens.findOne({ token: authCode }, (err, data) => {
    if (data) {
      db.emailTokens.remove({ token: authCode });
      Users.updateOne(
        { email: data.email },
        { $set: { confirmed: true } },
        (err) => {
          if (err) return err;
        }
      );
      res.render("login.ejs");
    } else {
      res.render("error.ejs", {
        error: "Looks that link doesn't exist or has been used!",
      });
    }
  });
});

routes.post("/resetPassword", (req, res) => {
  db.resetTokens.loadDatabase();
  const resetToken = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  db.resetTokens.findOne({ token: resetToken }, async (err, data) => {
    if (!data === undefined || !data.length === 0) {
      if (password.length >= 8) {
        if (password)
          if (confirmPassword === password) {
            const hashedPass = await bcrypt.hash(password, 13);
            res.render("success.ejs", {
              successMessage: "Successfully reset your password!",
            });
            Users.updateOne(
              { email: data.email },
              { $set: { password: hashedPass } },
              (err) => {
                if (err) return err;
              }
            );
            db.resetTokens.remove({ token: resetToken });
          } else {
            res.render("resetPassword.ejs", {
              token: resetToken,
              error: "Passwords do not match!",
            });
          }
      } else {
        res.render("resetPassword.ejs", {
          token: resetToken,
          error: "Your password must be 8 characters long!",
        });
      }
    } else {
      res.render("error.ejs", { error: "That token has already been used!" });
    }
  });
});

module.exports = routes;
