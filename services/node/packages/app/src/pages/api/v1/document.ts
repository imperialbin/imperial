import type { NextApiRequest, NextApiResponse } from "next";
import { throwError } from "../../../util/throwError";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /* Catch if user tries to get document without document ID */
  if (req.method === "GET" || req.method === "DELETE") return throwError(res, 400, "You did not provide a document ID");

  /* Create a document */
  if (req.method === "POST")
    return res.status(200).json({
      success: true,
      message: "Successfully created document",
    });

  /* Edit a document */
  if (req.method === "PATCH") return res.status(200).json({ success: true, message: "Successfully edited document" });

  console.log("test");
}
