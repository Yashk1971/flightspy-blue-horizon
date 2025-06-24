
import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { FlightResults } from "@/components/FlightResults";
import { HeroSection } from "@/components/HeroSection";
import { AuthModal } from "@/components/AuthModal";
import { Flight } from "@/types/Flight";

const Index = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleSearchClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // If user is authenticated, proceed with search
    handleSearch();
  };

  const handleAuth = (userData: any) => {
    setUser(userData);
    console.log("User authenticated:", userData);
  };

  const handleSearch = async (searchData?: any) => {
    setLoading(true);
    setHasSearched(true);
    
    // Get currency symbol based on user's country
    const getCurrencySymbol = (currency: string) => {
      const symbols: { [key: string]: string } = {
        USD: "$", GBP: "£", EUR: "€", CAD: "C$", AUD: "A$", JPY: "¥", INR: "₹"
      };
      return symbols[currency] || "$";
    };

    const currencySymbol = user ? getCurrencySymbol(user.currency) : "$";
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockFlights: Flight[] = [
        {
          id: "1",
          airline: "Delta Airlines",
          price: 299,
          duration: "5h 30m",
          stops: 0,
          departure: {
            time: "08:00",
            airport: searchData?.departure || "JFK",
            date: searchData?.departureDate || "2024-01-15"
          },
          arrival: {
            time: "13:30",
            airport: searchData?.arrival || "LAX",
            date: searchData?.departureDate || "2024-01-15"
          },
          bookingUrl: "https://kiwi.com/flight/delta-299",
          currencySymbol
        },
        {
          id: "2",
          airline: "American Airlines",
          price: 324,
          duration: "4h 45m",
          stops: 1,
          departure: {
            time: "10:15",
            airport: searchData?.departure || "JFK",
            date: searchData?.departureDate || "2024-01-15"
          },
          arrival: {
            time: "17:00",
            airport: searchData?.arrival || "LAX",
            date: searchData?.departureDate || "2024-01-15"
          },
          bookingUrl: "https://kiwi.com/flight/american-324",
          currencySymbol
        },
        {
          id: "3",
          airline: "United Airlines",
          price: 356,
          duration: "6h 15m",
          stops: 1,
          departure: {
            time: "14:30",
            airport: searchData?.departure || "JFK",
            date: searchData?.departureDate || "2024-01-15"
          },
          arrival: {
            time: "22:45",
            airport: searchData?.arrival || "LAX",
            date: searchData?.departureDate || "2024-01-15"
          },
          bookingUrl: "https://kiwi.com/flight/united-356",
          currencySymbol
        },
        {
          id: "4",
          airline: "JetBlue Airways",
          price: 378,
          duration: "5h 20m",
          stops: 0,
          departure: {
            time: "16:45",
            airport: searchData?.departure || "JFK",
            date: searchData?.departureDate || "2024-01-15"
          },
          arrival: {
            time: "22:05",
            airport: searchData?.arrival || "LAX",
            date: searchData?.departureDate || "2024-01-15"
          },
          bookingUrl: "https://kiwi.com/flight/jetblue-378",
          currencySymbol
        },
        {
          id: "5",
          airline: "Southwest Airlines",
          price: 412,
          duration: "7h 30m",
          stops: 2,
          departure: {
            time: "06:30",
            airport: searchData?.departure || "JFK",
            date: searchData?.departureDate || "2024-01-15"
          },
          arrival: {
            time: "16:00",
            airport: searchData?.arrival || "LAX",
            date: searchData?.departureDate || "2024-01-15"
          },
          bookingUrl: "https://kiwi.com/flight/southwest-412",
          currencySymbol
        }
      ];
      
      setFlights(mockFlights);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {!hasSearched ? (
        <>
          <HeroSection />
          <div className="container mx-auto px-4 pb-16">
            <SearchForm onSearch={handleSearchClick} loading={loading} />
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <SearchForm onSearch={handleSearch} loading={loading} compact />
          </div>
          <FlightResults flights={flights} loading={loading} />
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
};

export default Index;
