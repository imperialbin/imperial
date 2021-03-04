import { Router, Request, Response } from "express";
import passport from 'passport';

// Middleware

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.send("test login");
});
