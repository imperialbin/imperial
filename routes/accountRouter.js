require("dotenv/config");
const routes = require("express").Router();
const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const fetch = require("node-fetch");
const Datastore = require("nedb");

const db = {};
db.link = new Datastore({ filename: "./databases/links" });
db.betaCodes = new Datastore({ filename: "./databases/betaCodes" });
db.plusCodes = new Datastore({ filename: "./databases/plusCodes" });
db.betaCodes.loadDatabase();
db.plusCodes.loadDatabase();

routes.get("/", (req, res) => {
  db.link.loadDatabase();
  Users.findOne({ _id: req.user.toString() }, (err, user) => {
    if (user) {
      db.link
        .find({ creator: req.user.toString() })
        .sort({ dateCreated: -1 })
        .limit(10)
        .exec((err, documents) => {
          res.render("account.ejs", {
            user: user,
            error: false,
            success: false,
            codeError: false,
            pfpError: false,
            documents,
          });
        });
    }
  });
});

routes.post("/me", (req, res) => {
  const password = req.body.password;
  Users.findOne({ _id: req.user.toString() }, async (err, user) => {
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        res.setHeader("Content-Type", "text/plain");
        res.write(user.toString());
        res.end();
      } else {
        db.link
          .find({ creator: req.user.toString() })
          .sort({ dateCreated: -1 })
          .limit(10)
          .exec((err, documents) => {
            res.render("account.ejs", {
              user: user,
              error: false,
              success: false,
              codeError: false,
              pfpError:
                "We couldn't get your user data because your password was incorrect!",
              documents,
            });
          });
      }
    }
  });
});

routes.post("/redeem", (req, res) => {
  const code = req.body.code;
  db.plusCodes.find({ code }, (err, codeData) => {
    if (codeData) {
      if (!codeData[0].used) {
        Users.updateOne(
          { _id: req.user.toString() },
          { $set: { memberPlus: true } },
          (err) => {
            if (err) return console.log(err);
          }
        );
        db.plusCodes.remove({ _id: codeData[0]._id });
        res.render("success.ejs", { successMessage: "You are now Member+!" });
      }
    } else {
      console.log("couldn't find that code!");
    }
  });
});

routes.post("/resetPasswordForm", (req, res) => {
  const id = req.user.toString();
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  Users.findOne({ _id: id }, async (err, user) => {
    db.link
      .find({ creator: id })
      .sort({ dateCreated: -1 })
      .limit(10)
      .exec(async (err, documents) => {
        if (await bcrypt.compare(oldPassword, user.password)) {
          if (newPassword.length >= 8) {
            if (newPassword === confirmPassword) {
              const hashedPass = await bcrypt.hash(newPassword, 13);
              Users.updateOne(
                { _id: id },
                { $set: { password: hashedPass } },
                (err) => {
                  if (err) return console.log(err);
                }
              );
              res.render("account.ejs", {
                user: user,
                error: false,
                success: "Successfully reset your password!",
                codeError: false,
                pfpError: false,
                documents,
              });
            } else {
              res.render("account.ejs", {
                user: user,
                error: "New passwords do not match!",
                success: false,
                codeError: false,
                pfpError: false,
                documents,
              });
            }
          } else {
            res.render("account.ejs", {
              user: user,
              error: "Please make the password more than 8 characters long!",
              success: false,
              codeError: false,
              pfpError: false,
              documents,
            });
          }
        } else {
          res.render("account.ejs", {
            user: user,
            error: "Incorrect old password!",
            success: false,
            codeError: false,
            pfpError: false,
            documents,
          });
        }
      });
  });
});

routes.post("/changePfp", (req, res) => {
  const gitHubName = req.body.pfp;
  const pfpUrl = `https://github.com/${gitHubName}.png`;
  fetch(`https://github.com/${gitHubName}.png`).then((data) => {
    Users.findOne({ _id: req.user.toString() }, (err, user) => {
      db.link
        .find({ creator: req.user.toString() })
        .sort({ dateCreated: -1 })
        .limit(10)
        .exec((err, documents) => {
          if (data.status === 200) {
            try {
              Users.updateOne(
                { _id: req.user.toString() },
                { $set: { icon: pfpUrl } },
                (err) => {
                  if (err) return console.log(err);
                }
              );
              res.render("account.ejs", {
                user: user,
                error: false,
                success: false,
                codeError: false,
                pfpError: false,
                documents,
              });
            } catch (err) {
              res.render("account.ejs", {
                user: user,
                error: "An error has occured whilst trying to change your pfp!",
                success: false,
                codeError: false,
                pfpError: false,
                documents,
              });
            }
          } else {
            res.render("account.ejs", {
              user: user,
              error: false,
              success: false,
              codeError: false,
              pfpError: "We couldn't find that GitHub user!",
              documents,
            });
          }
        });
    });
  });
});

routes.post("/changePfpGravatar", async (req, res) => {
  const gravatarEmail = req.body.pfp;
  const gravatarUrl = await gravatar.url(gravatarEmail);
  Users.findOne({ _id: req.user.toString() }, (err, user) => {
    db.link
      .find({ creator: req.user.toString() })
      .sort({ dateCreated: -1 })
      .limit(10)
      .exec((err, documents) => {
        try {
          Users.updateOne(
            { _id: req.user.toString() },
            { $set: { icon: gravatarUrl } },
            (err) => {
              if (err) return console.log(err);
            }
          );
          res.render("account.ejs", {
            user: user,
            error: false,
            success: false,
            codeError: false,
            pfpError: false,
            documents,
          });
        } catch (err) {
          res.render("account.ejs", {
            user: user,
            error: false,
            success: false,
            codeError: false,
            pfpError: "An error has occured whilst trying to change your pfp!",
            documents,
          });
        }
      });
  });
});

routes.post("/createInvite", (req, res) => {
  db.betaCodes.loadDatabase();
  Users.findOne({ _id: req.user.toString() }, (err, user) => {
    if (err) return console.log(err);
    db.link
      .find({ creator: req.user.toString() })
      .sort({ dateCreated: -1 })
      .limit(10)
      .exec((err, documents) => {
        if (user.codesLeft > 0) {
          const str = Math.random().toString(36).substring(4);
          Users.updateOne(
            { _id: req.user.toString() },
            {
              $set: { codesLeft: user.codesLeft - 1 },
              $push: { codes: { code: str } },
            },
            (err) => {
              if (err) return console.log(err);
            }
          );
          db.betaCodes.insert({ betaCode: str }, () =>
            res.render("account.ejs", {
              user: user,
              error: false,
              success: false,
              codeError: false,
              pfpError: false,
              documents,
            })
          );
        } else {
          res.render("account.ejs", {
            user: user,
            error: false,
            success: false,
            codeError: "You've exceeded your max invite count!",
            pfpError: false,
            documents,
          });
        }
      });
  });
});

routes.get("/createPlusInvite", (req, res) => {
  db.plusCodes.loadDatabase();
  if (req.user.toString() === process.env.DEVELOPER_USER) {
    const plusCode =
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2);
    db.plusCodes.insert({ code: plusCode, used: false });
    res.render("success.ejs", { successMessage: `Plus code: ${plusCode}` });
  } else {
    res.redirect("/");
  }
});

routes.post("/changeEmail", (req) => {
  const email = req.body.email;
  console.log(email);
});

routes.post("/updateApiToken", (req, res) => {
  Users.updateOne(
    { _id: req.user.toString() },
    { $set: { apiToken: createToken() } },
    (err) => {
      if (err)
        return res.render("error.ejs", {
          error: "There was an error creating your API token!",
        });
      res.redirect("/account");
    }
  );
});

function createToken() {
  return "IMPERIAL-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}

module.exports = routes;
