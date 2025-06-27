
export interface AmadeusSearchParams {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
  currency?: string;
}

export interface AmadeusFlightData {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating?: {
        carrierCode: string;
      };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
  }>;
}

const AMADEUS_API_KEY = "guZswTAQqgdJxKmkqM5GV00idpjCJeiF";
const AMADEUS_API_SECRET = "your_secret_here"; // You'll need to provide this
const BASE_URL = "https://api.amadeus.com";

// Store access token
let accessToken: string | null = null;
let tokenExpiry: number = 0;

// Get OAuth token for Amadeus API
const getAccessToken = async () => {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_API_KEY,
        client_secret: AMADEUS_API_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`OAuth error: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute before expiry
    
    return accessToken;
  } catch (error) {
    console.error('Error getting Amadeus access token:', error);
    throw error;
  }
};

export const searchFlights = async (params: AmadeusSearchParams) => {
  try {
    const token = await getAccessToken();
    
    const searchParams = new URLSearchParams({
      originLocationCode: params.departure,
      destinationLocationCode: params.arrival,
      departureDate: params.departureDate,
      adults: (params.passengers || 1).toString(),
      currencyCode: params.currency || 'USD',
      max: '10',
    });

    if (params.returnDate) {
      searchParams.append('returnDate', params.returnDate);
    }

    const response = await fetch(`${BASE_URL}/v2/shopping/flight-offers?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Amadeus API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

export const transformAmadeusDataToFlight = (amadeusData: AmadeusFlightData, currencySymbol: string = '$') => {
  const firstItinerary = amadeusData.itineraries[0];
  const firstSegment = firstItinerary.segments[0];
  const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];
  
  // Parse duration (PT4H30M format)
  const durationMatch = firstItinerary.duration.match(/PT(\d+H)?(\d+M)?/);
  const hours = durationMatch?.[1] ? parseInt(durationMatch[1]) : 0;
  const minutes = durationMatch?.[2] ? parseInt(durationMatch[2]) : 0;
  const durationString = `${hours}h ${minutes}m`;

  // Count stops (segments - 1)
  const stops = Math.max(0, firstItinerary.segments.length - 1);

  // Get airline name (you might want to create a mapping for better display names)
  const airlineCode = firstSegment.carrierCode;
  const airline = getAirlineName(airlineCode);

  return {
    id: amadeusData.id,
    airline,
    price: parseFloat(amadeusData.price.total),
    duration: durationString,
    stops,
    departure: {
      time: new Date(firstSegment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      airport: firstSegment.departure.iataCode,
      date: new Date(firstSegment.departure.at).toISOString().split('T')[0]
    },
    arrival: {
      time: new Date(lastSegment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      airport: lastSegment.arrival.iataCode,
      date: new Date(lastSegment.arrival.at).toISOString().split('T')[0]
    },
    bookingUrl: `https://www.amadeus.com/booking/${amadeusData.id}`, // Placeholder - you might want to implement actual booking
    currencySymbol
  };
};

// Helper function to get airline names from codes
const getAirlineName = (code: string): string => {
  const airlineMap: { [key: string]: string } = {
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'SW': 'Southwest Airlines',
    'AS': 'Alaska Airlines',
    'B6': 'JetBlue Airways',
    'NK': 'Spirit Airlines',
    'F9': 'Frontier Airlines',
    'WN': 'Southwest Airlines',
    'LH': 'Lufthansa',
    'BA': 'British Airways',
    'AF': 'Air France',
    'KL': 'KLM',
    'VS': 'Virgin Atlantic',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'SQ': 'Singapore Airlines',
    'CX': 'Cathay Pacific',
    'JL': 'Japan Airlines',
    'NH': 'ANA',
  };
  
  return airlineMap[code] || code;
};
