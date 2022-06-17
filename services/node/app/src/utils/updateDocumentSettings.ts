import Setting from "../components/Setting";
import { Document } from "../types";
import { request } from "./Request";

interface Setting {
  imageEmbed?: boolean;
  instantDelete?: boolean;
  public?: boolean;
  language?: string;
  expiration?: number;
}

/* Ill type data later */
interface Response {
  data: any | boolean;
  error: number | false;
}

export const updateDocumentSettings = async (
  document: Document,
  setting: Setting,
): Promise<Response> => {
  const { data, error } = await request("PATCH", "/document", {
    id: document.id,
    settings: setting,
  });

  if (error) {
    return { data: false, error: error.code };
  }

  return { data, error: false };
};
