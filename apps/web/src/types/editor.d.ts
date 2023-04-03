import { Monaco } from "imperial-editor";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    monaco: Monaco;
  }
}
