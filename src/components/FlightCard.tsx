
import { Flight } from "@/types/Flight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, ArrowRight, ExternalLink, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlightCardProps {
  flight: Flight;
  rank: number;
}

export const FlightCard = ({ flight, rank }: FlightCardProps) => {
  const { toast } = useToast();

  const handleBooking = () => {
    // Since Amadeus test API doesn't provide direct booking URLs,
    // we'll redirect to popular flight booking sites with search parameters
    const departure = flight.departure.airport;
    const arrival = flight.arrival.airport;
    const date = flight.departure.date;
    
    // Try Google Flights first as it's most comprehensive
    const googleFlightsUrl = `https://www.google.com/travel/flights/search?tfs=CBwQAhogEgoyMDI1LTA2LTI5agwIAhIIL20vMDJfMjg2cgwIAhIIL20vMDVxdGo&curr=USD&hl=en`;
    
    // Alternative: Expedia with search parameters
    const expediaUrl = `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${departure},to:${arrival},departure:${date}&passengers=adults:1&options=cabinclass:economy`;
    
    // Alternative: Kayak with search parameters
    const kayakUrl = `https://www.kayak.com/flights/${departure}-${arrival}/${date}?sort=bestflight_a`;

    toast({
      title: "Redirecting to Book Flight",
      description: `Opening booking options for ${flight.airline} flight from ${departure} to ${arrival}`,
    });

    // Open Google Flights in new tab
    window.open(googleFlightsUrl, '_blank');
  };

  return (
    <Card className="p-6 bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 group">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Rank badge */}
        <div className="flex items-center gap-3">
          {rank === 1 && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold">
              <Star className="w-3 h-3 mr-1" />
              BEST DEAL
            </Badge>
          )}
          {rank <= 3 && rank > 1 && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              #{rank}
            </Badge>
          )}
        </div>

        {/* Flight info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">{flight.airline}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {flight.duration}
                  </div>
                  <div>
                    {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {flight.currencySymbol || "$"}{flight.price}
              </div>
              <div className="text-sm text-slate-400">per person</div>
            </div>
          </div>

          {/* Flight times */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="text-white font-medium">{flight.departure.time}</div>
              <div className="text-slate-400">{flight.departure.airport}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-400" />
            <div className="flex items-center gap-2">
              <div className="text-white font-medium">{flight.arrival.time}</div>
              <div className="text-slate-400">{flight.arrival.airport}</div>
            </div>
          </div>
        </div>

        {/* Booking button */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleBooking}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6 py-3 group-hover:scale-105 transition-transform duration-200"
          >
            Book Flight
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <div className="text-xs text-slate-500 text-center">
            Opens booking options
          </div>
        </div>
      </div>
    </Card>
  );
};
