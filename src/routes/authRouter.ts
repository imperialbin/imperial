import { Router, Request, Response } from "express";
import { Users } from "../models/Users";
import Datastore from "nedb";
import bcrypt from "bcrypt";

// Utilities

// uhhhhhhhhhhhhhhhhhhhhh
const db = {
  emailTokens: new Datastore({ filename: "./databases/emailTokens" }),
  resetTokens: new Datastore({ filename: "./databases/resetTokens" }),
};

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.send("test auth");
});
