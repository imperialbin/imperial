import { Monaco } from "imperial-editor";

declare global {
  interface Window {
    monaco: Monaco;
  }
}
