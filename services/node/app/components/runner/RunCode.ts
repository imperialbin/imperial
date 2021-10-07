/* eslint-disable no-console */
export const runCode = async (
  language: string,
  version: string,
  code: string,
): Promise<void> => {
  const req = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    body: JSON.stringify({
      language,
      version,
      files: [
        {
          content: String(code),
        },
      ],
    }),
  })
    .then(res => res.json())
    .then(res => res.run.output);
  console.log(req);
  return req;
};
