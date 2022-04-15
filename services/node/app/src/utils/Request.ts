/* eslint-disable no-console */
import { FULL_URI_V1 } from "./Consts";

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
    const res = await fetch(FULL_URI_V1 + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
    console.error(err);
    return {
      success: false,
      error: {
        code: 0,
        message: "An error occurred whilst processing your request.",
      },
    };
  }
};
