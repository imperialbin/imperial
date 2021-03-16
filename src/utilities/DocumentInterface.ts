export interface Document {
  URL: string;
  imageEmbed: boolean;
  instantDelete: boolean;
  creator: string;
  code: string;
  dateCreated: number;
  deleteDate: number;
  allowedEditors: Array<string>;
  encrypted: boolean;
  encryptedIv: string;
  views: number;
}