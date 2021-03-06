import { Router, Request, Response } from "express";
export const routes = Router();

import { IUser, Users } from "../models/Users";
import Datastore from "nedb";
import bcrypt from "bcrypt";

// Routes
import { routes as pasteRouter } from "./pasteRouter";

// Middleware
import checkAuthenticated from "../middleware/checkAuthenticated";
import checkNotAuthenticated from "../middleware/checkNotAuthenticated";

// Utilities
import { generateString } from "../utilities/generateString";
import { mail } from "../utilities/mailer";

const db = {
  link: new Datastore({ filename: "./databases/links" }),
  resetTokens: new Datastore({ filename: "./databases/resetTokens" }),
};

// default pages
routes.get("/", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    Users.findOne({ _id: req.user.toString() }, (err: string, user: IUser) => {
      res.render("index.ejs", { loggedIn: true, pfp: user.icon });
    });
  } else {
    res.render("index.ejs", { loggedIn: false });
  }
});

routes.get("/about", (req: Request, res: Response) => {
  res.render("about.ejs");
});

routes.get("/forgot", (req: Request, res: Response) => {
  res.render("forgot.ejs", { error: false });
});

routes.get("/resetPassword/:resetToken", (req: Request, res: Response) => {
  const token = req.params.resetToken;
  db.resetTokens.loadDatabase();
  db.resetTokens.findOne({ token }, (err, tokenExists) => {
    if (!tokenExists) res.render("error.ejs", { error: "Token is not valid!" });

    res.render("resetPassword.ejs", { token, error: false });
  });
});

routes.get("/redeem", checkAuthenticated, (req: Request, res: Response) => {
  res.render("redeem.ejs", { error: false });
});

routes.get("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return console.log(err);

    // @ts-ignore shut up pwetty pwease
    req.session = null;
    req.logOut();
  });
  res.redirect("/login");
});

// Social Medias
routes.get(["/discord", "/dis", "/dsc"], (req: Request, res: Response) =>
  res.redirect("https://discord.com/invite/cTm85eW49D")
);

routes.get(["/github", "/git", "/gh"], (req: Request, res: Response) =>
  res.redirect("https://github.com/imperialbin")
);

// something stupid so the server doesnt get confused
routes.use("/:slug", pasteRouter);

// Some posts for resetting your password
routes.post(
  "/requestResetPassword",
  checkNotAuthenticated,
  (req: Request, res: Response) => {
    const email = req.body.email.toLowerCase();
    Users.findOne({ email }, (err: string, user: IUser) => {
      if (err)
        return res.render("forgot.ejs", {
          error: "An internal server error has occurred!",
        });

      if (!user)
        return res.render("forgot.ejs", {
          error: "We couldn't find a user with that email!",
        });

      const token = generateString(30);
      db.resetTokens.insert({ token, email, used: false });
      mail(
        email,
        "Reset password",
        "Hey there!",
        `Please click this link to reset your password! <br> https://www.imperialb.in/resetPassword/${token}`
      )
        .then(() => {
          res.render("success.ejs", {
            successMessage: `Please check your email at ${email}`,
          });
        })
        .catch((err) => {
          console.log(err);
          res.render("error.ejs", { error: "An unexpected error happened!" });
        });
    });
  }
);

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
      if (password !== confirmPassword) throw "Passwords do not match!";

      const hashedPass = await bcrypt.hash(password, 13);
      await Users.updateOne(
        { email: tokenInfo.email },
        { $set: { password: hashedPass } }
      );
      db.resetTokens.remove({ token });
      res.render("success.ejs", {
        successMessage: "Successfully resetted your password!",
      });
    } catch (error) {
      return res.render("resetPassword.ejs", {
        token,
        error,
      });
    }
  });
});
