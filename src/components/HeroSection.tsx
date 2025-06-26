
import { Plane } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 sm:py-32">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-500/30">
            <Plane 
              className="h-8 w-8 text-blue-400" 
            />
          </div>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
          Fare<span className="text-blue-400">ly</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
          Find the cheapest flights in seconds. Compare prices from hundreds of airlines 
          and travel sites to get the best deals.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="px-6 py-3 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-500/30">
            <span className="text-blue-300 text-sm font-medium">🔥 Save up to 70% on flights</span>
          </div>
          <div className="px-6 py-3 bg-green-500/20 rounded-full backdrop-blur-sm border border-green-500/30">
            <span className="text-green-300 text-sm font-medium">✈️ Compare 100+ airlines</span>
          </div>
        </div>
      </div>
    </div>
  );
};
