import { createDocument } from "@bot/commands/documents/createDocument";
import { getDocument } from "@bot/commands/documents/getDocument";
import { link } from "@bot/commands/user/link";

const COMMANDS = [createDocument, getDocument, link];

export { COMMANDS };
