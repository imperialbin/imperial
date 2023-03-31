import { FULL_URI_V1 } from "./Constants";

export interface ImperialAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ImperialError;
}

export interface ImperialError {
  code: string;
  message?: string;
}

/**
 * Make a HTTP request to the Hop API
 * @param endpoint The API route to call excluding the version discriminator (e.g. auth/login)
 * @param options HTTP Method, request body and other options

 * @returns ImperialAPIResponse object
 */
export const makeRequest = async <T = any>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD",
  endpoint: string,
  body?: any,
  options?: {
    headers?: Record<string, string>;
  }
): Promise<ImperialAPIResponse<T>> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization:
        typeof window !== "undefined"
          ? localStorage.getItem("imperial_token") ?? ""
          : "",
      ...options?.headers,
    };

    if (body && (method === "GET" || method === "HEAD")) {
      throw new Error("GET requests cannot have a body");
    }

    const response: ImperialAPIResponse<T> = await fetch(
      FULL_URI_V1 + endpoint,
      {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      }
    ).then(async (res) =>
      res.status === 204
        ? { success: true }
        : res
            .json()
            .then((json) =>
              res.status >= 300
                ? { ...json, error: { message: json.error.message } }
                : json
            )
            .catch(() =>
              res.status >= 300 ? { success: false } : { success: true }
            )
    );

    return (
      response || { success: false, error: { code: "internal_scoped_error" } }
    );
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: {
        code: "internal_scoped_error",
        message: error instanceof Error ? error.message : undefined,
      },
    };
  }
};

/* This is used for SWR, but we can't have it the same as makeRequest because we have a try catch */
export const fetcher = async <T = any>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD",
  endpoint: string,
  body?: any
): Promise<ImperialAPIResponse<T>> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization:
      typeof window !== "undefined"
        ? localStorage.getItem("imperial_token") ?? ""
        : "",
  };

  if (body && (method === "GET" || method === "HEAD")) {
    throw new Error("GET requests cannot have a body");
  }

  return await fetch(FULL_URI_V1 + endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  }).then(async (res) => {
    const parsedRes = await res.json();

    if (!res.ok) throw new Error(parsedRes.message);

    return res.status === 204 ? { success: true } : parsedRes;
  });
};
