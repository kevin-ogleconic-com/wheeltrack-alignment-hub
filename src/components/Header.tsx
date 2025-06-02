
import { Button } from "@/components/ui/button";
import { Car, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg gradient-blue">
            <Car className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">AlignPro</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <Button 
              onClick={() => navigate('/dashboard')}
              size="sm" 
              className="gradient-blue text-white border-0 hover:opacity-90"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/auth')}
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                size="sm" 
                className="gradient-blue text-white border-0 hover:opacity-90"
              >
                Sign Up
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
