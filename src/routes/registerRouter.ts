import { Router, Request, Response } from "express";
export const routes = Router();
import { IUser, Users } from "../models/Users";
import bcrypt from "bcrypt";
import Datastore from "nedb";
// @ts-ignore shhh
import getIp from "ipware";

const db = {
  emailTokens: new Datastore({ filename: "./databases/emailTokens" }),
};

// Utilities
import { generateString } from "../utilities/generateString";
import { mail } from "../utilities/mailer";

routes.get("/", (req: Request, res: Response) => {
  res.render("register.ejs", { error: false, user: false, email: false });
});

routes.post("/", async (req: Request, res: Response) => {
  const throwInternalError = (error: string, email: string, user: string) => {
    res.render("register.ejs", {
      error,
      email,
      user,
    });
  };

  const email = req.body.email.toLowerCase();
  const username = req.body.name.toLowerCase();
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const inviteCode = req.body.code;
  const usersIp = getIp(req);

  // Check if username has been taken and if it returns
  const usernameCheck = await Users.findOne({ name: username });
  if (usernameCheck)
    return throwInternalError("That username is taken", email, username);

  // Check if we already have an IP associated with existing user
  const ipCheck = await Users.findOne({ ip: usersIp.clientIp });
  if (ipCheck)
    return throwInternalError(
      "IP is already associated with an account!",
      email,
      username
    );
  // Check if the email already is associated with an existing user
  const emailCheck = await Users.findOne({ email });
  if (emailCheck)
    return throwInternalError(
      "A user with that email already has an account!",
      email,
      username
    );

  // Check if the passwords are long enough and if they match
  if (password.length < 8)
    return throwInternalError(
      "Please make your password atleast 8 characters long!",
      email,
      username
    );
  if (password !== confirmPassword)
    return throwInternalError("Passwords do not match!", email, username);

  // Check the beta code
  //@ts-ignore This ignore is so that it doesnt complain that `code: inviteCode` isnt in the thingy
  const checkCode = await Users.findOne({ codes: { code: inviteCode } });
  if (!checkCode)
    return throwInternalError("Invalid invite code!", email, username);

  try {
    const emailToken = generateString(30);
    const hashedPass = await bcrypt.hash(password, 13);
    const newUser = new Users({
      userId: await Users.collection.count() + 1,
      name: username,
      email: email,
      betaCode: inviteCode,
      banned: false,
      confirmed: false,
      ip: usersIp.clientIp,
      codesLeft: 0,
      icon: "/assets/img/pfp.png",
      password: hashedPass,
      memberPlus: false,
      codes: [],
      documentsMade: 0,
    });
    await newUser.save();

    db.emailTokens.loadDatabase();
    db.emailTokens.insert({ token: emailToken, email, used: false });
    mail(
      email,
      "Confirm your email",
      "Hey there!",
      `Please click this link to verify your email! <br> https://imperialb.in/auth/${emailToken}`
    )
      .then(async () => {
        await Users.findOneAndUpdate(
          // @ts-ignore shhh
          { codes: { code: inviteCode } },
          { $pull: { codes: { code: inviteCode } } }
        );
        return res.render("success.ejs", {
          successMessage: `Please check your email to verify! (${email})`,
        });
      })
      .catch((err) => {
        console.log(err);
        return throwInternalError(
          "An error occurred whilst emailing you, please contact an admin!",
          email,
          username
        );
      });
  } catch (error) {
    console.log(error);
    return throwInternalError(
      "An error occurred, please contact an admin!",
      email,
      username
    );
  }
});
