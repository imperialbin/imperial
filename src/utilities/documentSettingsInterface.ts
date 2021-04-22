export interface DocumentSettings {
  creator: null | string;
  longerUrls: boolean;
  language: string | null | undefined;
  imageEmbed: boolean;
  expiration: number;
  instantDelete: boolean;
  quality: number;
  encrypted: boolean;
  password: any;
  editors: Array<string> | Array<void>;
}
