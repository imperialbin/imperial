import { Router, Request, Response } from "express";
import { IUser, Users } from "../models/Users";
import { Documents, IDocument } from "../models/Documents";
import { existsSync, unlinkSync } from "fs";

// Utilities
import { generateString } from "../utilities/generateString";
import { throwApiError } from "../utilities/throwApiError";
import { DocumentSettings } from "../utilities/documentSettingsInterface";
import { decrypt } from "../utilities/decrypt";
import { createDocument } from "../utilities/createDocument";
import { editGist } from "../utilities/editGist";

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

  const index = req.isAuthenticated()
    ? { _id: req.user?.toString() }
    : { apiToken: req.headers.authorization };

  Users.findOne(index, (err: string, user: IUser) => {
    if (err)
      return throwApiError(
        res,
        "There was an error whilst getting your account! Please contact an admin!",
        500
      );
    if (!user)
      return createDocument(
        code,
        generateString(8),
        req.body.language || null,
        false,
        false,
        5,
        null,
        20,
        false,
        null,
        [],
        res
      );

    const creator = user._id.toString();
    const documentSettings: DocumentSettings = {
      longerUrls: req.body.longerUrls || false,
      language: req.body.language || null,
      imageEmbed: req.body.imageEmbed || false,
      expiration: req.body.expiration || 5,
      instantDelete: req.body.instantDelete || false,
      quality: !user.memberPlus ? 73 : 100,
      encrypted: req.body.encrypted || false,
      password: req.body.password || null,
      editorArray: req.body.editors || [],
    };

    return createDocument(
      code,
      documentSettings.longerUrls ? generateString(26) : generateString(8),
      documentSettings.language,
      documentSettings.imageEmbed,
      documentSettings.instantDelete,
      documentSettings.expiration > 31 ? 31 : documentSettings.expiration,
      creator,
      documentSettings.quality,
      documentSettings.encrypted,
      documentSettings.password,
      documentSettings.editorArray,
      res
    );
  });
});

// Get document
routes.get("/document/:documentId", (req: Request, res: Response) => {
  const documentId = req.params.documentId;
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
        documentInfo: {
          documentId: document.URL,
          language: document.language,
          imageEmbed: document.imageEmbed,
          instantDelete: document.instantDelete,
          dateCreated: document.dateCreated,
          deleteDate: document.deleteDate,
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
    ? { _id: req.user?.toString() }
    : { apiToken: req.headers.authorization };

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

  Users.findOne(index, (err: string, user: IUser) => {
    if (err)
      return throwApiError(
        res,
        "An internal server occurred whilst getting user",
        500
      );
    if (!user) return throwApiError(res, "Your authorization is invalid", 401);

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
          documentId: documentId,
          rawLink: `https://imperialb.in/r/${documentId}`,
          formattedLink: `https://imperialb.in/p/${documentId}`,
          expiration: new Date(document.deleteDate),
          instantDelete: document.instantDelete,
        });
      }
    );
  });
});

// Delete document
routes.delete("/document/:documentId", async (req: Request, res: Response) => {
  const index = req.isAuthenticated()
    ? { _id: req.user?.toString() }
    : { apiToken: req.headers.authorization };

  const documentId = req.params.documentId;
  Users.findOne(index, (err: string, user: IUser) => {
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
          return throwApiError(res, "Sorry! That document doesn't exist.", 404);
        if (document.creator !== _id)
          return throwApiError(
            res,
            "Sorry! You aren't allowed to modify this document.",
            401
          );

        await Documents.deleteOne({ URL: documentId });
        if (
          document.imageEmbed &&
          existsSync(`./public/assets/img/${documentId}.jpg`)
        )
          unlinkSync(`./public/assets/img/${documentId}.jpg`);

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
    ? { _id: req.user?.toString() }
    : { apiToken: req.headers.authorization };

  Users.findOne(index, (err: string, user: IUser) => {
    if (err)
      return throwApiError(
        res,
        "An internal server occurred whilst getting user",
        500
      );
    if (!user)
      return throwApiError(res, "Please put in a valid API token!", 401);

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

        if (documents.length == 0)
          return throwApiError(res, "There was no documents to delete!", 400);

        await Documents.deleteMany({ creator });
        for (const document of documents) {
          if (
            document.imageEmbed &&
            existsSync(`./public/assets/img/${document.URL}.jpg`)
          )
            unlinkSync(`./public/assets/img/${document.URL}.jpg`);
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

routes.post("/checkUser", (req: Request, res: Response) => {
  const user = req.body.username;
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
    ? { _id: req.user?.toString() }
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

routes.get("*", (req: Request, res: Response) => {
  throwApiError(
    res,
    "That route does not exist or you have improper URL formatting!",
    404
  );
});
