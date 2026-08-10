export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  durationMinutes: number;
  releaseDate: string;
  posterUrl?: string;
  language?: string;
}
