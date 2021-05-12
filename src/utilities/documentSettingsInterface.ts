export interface DocumentSettings {
  creator: null | string;
  longerUrls: boolean;
  shortUrls: boolean;
  language: string | null | undefined;
  imageEmbed: boolean;
  expiration: number;
  instantDelete: boolean;
  quality: number;
  encrypted: boolean;
  public: boolean;
  password: any;
  editors: Array<string> | Array<void>;
}
