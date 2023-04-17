import { Document, PossibleDocumentSettings } from "../types";
import { Logger } from "@imperial/commons";
import { ZodError } from "zod";

class API {
  private static async req<T>(
    method: "POST" | "GET" | "PATCH" | "DELETE" | "PUT",
    endpoint: `/${string}`,
    body?: any,
    headers?: Record<string, string>
  ): Promise<
    | {
        success: true;
        data: T;
      }
    | {
        success: false;
        error: {
          message: string;
          errors?: ZodError[];
        };
      }
  > {
    try {
      const request = fetch(`http://localhost:8080/v1${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(body),
      })
        .then(async (res) => {
          const parsedRes = (await res.json()) as
            | {
                success: false;
                error: { message: string; errors?: ZodError[] };
              }
            | {
                success: true;
                data: T;
              };

          if (!parsedRes.success) {
            throw new Error(parsedRes.error.message);
          }

          return parsedRes;
        })
        .catch((err) => {
          throw err;
        });

      return request;
    } catch (err) {
      return {
        success: false,
        error: {
          message: String(err),
        },
      };
    }
  }

  public static async createDocument(
    content: string,
    settings: PossibleDocumentSettings,
    token: string
  ) {
    const document = await this.req<Document>(
      "POST",
      "/documents",
      {
        content,
        settings,
      },
      {
        Authorization: token,
      }
    );

    if (!document.success) {
      Logger.error("API", document.error.message);
      return { error: document.error };
    }

    return document.data;
  }

  public static async getDocument(
    id: string,
    token: string,
    password?: string
  ): Promise<Document | { error: { message: string } }> {
    const document = await this.req<Document>(
      "GET",
      `/documents/${id}?password=${password}`,
      undefined,
      {
        Authorization: token,
      }
    );

    if (!document.success) {
      Logger.error("API", document.error.message);
      return { error: document.error };
    }

    return document.data;
  }
}

export { API };
