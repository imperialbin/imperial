import hljs from "highlight.js";
import { SupportedLanguagesID } from "@imperial/commons";

const BAD_LANGUAGES_MAP = [
  "1c",
  "abnf",
  "accesslog",
  "ada",
  "angelscript",
  "arcade",
  "armasm",
  "aspectj",
  "autohotkey",
  "autoit",
  "avrasm",
  "awk",
  "axapta",
  "basic",
  "bnf",
  "cal",
  "capnproto",
  "ceylon",
  "clean",
  "clojure-repl",
  "cmake",
  "coq",
  "cos",
  "crmsh",
  "crystal",
  "d",
  "delphi",
  "django",
  "dos",
  "dsconfig",
  "dts",
  "dust",
  "ebnf",
  "elm",
  "fix",
  "flix",
  "gams",
  "gauss",
  "gcode",
  "gherkin",
  "glsl",
  "gml",
  "golo",
  "haxe",
  "hsp",
  "http",
  "hy",
  "inform7",
  "ini",
  "irpf90",
  "isbl",
  "jboss-cli",
  "julia-repl",
  "lasso",
  "ldif",
  "leaf",
  "lisp",
  "livecodeserver",
  "livescript",
  "llvm",
  "lsl",
  "mathematica",
  "matlab",
  "maxima",
  "mel",
  "mercury",
  "mipsasm",
  "mizar",
  "mojolicious",
  "monkey",
  "n1ql",
  "nestedtext",
  "nim",
  "nix",
  "node-repl",
  "nsis",
  "ocaml",
  "openscad",
  "oxygene",
  "parser3",
  "pf",
  "php-template",
  "processing",
  "profile",
  "prolog",
  "protobuf",
  "puppet",
  "purebasic",
  "q",
  "qml",
  "reasonml",
  "rib",
  "roboconf",
  "routeros",
  "rsl",
  "ruleslanguage",
  "sas",
  "scheme",
  "scilab",
  "smali",
  "smalltalk",
  "sml",
  "sqf",
  "stan",
  "stata",
  "step21",
  "stylus",
  "subunit",
  "taggerscript",
  "tap",
  "tcl",
  "thrift",
  "tp",
  "twig",
  "vala",
  "vbscript-html",
  "verilog",
  "vhdl",
  "vim",
  "wasm",
  "wren",
  "x86asm",
  "xl",
  "pgsql",
];

const HLJS_BAD_NAME_MAP = {
  objectivec: "objective-c",
  q: "qsharp",
};

// Rename languages
for (const [key, value] of Object.entries(HLJS_BAD_NAME_MAP)) {
  hljs.registerAliases(key, { languageName: value });
}

// Unregister bad languages that no one cares about
for (const badLanguage of BAD_LANGUAGES_MAP) {
  hljs.unregisterLanguage(badLanguage);
}

const guessLanguage = (text: string) => {
  const languageMeta = hljs.highlightAuto(text);

  /*
    If there is a language, use the bad name map first, then fall over to the
    actual language name from hljs, if all else fails, use plaintext
  */
  return (
    languageMeta.language
      ? HLJS_BAD_NAME_MAP?.[
          languageMeta.language as keyof typeof HLJS_BAD_NAME_MAP
        ] ?? languageMeta.language?.toLowerCase()
      : "plaintext"
  ) as SupportedLanguagesID;
};

export { guessLanguage };
