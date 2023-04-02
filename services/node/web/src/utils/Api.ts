import { Document } from "../types";
import { ImperialAPIResponse, makeRequest } from "./Rest";

type APIObjectResponse<T = unknown> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
    };

export class API {
  private static returnData<T extends ImperialAPIResponse<unknown>>(
    response: T,
  ): APIObjectResponse<NonNullable<T["data"]>> {
    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: response.error?.message ?? "An error occurred whilst fetching data",
    };
  }

  public static async getRecentDocumentsAdmin() {
    const response = await makeRequest<Document[]>("GET", "/admin/recent");

    return this.returnData(response);
  }

  public static async getDocument(id: string): Promise<APIObjectResponse<Document>> {
    const { success, data, error } = await makeRequest<Document>(
      "GET",
      `/document/${id}`,
    );

    if (!success || !data) {
      return {
        success: false,
        error: error?.message ?? "An error occurred whilst fetching document",
      };
    }

    return { success: true, data };
  }
}
