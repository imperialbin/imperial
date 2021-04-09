import { Response } from "express";

export const throwApiError = (res: Response, message: string, code: number): void => {
  res.status(code || 200).json({
    success: false,
    message,
  });
};
