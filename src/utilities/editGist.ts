import { Documents } from "../models/Documents";
import { Users } from "../models/Users";
import fetch from "node-fetch";

export const editGist = async (URL: string, code: string): Promise<void> => {
  const findDocument = await Documents.findOne({ URL });
  const user = await Users.findOne({ _id: findDocument?.creator });
  if (findDocument && user) {
    await fetch(
      `https://api.github.com/gists/${findDocument.gist}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          files: {
            "IMPERIAL Document": {
              content: code,
            },
          },
        }),
        headers: {
          authorization: `bearer ${user.githubAccess}`,
        },
      }
    );
    console.log('Edited gists');
  }
};
