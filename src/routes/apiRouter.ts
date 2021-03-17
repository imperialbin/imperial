import { Router, Request, Response } from "express";
export const routes = Router();
import { IUser, Users } from "../models/Users";
import crypto from "crypto";
import fs from "fs";

// Utilities
import { generateString } from "../utilities/generateString";
import { throwApiError } from "../utilities/throwApiError";
import { DocumentSettings } from "../utilities/documentSettingsInterface";
import { encrypt } from "../utilities/encrypt";
import { decrypt } from "../utilities/decrypt";
import { screenshotDocument } from "../utilities/screenshotDocument";
import { Documents, IDocument } from "../models/Documents";

routes.get("/", (req: Request, res: Response) =>
  res.json({ message: "Welcome to Imperial's API!" })
);

// Post document
routes.post("/document", (req: Request, res: Response) => {
  const code = req.body.code;
  if (!code)
    return throwApiError(
      res,
      "You need to give text in the `code` parameter!",
      400
    );

  const createPaste = async (
    URL: string,
    imageEmbed: boolean,
    instantDelete: boolean,
    expiration: number,
    creator: string,
    quality: number,
    encrypted: boolean,
    password: any
  ) => {
    const date = new Date();
    let passwordToHash: string, initVector: any, hashedPassword: any;

    if (encrypted) {
      passwordToHash =
        typeof password === "string" ? password : generateString(12);
      initVector = crypto.randomBytes(16);
      hashedPassword = crypto
        .createHash("sha256")
        .update(passwordToHash)
        .digest();
    }

    try {
      new Documents({
        URL,
        imageEmbed,
        instantDelete,
        creator,
        code: encrypted ? encrypt(hashedPassword, code, initVector) : code,
        dateCreated: date.getTime(),
        deleteDate: date.setDate(date.getDate() + expiration),
        allowedEditors: [],
        encrypted,
        encryptedIv: encrypted ? initVector?.toString("hex") : null,
        views: 0,
      })
        .save()
        .then(async (document) => {
          if (creator)
            await Users.updateOne(
              { _id: creator },
              { $inc: { documentsMade: 1 } }
            );

          if (quality && !instantDelete && imageEmbed && !encrypted)
            screenshotDocument(URL, quality);
          return res.json({
            success: true,
            documentId: URL,
            rawLink: `https://imperialb.in/r/${URL}`,
            formattedLink: `https://imperialb.in/p/${URL}`,
            expiresIn: new Date(document.deleteDate),
            instantDelete,
            encrypted,
            password: encrypted ? password : false,
          });
        })
        .catch(() => {
          // Throw so it goes right below
          throw "";
        });
    } catch (error) {
      return throwApiError(
        res,
        "An internal server error occurred! Please contact an admin",
        500
      );
    }
  };

  const guestPaste = () => {
    createPaste(generateString(8), false, false, 5, "NONE", 20, false, false);
  };

  if (!req.isAuthenticated() || !req.headers.authorization) return guestPaste();

  const authorization = req.isAuthenticated()
    ? req.user?.toString()
    : // @ts-ignore I dont even know why you're complaing man
      req.headers.authorization;

  Users.findOne(
    {
      $or: [{ _id: authorization }, { apiToken: authorization }],
    },
    (err: string, user: IUser) => {
      if (err)
        return throwApiError(
          res,
          "There was an error whilst getting your account! Please contact an admin!",
          500
        );
      if (!user) return guestPaste();

      const creator = user._id.toString();
      const documentSettings: DocumentSettings = {
        longerUrls: req.body.longerUrls || false,
        imageEmbed: req.body.imageEmbed || false,
        expiration: req.body.expiration || 5,
        instantDelete: req.body.instantDelete || false,
        quality: !user.memberPlus ? 73 : 100,
        encrypted: req.body.encrypted || false,
        password: req.body.password || false,
      };

      return createPaste(
        documentSettings.longerUrls ? generateString(26) : generateString(8),
        documentSettings.imageEmbed,
        documentSettings.instantDelete,
        documentSettings.expiration > 31 ? 31 : documentSettings.expiration,
        creator,
        documentSettings.quality,
        documentSettings.encrypted,
        documentSettings.password
      );
    }
  );
});

// Get document
routes.get("/document/:documentId", (req: Request, res: Response) => {
  const documentId = req.params.documentId;
  const password: any = req.query.password || false;

  Documents.findOne({ URL: documentId }, (err: string, document: IDocument) => {
    if (err)
      return throwApiError(
        res,
        "An internal server error occurred! Please contact an admin!",
        500
      );
    if (!document)
      return throwApiError(res, "We couldn't find that document!", 404);
    if (document.encrypted && !password)
      return throwApiError(
        res,
        "You need to pass ?password=PASSWORD with your request, since this paste is encrypted!",
        401
      );

    let code;
    if (document.encrypted && password) {
      try {
        code = decrypt(password, document.code, document.encryptedIv!);
      } catch {
        return throwApiError(
          res,
          "Incorrect password for encrypted document!",
          401
        );
      }
    } else {
      code = document.code;
    }

    return res.json({
      success: true,
      document: code,
    });
  });
});

// Edit document
routes.patch("/document", (req: Request, res: Response) => {
  const authorization = req.isAuthenticated()
    ? req.user?.toString()
    : // @ts-ignore I dont even know why you're complaing man
      req.headers.authorization;
  if (!authorization) return throwApiError(res, "You must be authorized!", 401);

  const documentId = req.body.document;
  const code = req.body.newCode || req.body.code;
  if (!documentId)
    return throwApiError(res, "You must include a document id!", 400);
  if (!code)
    return throwApiError(
      res,
      "You must give code to replace the old code with!",
      400
    );

  Users.findOne(
    {
      $or: [{ _id: authorization }, { apiToken: authorization }],
    },
    (err: string, user: IUser) => {
      if (err)
        return throwApiError(
          res,
          "An internal server occurred whilst getting user",
          500
        );
      const _id = user._id.toString();

      Documents.findOne(
        { URL: documentId },
        async (err: string, document: IDocument) => {
          if (err)
            return throwApiError(
              res,
              "An internal server occurred whilst getting document!",
              500
            );
          if (!document)
            return throwApiError(
              res,
              "We couldn't find the document you're trying to edit!",
              404
            );

          if (document.encrypted)
            return throwApiError(
              res,
              "You cannot edit encrypted documents right now, please try again later",
              401
            );

          const editors = document.allowedEditors;

          if (document.creator != _id && editors.indexOf(_id) === -1)
            return throwApiError(
              res,
              "Sorry! You aren't allowed to edit this document.",
              401
            );

          await Documents.updateOne({ URL: documentId }, { $set: { code } });
          return res.json({
            success: true,
            message: "Successfully edit the document!",
            documentId: documentId,
            rawLink: `https://imperialb.in/r/${documentId}`,
            formattedLink: `https://imperialb.in/p/${documentId}`,
            expiresIn: new Date(document.deleteDate),
            instantDelete: document.instantDelete,
          });
        }
      );
    }
  );
});

// Delete document
routes.delete("/document/:documentId", async (req: Request, res: Response) => {
  const authorization = req.isAuthenticated()
    ? req.user?.toString()
    : // @ts-ignore I dont even know why you're complaing man
      req.headers.authorization;
  if (!authorization) return throwApiError(res, "You must be authorized!", 401);

  const documentId = req.params.documentId;
  Users.findOne(
    {
      $or: [{ _id: authorization }, { apiToken: authorization }],
    },
    (err: string, user: IUser) => {
      if (err)
        return throwApiError(
          res,
          "An internal server occurred whilst getting user",
          500
        );
      if (!user)
        return throwApiError(res, "Please put in a valid API token!", 401);

      const _id = user._id.toString();

      Documents.findOne(
        { URL: documentId },
        async (err: string, document: IDocument) => {
          if (!document)
            return throwApiError(
              res,
              "Sorry! That document doesn't exist.",
              404
            );
          if (document.creator !== _id)
            return throwApiError(
              res,
              "Sorry! You aren't allowed to modify this document.",
              401
            );

          await Documents.remove({ URL: documentId });
          if (
            document.imageEmbed &&
            fs.existsSync(`./public/assets/img/${documentId}.jpg`)
          )
            fs.unlinkSync(`./public/assets/img/${documentId}.jpg`);

          if (req.isAuthenticated()) return res.redirect("/account");

          return res.json({
            success: true,
            message: "Successfully deleted the document!",
          });
        }
      );
    }
  );
});

// Purging documents
routes.delete("/purgeDocuments", (req: Request, res: Response) => {
  const authorization = req.isAuthenticated()
    ? req.user?.toString()
    : // @ts-ignore I dont even know why you're complaing man
      req.headers.authorization;
  if (!authorization) return throwApiError(res, "You must be authorized!", 401);

  Users.findOne(
    {
      $or: [{ _id: authorization }, { apiToken: authorization }],
    },
    (err: string, user: IUser) => {
      if (err)
        return throwApiError(
          res,
          "An internal server occurred whilst getting user",
          500
        );
      if (!user)
        return throwApiError(res, "Please put in a valid API token!", 401);

      const creator = user._id.toString();
      db.link.loadDatabase();
      db.link.find({ creator }, (err: string, documents: any) => {
        if (err)
          return throwApiError(
            res,
            "An internal server occurred whilst getting documents!",
            500
          );

        if (documents.length == 0)
          return throwApiError(res, "There was no documents to delete!", 400);

        for (const document of documents) {
          const _id = document._id;
          db.link.remove({ _id });

          if (
            document.imageEmbed &&
            fs.existsSync(`./public/assets/img/${document.URL}.jpg`)
          )
            fs.unlinkSync(`./public/assets/img/${document.URL}.jpg`);
        }

        if (req.isAuthenticated()) return res.redirect("/account");

        return res.json({
          success: true,
          message: `Deleted a total of ${documents.length} documents!`,
          numberDeleted: documents.length,
        });
      });
    }
  );
});

routes.get("/checkApiToken/:apiToken", (req: Request, res: Response) => {
  const apiToken = req.params.apiToken;

  Users.findOne({ apiToken }, (err: string, user: IUser) => {
    if (err)
      return throwApiError(
        res,
        "An internal server occurred whilst getting user",
        500
      );

    return res.json({
      success: user ? true : false,
      message: user ? "API token is valid!" : "API token is invalid!",
    });
  });
});

routes.get("/getShareXConfig/:apiToken", (req: Request, res: Response) => {
  const apiToken = req.params.apiToken;
  res.attachment("imperialbin.sxcu").send({
    Version: "13.4.0",
    DestinationType: "TextUploader",
    RequestMethod: "POST",
    RequestURL: "https://imperialb.in/api/postCode/",
    Headers: {
      Authorization: apiToken,
    },
    Body: "JSON",
    Data:
      '{\n  "code": "$input$",\n  "longerUrls": false,\n  "imageEmbed": true,\n  "instantDelete": false\n}',
    URL: "$json:formattedLink$",
  });
});

routes.get("*", (req: Request, res: Response) => {
  throwApiError(
    res,
    "That route does not exist or you have improper URL formatting!",
    404
  );
});
