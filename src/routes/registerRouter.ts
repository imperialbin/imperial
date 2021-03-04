import { Router, Request, Response } from "express";

// Middleware

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.send("test register");
});
