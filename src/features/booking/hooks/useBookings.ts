import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/booking';

export const useBookings = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['my-bookings', page, size],
    queryFn: () => bookingApi.getMyBookings(page, size),
  });
};
