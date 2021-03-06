import { Router, Request, Response } from "express";
export const routes = Router();
import { Users } from "../models/Users";
import Datastore from "nedb";
import fs from "fs";

const db = {
  link: new Datastore({ filename: "./databases/links" }),
};

// Utilities
import { decrypt } from "../utilities/decrypt";

routes.get(
  [
    "/:documentId",
    "/:slugOne/:documentId",
    "/:slugOne/:slugTwo/:documentId",
    "/:slugOne/:slugTwo/:slugThree/:documentId",
  ],
  (req: Request, res: Response) => {
    const documentId = req.params.documentId;
    res.send(documentId);
  }
);
