import { Documents } from "../models/Documents";

// Usage getDocuments("", 10).then(console.log);

/* Creator can be undefined or a string, so then when using it - it doesn't yell
and scream and pout and also because if there is no user I still want to
check if they have documents */
export const getDocuments = (creator: string | undefined, amount: number) => {
  // Returns a promise to get a users documents
  return new Promise((resolve, reject) => {
    Documents.find({ creator })
      .sort({ dateCreated: -1 })
      .limit(amount)
      .exec((err, documents) => {
        if (err)
          return reject("An error occurred whilst getting users documents");

        resolve(documents);
      });
  });
};
