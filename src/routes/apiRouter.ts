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

const db = {
  link: new Datastore({ filename: "./databases/links" }),
};

routes.get("/", (req: Request, res: Response) =>
  res.json({ message: "Welcome to Imperialbin's API!" })
);

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
