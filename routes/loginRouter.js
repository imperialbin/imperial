const routes = require("express").Router();
const passport = require("passport");

// Middleware
const checkNotAuthenticated = require("../middleware/checkNotAuthenticated");

routes.get("/", checkNotAuthenticated, (req, res) => {
  console.log("uwu");
  res.render("login.ejs");
});

routes.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

module.exports = routes;
