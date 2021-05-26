import { Router, Request, Response } from "express";
import { Users } from "../models/Users";
import isBot from "isbot";
import { existsSync } from "fs";

// Utilities
import { decrypt } from "../utilities/decrypt";
import { Documents, IDocument } from "../models/Documents";

export const routes = Router();

routes.get(
  [
    "/:documentId",
    "/:slugOne/:documentId",
    "/:slugOne/:slugTwo/:documentId",
    "/:slugOne/:slugTwo/:slugThree/:documentId",
  ],
  async (req: Request, res: Response) => {
    const documentId: string = req.params.documentId;
    const CrawlerDetect = isBot(req.get("user-agent") ?? "deez nuts");

    Documents.findOne(
      { URL: documentId },
      async (err: string, document: IDocument) => {
        if (err)
          return res.render("error.ejs", {
            error: "An error occurred whilst getting that document!",
          });
        if (!document)
          return res.render("error.ejs", {
            error: "We couldn't find that document!",
          });
        if (document.encrypted)
          return res.render("enterPassword.ejs", { error: false, documentId });

        let deleteDate: string;
        if (document.instantDelete) {
          if (!CrawlerDetect) {
            setTimeout(async () => {
              await Documents.deleteOne({ URL: document.URL });
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

        if (req.isAuthenticated()) {
          const _id = req.user?._id.toString();

          await Documents.updateOne(
            { URL: documentId },
            { $inc: { views: 1 } }
          );

          const user = await Users.findOne({ _id });
          if (!user)
            return res.render("pasted.ejs", {
              documentName: documentId,
              language: document.language,
              imageEmbed: document.imageEmbed,
              code: document.code,
              loggedIn: false,
              deleteDate: deleteDate,
              creator: false,
              encrypted: false,
            });

          // The editor array is returning a fucky wucky for some reason, dear future cody, please fix
          const editorArray = document.allowedEditors;
          const isCreator =
            _id === document.creator || editorArray.includes(user.name);

          return res.render("pasted.ejs", {
            documentName: documentId,
            imageEmbed: document.imageEmbed,
            language: document.language,
            code: document?.code,
            loggedIn: true,
            pfp: user.icon,
            deleteDate: deleteDate,
            creator: isCreator,
            originalCreator: document.creator,
            incomingUser: _id,
            isAdmin: user.admin,
            isMemberPlus: user.memberPlus,
            encrypted: false,
          });
        } else {
          return res.render("pasted.ejs", {
            documentName: documentId,
            imageEmbed: document.imageEmbed,
            language: document.language,
            code: document.code,
            loggedIn: false,
            deleteDate: deleteDate,
            creator: false,
            encrypted: false,
          });
        }
      }
    );
  }
);

routes.post("/getDocumentAccess/:documentId", (req: Request, res: Response) => {
  const password = req.body.password;
  const documentId = req.params.documentId;
  const CrawlerDetect = isBot(req.get("user-agent") ?? "deez nuts");

  let code: string;
  Documents.findOne(
    { URL: documentId },
    async (err: string, document: IDocument) => {
      if (err)
        return res.render("error.ejs", {
          error: "An internal error has occurred!",
        });
      if (!document)
        return res.render("error.ejs", {
          error: "We couldn't find that document!",
        });

      try {
        code = decrypt(password, document?.code, document.encryptedIv!);
        let deleteDate: string;

        if (document.instantDelete) {
          if (!CrawlerDetect) {
            setTimeout(async () => {
              await Documents.deleteOne({ URL: document.URL });
            }, 100);
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

        if (req.isAuthenticated()) {
          const _id = req.user?._id.toString();
          const user = await Users.findOne({ _id });
          if (!user)
            return res.render("pasted.ejs", {
              documentName: documentId,
              language: document.language,
              imageEmbed: document.imageEmbed,
              code: code,
              loggedIn: false,
              deleteDate: deleteDate,
              creator: false,
              encrypted: true,
            });

          const editorArray = document.allowedEditors;
          const isCreator =
            _id === document.creator || editorArray.includes(_id);

          return res.render("pasted.ejs", {
            documentName: documentId,
            imageEmbed: document.imageEmbed,
            language: document.language,
            code: code,
            loggedIn: true,
            pfp: user.icon,
            deleteDate: deleteDate,
            creator: isCreator,
            originalCreator: document.creator,
            incomingUser: _id,
            isAdmin: user.admin,
            isMemberPlus: user.memberPlus,
            encrypted: true,
          });
        } else {
          return res.render("pasted.ejs", {
            documentName: documentId,
            imageEmbed: document.imageEmbed,
            language: document.language,
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
    }
  );
});
