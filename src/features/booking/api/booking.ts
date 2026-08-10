import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { Showtime, Seat } from '../types';
import { PageResponse } from '@/types';

import { v4 as uuidv4 } from 'uuid';

export const bookingApi = {
  getShowtimes: async (movieId: string): Promise<Showtime[]> => {
    try {
      const { data } = await api.get<Showtime[]>(ENDPOINTS.SHOWTIMES.BY_MOVIE(movieId));
      return data;
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      return [];
    }
  },

  getSeats: async (showtimeId: string): Promise<Seat[]> => {
    try {
      const { data } = await api.get<Seat[]>(ENDPOINTS.SHOWTIMES.SEATS(showtimeId));
      return data;
    } catch (error) {
      console.error('Error fetching seats:', error);
      return [];
    }
  },
  
  createBooking: async (bookingData: any): Promise<any> => {
    try {
      const idempotencyKey = uuidv4();
      const { data } = await api.post(ENDPOINTS.BOOKINGS.BASE, bookingData, {
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      });
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  getMyBookings: async (page = 0, size = 10): Promise<PageResponse<any>> => {
    try {
      const { data } = await api.get<PageResponse<any> | any[]>(ENDPOINTS.BOOKINGS.MY_BOOKINGS, {
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
      console.error('Error fetching my bookings:', error);
      return {
        content: [],
        pageNumber: page,
        pageSize: size,
        totalElements: 0,
        totalPages: 0
      };
    }
  },

  createPaymentIntent: async (bookingId: string): Promise<{ clientSecret: string }> => {
    try {
      const { data } = await api.post(`/payments/create-intent/${bookingId}`);
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  confirmPayment: async (bookingId: string): Promise<any> => {
    try {
      const { data } = await api.post(`/payments/confirm/${bookingId}`);
      return data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }
};
