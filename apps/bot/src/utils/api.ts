import { Document, Logger } from "@imperial/commons";
import { ZodError } from "zod";
import { db } from "../db";
import { users } from "@imperial/internal";
import { sql } from "drizzle-orm";
import { env } from "./env";

class API {
  private static async req<T>(
    method: "POST" | "GET" | "PATCH" | "DELETE" | "PUT",
    endpoint: `/${string}`,
    body?: any,
    headers?: Record<string, any>
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
      const request = fetch(`${env.API_URL_V1}${endpoint}`, {
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
    settings: Partial<Document["settings"]>,
    userId: string
  ) {
    const document = await this.req<Document & { password?: string }>(
      "POST",
      "/documents",
      {
        content,
        settings,
      },
      {
        Authorization: await this.getApiTokenById(userId),
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
    password?: string,
    userId?: string
  ): Promise<Document | { error: { message: string } }> {
    const document = await this.req<Document>(
      "GET",
      `/documents/${id}?password=${password}`,
      undefined,
      {
        Authorization: await this.getApiTokenById(userId ?? ""),
      }
    );

    if (!document.success) {
      Logger.error("API", document.error.message);
      return { error: document.error };
    }

    return document.data;
  }

  public static async getApiTokenById(userId: string) {
    const maybeUser =
      (
        await db
          .select({
            token: users.api_token,
          })
          .from(users)
          .where(sql`${users.discord}->>'id' = ${userId}`)
      )?.[0] ?? null;

    if (!maybeUser) {
      return null;
    }

    return maybeUser.token;
  }
}

export { API };
