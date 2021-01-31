const rateLimit = require('express-rate-limit');
const Users = require('../models/Users');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  handler: function (req, res, next) {
    if (req.headers.authorization || req.body.apiToken) {
      const apiToken = req.headers.authorization || req.body.apiToken;
      Users.findOne({ apiToken }, (err, user) => {
        if (user) {
          next();
        } else {
          res.status(429).json({
            success: false,
            message: "API token is invalid! Please get an API token at https://imperialb.in/account"
          });
        }
      })
    } else {
      res.status(429).json({
        success: false,
        message: "You have reached the 15 requests every 15 minutes, please link an API key to raise that amount! (https://www.imperialb.in/account)"
      });
    }
  }
});