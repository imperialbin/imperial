import { generateString } from "./generateString";
import { randomBytes, createHash } from "crypto";
import { Documents, IDocument } from "../models/Documents";
import { encrypt } from "./encrypt";
import { Users } from "../models/Users";
import { screenshotDocument } from "./screenshotDocument";
import { createGist } from "./createGists";
import hljs from "imperial-highlight.js";

export const createDocument = async (
  code: string,
  URL: string,
  language: string | null | undefined,
  imageEmbed: boolean,
  instantDelete: boolean,
  expiration: number,
  creator: string | null,
  quality: number,
  encrypted: boolean,
  password: string | null,
  editors: Array<string | null>,
  res: any = null,
  host: string | null = null
): Promise<IDocument> => {
  return new Promise<IDocument>((resolve, reject) => {
    const date = new Date();
    let passwordToHash: string, initVector: any, hashedPassword: any;
    if (encrypted) {
      passwordToHash =
        typeof password === "string" ? password : generateString(12);

      initVector = randomBytes(16);
      hashedPassword = createHash("sha256").update(passwordToHash).digest();
    }

    // Check if the language they passed is a valid language, if its not, set it to auto
    language =
      language && hljs.listLanguages().includes(language)
        ? language
        : (language = "auto");

    if (language === "auto" || !language) {
      const detectLanguage = hljs.highlightAuto(code);
      if (detectLanguage.relevance >= 5) {
        language = detectLanguage.language;
      }
    }

    try {
      new Documents({
        URL,
        language,
        imageEmbed,
        instantDelete,
        creator,
        code: encrypted ? encrypt(hashedPassword, code, initVector) : code,
        dateCreated: date.getTime(),
        deleteDate: date.setDate(date.getDate() + expiration),
        allowedEditors: editors,
        encrypted,
        gist: null,
        encryptedIv: encrypted ? initVector?.toString("hex") : null,
        view: 0,
      })
        .save()
        .then(async (document) => {
          const user = await Users.findOne({ _id: creator });
          if (creator)
            await Users.updateOne(
              { _id: creator },
              { $inc: { documentsMade: 1 } }
            );

          if (user?.githubAccess && !encrypted) createGist(user._id, code, URL);

          if (quality && !instantDelete && imageEmbed && !encrypted)
            screenshotDocument(URL, quality);

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
                password: encrypted ? passwordToHash : null,
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
