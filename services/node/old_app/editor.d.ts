import { Monaco } from "imperial-editor";
import "styled-components";

export {};
declare global {
  interface Window {
    monaco: Monaco;
  }
}
