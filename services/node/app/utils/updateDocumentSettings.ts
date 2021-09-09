import { Setting } from "../components";
import { Document } from "../types";
import { request } from "./requestWrapper";

interface Setting {
  imageEmbed?: boolean;
  instantDelete?: boolean;
  public?: boolean;
}

export const updateDocumentSettings = async (
  document: Document,
  setting: Setting
): Promise<any> => {
  const { data, error } = await request(`/document`, "POST", {
    id: document.id,
    settings: setting,
  });

  if (error) {
    return error;
  }

  return data;
};
