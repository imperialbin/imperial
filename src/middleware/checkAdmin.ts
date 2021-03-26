import { NextFunction, Request, Response } from "express";
import { IUser, Users } from "../models/Users";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const _id = req.user.toString();
    Users.findOne({ _id }, (err: string, user: IUser) => {
      if (err || !user || !user.admin) return res.redirect("/");

      // Im checking once more just incase lmfao
      if (user.admin) return next();
    });
  } else {
    res.redirect("/login");
  }
};
