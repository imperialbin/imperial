import { NextFunction, Request, Response } from "express";

export const checkAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) return next();

  res.redirect("/login");
};
