import hljs from "highlight.js";

const guessLanguage = (text: string): string => {
  hljs.configure({
    languages: [
      "Bash",
      "C#",
      "TypeScript",
      "C",
      "C++",
      "CSS",
      "Clojure",
      "cURL",
      "Dart",
      "Dockerfile",
      "Elixir",
      "Erlang",
      "F#",
      "Go",
      "Swift",
      "Svelte",
      "SQL",
      "Ruby",
      "Rust",
      "Python",
      "Plaintext",
      "Lua",
      "Kotlin",
      "HTML,XML",
    ],
  });
  const getLanguage = hljs.highlightAuto(text);

  return getLanguage.language ?? "plaintext";
};

export { guessLanguage };
