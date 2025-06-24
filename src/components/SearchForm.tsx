
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Plane, Users, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  onSearch: (data: any) => void;
  loading: boolean;
  compact?: boolean;
}

export const SearchForm = ({ onSearch, loading, compact = false }: SearchFormProps) => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departure || !arrival || !departureDate) return;
    
    onSearch({
      departure,
      arrival,
      departureDate: format(departureDate, 'yyyy-MM-dd'),
      returnDate: returnDate ? format(returnDate, 'yyyy-MM-dd') : null,
      passengers,
      isRoundTrip
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departure" className="text-slate-300 font-medium">From</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
            <Input
              id="departure"
              placeholder="New York (NYC)"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="arrival" className="text-slate-300 font-medium">To</Label>
          <div className="relative">
            <ArrowLeftRight className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
            <Input
              id="arrival"
              placeholder="Los Angeles (LAX)"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300 font-medium">Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-slate-800 border-slate-600 text-white hover:bg-slate-700",
                  !departureDate && "text-slate-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-slate-300 font-medium">Return Date</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsRoundTrip(!isRoundTrip)}
              className="text-xs text-blue-400 hover:text-blue-300 p-1 h-auto"
            >
              {isRoundTrip ? 'One-way' : 'Round-trip'}
            </Button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!isRoundTrip}
                className={cn(
                  "w-full justify-start text-left font-normal bg-slate-800 border-slate-600 text-white hover:bg-slate-700",
                  !returnDate && "text-slate-400",
                  !isRoundTrip && "opacity-50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                {returnDate ? format(returnDate, "PPP") : <span>Return date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                disabled={(date) => date < (departureDate || new Date())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="passengers" className="text-slate-300 font-medium">Passengers</Label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
            <Input
              id="passengers"
              type="number"
              min="1"
              max="9"
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
              className="pl-10 bg-slate-800 border-slate-600 text-white focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Searching Flights...
          </div>
        ) : (
          "Search Flights"
        )}
      </Button>
    </form>
  );

  if (compact) {
    return (
      <Card className="p-6 bg-slate-800 border-slate-700">
        {formContent}
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Find Your Perfect Flight</h2>
          <p className="text-slate-400">Compare prices and find the best deals</p>
        </div>
        {formContent}
      </Card>
    </div>
  );
};
