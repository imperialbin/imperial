import { API_VERSION_V1 } from "./Consts";

export interface Response<T = any> {
  success: boolean;
  data?: T;
  error?: ResponseError;
  message?: string;
}

export interface ResponseError {
  code: number;
  message: string;
}

export const request = async <T = any>(
  endpoint: string,
  method: "GET" | "POST" | "DELETE" | "PATCH" = "GET",
  body?: any,
): Promise<Response<T>> => {
  try {
    const res = await fetch(API_VERSION_V1 + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const parsedRes: Response<T> = await res.json();

    if (!parsedRes.success) {
      return {
        success: false,
        error: {
          code: res.status,
          message: parsedRes.message ?? "Unknown error",
        },
      };
    }

    return parsedRes;
  } catch (err) {
    return {
      success: false,
      error: {
        code: 0,
        message: "An error occurred whilst processing your request.",
      },
    };
  }
};
