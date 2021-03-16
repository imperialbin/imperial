import { Router, Request, Response } from "express";
import { Users } from "../models/Users";
import Datastore from "nedb";
import bcrypt from "bcrypt";

export const routes = Router();

// Utilities
const db = {
  emailTokens: new Datastore({ filename: "./databases/emailTokens" }),
  resetTokens: new Datastore({ filename: "./databases/resetTokens" }),
};

routes.get("/", (req: Request, res: Response) => {
  res.redirect("/");
});

routes.get("/:token", (req: Request, res: Response) => {
  const token = req.params.token;
  db.emailTokens.loadDatabase();
  db.emailTokens.findOne({ token }, async (err, tokenInfo) => {
    if (!tokenInfo)
      return res.render("error.ejs", {
        error: "That token has already been used or doesn't exists!",
      });

    await Users.updateOne(
      { email: tokenInfo.email },
      { $set: { confirmed: true } }
    );

    db.emailTokens.remove({ token });
    res.redirect("/login");
  });
});

routes.post("/resetPassword", (req: Request, res: Response) => {
  const token = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  db.resetTokens.findOne({ token }, async (err, tokenInfo) => {
    if (!tokenInfo)
      return res.render("error.ejs", {
        error: "That token has already been used!",
      });

    try {
      if (password.length < 8) throw "Your password must be 8 characters long!";
      if (confirmPassword === password) throw "Passwords do not match!";

      const hashedPass = await bcrypt.hash(password, 13);
      await Users.updateOne(
        { email: tokenInfo.email },
        { $set: { password: hashedPass } }
      );

      res.render("success.ejs", {
        successMessage: "Successfully reset your password!",
      });
      db.resetTokens.remove({ token });
    } catch (error) {
      res.render("resetPassword.ejs", {
        token,
        error,
      });
    }
  });
});
