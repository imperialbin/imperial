import { Router, Request, Response } from "express";
import { Users } from "../models/Users";
import Datastore from "nedb";

const db = {
  
}

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.send("test");
});
