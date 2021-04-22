import { generateString } from "./generateString";
import { randomBytes, createHash } from "crypto";
import { Documents, IDocument } from "../models/Documents";
import { encrypt } from "./encrypt";
import { Users } from "../models/Users";
import { screenshotDocument } from "./screenshotDocument";
import { createGist } from "./createGists";
import hljs from "imperial-highlight.js";
import { DocumentSettings } from "./documentSettingsInterface";

/**
 * @param  {string} code
 * @param  {DocumentSettings} documentSettings
 * @param  {Response|any=null} res
 * @param  {string|null=null} host
 * @returns Promise
 */
export const createDocument = async (
  code: string,
  documentSettings: DocumentSettings,
  res: Response | any = null,
  host: string | null = null
): Promise<IDocument> => {
  return new Promise<IDocument>((resolve, reject) => {
    const date = new Date();
    let passwordToHash: string, initVector: any, hashedPassword: any;

    if (documentSettings.encrypted) {
      passwordToHash =
        typeof documentSettings.password === "string"
          ? documentSettings.password
          : generateString(12);

      initVector = randomBytes(16);
      hashedPassword = createHash("sha256").update(passwordToHash).digest();
    }

    const URL = documentSettings.longerUrls
      ? generateString(26)
      : generateString(8);

    // Check if the language they passed is a valid language, if its not, set it to auto
    documentSettings.language =
      documentSettings.language &&
      hljs.listLanguages().includes(documentSettings.language)
        ? documentSettings.language
        : (documentSettings.language = "auto");

    if (documentSettings.language === "auto" || !documentSettings.language) {
      const detectLanguage = hljs.highlightAuto(code);
      if (detectLanguage.relevance >= 5) {
        documentSettings.language = detectLanguage.language;
      }
    }

    try {
      new Documents({
        URL,
        language: documentSettings.language,
        imageEmbed: documentSettings.imageEmbed,
        instantDelete: documentSettings.instantDelete,
        creator: documentSettings.creator,
        code: documentSettings.encrypted
          ? encrypt(hashedPassword, code, initVector)
          : code,
        dateCreated: date.getTime(),
        deleteDate: date.setDate(date.getDate() + documentSettings.expiration),
        allowedEditors: documentSettings.editors,
        encrypted: documentSettings.encrypted,
        gist: null,
        encryptedIv: documentSettings.encrypted
          ? initVector?.toString("hex")
          : null,
        views: 0,
      })
        .save()
        .then(async (document) => {
          const user = await Users.findOne({ _id: documentSettings.creator });
          if (user)
            await Users.updateOne(
              { _id: documentSettings.creator },
              { $inc: { documentsMade: 1 } }
            );

          if (user?.githubAccess && !documentSettings.encrypted)
            createGist(user._id, code, URL);

          if (
            documentSettings.quality &&
            !documentSettings.instantDelete &&
            documentSettings.imageEmbed &&
            !documentSettings.encrypted
          )
            screenshotDocument(URL, documentSettings.quality);

          if (res) {
            host = host ? host : "imperialb.in";

            return res.json({
              success: true,
              rawLink: `https://${host}/r/${URL}`,
              formattedLink: `https://${host}/p/${URL}`,
              document: {
                documentId: document.URL,
                language: document.language,
                imageEmbed: document.imageEmbed,
                instantDelete: document.instantDelete,
                creationDate: document.dateCreated,
                expirationDate: document.deleteDate,
                allowedEditors: document.allowedEditors,
                encrypted: document.encrypted,
                password: document.encrypted ? passwordToHash : null,
                views: document.views,
              },
            });
          }

          resolve(document);
        });
    } catch (error) {
      if (res) {
        return res.json({
          success: false,
          message:
            "An internal server error occurred, please contact an admin or developer",
        });
      }

      reject(error);
    }
  });
};
