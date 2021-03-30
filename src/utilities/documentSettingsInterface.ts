export interface DocumentSettings {
  longerUrls: boolean;
  language: string | null;
  imageEmbed: boolean;
  expiration: number;
  instantDelete: boolean;
  quality: number;
  encrypted: boolean;
  password: any;
  editorArray: Array<string>;
}
