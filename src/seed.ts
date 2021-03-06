import { hashSync } from "bcryptjs";
import { Users, IUser } from "./models/Users";

const user: Omit<IUser, "_id"> = {
  email: "hello@imperialb.in",
  password: hashSync("asdhjkasdhjk", 13),
  userId: 1,
  name: "demo",
  betaCode: "12345",
  banned: false,
  apiToken: "hello-world",
  icon: "",
  ip: "",
  confirmed: true,
  codes: ["yes"],
  codesLeft: 10,
  memberPlus: true,
  documentsMade: 10,
  activeUnlimitedDocuments: 0,
  discordId: null,
  githubAccess: null,
  admin: false,
  opt: null,
  settings: {
    clipboard: false,
    longerUrls: true,
    shortUrls: false,
    instantDelete: false,
    encrypted: false,
    expiration: 10,
    imageEmbed: true,
  },
};

new Users(user).save().then(() => {
  console.log("Initial user seeded");
});

export {};
