
import { ArrowRight, Play, Wrench, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoModal from "./VideoModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <Target className="w-4 h-4 mr-2" />
            Professional Wheel Alignment Technology
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Precision Wheel
            <span className="block gradient-text">Alignment Hub</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionary IoT-powered wheel alignment system that delivers 
            <span className="text-blue-400 font-semibold"> professional-grade accuracy</span> 
            at a fraction of the cost
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">±0.1°</div>
              <div className="text-gray-400">Precision</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">90%</div>
              <div className="text-gray-400">Cost Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5min</div>
              <div className="text-gray-400">Setup Time</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="gradient-blue text-white border-0 hover:opacity-90 transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg"
              onClick={() => navigate('/signup')}
            >
              Start a Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-6 text-lg"
              onClick={() => setShowVideo(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <Wrench className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Easy Setup</h3>
              <p className="text-gray-400">Quick 5-minute installation with smartphone integration</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <Target className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Professional Accuracy</h3>
              <p className="text-gray-400">±0.1° precision matching $50,000+ systems</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Instant Results</h3>
              <p className="text-gray-400">Real-time measurements with detailed reports</p>
            </div>
          </div>
        </div>
      </div>

      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
    </section>
  );
};

export default Hero;
