import { createDocument } from "./documents/createDocument";
import { getDocument } from "./documents/getDocument";
import { link } from "./user/link";

const COMMANDS = [createDocument, getDocument, link];

export { COMMANDS };
