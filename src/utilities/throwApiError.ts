import { Response } from "express";

/**
 * @param  {Response} res
 * @param  {string} message
 * @param  {number} code
 * @returns void
 */
export const throwApiError = (
  res: Response,
  message: string,
  code: number
): void => {
  res.status(code || 200).json({
    success: false,
    message,
  });
};
