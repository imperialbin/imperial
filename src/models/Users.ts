import { Document, Schema } from "mongoose";
import { userDatabase } from "../utilities/connectDatabases";

/* ¡¿ESTÁS LEVANTADO?!  ¡¿ESTÁS BUSCANDO ESA BOLSA ?!  ¡¿ESTÁS CORRIENDO  HACIA
ESA BOLSA ?! ¡¿ESTÁS VOLANDO  A ESA BOLSA ?! ¡¿ESTÁS CONDUCIENDO A ESA BOLSA ?!
¡¿ESTÁS NADANDO  A ESA BOLSA ?! ¡¿ESTÁS ESPERANDO A ESA BOLSA ?! DEBES
LEVANTARTE !!!   ¡¡PORQUE DEBEMOS SER RICOS !! */

export interface UserSettings {
  clipboard: boolean;
  longerUrls: boolean;
  instantDelete: boolean;
  encrypted: boolean;
  expiration: number;
  imageEmbed: boolean;
}

export interface IUser {
  _id: string;
  userId: number;
  name: string;
  email: string;
  betaCode: string;
  banned: boolean;
  confirmed: boolean;
  ip: string;
  codesLeft: number;
  icon: string;
  password: string;
  memberPlus: boolean;
  codes: Array<string>;
  apiToken: string;
  documentsMade: number;
  activeUnlimitedDocuments: number;
  discordId: string | null;
  githubAccess: string | null;
  admin: boolean;
  settings: UserSettings;
}

export const Users = userDatabase.model<IUser & Document>(
  "Users",
  new Schema({
    userId: Number,
    name: String,
    email: String,
    betaCode: String,
    banned: Boolean,
    confirmed: Boolean,
    ip: String,
    codesLeft: Number,
    icon: String,
    password: String,
    memberPlus: Boolean,
    codes: Array,
    apiToken: String,
    documentsMade: Number,
    activeUnlimitedDocuments: Number,
    admin: Boolean,
    discordId: String || null,
    githubAccess: String || null,
    settings: {
      clipboard: Boolean,
      longerUrls: Boolean,
      instantDelete: Boolean,
      encrypted: Boolean,
      expiration: Number,
      imageEmbed: Boolean,
    },
  })
);
