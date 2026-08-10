import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '../api/movies';

export const useMovies = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['movies', page, size],
    queryFn: () => moviesApi.getAllMovies(page, size),
  });
};

export const useMovieSearch = (genre: string) => {
  return useQuery({
    queryKey: ['movies', 'search', genre],
    queryFn: () => moviesApi.searchMovies(genre),
    enabled: !!genre, // Only fetch if genre is provided
  });
};
