export interface Artist {
  id: string | number;
  name: string;
}

export interface Album {
  id?: string | number;
  title?: string;
  name?: string;
  cover_medium?: string;
  images?: { url: string }[];
  cover?: string;
}

export interface Track {
  id: string | number;
  name: string;
  title?: string;
  title_short?: string;
  duration?: number;
  duration_ms?: number;
  preview_url?: string | null;
  preview?: string;
  artists: Artist[];
  artist?: Artist;
  album?: Album;
}

export interface SearchResponse {
  data: Track[];
  total: number;
  next?: string;
}
