const routes = require("express").Router();
const Datastore = require("nedb");

// Utilities
const decrypt = require("../utilities/decrypt");

var db = {
  link: new Datastore({ filename: "./databases/links" }),
};

routes.get("/", (req, res) => res.redirect("/"));

routes.get("/:documentId", (req, res) => {
  const document = req.params.documentId;
  const password = req.query.password || false;
  db.link.loadDatabase();
  db.link.findOne({ URL: document }, (err, document) => {
    if (err) return res.render("error.ejs", { error: "An error occurred!" });
    if (!document) res.render("error.ejs", { error: "We couldn't find that document!" });
    if (document.encrypted && !password) {
      return res.json({
        success: false,
        message: "You need to pass ?password=PASSWORD with your request, since this paste is encrypted!",
      });
    }
    let code;
    if (document.encrypted && password) {
      try {
        code = decrypt(password, document.code, document.encryptedIv);
      } catch {
        return res.json({
          success: false,
          message: "Incorrect password for encrypted document!",
        });
      }
    } else {
      code = document.code;
    }
    res.setHeader("Content-Type", "text/plain");
    res.send(code);
    res.end();
    if (document.instantDelete) {
      setTimeout(() => {
        db.link.remove({ URL: document.URL });
      }, 1000);
    }
  });
});

module.exports = routes;
