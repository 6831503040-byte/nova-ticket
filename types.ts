
export type AppStep = 'HOME' | 'EVENT_DETAIL' | 'LOGIN' | 'QUEUE' | 'SEATING' | 'PAYMENT' | 'CONFIRMATION' | 'MY_BOOKINGS' | 'BROWSE_ALL' | 'LATEST_NEWS';

export interface PerformanceRound {
  id: string;
  date: string;
  time: string;
}

export interface Event {
  id: string;
  title: string;
  venue: string;
  date: string;
  image: string;
  priceRange: string;
  minPrice: number;
  description: string;
  rounds: PerformanceRound[];
  stadiumLayoutType: 'STADIUM' | 'ARENA';
  category?: 'CONCERT' | 'FESTIVAL' | 'FAN_MEETING';
  status?: 'OPEN' | 'COMING_SOON' | 'SOLD_OUT';
  saleStartTime?: string; // ISO string or specific format
}

/**
 * Represents a single seat in the venue's seating chart.
 */
export interface Seat {
  id: string;
  row: string;
  col: number;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  zone: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Booking {
  orderId: string;
  event: Event;
  roundId: string; // Added to distinguish bookings between different dates
  seats: string[];
  zone?: string; // Added to store the zone name (e.g. VIP, VVIP)
  totalPrice: number;
  bookingDate: string;
}

export interface Notification {
  id: string;
  type: 'UPCOMING_SALE' | 'SALE_OPEN';
  title: string;
  message: string;
  eventId: string;
  timestamp: number;
  read?: boolean;
}
