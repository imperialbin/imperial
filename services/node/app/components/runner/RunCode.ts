/* eslint-disable no-console */
export const runCode = async (
  language: string,
  version: string,
  code: string,
): Promise<{ data: string | null; error: number | null }> => {
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
  });

  if (!req.ok) return { data: null, error: req.status };

  const parsedJSON = await req.json();

  return { data: parsedJSON.run.output, error: null };
};
