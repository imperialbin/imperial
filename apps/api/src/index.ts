import { main } from "./server";
import { deleteExpiredDocuments } from "./utils/crons";

// Server
main();

// Crons
deleteExpiredDocuments.start();
