import { SupportedLanguagesID } from "@imperial/commons";
import { z } from "zod";

const languageSchema = z
  .string()
  .min(1)
  .max(100)
  .refine((value): value is SupportedLanguagesID => true);

export { languageSchema };
