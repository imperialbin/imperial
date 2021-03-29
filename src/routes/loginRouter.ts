import { Router, Request, Response } from "express";
import { authenticate } from "passport";

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.render("login.ejs");
});

routes.post(
  "/",
  authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
