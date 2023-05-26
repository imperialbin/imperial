import { SupportedLanguagesID } from "@imperial/commons";
import { z } from "zod";

const languageSchema = z
  .string()
  .min(1)
  .max(100)
  .refine((value): value is SupportedLanguagesID => true);

const usernameSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username must be alphanumeric" });

export { languageSchema, usernameSchema };
