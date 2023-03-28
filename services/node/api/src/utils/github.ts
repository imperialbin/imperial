/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class GitHub {
  public static async createGist(
    content: string,
    documentId: string,
    userAuth: string,
    language?: string
  ) {
    const gist = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `token ${userAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          [`${documentId}`]: {
            content,
          },
        },
      }),
    }).then(async (res) => res.json());

    return gist as string;
  }
}
