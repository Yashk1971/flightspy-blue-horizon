
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plane } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (userData: any) => void;
}

export const AuthModal = ({ isOpen, onClose, onAuth }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    country: ""
  });
  const { toast } = useToast();

  const countries = [
    { code: "US", name: "United States", currency: "USD" },
    { code: "GB", name: "United Kingdom", currency: "GBP" },
    { code: "EU", name: "European Union", currency: "EUR" },
    { code: "CA", name: "Canada", currency: "CAD" },
    { code: "AU", name: "Australia", currency: "AUD" },
    { code: "JP", name: "Japan", currency: "JPY" },
    { code: "IN", name: "India", currency: "INR" },
  ];

  // Password validation
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
      errors: [
        !minLength && "At least 8 characters",
        !hasUppercase && "One uppercase letter",
        !hasLowercase && "One lowercase letter", 
        !hasNumber && "One number",
        !hasSpecialChar && "One special character (!@#$%^&*)"
      ].filter(Boolean)
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !passwordValidation.isValid) {
      toast({
        title: "Password requirements not met",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast({
            title: "Login Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          const selectedCountry = countries.find(c => c.code === (data.user?.user_metadata?.country || 'US'));
          onAuth({
            ...formData,
            currency: selectedCountry?.currency || "USD"
          });
          onClose();
        }
      } else {
        const selectedCountry = countries.find(c => c.code === formData.country);
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: formData.name,
              country: formData.country,
              currency: selectedCountry?.currency || "USD"
            }
          }
        });

        if (error) {
          toast({
            title: "Sign Up Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
          onAuth({
            ...formData,
            currency: selectedCountry?.currency || "USD"
          });
          onClose();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-500/30">
              <Plane className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back" : "Join Farely"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name" className="text-slate-300">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
            {!isLogin && formData.password && (
              <div className="mt-2 text-xs space-y-1">
                <div className="text-slate-400">Password must contain:</div>
                {passwordValidation.errors.map((error, index) => (
                  <div key={index} className="text-red-400 flex items-center gap-1">
                    <span>•</span> {error}
                  </div>
                ))}
                {passwordValidation.isValid && (
                  <div className="text-green-400 flex items-center gap-1">
                    <span>✓</span> Password meets all requirements
                  </div>
                )}
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <Label htmlFor="country" className="text-slate-300">Country</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code} className="text-white hover:bg-slate-600">
                      {country.name} ({country.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            disabled={loading || (!isLogin && !passwordValidation.isValid)}
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
