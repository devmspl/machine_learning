export interface UrlInterface {
    urls: string[];
    Fromurl: string;
    status: 'pending' | 'completed' | string;
    created_at?: Date;
    updated_at?: Date;
  }
  