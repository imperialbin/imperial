const routes = require("express").Router();
const fs = require("fs");
const Datastore = require("nedb");
var db = {};
db.users = new Datastore({ filename: "./databases/users" });
db.link = new Datastore({ filename: "./databases/links" });
db.betaCodes = new Datastore({ filename: "./databases/betaCodes" });
db.plusCodes = new Datastore({ filename: "./databases/plusCodes" });
db.emailTokens = new Datastore({ filename: "./databases/emailTokens" });
db.resetTokens = new Datastore({ filename: "./databases/resetTokens" });

routes.get("/", (req, res) => {
  res.redirect("/");
});

routes.get("/:documentIdOne/:documentIdTwo", (req, res) => {
  const documentOne = req.params.documentIdOne;
  const documentTwo = req.params.documentIdTwo;
  try {
    db.link.findOne({ URL: documentOne }, (err, documentOneInfo) => {
      if (err)
        return res.render("error.ejs", {
          error: "An internal server error occurred please contact an admin!",
        });
      if (documentOneInfo) {
        db.link.findOne({ url: documentTwo }, (err, documentTwoInfo) => {
          if (documentTwoInfo) {
            res.render("compare.ejs", {
              documentOne: documentOneCode,
              documentTwo: documentTwoCode,
            });
          } else {
            res.render("error.ejs", {
              error: `We couldn\'t find the document ${documentTwo} to compare to ${documentOne}`,
            });
          }
        });
      } else {
        res.render("error.ejs", {
          error: `We couldn\'t find the document ${documentOne} to compare to ${documentTwo}`,
        });
      }
    });
  } catch (err) {
    res.render("error.ejs", { error: "An error occured!" });
  }
});

module.exports = routes;
