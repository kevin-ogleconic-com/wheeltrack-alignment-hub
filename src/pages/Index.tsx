
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return (
      <div className="min-h-screen">
        <Header />
        <Dashboard />
        <div className="fixed bottom-4 right-4">
          <Button 
            onClick={() => setShowDashboard(false)}
            variant="outline" 
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
          >
            Back to Landing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturesSection />
      <PricingSection />
      <Footer />
      
      {/* Demo Dashboard Button */}
      <div className="fixed bottom-4 right-4">
        <Button 
          onClick={() => setShowDashboard(true)}
          className="gradient-blue text-white border-0 hover:opacity-90"
        >
          View Demo Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Index;
