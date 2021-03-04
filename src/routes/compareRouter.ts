import { Router, Request, Response } from "express";
import Datastore from "nedb";

// Utilities

// uhhhhhhhhhhhhhhhhhhhhh
const db = {
  link: new Datastore({ filename: "../databases/links" }),
};

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.send("test compare");
});
