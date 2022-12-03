import { API_VERSION_V1 } from "./Constants";

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
  body?: any
): Promise<ImperialAPIResponse<T>> => {
  const imperialToken = localStorage.getItem("imperial-token") || "";

  try {
    const headers: Record<string, string> = {
      authorization: imperialToken,
      "Content-Type": "application/json",
    };

    if (body && (method === "GET" || method === "HEAD")) {
      throw new Error("GET requests cannot have a body");
    }

    const response: ImperialAPIResponse<T> = await fetch(
      API_VERSION_V1 + endpoint,
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
