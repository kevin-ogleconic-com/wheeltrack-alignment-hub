
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Gauge, Shield, Smartphone, TrendingUp, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Gauge className="h-8 w-8" />,
      title: "Real-time Data Sync",
      description: "Instantly sync alignment data from your machines to the cloud. Never lose important measurements again."
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Manufacturer Specs Database",
      description: "Access comprehensive manufacturer alignment specifications for thousands of vehicle models."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Analyze trends, track performance, and identify opportunities for your alignment business."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Access",
      description: "Access your data anywhere with our mobile app. Perfect for field work and customer consultations."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Storage",
      description: "Enterprise-grade security ensures your valuable alignment data is always protected and backed up."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "Share data with your team, assign tasks, and collaborate on complex alignment projects."
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Powerful Features</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to manage wheel alignment data professionally and efficiently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg gradient-blue-subtle group-hover:gradient-blue transition-all duration-300">
                    <div className="text-blue-400 group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
