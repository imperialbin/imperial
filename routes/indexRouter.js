const routes = require("express").Router();
const Users = require("../models/Users");
const Datastore = require("nedb");
const bcrypt = require("bcrypt");
const mailer = require("nodemailer");

const db = {
  link: new Datastore({ filename: "./databases/links" }),
  resetTokens: new Datastore({ filename: "./databases/resetTokens" }),
};

db.resetTokens.loadDatabase();
db.link.loadDatabase();

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

// Middleware
const checkAuthenticated = require("../middleware/checkAuthenticated");
const checkNotAuthenticated = require("../middleware/checkNotAuthenticated");

// Utilities
const screenshotDocument = require("../utilities/screenshotDocument");
const generateString = require("../utilities/generateString");
const crypto = require("crypto");
const encrypt = require("../utilities/encrypt");

routes.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    Users.findOne({ _id: req.user.toString() }, (err, user) => {
      res.render("index.ejs", { loggedIn: true, pfp: user.icon });
    });
  } else {
    res.render("index.ejs", { loggedIn: false });
  }
});

routes.get("/success", (req, res) => {
  res.render("success.ejs", { successMessage: "bruh" });
});

routes.get(["/discord", "/dis", "/dsc"], (req, res) => {
  res.redirect("https://discord.com/invite/cTm85eW49D");
});

routes.get(["/github", "/gh", "/git"], (req, res) => {
  res.redirect("https://github.com/imperialbin");
});

routes.get("/forgot", (req, res) => {
  res.render("forgot.ejs", { error: false });
});

routes.get("/resetPassword/:resetToken", (req, res) => {
  db.resetTokens.loadDatabase();
  const resetToken = req.params.resetToken;
  db.resetTokens.findOne({ token: resetToken }, (err, tokenExists) => {
    if (err) return console.log(err);
    if (tokenExists) {
      res.render("resetPassword.ejs", { token: resetToken, error: false });
    } else {
      res.render("error.ejs", { error: "Token is not valid!" });
    }
  });
});

routes.get("/redeem", checkAuthenticated, (req, res) => {
  res.render("redeem.ejs", { error: false });
});

routes.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return console.log(err);
    req.session = null;
    req.logout();
  });
  res.redirect("/login");
});

routes.post("/saveCode", async (req, res) => {
  let code = req.body.code;
  const securedUrls = JSON.parse(req.body.securedUrls.toString().toLowerCase());

  let instantDelete = JSON.parse(req.body.instantDelete.toString().toLowerCase());
  let encrypted = req.body.encrypted ? JSON.parse(req.body.encrypted.toString().toLowerCase()) : false;
  /*   let password = req.body.password; */
  let imageEmbed = JSON.parse(req.body.imageEmbeds.toString().toLowerCase());
  let time = req.body.time;
  let str = generateString(8);
  let allowedEditor = req.body.allowedEditor;
  let creator;
  if (req.isAuthenticated()) {
    if (securedUrls) str = generateString(26);
    if (time >= 31) time = 31;
    creator = req.user.toString(); // this has to be like this mainly because its being dumb, and has a bunch of rando characters even tho its a string, wtf man?
  } else {
    time = 7;
    instantDelete = false;
    creator = "none";
    allowedEditor = "NONE";
    imageEmbed = false;
    encrypted = false;
  }
  try {
    // Check if input is more than 0
    if (code.length > 0) {
      let passwordToBeHashed, initVector, hashedPassword;
      if (encrypted) {
        passwordToBeHashed = generateString(12);
        initVector = crypto.randomBytes(16);
        hashedPassword = crypto.createHash("sha256").update(passwordToBeHashed).digest();
      }
      if (req.isAuthenticated()) {
        await Users.updateOne({ _id: creator }, { $inc: { documentsMade: 1 } });
        db.link.insert({
          URL: str,
          imageEmbed,
          instantDelete,
          creator,
          code: encrypted ? encrypt(hashedPassword, code, initVector) : code,
          dateCreated: new Date().getTime(),
          deleteDate: new Date().setDate(new Date().getDate() + Number(time)),
          allowedEditor: [],
          encrypted,
          encryptedIv: encrypted ? initVector.toString("hex") : null,
        });
        if (allowedEditor) {
          for (var editor = 0; editor < allowedEditor.split(",").length; editor++) {
            Users.findOne({ name: allowedEditor.split(",")[editor] }, (err, user) => {
              if (err) return console.log(err);
              if (user) {
                db.link.update({ URL: str }, { $push: { allowedEditor: user._id.toString() } });
                db.link.loadDatabase();
              }
            });
          }
        }
        // Check for image embeds
        if (imageEmbed && !instantDelete && !encrypted) {
          Users.findOne({ _id: req.user.toString() }, (err, user) => {
            if (err) return db.link.update({ URL: str }, { $set: { imageEmbed: false } });
            if (user) {
              // Non plus members can not use higher resolution screenshots
              const quality = user.memberPlus ? 100 : 73;
              screenshotDocument(str, quality);
            }
          });
        }
      } else {
        db.link.insert({
          URL: str,
          imageEmbed,
          instantDelete,
          creator,
          code,
          dateCreated: new Date().getTime(),
          deleteDate: new Date().setDate(new Date().getDate() + Number(time)),
          allowedEditor: "NONE",
          encrypted: false,
        });
      }
      res.json({
        status: "success",
        link: `/p/${str}`,
        password: encrypted ? passwordToBeHashed : false,
      });
      db.link.loadDatabase();
    }
  } catch (err) {
    console.log(err);
  }
});

routes.post("/editCode", (req, res) => {
  const code = req.body.code;
  const documentId = req.body.documentId;
  if (req.isAuthenticated()) {
    db.link.findOne({ URL: documentId }, (err, doc) => {
      if (doc) {
        if (doc.creator === req.user.toString() || doc.allowedEditor.indexOf(req.user.toString()) !== -1) {
          db.link.update({ URL: documentId }, { $set: { code } }, (err) => {
            if (err) return console.log(err);
            res.json({ status: "success" });
          });
        }
      } else {
        res.json({
          success: false,
          message: "That document doesn't even fucking exist you bafoon!",
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: "You aren't logged in!",
    });
  }
});

routes.post("/requestResetPassword", checkNotAuthenticated, (req, res) => {
  const email = req.body.email.toLowerCase();
  Users.findOne({ email: email }, (err, user) => {
    if (err || user == null) {
      return res.render("forgot.ejs", {
        error: "We couldn't find a user with that email!",
      });
    }
    try {
      const resetToken =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2);
      db.resetTokens.insert({ token: resetToken, email: email, used: false });
      let mailOptions = {
        from: "IMPERIAL",
        to: email,
        subject: "Reset Password",
        text: "Hey there!",
        html: `Please click this link to reset your password! <br> https://www.imperialb.in/resetPassword/${resetToken}`,
      };
      transporter.sendMail(mailOptions, () =>
        res.render("success.ejs", {
          successMessage: `Please check your email at ${email}`,
        })
      );
    } catch {
      res.render("error.ejs", { error: "An unexpected error happened!" });
    }
  });
});

routes.post("/resetPassword", (req, res) => {
  const resetToken = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  db.resetTokens.find({ token: resetToken }, async (err, data) => {
    if (data || data.length !== 0) {
      if (password.length >= 8) {
        if (password)
          if (confirmPassword === password) {
            const hashedPass = await bcrypt.hash(password, 13);
            res.render("success.ejs", {
              successMessage: "Successfully resetted your password!",
            });
            Users.updateOne({ email: data[0].email }, { $set: { password: hashedPass } }, (err) => {
              if (err) return err;
            });
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
