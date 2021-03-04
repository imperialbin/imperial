import { Router, Request, Response } from "express";
import { Users } from "../models/Users";
import Datastore from "nedb";

// Utilities

// uhhhhhhhhhhhhhhhhhhhhh
const db = {
  link: new Datastore({ filename: "../databases/links" }),
  plusCodes: new Datastore({ filename: "../databases/plusCodes" }),
};

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.send("test account");
});
