import { NextFunction, Request, Response } from "express";

export const checkAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  if (req.user?.banned) return res.redirect("/logout");

  next();
};
