export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REGISTER: '/auth/register',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  MOVIES: {
    BASE: '/movies',
    NOW_PLAYING: '/movies/now-playing',
    UPCOMING: '/movies/upcoming',
    BY_ID: (id: string) => `/movies/${id}`,
    SEARCH: (genre: string) => `/movies/search?genre=${genre}`,
  },
  THEATERS: {
    BASE: '/theaters',
  },
  SCREENS: {
    BASE: '/screens',
    BY_THEATER: (theaterId: string) => `/screens/theater/${theaterId}`,
  },
  SHOWTIMES: {
    BASE: '/showtimes',
    BY_MOVIE: (movieId: string) => `/showtimes/movie/${movieId}`,
    BY_THEATER: (theaterId: string) => `/showtimes/theater/${theaterId}`,
    SEATS: (showtimeId: string) => `/showtimes/${showtimeId}/seats`,
  },
  BOOKINGS: {
    BASE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
  },
} as const;
