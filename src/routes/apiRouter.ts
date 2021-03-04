import { Router, Request, Response } from "express";
import { Users } from "../models/Users";
import Datastore from "nedb";
import crypto from "crypto";

// Utilities

// uhhhhhhhhhhhhhhhhhhhhh
const db = {
  link: new Datastore({ filename: "../databases/links" }),
};

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.send("test api");
});
