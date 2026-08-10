import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { Theater, TheaterRequest, Screen, ScreenRequest, Showtime, ShowtimeRequest } from '../types';

export const adminApi = {
  // Theaters
  createTheater: async (data: TheaterRequest): Promise<Theater> => {
    const response = await api.post<Theater>(ENDPOINTS.THEATERS.BASE, data);
    return response.data;
  },
  
  getTheaters: async (): Promise<Theater[]> => {
    const response = await api.get<Theater[]>(ENDPOINTS.THEATERS.BASE);
    return response.data;
  },

  updateTheater: async (id: string, data: TheaterRequest): Promise<Theater> => {
    const response = await api.put<Theater>(`${ENDPOINTS.THEATERS.BASE}/${id}`, data);
    return response.data;
  },

  deleteTheater: async (id: string): Promise<void> => {
    await api.delete(`${ENDPOINTS.THEATERS.BASE}/${id}`);
  },

  // Screens
  createScreen: async (data: ScreenRequest): Promise<Screen> => {
    const response = await api.post<Screen>(ENDPOINTS.SCREENS.BASE, data);
    return response.data;
  },
  
  getScreensByTheater: async (theaterId: string): Promise<Screen[]> => {
    const response = await api.get<Screen[]>(ENDPOINTS.SCREENS.BY_THEATER(theaterId));
    return response.data;
  },

  updateScreen: async (id: string, data: ScreenRequest): Promise<Screen> => {
    const response = await api.put<Screen>(`${ENDPOINTS.SCREENS.BASE}/${id}`, data);
    return response.data;
  },

  deleteScreen: async (id: string): Promise<void> => {
    await api.delete(`${ENDPOINTS.SCREENS.BASE}/${id}`);
  },

  // Showtimes
  createShowtime: async (data: ShowtimeRequest): Promise<Showtime> => {
    const response = await api.post<Showtime>(ENDPOINTS.SHOWTIMES.BASE, data);
    return response.data;
  },

  getShowtimesByTheater: async (theaterId: string): Promise<Showtime[]> => {
    const response = await api.get<Showtime[]>(ENDPOINTS.SHOWTIMES.BY_THEATER(theaterId));
    return response.data;
  },

  updateShowtime: async (id: string, data: ShowtimeRequest): Promise<Showtime> => {
    const response = await api.put<Showtime>(`${ENDPOINTS.SHOWTIMES.BASE}/${id}`, data);
    return response.data;
  },

  deleteShowtime: async (id: string): Promise<void> => {
    await api.delete(`${ENDPOINTS.SHOWTIMES.BASE}/${id}`);
  },
  
  // Movies (Assuming movies are also managed here if not in moviesApi)
  updateMovie: async (id: string, data: any): Promise<any> => {
    const response = await api.put(`${ENDPOINTS.MOVIES.BASE}/${id}`, data);
    return response.data;
  },

  deleteMovie: async (id: string): Promise<void> => {
    await api.delete(`${ENDPOINTS.MOVIES.BASE}/${id}`);
  }
};
