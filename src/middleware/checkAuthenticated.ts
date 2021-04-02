import { NextFunction, Request, Response } from "express";
import { Users } from "../models/Users";

export const checkAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    const user = await Users.findOne({ _id: req.user.toString() });
    if (user && !user.banned) {
      return next();
    } else {
      res.redirect("/logout");
    }
  }

  res.redirect("/login");
};
