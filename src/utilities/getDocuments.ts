import { Documents, IDocument } from "../models/Documents";

/**
 * @param  {string|undefined} creator
 * @param  {number} amount
 * @returns Promise
 */
export const getDocuments = async (
  creator: string | undefined,
  amount: number
): Promise<Array<IDocument>> => {
  // Returns a promise to get a users documents
  return await Documents.find({ creator })
    .sort({ dateCreated: -1 })
    .limit(amount);
};
