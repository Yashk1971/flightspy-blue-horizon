
export interface Flight {
  id: string;
  airline: string;
  price: number;
  duration: string;
  stops: number;
  departure: {
    time: string;
    airport: string;
    date: string;
  };
  arrival: {
    time: string;
    airport: string;
    date: string;
  };
  bookingUrl: string;
  currencySymbol?: string;
}
