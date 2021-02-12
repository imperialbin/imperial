require("dotenv/config");

const routes = require("express").Router();
const Users = require("../models/Users");
const getIp = require("ipware")().get_ip;
const mailer = require("nodemailer");
const bcrypt = require("bcrypt");
const Datastore = require("nedb");

const db = {};

db.betaCodes = new Datastore({ filename: "./databases/betaCodes" });
db.emailTokens = new Datastore({ filename: "./databases/emailTokens" });

// Middleware
const checkNotAuthenticated = require("../middleware/checkNotAuthenticated");

// Utilities
const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

routes.get("/", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs", { error: false, user: false, email: false });
});

routes.post("/", async (req, res) => {
  db.betaCodes.loadDatabase();
  db.emailTokens.loadDatabase();
  const email = req.body.email.toLowerCase();
  const user = req.body.name.toLowerCase();
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const code = req.body.code;
  const actualIp = getIp(req);
  Users.findOne({ name: user }, (err, checkUsername) => {
    if (!checkUsername) {
      Users.findOne({ ip: actualIp.clientIp }, (err, indexIp) => {
        if (!indexIp) {
          if (password.length >= 8) {
            if (confirmPassword === password) {
              db.betaCodes.findOne({ betaCode: code }, (err, code) => {
                if (code) {
                  Users.findOne({ email: email }, async (err, data) => {
                    if (!data) {
                      try {
                        const emailToken =
                          Math.random().toString(36).slice(2) +
                          Math.random().toString(36).slice(2) +
                          Math.random().toString(36).slice(2);
                        db.emailTokens.insert({
                          token: emailToken,
                          email: email,
                          used: false,
                        });
                        const hashedPass = await bcrypt.hash(password, 13);
                        const newUser = new Users({
                          name: user,
                          email: email,
                          betaCode: code.betaCode,
                          banned: false,
                          confirmed: false,
                          ip: actualIp.clientIp,
                          codesLeft: 0,
                          icon: "/assets/img/pfp.png",
                          password: hashedPass,
                          memberPlus: false,
                          codes: [],
                          documentsMade: 0
                        });
                        newUser
                          .save()
                          .then(() => {
                            const mailOptions = {
                              from: "IMPERIAL",
                              to: email,
                              subject: "Confirm your email",
                              text: "Hey there!",
                              html: `Please click this link to verify your email! <br> https://www.imperialb.in/auth/${emailToken}`,
                            };

                            transporter.sendMail(mailOptions, (err) => {
                              if (err) return console.log(err);
                              db.betaCodes.remove(
                                { betaCode: code.betaCode },
                                (err) => console.log(err)
                              );
                              Users.findOneAndUpdate(
                                { codes: { code: code.betaCode } },
                                { $pull: { codes: { code: code.betaCode } } },
                                console.err
                              );
                            });

                            res.render("success.ejs", {
                              successMessage: `Please check your email to verify! (${email})`,
                            });
                          })
                          .catch((err) => console.log(err));
                      } catch (err) {
                        res.render("register.ejs", {
                          error:
                            "An internal server error happened! Please contact an admin!",
                          email,
                          user,
                        });
                      }
                    } else {
                      res.render("register.ejs", {
                        error: "A user with that email already has an account!",
                        email: false,
                        user,
                      });
                    }
                  });
                } else {
                  res.render("register.ejs", {
                    error: "Incorrect access code!",
                    email,
                    user,
                  });
                }
              });
            } else {
              res.render("register.ejs", {
                error: "Passwords do not match!",
                email,
                user,
              });
            }
          } else {
            res.render("register.ejs", {
              error: "Please make your password atleast 8 characters long!",
              email,
              user,
            });
          }
        } else {
          res.render("register.ejs", {
            error: "IP is already associated with an account!",
            email,
            user,
          });
        }
      });
    } else {
      res.render("register.ejs", {
        error: "That username is taken!",
        email,
        user: false,
      });
    }
  });
});

module.exports = routes;
