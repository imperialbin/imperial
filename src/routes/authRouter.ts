import { Router, Request, Response } from "express";
import { Users } from "../models/Users";
import { hash } from "bcrypt";

// Utilities
import { verifyToken } from "../utilities/verifyToken";

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.redirect("/");
});

routes.get("/:token", async (req: Request, res: Response) => {
  const token = req.params.token;
  try {
    const getEmail = verifyToken(token);

    await Users.updateOne({ email: getEmail }, { $set: { confirmed: true } });
    res.redirect("/login");
  } catch (err) {
    res.render("error.ejs", {
      error: "Invalid token! Please contact an admin!",
    });
  }
});

routes.post("/resetPassword", async (req: Request, res: Response) => {
  const token = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    const tokenInfo = verifyToken(token);
    if (password.length < 8) throw "Your password must be 8 characters long!";
    if (confirmPassword === password) throw "Passwords do not match!";

    const hashedPass = await hash(password, 13);
    await Users.updateOne(
      { email: tokenInfo },
      { $set: { password: hashedPass } }
    );

    res.render("success.ejs", {
      successMessage: "Successfully reset your password!",
    });
  } catch (error) {
    res.render("resetPassword.ejs", {
      token,
      error: "Invalid token or token has expired!!",
    });
  }
});
