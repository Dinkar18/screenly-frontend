export type SeatStatus = 'available' | 'reserved' | 'sold' | 'selected';
export type SeatTier = 'standard' | 'premium' | 'vip';

export interface Seat {
  id: string;
  row: string;
  number: string;
  status: SeatStatus;
  tier: SeatTier;
  price: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  theaterName: string;
  screenName: string;
  startTime: string; // ISO String
  format: '2D' | '3D' | 'IMAX 2D' | 'IMAX 3D' | '4DX';
  price?: number;
}

export interface BookingState {
  showtimeId: string | null;
  selectedSeats: Seat[];
  totalAmount: number;
}
