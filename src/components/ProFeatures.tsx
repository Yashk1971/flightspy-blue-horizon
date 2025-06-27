
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Star, Filter, Bell, Calendar, Headphones } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProFeaturesProps {
  onAuthClick: () => void;
}

export const ProFeatures = ({ onAuthClick }: ProFeaturesProps) => {
  const { user, session } = useAuth();
  const { subscribed } = useSubscription();
  const { toast } = useToast();

  const handleUpgrade = async () => {
    if (!user) {
      onAuthClick();
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
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

      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const features = [
    { icon: Filter, title: "Advanced Filters", description: "Filter by airline, stops, time preferences" },
    { icon: Bell, title: "Price Alerts", description: "Get notified when prices drop" },
    { icon: Calendar, title: "Flexible Dates", description: "Find cheapest dates in a range" },
    { icon: Headphones, title: "Priority Support", description: "24/7 dedicated customer support" }
  ];

  if (subscribed) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-sm">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Star className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You're a Pro Member! 🎉</h3>
            <p className="text-green-100 mb-6">
              Enjoy unlimited access to all premium features and priority support.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <feature.icon className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-green-100 font-medium">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="p-8 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500/20 rounded-full border border-purple-500/30">
              <Lock className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Unlock <span className="text-purple-400">Pro Features</span>
          </h3>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Get access to advanced search filters, price alerts, and premium support to find the absolute best flight deals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-slate-700 rounded-full">
                  <feature.icon className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-slate-700 p-4 rounded-lg mb-6 max-w-md mx-auto">
            <div className="text-center">
              <span className="text-3xl font-bold text-white">$2.99</span>
              <span className="text-slate-400 ml-2">/month</span>
            </div>
            <p className="text-slate-400 text-sm mt-1">Cancel anytime</p>
          </div>
          
          <Button
            onClick={handleUpgrade}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
          >
            {user ? "Upgrade to Pro" : "Sign Up for Pro"}
          </Button>
          
          {!user && (
            <p className="text-slate-400 text-sm mt-3">
              Sign up required to access Pro features
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
