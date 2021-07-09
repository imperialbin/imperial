import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const documentId = req.query.documentId[0];

  if (req.method === "GET")
    res.json({
      success: true,
      documentId,
    });

  if (req.method === "DELETE")
    res.json({
      success: true,
      message: `Successfully deleted document ${documentId}`,
    });
}
