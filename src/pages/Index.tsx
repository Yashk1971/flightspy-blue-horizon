
import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { FlightResults } from "@/components/FlightResults";
import { HeroSection } from "@/components/HeroSection";
import { Flight } from "@/types/Flight";

const Index = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchData: any) => {
    setLoading(true);
    setHasSearched(true);
    
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
            airport: searchData.departure,
            date: searchData.departureDate
          },
          arrival: {
            time: "13:30",
            airport: searchData.arrival,
            date: searchData.departureDate
          },
          bookingUrl: "https://kiwi.com/flight/delta-299"
        },
        {
          id: "2",
          airline: "American Airlines",
          price: 324,
          duration: "4h 45m",
          stops: 1,
          departure: {
            time: "10:15",
            airport: searchData.departure,
            date: searchData.departureDate
          },
          arrival: {
            time: "17:00",
            airport: searchData.arrival,
            date: searchData.departureDate
          },
          bookingUrl: "https://kiwi.com/flight/american-324"
        },
        {
          id: "3",
          airline: "United Airlines",
          price: 356,
          duration: "6h 15m",
          stops: 1,
          departure: {
            time: "14:30",
            airport: searchData.departure,
            date: searchData.departureDate
          },
          arrival: {
            time: "22:45",
            airport: searchData.arrival,
            date: searchData.departureDate
          },
          bookingUrl: "https://kiwi.com/flight/united-356"
        },
        {
          id: "4",
          airline: "JetBlue Airways",
          price: 378,
          duration: "5h 20m",
          stops: 0,
          departure: {
            time: "16:45",
            airport: searchData.departure,
            date: searchData.departureDate
          },
          arrival: {
            time: "22:05",
            airport: searchData.arrival,
            date: searchData.departureDate
          },
          bookingUrl: "https://kiwi.com/flight/jetblue-378"
        },
        {
          id: "5",
          airline: "Southwest Airlines",
          price: 412,
          duration: "7h 30m",
          stops: 2,
          departure: {
            time: "06:30",
            airport: searchData.departure,
            date: searchData.departureDate
          },
          arrival: {
            time: "16:00",
            airport: searchData.arrival,
            date: searchData.departureDate
          },
          bookingUrl: "https://kiwi.com/flight/southwest-412"
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
            <SearchForm onSearch={handleSearch} loading={loading} />
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
    </div>
  );
};

export default Index;
