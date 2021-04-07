import { Document } from "mongoose";
import { IUser } from "./src/models/Users";

// this will give you sweet typing :p

declare global {
  namespace Express {
    type User = IUser & Document;
  }
}
