import { Router, Request, Response } from "express";
export const routes = Router();
import Datastore from "nedb";

const db = {
  link: new Datastore({ filename: "../databases/links" }),
};

routes.get("/", (req: Request, res: Response) => {
  res.redirect("/");
});

routes.get("/:documentIdOne/:documentIdTwo", (req: Request, res: Response) => {
  const documentOne = req.params.documentIdOne;
  const documentTwo = req.params.documentIdTwo;
  db.link.loadDatabase();
  try {
    db.link.findOne({ URL: documentOne }, (err, documentOneInfo) => {
      if (err)
        throw "An internal server error occurred please contact an admin!";
      if (!documentOneInfo)
        throw `We couldn't find the document ${documentOne} to compare to ${documentTwo}`;
      if (documentOneInfo.encrypted)
        throw `${documentOne} is encrypted! You can not compare encrypted documents!`;

      db.link.findOne({ URL: documentTwo }, (err, documentTwoInfo) => {
        if (err)
          throw "An internal server error occurred please contact an admin!";
        if (!documentTwoInfo)
          throw `We couldn't find the document ${documentTwo} to compare to ${documentOne}`;
        if (documentTwoInfo.encrypted)
          throw `${documentTwo} is encrypted! You can not compare encrypted documents!`;

        res.render("compare.ejs", {
          documentOne: documentOneInfo.code,
          documentTwo: documentTwoInfo.code,
        });
      });
    });
  } catch (error) {
    res.render("error.ejs", {
      error,
    });
  }
});
