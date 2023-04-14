import { getCookie } from "cookies-next";
import { env } from "./env";

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

 * @returns ImperialAPIResponse object with the data or error.
 */
export const makeRequest = async <T = any>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD",
  endpoint: string,
  body?: any,
  options?: {
    headers?: Record<string, string>;
  },
): Promise<ImperialAPIResponse<T>> => {
  try {
    const headers: Record<string, string> = {
      Authorization: (getCookie("imperial-auth") as string) ?? "",
      "Content-Type": "application/json",
      ...options?.headers,
    };

    if (body && (method === "GET" || method === "HEAD")) {
      throw new Error("GET requests cannot have a body");
    }

    const response: ImperialAPIResponse<T> = await fetch(env.API_URL_V1 + endpoint, {
      method,
      headers,
      credentials: "include",
      body: body ? JSON.stringify(body ?? {}) : null,
    }).then(async (res) =>
      res.status === 204
        ? { success: true }
        : res
            .json()
            .then((json) =>
              res.status >= 300
                ? { ...json, error: { message: json.error.message } }
                : json,
            )
            .catch(() => (res.status >= 300 ? { success: false } : { success: true })),
    );

    return response || { success: false, error: { code: "internal_scoped_error" } };
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
