import { createConnection } from "mongoose";
import { Consts } from "./consts";

// ENV stuff
const MONGO_URI = Consts.MONGO_URI;
const DOCUMENT_URI = Consts.DOCUMENT_URI;

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const connectDatabase = async (): Promise<void> => {
  const userDatabase = createConnection(MONGO_URI, connectionOptions);
  const documentDatabase = createConnection(DOCUMENT_URI, connectionOptions);

  if (await userDatabase) console.log("User database online");
  if (await documentDatabase) console.log("Document database online");

  return;
};

export const userDatabase = createConnection(MONGO_URI, connectionOptions);
export const documentDatabase = createConnection(
  DOCUMENT_URI,
  connectionOptions
);
