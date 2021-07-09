import { NextApiResponse } from "next";

export const throwError = (res: NextApiResponse, status: number, message: string): void => {
  res.status(status).json({
    success: false,
    message,
  });
};
