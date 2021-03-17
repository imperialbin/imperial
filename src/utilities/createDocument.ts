import { generateString } from "./generateString";
import { randomBytes, createHash } from "crypto";
import { Documents, IDocument } from "../models/Documents";
import { encrypt } from "./encrypt";
import { Users } from "../models/Users";
import { screenshotDocument } from "./screenshotDocument";

export const createDocument = async (
  code: string,
  URL: string,
  imageEmbed: boolean,
  instantDelete: boolean,
  expiration: number,
  creator: string | null,
  quality: number,
  encrypted: boolean,
  password: any,
  res: any = null
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
        view: 0,
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

          if (res) {
            return res?.json({
              success: true,
              documentId: URL,
              rawLink: `https://imperialb.in/r/${URL}`,
              formattedLink: `https://imperialb.in/p/${URL}`,
              expiresIn: new Date(document.deleteDate),
              instantDelete: document.instantDelete,
              encrypted: document.encrypted,
              password: document.encrypted ? password : false,
            });
          }

          return resolve(document);
        });
    } catch (error) {
      if (res) {
        return res?.json({
          success: false,
          message:
            "An internal server error occurred, please contact an admin or developer",
        });
      }

      reject(error);
    }
  });
};
