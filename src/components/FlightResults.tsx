
import { useState } from "react";
import { Flight } from "@/types/Flight";
import { FlightCard } from "./FlightCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Filter, TrendingUp, Settings } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FlightResultsProps {
  flights: Flight[];
  loading: boolean;
}

export const FlightResults = ({ flights, loading }: FlightResultsProps) => {
  const [sortBy, setSortBy] = useState("price");
  const [showProModal, setShowProModal] = useState(false);
  const { subscribed, loading: subLoading } = useSubscription();
  const { session } = useAuth();
  const { toast } = useToast();

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price;
    } else if (sortBy === "duration") {
      const aDuration = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1]?.split('m')[0] || '0');
      const bDuration = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1]?.split('m')[0] || '0');
      return aDuration - bDuration;
    }
    return 0;
  });

  const handleProUpgrade = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade to Pro features.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create checkout session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      setShowProModal(false);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to open subscription management. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Searching for the best flights...</h3>
          <p className="text-slate-400">Comparing prices from 100+ airlines</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Flight Results</h2>
          <p className="text-slate-400">Found {flights.length} flights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600 text-white">
              <Filter className="w-4 h-4 mr-2 text-blue-400" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="price" className="text-white">Price (Low to High)</SelectItem>
              <SelectItem value="duration" className="text-white">Duration (Shortest)</SelectItem>
            </SelectContent>
          </Select>
          
          {subscribed ? (
            <Button
              onClick={handleManageSubscription}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Pro Plan
            </Button>
          ) : (
            <Button
              onClick={() => setShowProModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Unlock Pro Filters
            </Button>
          )}
        </div>
      </div>

      {/* Pro subscription status */}
      {subscribed && (
        <Card className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-green-400 font-medium">Pro Plan Active! 🎉</p>
              <p className="text-slate-300 text-sm">
                You have access to all premium features including advanced filters and priority support.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Best deal highlight */}
      {sortedFlights.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-green-400 font-medium">Best Deal Found!</p>
              <p className="text-slate-300 text-sm">
                Save ${(sortedFlights[sortedFlights.length - 1]?.price || 0) - sortedFlights[0].price} compared to the most expensive option
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Flight cards */}
      <div className="space-y-4">
        {sortedFlights.map((flight, index) => (
          <FlightCard key={flight.id} flight={flight} rank={index + 1} />
        ))}
      </div>

      {/* Pro features modal */}
      {showProModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 bg-slate-800 border-slate-600">
            <h3 className="text-xl font-bold text-white mb-4">Unlock Farely Pro</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Advanced airline filters</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Real-time price alerts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Flexible date ranges</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Priority customer support</span>
              </div>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg mb-6">
              <div className="text-center">
                <span className="text-2xl font-bold text-white">$2.99</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-400 text-sm text-center mt-1">Cancel anytime</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowProModal(false)}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleProUpgrade}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Start Pro Plan
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
