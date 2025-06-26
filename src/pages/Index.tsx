
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { FlightResults } from "@/components/FlightResults";
import { HeroSection } from "@/components/HeroSection";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { searchFlights, transformKiwiDataToFlight } from "@/services/kiwiApi";
import { supabase } from "@/integrations/supabase/client";
import { Flight } from "@/types/Flight";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user, loading: authLoading, signOut } = useAuth();
  const { subscribed, subscription_tier } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to get currency symbol
  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: "$", GBP: "£", EUR: "€", CAD: "C$", AUD: "A$", JPY: "¥", INR: "₹"
    };
    return symbols[currency] || "$";
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setUserProfile(data);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Check for subscription success/cancel from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscription = urlParams.get('subscription');
    
    if (subscription === 'success') {
      toast({
        title: "Welcome to Farely Pro! 🎉",
        description: "Your subscription is now active. Enjoy all premium features!",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (subscription === 'cancelled') {
      toast({
        title: "Subscription Cancelled",
        description: "You can still upgrade to Pro anytime to unlock premium features.",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const handleSearch = async (searchData: any) => {
    if (!user || !userProfile) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const currencySymbol = getCurrencySymbol(userProfile.currency);

      // Save search to history
      await supabase.from('search_history').insert({
        user_id: user.id,
        departure_location: searchData.departure,
        arrival_location: searchData.arrival,
        departure_date: searchData.departureDate,
        return_date: searchData.returnDate,
        passengers: searchData.passengers || 1
      });

      // Search flights using Kiwi API
      const kiwiResults = await searchFlights({
        departure: searchData.departure,
        arrival: searchData.arrival,
        departureDate: searchData.departureDate,
        returnDate: searchData.returnDate,
        passengers: searchData.passengers,
        currency: userProfile.currency
      });

      // Transform Kiwi data to our Flight interface
      const transformedFlights = kiwiResults.map((kiwiFlight: any) => 
        transformKiwiDataToFlight(kiwiFlight, currencySymbol)
      );

      setFlights(transformedFlights);
      
      if (transformedFlights.length === 0) {
        toast({
          title: "No flights found",
          description: "Try adjusting your search criteria or dates.",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Unable to search flights at the moment. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to mock data for demo purposes
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
          currencySymbol: getCurrencySymbol(userProfile?.currency || 'USD')
        }
      ];
      setFlights(mockFlights);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header with user info and sign out */}
      <div className="bg-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-white">
            Welcome, {userProfile?.name || user?.user_metadata?.name || user.email}
          </div>
          {subscribed && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white text-xs font-medium">
              Pro Member
            </div>
          )}
        </div>
        <Button 
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="text-white border-slate-600 hover:bg-slate-700 hover:text-white"
        >
          Sign Out
        </Button>
      </div>

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
