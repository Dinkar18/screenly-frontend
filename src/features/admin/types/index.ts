export interface Theater {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface Screen {
  id: string;
  theaterId: string;
  name: string;
  capacity: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  movieTitle?: string;
  screenId: string;
  screenName?: string;
  theaterId?: string;
  theaterName?: string;
  startTime: string;
  endTime?: string;
  price: number;
}

export interface TheaterRequest {
  name: string;
  city: string;
  address: string;
}

export interface ScreenRequest {
  theaterId: string;
  name: string;
  capacity: number;
}

export interface ShowtimeRequest {
  movieId: string;
  screenId: string;
  startTime: string;
  price: number;
}
