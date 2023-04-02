import {
  C as CIcon,
  Clojure as ClojureIcon,
  CoffeeScript as CoffeeScriptIcon,
  CPP as CPPIcon,
  CSharp as CSharpIcon,
  CSS as CSSIcon,
  Docker as DockerIcon,
  FSharp as FSharpIcon,
  Go as GoIcon,
  GraphQL as GraphQLIcon,
  Handlebars as HandlebarsIcon,
  HTML as HTMLIcon,
  Java as JavaIcon,
  JavaScript as JavaScriptIcon,
  Kotlin as KotlinIcon,
  Less as LessIcon,
  Lua as LuaIcon,
  MySQL as MySQLIcon,
  ObjectiveC as ObjectiveCIcon,
  Perl as PerlIcon,
  PHP as PHPIcon,
  Python as PythonIcon,
  R as RIcon,
  Redis as RedisIcon,
  Ruby as RubyIcon,
  Rust as RustIcon,
  Swift as SwiftIcon,
  TypeScript as TypeScriptIcon,
} from "../components/Icons";

/* ENV and some static stuff */
export const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8080/"
    : "http://127.0.0.1:8080/";
export const API_VERSION_V1 = "v1";
export const FULL_URI_V1 = API_BASE + API_VERSION_V1;
export const CDN_URL = "https://cdn.impb.in/";

/* Socials */
export const DiscordURL = "https://discord.gg/cTm85eW49D";
export const GitHubURL = "https://github.com/imperialbin";
export const TwitterURL = "https://twitter.com/imperialbin";

export type SupportedLanguages = typeof supportedLanguages[number]["name"];
// For now
export type SupportedLanguagesID = string;

export const supportedLanguages = [
  {
    name: "Auto",
    id: "auto",
    icon: undefined,
  },
  {
    name: "TypeScript",
    id: "typescript",
    icon: TypeScriptIcon,
  },
  {
    name: "JavaScript",
    id: "javascript",
    icon: JavaScriptIcon,
  },
  { name: "Python", id: "python", icon: PythonIcon },
  { name: "Go", id: "go", icon: GoIcon },
  { name: "C", id: "c", icon: CIcon },
  { name: "C++", id: "cpp", icon: CPPIcon },
  { name: "C#", id: "csharp", icon: CSharpIcon },
  { name: "HTML", id: "html", icon: HTMLIcon },
  { name: "CSS", id: "css", icon: CSSIcon },
  {
    name: "CoffeeScript",
    id: "coffeescript",
    icon: CoffeeScriptIcon,
  },
  { name: "Java", id: "java", icon: JavaIcon },
  { name: "Rust", id: "rust", icon: RustIcon },
  { name: "swift", id: "swift", icon: SwiftIcon },
  { name: "Kotlin", id: "kotlin", icon: KotlinIcon },
  { name: "Clojure", id: "clojure", icon: ClojureIcon },
  { name: "Dockerfile", id: "dockerfile", icon: DockerIcon },
  { name: "F#", id: "fsharp", icon: FSharpIcon },
  { name: "Graphql", id: "graphql", icon: GraphQLIcon },
  {
    name: "Handlebars",
    id: "handlebars",
    icon: HandlebarsIcon,
  },
  { name: "Less", id: "less", icon: LessIcon },
  { name: "Lua", id: "lua", icon: LuaIcon },
  { name: "MySQL", id: "mysql", icon: MySQLIcon },
  {
    name: "Objective-c",
    id: "objective-c",
    icon: ObjectiveCIcon,
  },
  { name: "Perl", id: "perl", icon: PerlIcon },
  { name: "PHP", id: "php", icon: PHPIcon },
  { name: "R", id: "r", icon: RIcon },
  { name: "Redis", id: "redis", icon: RedisIcon },
  { name: "Ruby", id: "ruby", icon: RubyIcon },
  { name: "Apex", id: "apex", icon: undefined },
  { name: "Azcli", id: "azcli", icon: undefined },
  { name: "Bat", id: "bat", icon: undefined },
  { name: "Csp", id: "csp", icon: undefined },
  { name: "INI", id: "ini", icon: undefined },
  { name: "JSON", id: "json", icon: undefined },
  { name: "Markdown", id: "markdown", icon: undefined },
  { name: "Msdax", id: "msdax", icon: undefined },
  { name: "Pascal", id: "pascal", icon: undefined },
  { name: "PGSQL", id: "pgsql", icon: undefined },
  { name: "Plaintext", id: "plaintext", icon: undefined },
  { name: "Postiats", id: "postiats", icon: undefined },
  { name: "Powerquery", id: "powerquery", icon: undefined },
  { name: "Powershell", id: "powershell", icon: undefined },
  { name: "Pug", id: "pug", icon: undefined },
  { name: "Razor", id: "razor", icon: undefined },
  { name: "Redshift", id: "redshift", icon: undefined },
  { name: "SB", id: "sb", icon: undefined },
  { name: "Scheme", id: "scheme", icon: undefined },
  { name: "SCSS", id: "scss", icon: undefined },
  { name: "Shell", id: "shell", icon: undefined },
  { name: "SOL", id: "sol", icon: undefined },
  { name: "SQL", id: "sql", icon: undefined },
  { name: "St", id: "st", icon: undefined },
  { name: "TCL", id: "tcl", icon: undefined },
  { name: "VB", id: "vb", icon: undefined },
  { name: "XML", id: "xml", icon: undefined },
  { name: "YAML", id: "yaml", icon: undefined },
] as const;
