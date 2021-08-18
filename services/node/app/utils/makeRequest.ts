import { API_URI, API_VERSION } from "./consts";

export const makeRequest = async (
  path: string,
  method: "POST" | "GET" | "DELETE" | "PATCH",
  body: any = null
): Promise<any> => {
  const request = await fetch(API_URI + API_VERSION + path, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return request.json();
};
