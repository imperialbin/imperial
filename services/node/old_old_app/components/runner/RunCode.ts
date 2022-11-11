/* eslint-disable no-console */
export const runCode = async (
  language: string,
  version: string,
  code: string,
) => {
  if (language === "typescript") {
    version = "*";
  }

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

  if (!req.ok) return { data: null, error: true };

  const parsedJSON = await req.json();

  if (parsedJSON.run.stderr) {
    return {
      error: true,
      data: parsedJSON.run.stderr,
    };
  }

  return { data: parsedJSON.run.output, error: false };
};
