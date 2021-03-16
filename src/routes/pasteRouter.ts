import { Router, Request, Response } from "express";
export const routes = Router();
import { IUser, Users } from "../models/Users";
// @ts-ignore shhh
import { Crawler } from "es6-crawler-detect";
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
    const documentId: string = req.params.documentId;
    const CrawlerDetect = new Crawler(req);
    db.link.loadDatabase();
    db.link.findOne({ URL: documentId }, (err, document) => {
      if (err)
        return res.render("error.ejs", {
          error: "An error occurred whilst getting that document!",
        });
      if (!document)
        res.render("error.ejs", {
          error: "We couldn't find that document!",
        });

      if (document.encrypted)
        return res.render("enterPassword.ejs", { error: false, documentId });

      let deleteDate: string;

      if (document.instantDelete) {
        if (!CrawlerDetect.isCrawler()) {
          setTimeout(() => {
            db.link.remove({ URL: document.URL });
          }, 1000);
        }
        deleteDate = "Deletes after being viewed.";
      } else {
        const documentDate = new Date(document.deleteDate);
        const date = {
          year: documentDate.getFullYear(),
          month: documentDate.getMonth() + 1, // We have to have a +1 here because it starts at 0
          day: documentDate.getDate(),
        };
        deleteDate = `Deletes on ${date.day}/${date.month}/${date.year}`;
      }

      const enableImageEmbed = !!(
        document.imageEmbed &&
        fs.existsSync(`./public/assets/img/${document.URL}.jpg`)
      );

      if (req.isAuthenticated()) {
        const _id = req.user?.toString();
        Users.findOne({ _id }, (err: string, user: IUser) => {
          if (err)
            return res.render("pasted.ejs", {
              documentName: documentId,
              imageEmbed: enableImageEmbed,
              code: document.code,
              loggedIn: false,
              deleteDate: deleteDate,
              creator: false,
              encrypted: false,
            });

          const editorArray = document.allowedEditor;
          const isCreator =
            _id === document.creator || editorArray.includes(_id);

          return res.render("pasted.ejs", {
            documentName: documentId,
            imageEmbed: enableImageEmbed,
            code: document.code,
            loggedIn: true,
            pfp: user.icon,
            deleteDate: deleteDate,
            creator: isCreator,
            originalCreator: document.creator,
            incomingUser: _id,
            encrypted: false,
          });
        });
      } else {
        return res.render("pasted.ejs", {
          documentName: documentId,
          imageEmbed: enableImageEmbed,
          code: document.code,
          loggedIn: false,
          deleteDate: deleteDate,
          creator: false,
          encrypted: false,
        });
      }
    });
  }
);

routes.post("/getDocumentAccess/:documentId", (req: Request, res: Response) => {
  const password = req.body.password;
  const documentId = req.params.documentId;
  const CrawlerDetect = new Crawler(req);

  let code: string;
  db.link.loadDatabase();
  db.link.findOne({ URL: documentId }, (err, document) => {
    if (err)
      return res.render("error.ejs", {
        error: "An internal error has occurred!",
      });
    if (!document)
      return res.render("error.ejs", {
        error: "We couldn't find that document!",
      });

    try {
      code = decrypt(password, document.code, document.encryptedIv);
      let deleteDate: string;

      if (document.instantDelete) {
        if (!CrawlerDetect.isCrawler()) {
          setTimeout(() => {
            db.link.remove({ URL: document.URL });
          }, 1000);
        }
        deleteDate = "Deletes after being viewed.";
      } else {
        const documentDate = new Date(document.deleteDate);
        const date = {
          year: documentDate.getFullYear(),
          month: documentDate.getMonth() + 1,
          day: documentDate.getDate(),
        };
        deleteDate = `Deletes on ${date.day}/${date.month}/${date.year}.`;
      }

      const enableImageEmbed = !!(
        document.imageEmbed &&
        fs.existsSync(`./public/assets/img/${document.URL}.jpg`)
      );
      if (req.isAuthenticated()) {
        const _id = req.user?.toString();
        Users.findOne({ _id }, (err: string, user: IUser) => {
          if (err)
            return res.render("pasted.ejs", {
              documentName: documentId,
              imageEmbed: enableImageEmbed,
              code: code,
              loggedIn: false,
              deleteDate: deleteDate,
              creator: false,
              encrypted: true,
            });

          const editorArray = document.allowedEditor;
          const isCreator =
            _id === document.creator || editorArray.includes(_id);

          return res.render("pasted.ejs", {
            documentName: documentId,
            imageEmbed: enableImageEmbed,
            code: code,
            loggedIn: true,
            pfp: user.icon,
            deleteDate: deleteDate,
            creator: isCreator,
            originalCreator: document.creator,
            incomingUser: _id,
            encrypted: true,
          });
        });
      } else {
        return res.render("pasted.ejs", {
          documentName: documentId,
          imageEmbed: enableImageEmbed,
          code: code,
          loggedIn: false,
          deleteDate: deleteDate,
          creator: false,
          encrypted: true,
        });
      }
    } catch (error) {
      return res.render("enterPassword.ejs", {
        error: "Incorrect password",
        documentId,
      });
    }
  });
});
