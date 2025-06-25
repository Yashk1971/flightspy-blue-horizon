
export interface KiwiSearchParams {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
  currency?: string;
}

export interface KiwiFlightData {
  id: string;
  price: number;
  duration: {
    departure: number;
    return?: number;
    total: number;
  };
  route: Array<{
    flyFrom: string;
    flyTo: string;
    cityFrom: string;
    cityTo: string;
    local_departure: string;
    local_arrival: string;
    airline: string;
  }>;
  airlines: string[];
  booking_token: string;
  deep_link: string;
}

const KIWI_API_KEY = "kiwiapikey";
const BASE_URL = "https://api.tequila.kiwi.com";

export const searchFlights = async (params: KiwiSearchParams) => {
  const searchParams = new URLSearchParams({
    fly_from: params.departure,
    fly_to: params.arrival,
    date_from: params.departureDate,
    date_to: params.departureDate,
    adults: (params.passengers || 1).toString(),
    curr: params.currency || 'USD',
    limit: '10',
    sort: 'price',
  });

  if (params.returnDate) {
    searchParams.append('return_from', params.returnDate);
    searchParams.append('return_to', params.returnDate);
  }

  try {
    const response = await fetch(`${BASE_URL}/search?${searchParams}`, {
      headers: {
        'apikey': KIWI_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Kiwi API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

export const transformKiwiDataToFlight = (kiwiData: KiwiFlightData, currencySymbol: string = '$') => {
  const route = kiwiData.route[0]; // First route segment
  const returnRoute = kiwiData.route.length > 1 ? kiwiData.route[kiwiData.route.length - 1] : null;
  
  // Calculate duration in hours and minutes
  const totalDurationSeconds = kiwiData.duration.total;
  const hours = Math.floor(totalDurationSeconds / 3600);
  const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
  const durationString = `${hours}h ${minutes}m`;

  // Count stops (route segments - 1)
  const stops = Math.max(0, kiwiData.route.length - 1);

  return {
    id: kiwiData.id,
    airline: kiwiData.airlines[0] || route.airline,
    price: kiwiData.price,
    duration: durationString,
    stops,
    departure: {
      time: new Date(route.local_departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      airport: route.flyFrom,
      date: new Date(route.local_departure).toISOString().split('T')[0]
    },
    arrival: {
      time: new Date(route.local_arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      airport: route.flyTo,
      date: new Date(route.local_arrival).toISOString().split('T')[0]
    },
    bookingUrl: kiwiData.deep_link,
    currencySymbol
  };
};
