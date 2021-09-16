import { request } from "./requestWrapper";

interface Settings {
  clipboard?: boolean;
  longUrls?: boolean;
  shortUrls?: boolean;
  instantDelete?: boolean;
  encrypted?: boolean;
  imageEmbed?: boolean;
  expiration?: number;
  fontLignatures?: boolean;
  fontSize?: number;
  renderWhiteSpace?: boolean;
  wordWrap?: boolean;
}

/* Ill type data later */
interface Response {
  data: any | boolean;
  error: number | false;
}

export const updateUserSettings = async (
  settings: Settings
): Promise<Response> => {
  const { data, error } = await request(`/user/@me`, "PATCH", {
    ...settings,
  });

  if (error) {
    return { data: false, error };
  }

  return { data, error: false };
};
