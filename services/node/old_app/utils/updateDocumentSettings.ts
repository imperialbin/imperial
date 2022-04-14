import { Setting } from "../components/ui";
import { Document } from "../types";
import { request } from "./requestWrapper";

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
  const { data, error } = await request(`/document`, "PATCH", {
    id: document.id,
    settings: setting,
  });

  if (error) {
    return { data: false, error };
  }

  return { data, error: false };
};
