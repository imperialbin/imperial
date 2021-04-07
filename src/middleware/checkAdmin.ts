import { NextFunction, Request, Response } from "express";

export const checkAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAuthenticated() && req.user?.admin) {
    return next();
  }

  res.redirect("/login");
};
