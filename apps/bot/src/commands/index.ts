import { createDocument } from "@bot/commands/documents/createDocument";
import { getDocument } from "@bot/commands/documents/getDocument";
import { link } from "@bot/commands/user/link";
import { unlink } from "@bot/commands/user/unlink";

const COMMANDS = [createDocument, getDocument, link, unlink];

export { COMMANDS };
