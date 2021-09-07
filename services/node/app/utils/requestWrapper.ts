import { FULL_URI_V1 } from "./consts";

export const request = async (
  path: string,
  method: "POST" | "GET" | "DELETE" | "PATCH",
  body: any = null
): Promise<any> => {
  const request = await fetch(FULL_URI_V1 + path, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body && JSON.stringify(body),
  });

  const data = await request.json();

  if (!request.ok) {
    return { data: data, error: request.status };
  }

  return { data: data, error: false };
};
