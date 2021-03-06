import rateLimit from "express-rate-limit";
import { IUser, Users } from "../models/Users";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  handler: (req, res, next) => {
    if (req.headers.authorization || req.isAuthenticated()) {
      if (req.isAuthenticated()) next();

      const apiToken = req.headers.authorization;
      Users.findOne({ apiToken }, (err: string, user: IUser) => {
        if (user) {
          next();
        } else {
          res.status(429).json({
            success: false,
            message:
              "API token is invalid! Please get an API token at https://imperialb.in/account",
          });
        }
      });
    } else {
      res.status(429).json({
        success: false,
        message:
          "You have reached the 15 requests every 15 minutes, please link an API key to raise that amount! (https://www.imperialb.in/account)",
      });
    }
  },
});
