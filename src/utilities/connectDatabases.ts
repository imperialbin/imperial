import { createConnection } from "mongoose";

// ENV stuff
const MONGO_URI = process.env.MONGO_URI ?? "";
const DOCUMENT_URI = process.env.DOCUMENT_URI ?? "";

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
