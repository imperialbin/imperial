import { Monaco } from "imperial-editor";
import "styled-components";
import { Theme } from "./types";

export {};
declare global {
  interface Window {
    monaco: Monaco;
  }
}
