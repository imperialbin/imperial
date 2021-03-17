import { Router, Request, Response } from "express";
import { Documents, IDocument } from "../models/Documents";

// Utilities
import { decrypt } from "../utilities/decrypt";
import { throwApiError } from "../utilities/throwApiError";

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.redirect("/");
});

routes.get("/:documentId", (req, res) => {
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
      return throwApiError(res, "That document does not exists!", 404);
    if (document.encrypted && !password)
      return throwApiError(
        res,
        "You need to pass ?password=PASSWORD with your request, since this paste is encrypted!",
        403
      );

    let code;
    if (document.encrypted && password) {
      try {
        code = decrypt(password, document.code, document.encryptedIv!);
      } catch (error) {
        return throwApiError(
          res,
          "Incorrect password for encrypted document!",
          403
        );
      }
    } else {
      code = document.code;
    }

    res.setHeader("Content-Type", "text/plain");
    res.send(code);
    res.end();

    if (document.instantDelete) {
      setTimeout(async () => {
        await Documents.remove({ URL: documentId });
      }, 1000);
    }
  });
});
