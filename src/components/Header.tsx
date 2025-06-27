
import { Button } from "@/components/ui/button";
import { Plane, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onAuthClick: () => void;
  onSignOut: () => void;
}

export const Header = ({ onAuthClick, onSignOut }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-transparent">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-500/30">
            <Plane className="h-6 w-6 text-blue-400" />
          </div>
          <span className="text-2xl font-bold text-white">
            Fare<span className="text-blue-400">ly</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-white text-sm">
                Welcome, {user.user_metadata?.name || user.email?.split('@')[0]}
              </span>
              <Button 
                onClick={onSignOut}
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10 hover:text-white bg-transparent"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onAuthClick}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
