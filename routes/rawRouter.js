const routes = require("express").Router();
const Datastore = require("nedb");
var db = {
  link: new Datastore({ filename: "./databases/links" })
};

routes.get("/", (req, res) => res.redirect("/"));

routes.get("/:documentId", (req, res) => {
  const document = req.params.documentId;
  try {
    db.link.loadDatabase();
    db.link.findOne({ URL: document }, (err, document) => {
      if (err) return res.render("error.ejs", { error: "An error occurred!" });
      if (document) {
        res.setHeader("Content-Type", "text/plain");
        res.send(document.code);
        res.end();
        if (document.instantDelete) {
          setTimeout(() => {
            db.link.remove({ URL: document.URL });
          }, 1000);
        }
      } else {
        res.render("error.ejs", { error: "We couldn't find that document!" });
      }
    });
  } catch (err) {
    res.render("error.ejs", {
      error: "We couldn't find that document or an error occurred!",
    });
  }
});

module.exports = routes;
