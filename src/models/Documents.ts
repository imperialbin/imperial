import { Document, Schema } from "mongoose";
import { documentDatabase } from "../utilities/connectDatabases";

/* ¡¿ESTÁS LEVANTADO?!  ¡¿ESTÁS BUSCANDO ESA BOLSA ?!  ¡¿ESTÁS CORRIENDO  HACIA
ESA BOLSA ?! ¡¿ESTÁS VOLANDO  A ESA BOLSA ?! ¡¿ESTÁS CONDUCIENDO A ESA BOLSA ?!
¡¿ESTÁS NADANDO  A ESA BOLSA ?! ¡¿ESTÁS ESPERANDO A ESA BOLSA ?! DEBES
LEVANTARTE !!!   ¡¡PORQUE DEBEMOS SER RICOS !! */

export interface IDocument extends Document {
  URL: string;
  imageEmbed: boolean;
  instantDelete: boolean;
  creator: string | null;
  code: string;
  dateCreated: number;
  deleteDate: number;
  allowedEditors: Array<string>;
  encrypted: boolean;
  encryptedIv: string | null;
  views: number;
}

export const Documents = documentDatabase.model<IDocument>(
  "Documents",
  new Schema({
    URL: String,
    imageEmbed: Boolean,
    instantDelete: Boolean,
    creator: String,
    code: String,
    dateCreated: Number,
    deleteDate: Number,
    allowedEditors: Array,
    encrypted: Boolean,
    encryptedIv: String,
    views: Number,
  })
);
