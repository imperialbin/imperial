import { Router, Request, Response } from "express";
export const routes = Router();
import { IUser, Users } from "../models/Users";
import Datastore from "nedb";
import crypto from "crypto";

// Utilities
import { generateString } from "../utilities/generateString";
import { throwApiError } from "../utilities/throwApiError";
import { DocumentSettings } from "../utilities/documentSettingsInterface";
import { encrypt } from "../utilities/encrypt";
import { screenshotDocument } from "../utilities/screenshotDocument";
import { decrypt } from "../utilities/decrypt";

const db = {
  link: new Datastore({ filename: "./databases/links" }),
};

routes.get("/", (req: Request, res: Response) =>
  res.json({ message: "Welcome to Imperialbin's API!" })
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

  const createPaste = (
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
      db.link.loadDatabase();
      db.link.insert(
        {
          URL,
          imageEmbed,
          instantDelete,
          creator,
          code: encrypted ? encrypt(hashedPassword, code, initVector) : code,
          dateCreated: date.getTime(),
          deleteDate: date.setDate(date.getDate() + expiration),
          allowedEditor: [],
          encrypted,
          encryptedIv: encrypted ? initVector?.toString("hex") : null,
        },
        async (err, document) => {
          if (err)
            return throwApiError(
              res,
              "An internal server error occurred whilst creating document!",
              500
            );

          if (creator !== "NONE")
            await Users.updateOne(
              { _id: creator },
              { $inc: { documentsMade: 1 } }
            );

          if (quality && !instantDelete && imageEmbed && !encrypted)
            screenshotDocument(URL, quality);

          return res.json({
            success: true,
            documnetId: URL,
            rawLink: `https://imperialb.in/r/${URL}`,
            formattedLink: `https://imperialb.in/p/${URL}`,
            expiresIn: new Date(document.deleteDate),
            instantDelete,
            encrypted,
            password: encrypted ? password : false,
          });
        }
      );
    } catch (error) {
      return throwApiError(
        res,
        "An internal server error occurred! Please contact an admin",
        500
      );
    }
  };
});

// Get document
routes.get("/document/:documentId", (req: Request, res: Response) => {
  const documentId = req.params.documentId;
  const password: any = req.query.password || false;

  db.link.loadDatabase();
  db.link.findOne({ URL: documentId }, (err, document) => {
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
        code = decrypt(password, document.code, document.encryptedIv);
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

      db.link.findOne({ URL: documentId }, (err, document) => {
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

        const editors = document.allowedEditor;
        
      });
    }
  );
});
