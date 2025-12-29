export interface Comic {
  _id: string;
  title: string;
  coverUrl: string;
  downloadUrls: string[];
  pages: string[];
  onlineRead: boolean;
  seriesId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComicData {
  title: string;
  coverUrl: string;
  downloadUrls: string[];
  pages?: string[];
  seriesId: string;
}

export interface UpdateComicData {
  title?: string;
  coverUrl?: string;
  downloadUrls?: string[];
  pages?: string[];
  seriesId?: string;
  onlineRead?: boolean;
}

