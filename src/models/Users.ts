import { Document, model, Schema } from "mongoose";

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
export interface IUser extends Document {
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
  settings: UserSettings;
}

const UserSchema = new Schema({
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
  settings: {
    clipboard: Boolean,
    longerUrls: Boolean,
    instantDelete: Boolean,
    encrypted: Boolean,
    expiration: Number,
    imageEmbed: Boolean,
  },
});

export const Users = model<IUser>("Users", UserSchema);
