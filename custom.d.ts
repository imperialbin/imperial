import { Document } from "mongoose";
import { IUser } from "./src/models/Users";

// this will give you sweet typing :p
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends IUser {}
  }
}
