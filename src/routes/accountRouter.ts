import { Router, Request, Response } from "express";
import { IUser, Users } from "../models/Users";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import fetch from "node-fetch";
import Datastore from "nedb";

// ENV
const DEVELOPER_USER = process.env.DEVELOPER_USER;

// Utilities
import generateString from "../utilities/generateString";

// uhhhhhhhhhhhhhhhhhhhhh
const db = {
  link: new Datastore({ filename: "../databases/links" }),
  plusCodes: new Datastore({ filename: "../databases/plusCodes" }),
};

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  db.link.loadDatabase();
  Users.findOne({ _id: req.user?.toString() }, (err: string, user: IUser) => {
    if (user) {
      db.link
        .find({ creator: req.user?.toString() })
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

// Retrieving User data
routes.post("/me", (req: Request, res: Response) => {
  const password = req.body.password;
  Users.findOne(
    { _id: req.user?.toString() },
    async (err: string, user: IUser) => {
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          res.setHeader("Content-Type", "text/plain");
          res.write(user.toString());
          res.end();
        } else {
          db.link
            .find({ creator: req.user?.toString() })
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
    }
  );
});

// Redeeming Plus code
routes.post("/redeem", (req: Request, res: Response) => {
  const code = req.body.code;
  db.plusCodes.findOne({ code }, async (err, codeData) => {
    if (codeData) {
      if (!codeData.used) {
        await Users.updateOne(
          { _id: req.user?.toString() },
          { $set: { memberPlus: true } }
        );
        db.plusCodes.remove({ _id: codeData[0]._id });
        res.render("success.ejs", { successMessage: "You are now Member+!" });
      }
    }
  });
});

// Resetting password stuff
routes.post("/resetPasswordForm", (req: Request, res: Response) => {
  const _id = req.user?.toString();
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  Users.findOne({ _id }, (err: string, user: IUser) => {
    db.link
      .find({ creator: _id })
      .sort({ dateCreated: -1 })
      .limit(10)
      .exec(async (err, documents) => {
        try {
          if (!(await bcrypt.compare(oldPassword, user.password)))
            throw "Incorrect old password!";
          if (newPassword.length! >= 8)
            throw "Please make your new password more than 8 characters long!";
          if (newPassword !== confirmPassword)
            throw "New passwords do not match!";

          const hashedPass = await bcrypt.hash(newPassword, 13);
          await Users.updateOne({ _id }, { $set: { password: hashedPass } });
          res.render("account.ejs", {
            user: user,
            error: false,
            success: "Successfully reset your password!",
            codeError: false,
            pfpError: false,
            documents,
          });
        } catch (err) {
          res.render("account.ejs", {
            user: user,
            error: err,
            success: false,
            codeError: false,
            pfpError: false,
            documents,
          });
        }
      });
  });
});

routes.post("/changePfp", (req: Request, res: Response) => {
  const gitHubName = req.body.pfp;
  const _id = req.user?.toString();
  const pfpUrl = `https://github.com/${gitHubName}.png`;
  fetch(pfpUrl).then((data) => {
    Users.findOne({ _id }, (err: string, user: IUser) => {
      db.link
        .find({ creator: _id })
        .sort({ dateCreated: -1 })
        .limit(10)
        .exec(async (err, documents) => {
          try {
            if (data.status !== 200)
              throw "We could not find that Github user!";

            await Users.updateOne({ _id }, { $set: { icon: pfpUrl } });
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
              error: err,
              success: false,
              codeError: false,
              pfpError: false,
              documents,
            });
          }
        });
    });
  });
});

routes.post("/changePfpGravatar", async (req: Request, res: Response) => {
  const gravatarEmail = req.body.pfp;
  const _id = req.user?.toString();
  const gravatarUrl = await gravatar.url(gravatarEmail);
  db.link
    .find({ creator: _id })
    .sort({ dateCreated: -1 })
    .limit(10)
    .exec(async (err, documents) => {
      const user = await Users.findOne({ _id });
      try {
        await Users.updateOne({ _id }, { $set: { icon: gravatarUrl } });
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

routes.post("/createInvite", (req: Request, res: Response) => {
  const _id = req.user?.toString();
  Users.findOne({ _id }, (err: string, user: IUser) => {
    db.link
      .find({ creator: _id })
      .sort({ dateCreated: -1 })
      .limit(10)
      .exec(async (err, documents) => {
        if (user.codesLeft > 0) {
          await Users.updateOne(
            { _id },
            {
              $set: { codesLeft: user.codesLeft - 1 },
              // @ts-ignore fuck you typescript
              $push: { codes: { code: generateString(8) } },
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

routes.get("/createPlusInvite", (req: Request, res: Response) => {
  db.plusCodes.loadDatabase();
  if (req.user?.toString() === DEVELOPER_USER) {
    const code = generateString(33);
    db.plusCodes.insert({ code, used: false });
    res.render("success.ejs", { successMessage: `Plus code: ${code}` });
  } else {
    res.redirect("/");
  }
});

routes.post("/updateApiToken", async (req: Request, res: Response) => {
  await Users.updateOne(
    { _id: req.user?.toString() },
    { $set: { apiToken: createToken() } }
  );
  res.redirect("/account");
});

const createToken = (): string => {
  return "IMPERIAL-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
};
