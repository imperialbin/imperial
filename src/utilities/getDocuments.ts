import { Documents, IDocument } from "../models/Documents";

// Usage await getDocuments("", 10);

/* Creator can be undefined or a string, so then when using it - it doesn't yell
and scream and pout and also because if there is no user I still want to
check if they have documents */
export const getDocuments = async (
  creator: string | undefined,
  amount: number
): Promise<Array<IDocument>> => {
  // Returns a promise to get a users documents
  return await Documents.find({ creator })
    .sort({ dateCreated: -1 })
    .limit(amount);
};
