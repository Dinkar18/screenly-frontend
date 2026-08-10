export const APP_CONFIG = {
  APP_NAME: 'Cinema CMS',
  MAX_SEATS_PER_BOOKING: 6,
} as const;

export const SEAT_TIERS = {
  VIP: { id: 'vip', price: 25 },
  PREMIUM: { id: 'premium', price: 18 },
  STANDARD: { id: 'standard', price: 12 },
} as const;

export const SEAT_STATUS = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  SOLD: 'sold',
  RESERVED: 'reserved',
} as const;
