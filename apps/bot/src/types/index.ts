interface Document {
  id: string;
  content: string;
  creator: User | null;
  views: number;
  gist_url: string | null;
  links: {
    raw: string;
    formatted: string;
  };
  timestamps: {
    creation: string;
    expiration: string | null;
  };
  settings: {
    language: string;
    image_embed: boolean;
    instant_delete: boolean;
    encrypted: boolean;
    password?: string | undefined;
    public: boolean;
    editors: User[];
  };
}

interface PossibleDocumentSettings {
  language?: string;
  expiration?: number;
  image_embed?: boolean;
  instant_delete?: boolean;
  encrypted?: boolean;
  password?: string;
  public?: boolean;
  long_urls?: boolean;
  short_urls?: boolean;
  create_gist?: boolean;
  editors?: string[];
}

interface User {
  id: string;
  documents_made: number;
  username: string;
  icon: string | null;
  flags: number;
}

export { Document, PossibleDocumentSettings, User };
