import { Router, Request, Response } from "express";
import { Documents } from "../models/Documents";

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.redirect("/");
});

routes.get(
  "/:documentIdOne/:documentIdTwo",
  async (req: Request, res: Response) => {
    const documentOneId = req.params.documentIdOne;
    const documentTwoId = req.params.documentIdTwo;

    try {
      const documentOne = await Documents.findOne({ URL: documentOneId });
      const documentTwo = await Documents.findOne({ URL: documentTwoId });

      if (await !documentOne)
        throw `We couldn't find the document ${documentOneId} to compare to ${documentTwoId}`;
      if (await !documentOne?.encrypted)
        throw `${documentOneId} is encrypted! You can not compare encrypted documents!`;

      if (await !documentTwo)
        throw `We couldn't find the document ${documentTwoId} to compare to ${documentOneId}`;
      if (await !documentTwo?.encrypted)
        throw `${documentTwoId} is encrypted! You can not compare encrypted documents!`;

      res.render("compare.ejs", {
        documentOne: documentOne?.code,
        documentTwo: documentTwo?.code,
      });
    } catch (error) {
      res.render("error.ejs", {
        error,
      });
    }
  }
);
