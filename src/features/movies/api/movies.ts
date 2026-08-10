import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { Movie } from '../types';
import { PageResponse } from '@/types';

export const moviesApi = {
  getAllMovies: async (page = 0, size = 10): Promise<PageResponse<Movie>> => {
    try {
      const { data } = await api.get<PageResponse<Movie> | Movie[]>(ENDPOINTS.MOVIES.BASE, {
        params: { page, size }
      });
      if (Array.isArray(data)) {
        return {
          content: data,
          pageNumber: 0,
          pageSize: data.length,
          totalElements: data.length,
          totalPages: 1
        };
      }
      return data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      return {
        content: [],
        pageNumber: page,
        pageSize: size,
        totalElements: 0,
        totalPages: 0
      };
    }
  },

  getMovieById: async (id: string): Promise<Movie | null> => {
    try {
      const { data } = await api.get<Movie>(ENDPOINTS.MOVIES.BY_ID(id));
      return data;
    } catch (error) {
      console.error(`Error fetching movie ${id}:`, error);
      return null;
    }
  },

  searchMovies: async (genre: string): Promise<Movie[]> => {
    try {
      const { data } = await api.get<Movie[]>(ENDPOINTS.MOVIES.SEARCH(genre));
      return data;
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  getNowPlaying: async (): Promise<Movie[]> => {
    try {
      const { data } = await api.get<Movie[]>(ENDPOINTS.MOVIES.NOW_PLAYING);
      return data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return [];
    }
  },

  getUpcoming: async (): Promise<Movie[]> => {
    try {
      const { data } = await api.get<Movie[]>(ENDPOINTS.MOVIES.UPCOMING);
      return data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      return [];
    }
  },

  getMovieDetails: async (id: string): Promise<Movie | null> => {
    return moviesApi.getMovieById(id);
  },

  addMovie: async (movieData: Partial<Movie>): Promise<Movie> => {
    try {
      const { data } = await api.post<Movie>(ENDPOINTS.MOVIES.BASE, movieData);
      return data;
    } catch (error) {
      console.error('Error adding movie:', error);
      throw error;
    }
  },

  updateMovie: async (id: string, movieData: Partial<Movie>): Promise<Movie> => {
    try {
      const { data } = await api.put<Movie>(`${ENDPOINTS.MOVIES.BASE}/${id}`, movieData);
      return data;
    } catch (error) {
      console.error(`Error updating movie ${id}:`, error);
      throw error;
    }
  },

  deleteMovie: async (id: string): Promise<void> => {
    try {
      await api.delete(`${ENDPOINTS.MOVIES.BASE}/${id}`);
    } catch (error) {
      console.error(`Error deleting movie ${id}:`, error);
      throw error;
    }
  }
};
