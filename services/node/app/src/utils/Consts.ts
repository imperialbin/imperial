import {
  TypeScript as TypeScriptIcon,
  HTML as HTMLIcon,
  GraphQL as GraphQLIcon,
  CoffeeScript as CoffeeScriptIcon,
  Handlebars as HandlebarsIcon,
  Clojure as ClojureIcon,
  Docker as DockerIcon,
  Java as JavaIcon,
  JavaScript as JavaScriptIcon,
  CSS as CSSIcon,
  Go as GoIcon,
  Kotlin as KotlinIcon,
  Lua as LuaIcon,
  Swift as SwiftIcon,
  MySQL as MySQLIcon,
  Less as LessIcon,
  FSharp as FSharpIcon,
  ObjectiveC as ObjectiveCIcon,
  Perl as PerlIcon,
  PHP as PHPIcon,
  CSharp as CSharpIcon,
  CPP as CPPIcon,
  C as CIcon,
  Python as PythonIcon,
  Redis as RedisIcon,
  Rust as RustIcon,
  Ruby as RubyIcon,
  R as RIcon,
} from "../components/Icons";

/* ENV and some static stuff */
export const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8080/"
    : "https://staging.impb.in/";
export const API_VERSION_V1 = "v1";
export const FULL_URI_V1 = API_BASE + API_VERSION_V1;

/* Socials */
export const DiscordURL = "https://discord.gg/cTm85eW49D";
export const GitHubURL = "https://github.com/imperialbin";
export const TwitterURL = "https://twitter.com/imperialbin";

export type SupportedLanguages = typeof supportedLanguages[number]["name"];

export const supportedLanguages = [
  { id: 1, name: "apex" },
  { id: 2, name: "azcli" },
  { id: 3, name: "bat" },
  { id: 4, name: "c", icon: CIcon },
  { id: 5, name: "clojure", icon: ClojureIcon },
  { id: 6, name: "coffeescript", icon: CoffeeScriptIcon },
  { id: 7, name: "cpp", icon: CPPIcon },
  { id: 8, name: "csharp", icon: CSharpIcon },
  { id: 9, name: "csp" },
  { id: 10, name: "css", icon: CSSIcon },
  { id: 11, name: "dockerfile", icon: DockerIcon },
  { id: 12, name: "fsharp", icon: FSharpIcon },
  { id: 13, name: "go", icon: GoIcon },
  { id: 14, name: "graphql", icon: GraphQLIcon },
  { id: 15, name: "handlebars", icon: HandlebarsIcon },
  { id: 16, name: "html", icon: HTMLIcon },
  { id: 17, name: "ini" },
  { id: 18, name: "java", icon: JavaIcon },
  { id: 19, name: "javascript", icon: JavaScriptIcon },
  { id: 20, name: "json" },
  { id: 21, name: "kotlin", icon: KotlinIcon },
  { id: 22, name: "less", icon: LessIcon },
  { id: 23, name: "lua", icon: LuaIcon },
  { id: 24, name: "markdown" },
  { id: 25, name: "msdax" },
  { id: 26, name: "mysql", icon: MySQLIcon },
  { id: 27, name: "objective-c", icon: ObjectiveCIcon },
  { id: 28, name: "pascal" },
  { id: 29, name: "perl", icon: PerlIcon },
  { id: 30, name: "pgsql" },
  { id: 31, name: "php", icon: PHPIcon },
  { id: 32, name: "plaintext" },
  { id: 33, name: "postiats" },
  { id: 34, name: "powerquery" },
  { id: 35, name: "powershell" },
  { id: 36, name: "pug" },
  { id: 37, name: "python", icon: PythonIcon },
  { id: 38, name: "r", icon: RIcon },
  { id: 39, name: "razor" },
  { id: 40, name: "redis", icon: RedisIcon },
  { id: 41, name: "redshift" },
  { id: 42, name: "ruby", icon: RubyIcon },
  { id: 43, name: "rust", icon: RustIcon },
  { id: 44, name: "sb" },
  { id: 45, name: "scheme" },
  { id: 46, name: "scss" },
  { id: 47, name: "shell" },
  { id: 48, name: "sol" },
  { id: 49, name: "sql" },
  { id: 50, name: "st" },
  { id: 51, name: "swift", icon: SwiftIcon },
  { id: 52, name: "tcl" },
  { id: 53, name: "typescript", icon: TypeScriptIcon },
  { id: 54, name: "vb" },
  { id: 55, name: "xml" },
  { id: 56, name: "yaml" },
] as const;
