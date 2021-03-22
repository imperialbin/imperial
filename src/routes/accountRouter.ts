import { Router, Request, Response } from "express";
import { IUser, Users } from "../models/Users";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import fetch from "node-fetch";
import Datastore from "nedb";

// ENV
const DEVELOPER_USER = process.env.DEVELOPER_USER;

// Utilities
import { generateString } from "../utilities/generateString";
import { getDocuments } from "../utilities/getDocuments";
import { generateApiToken as createToken } from "../utilities/generateApiToken";

// uhhhhhhhhhhhhhhhhhhhhh
const db = {
  plusCodes: new Datastore({ filename: "./databases/plusCodes" }),
};

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  Users.findOne(
    { _id: req.user?.toString() },
    async (err: string, user: IUser) => {
      if (user) {
        res.render("account.ejs", {
          user,
          error: false,
          success: false,
          codeError: false,
          pfpError: false,
          documents: await getDocuments(req.user?.toString(), 10),
        });
      }
    }
  );
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
          res.render("account.ejs", {
            user,
            error: false,
            success: false,
            codeError: false,
            pfpError: false,
            documents: await getDocuments(req.user?.toString(), 10),
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

  Users.findOne({ _id }, async (err: string, user: IUser) => {
    try {
      if (!(await bcrypt.compare(oldPassword, user.password)))
        throw "Incorrect old password!";
      if (newPassword.length < 8)
        throw "Please make your new password more than 8 characters long!";
      if (newPassword !== confirmPassword) throw "New passwords do not match!";

      const hashedPass = await bcrypt.hash(newPassword, 13);
      await Users.updateOne({ _id }, { $set: { password: hashedPass } });
      res.render("account.ejs", {
        user,
        error: false,
        success: "Successfully reset your password!",
        codeError: false,
        pfpError: false,
        documents: await getDocuments(req.user?.toString(), 10),
      });
    } catch (error) {
      res.render("account.ejs", {
        user,
        error,
        success: false,
        codeError: false,
        pfpError: false,
        documents: await getDocuments(req.user?.toString(), 10),
      });
    }
  });
});

routes.post("/changePfp", (req: Request, res: Response) => {
  const gitHubName = req.body.pfp;
  const _id = req.user?.toString();
  const pfpUrl = `https://github.com/${gitHubName}.png`;
  fetch(pfpUrl).then((data) => {
    Users.findOne({ _id }, async (err: string, user: IUser) => {
      try {
        if (data.status !== 200) throw "We could not find that Github user!";

        await Users.updateOne({ _id }, { $set: { icon: pfpUrl } });
        res.render("account.ejs", {
          user,
          error: false,
          success: false,
          codeError: false,
          pfpError: false,
          documents: await getDocuments(req.user?.toString(), 10),
        });
      } catch (error) {
        res.render("account.ejs", {
          user,
          error,
          success: false,
          codeError: false,
          pfpError: false,
          documents: await getDocuments(req.user?.toString(), 10),
        });
      }
    });
  });
});

routes.post("/changeDocumentSettings", (req: Request, res: Response) => {
  const settings = req.body;
  const _id = req.user?.toString();
  Users.updateOne({ _id }, { $set: { settings } }, {}, (err: string) => {
    if (err)
      return res.json({
        success: false,
        message: "An error occurred whilst saving your settings!",
      });
    res.json({
      success: true,
      message: "Successfully changed your user settings!",
    });
  });
});

routes.post("/changePfpGravatar", async (req: Request, res: Response) => {
  const gravatarEmail = req.body.pfp;
  const _id = req.user?.toString();
  const gravatarUrl = await gravatar.url(gravatarEmail);
  const user = await Users.findOne({ _id });
  try {
    await Users.updateOne({ _id }, { $set: { icon: gravatarUrl } });
    res.render("account.ejs", {
      user,
      error: false,
      success: false,
      codeError: false,
      pfpError: false,
      documents: await getDocuments(req.user?.toString(), 10),
    });
  } catch (err) {
    res.render("account.ejs", {
      user,
      error: false,
      success: false,
      codeError: false,
      pfpError: "An error has occurred whilst trying to change your pfp!",
      documents: await getDocuments(req.user?.toString(), 10),
    });
  }
});

routes.post("/createInvite", (req: Request, res: Response) => {
  const _id = req.user?.toString();
  Users.findOne({ _id }, async (err: string, user: IUser) => {
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
        user,
        error: false,
        success: false,
        codeError: false,
        pfpError: false,
        documents: await getDocuments(req.user?.toString(), 10),
      });
    } else {
      res.render("account.ejs", {
        user,
        error: false,
        success: false,
        codeError: "You've exceeded your max invite count!",
        pfpError: false,
        documents: await getDocuments(req.user?.toString(), 10),
      });
    }
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
