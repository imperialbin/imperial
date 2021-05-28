import { Router, Request, Response } from "express";
import { IUser, Users } from "../models/Users";
import { Documents, IDocument } from "../models/Documents";

// Utilities
import { throwApiError } from "../utilities/throwApiError";
import { DocumentSettings } from "../utilities/documentSettingsInterface";
import { decrypt } from "../utilities/decrypt";
import { createDocument } from "../utilities/createDocument";
import { editGist } from "../utilities/editGist";
import { s3 } from "../utilities/aws";

export const routes = Router();

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

  if (typeof code !== "string")
    return throwApiError(res, "You need to pass correct type of code", 400);

  const index = req.isAuthenticated()
    ? { _id: req.user?._id.toString() }
    : { apiToken: req.headers.authorization };

  if (req.user?.banned) return res.redirect("/logout");

  if (!req.headers.authorization && !req.user)
    return createDocument(
      code,
      {
        creator: null,
        editors: [],
        encrypted: false,
        expiration: 5,
        imageEmbed: false,
        instantDelete: false,
        language: req.body.language || null,
        public: false,
        longerUrls: false,
        shortUrls: false,
        password: null,
        quality: 20,
      },
      res,
      req.get("host")
    );

  Users.findOne(index, (err: string, user: IUser) => {
    if (err)
      return throwApiError(
        res,
        "There was an error whilst getting your account! Please contact an admin!",
        500
      );
    if (!user)
      return throwApiError(res, "Your authorization token is invalid!", 401);

    if (user.banned) return throwApiError(res, "User is banned!", 401);

    const creator = user._id.toString();

    const documentSettings: DocumentSettings = {
      longerUrls: req.body.longerUrls || false,
      shortUrls: req.body.shortUrls || false,
      language: req.body.language || null,
      creator,
      imageEmbed: req.body.imageEmbed || false,
      expiration: req.body.expiration || 5,
      instantDelete: req.body.instantDelete || false,
      quality: !user.memberPlus ? 73 : 100,
      encrypted: req.body.encrypted || false,
      public: req.body.public || false,
      password: req.body.password || null,
      editors: req.body.editors || [],
    };

    // Me checking types to make sure no one fucks me over fuck you fuycky ou fuck you fyuck you fuck yo u
    if (
      typeof documentSettings.longerUrls !== "boolean" ||
      typeof documentSettings.shortUrls !== "boolean" ||
      typeof documentSettings.imageEmbed !== "boolean" ||
      typeof documentSettings.expiration !== "number" ||
      typeof documentSettings.instantDelete !== "boolean" ||
      typeof documentSettings.encrypted !== "boolean" ||
      typeof documentSettings.public !== "boolean"
    )
      return throwApiError(
        res,
        "Some settings are not correct types! Please refer to our docs at https://docs.imperialb.in/",
        400
      );

    return createDocument(
      code,
      documentSettings,
      res,
      documentSettings.shortUrls ? "impb.in" : req.get("host")
    );
  });
});

// Get document
routes.get("/document/:documentId", (req: Request, res: Response) => {
  const documentId = req.params.documentId;
  if (!documentId && typeof documentId !== "string")
    return throwApiError(
      res,
      "Document ID was not provided or is invalid!",
      400
    );
  const password: any = req.query.password || false;

  Documents.findOne(
    { URL: documentId },
    async (err: string, document: IDocument) => {
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

      await Documents.updateOne({ URL: documentId }, { $inc: { views: 1 } });

      return res.json({
        success: true,
        content: code,
        document: {
          documentId: document.URL,
          public: document.public || false,
          language: document.language,
          imageEmbed: document.imageEmbed,
          instantDelete: document.instantDelete,
          creationDate: document.dateCreated,
          expirationDate: document.deleteDate,
          allowedEditors: document.allowedEditors,
          encrypted: document.encrypted,
          views: document.views,
        },
      });
    }
  );
});

// Edit document
routes.patch("/document", (req: Request, res: Response) => {
  const index = req.isAuthenticated()
    ? { _id: req.user?._id.toString() }
    : { apiToken: req.headers.authorization };

  if (req.user?.banned) return res.redirect("/logout");

  const documentId = req.body.document;
  const code = req.body.newCode || req.body.code;
  if (!documentId && typeof documentId !== "string")
    return throwApiError(res, "You must include a valid document id!", 400);
  if ((!code && typeof code !== "string") || code === "" || !code.trim())
    return throwApiError(
      res,
      "You must give valid code to replace the old code with!",
      400
    );

  Users.findOne(index, (err: string, user: IUser) => {
    if (err)
      return throwApiError(
        res,
        "An internal server occurred whilst getting user",
        500
      );
    if (!user) return throwApiError(res, "Your authorization is invalid", 401);
    if (user.banned) return throwApiError(res, "User is banned!", 401);

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

        if (document.creator != _id && !editors.includes(user.name))
          return throwApiError(
            res,
            "Sorry! You aren't allowed to edit this document.",
            401
          );

        await Documents.updateOne({ URL: documentId }, { $set: { code } });
        if (document.gist) {
          editGist(document.URL, code);
        }
        return res.json({
          success: true,
          message: "Successfully edit the document!",
          rawLink: `https://imperialb.in/r/${documentId}`,
          formattedLink: `https://imperialb.in/p/${documentId}`,
          document: {
            documentId: document.URL,
            public: document.public || false,
            language: document.language,
            imageEmbed: document.imageEmbed,
            instantDelete: document.instantDelete,
            creationDate: document.dateCreated,
            expirationDate: document.deleteDate,
            allowedEditors: document.allowedEditors,
            encrypted: document.encrypted,
            views: document.views,
          },
        });
      }
    );
  });
});

// Delete document
routes.delete("/document/:documentId", async (req: Request, res: Response) => {
  const index = req.isAuthenticated()
    ? { _id: req.user?._id.toString() }
    : { apiToken: req.headers.authorization };

  if (req.user?.banned) return res.redirect("/logout");

  const documentId = req.params.documentId;
  if (!documentId && typeof documentId !== "string")
    return throwApiError(res, "An invalid document ID was provided!", 400);
  Users.findOne(index, (err: string, user: IUser) => {
    if (err)
      return throwApiError(
        res,
        "An internal server occurred whilst getting user",
        500
      );
    if (!user)
      return throwApiError(res, "Please put in a valid API token!", 401);

    if (user.banned) return throwApiError(res, "User is banned!", 401);

    const _id = user._id.toString();

    Documents.findOne(
      { URL: documentId },
      async (err: string, document: IDocument) => {
        if (!document)
          return throwApiError(res, "Sorry! That document doesn't exist.", 404);
        if (document.creator !== _id)
          return throwApiError(
            res,
            "Sorry! You aren't allowed to modify this document.",
            401
          );

        await Documents.deleteOne({ URL: documentId });
        if (document.imageEmbed)
          await s3
            .deleteObject({
              Bucket: "imperial",
              Key: `${documentId}.jpg`,
            })
            .promise();

        return res.json({
          success: true,
          message: "Successfully deleted the document!",
        });
      }
    );
  });
});

// Purging documents
routes.delete("/purgeDocuments", (req: Request, res: Response) => {
  const index = req.isAuthenticated()
    ? { _id: req.user?._id.toString() }
    : { apiToken: req.headers.authorization };

  if (req.user?.banned) return res.redirect("/logout");

  Users.findOne(index, (err: string, user: IUser) => {
    if (err)
      return throwApiError(
        res,
        "An internal server occurred whilst getting user",
        500
      );
    if (!user)
      return throwApiError(res, "Please put in a valid API token!", 401);

    if (user.banned) return throwApiError(res, "User is banned!", 401);

    const creator = user._id.toString();
    Documents.find(
      { creator },
      async (err: string, documents: Array<IDocument>) => {
        if (err)
          return throwApiError(
            res,
            "An internal server occurred whilst getting documents!",
            500
          );

        if (documents.length == 0) {
          if (req.isAuthenticated()) return res.redirect("/account");
          return throwApiError(res, "There was no documents to delete!", 400);
        }

        await Documents.deleteMany({ creator });
        for (const document of documents) {
          if (document.imageEmbed)
            await s3
              .deleteObject({
                Bucket: "imperial",
                Key: `${document.URL}.jpg`,
              })
              .promise();
        }

        if (req.isAuthenticated()) return res.redirect("/account");

        return res.json({
          success: true,
          message: `Deleted a total of ${documents.length} documents!`,
          numberDeleted: documents.length,
        });
      }
    );
  });
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

    if (user.banned)
      return res.json({
        success: false,
        message: "User is banned",
      });

    res.json({
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
    RequestURL: "https://imperialb.in/api/document/",
    Headers: {
      Authorization: apiToken,
    },
    Body: "JSON",
    Data:
      '{\n  "code": "$input$",\n  "longerUrls": false,\n  "imageEmbed": true,\n  "instantDelete": false\n}',
    URL: "$json:formattedLink$",
  });
});

routes.post("/checkUser", (req: Request, res: Response) => {
  const user = req.body.username;
  if (!user) return throwApiError(res, "You must pass in username!", 400);
  Users.findOne({ name: user }, (err: string, user: IUser) => {
    if (err)
      return throwApiError(res, "An error occurred whilst getting user", 500);
    if (!user) return throwApiError(res, "That user does not exist", 400);

    return res.json({
      success: true,
      username: user.name,
      userPfp: user.icon,
    });
  });
});

/* routes.post("/report", (req: Request, res: Response) => {
  const index = req.isAuthenticated()
    ? { _id: req.user?._id.toString() }
    : { apiToken: req.headers.authorization };
  Users.findOne({ index }, (err: string, user: IUser) => {
    if (err)
      return throwApiError(
        res,
        "An error occurred whilst getting your user!",
        500
      );
    if (!user)
      return throwApiError(
        res,
        "You must be authorized to report something!",
        401
      );
    
    
  });
}); */

routes.use("*", (req: Request, res: Response) => {
  throwApiError(
    res,
    "That route does not exist or you have improper URL formatting!",
    404
  );
});
