import { SVGProps } from "react";
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

export const supportedLanguages: Array<{
  id: number;
  name: string;
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}> = [
  { id: 53, name: "TypeScript", icon: TypeScriptIcon },
  { id: 19, name: "JavaScript", icon: JavaScriptIcon },
  { id: 37, name: "Python", icon: PythonIcon },
  { id: 13, name: "Go", icon: GoIcon },
  { id: 4, name: "C", icon: CIcon },
  { id: 7, name: "C++", icon: CPPIcon },
  { id: 8, name: "C#", icon: CSharpIcon },
  { id: 16, name: "HTML", icon: HTMLIcon },
  { id: 10, name: "CSS", icon: CSSIcon },
  { id: 6, name: "CoffeeScript", icon: CoffeeScriptIcon },
  { id: 18, name: "Java", icon: JavaIcon },
  { id: 43, name: "Rust", icon: RustIcon },
  { id: 51, name: "swift", icon: SwiftIcon },
  { id: 21, name: "Kotlin", icon: KotlinIcon },
  { id: 5, name: "Clojure", icon: ClojureIcon },
  { id: 11, name: "Dockerfile", icon: DockerIcon },
  { id: 12, name: "F#", icon: FSharpIcon },
  { id: 14, name: "Graphql", icon: GraphQLIcon },
  { id: 15, name: "Handlebars", icon: HandlebarsIcon },
  { id: 22, name: "Less", icon: LessIcon },
  { id: 23, name: "Lua", icon: LuaIcon },
  { id: 26, name: "MySQL", icon: MySQLIcon },
  { id: 27, name: "Objective-c", icon: ObjectiveCIcon },
  { id: 29, name: "Perl", icon: PerlIcon },
  { id: 31, name: "PHP", icon: PHPIcon },
  { id: 38, name: "R", icon: RIcon },
  { id: 40, name: "Redis", icon: RedisIcon },
  { id: 42, name: "Ruby", icon: RubyIcon },
  { id: 1, name: "Apex" },
  { id: 2, name: "Azcli" },
  { id: 3, name: "Bat" },
  { id: 9, name: "Csp" },
  { id: 17, name: "INI" },
  { id: 20, name: "JSON" },
  { id: 24, name: "Markdown" },
  { id: 25, name: "Msdax" },
  { id: 28, name: "Pascal" },
  { id: 30, name: "PgSQL" },
  { id: 32, name: "Plaintext" },
  { id: 33, name: "Postiats" },
  { id: 34, name: "Powerquery" },
  { id: 35, name: "Powershell" },
  { id: 36, name: "Pug" },
  { id: 39, name: "Razor" },
  { id: 41, name: "Redshift" },
  { id: 44, name: "SB" },
  { id: 45, name: "Scheme" },
  { id: 46, name: "SCSS" },
  { id: 47, name: "Shell" },
  { id: 48, name: "SOL" },
  { id: 49, name: "SQL" },
  { id: 50, name: "St" },
  { id: 52, name: "TCL" },
  { id: 54, name: "VB" },
  { id: 55, name: "XML" },
  { id: 56, name: "YAML" },
];
