
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Freemium",
      price: "Free",
      description: "Perfect for small shops starting out",
      features: [
        "Store up to 3 vehicles",
        "Basic alignment data tracking",
        "Email support",
        "Mobile app access",
        "Basic reporting"
      ],
      icon: <Star className="h-6 w-6" />,
      popular: false
    },
    {
      name: "Basic",
      price: "$29",
      period: "/month",
      description: "Unlimited vehicles for growing businesses",
      features: [
        "Unlimited vehicle storage",
        "Advanced alignment tracking",
        "Priority email support",
        "Custom reporting",
        "Data export capabilities",
        "API access"
      ],
      icon: <Zap className="h-6 w-6" />,
      popular: true
    },
    {
      name: "Pro",
      price: "$89",
      period: "/month",
      description: "Complete solution with manufacturer specs",
      features: [
        "Everything in Basic",
        "Manufacturer specifications database",
        "Advanced analytics",
        "Phone support",
        "Custom integrations",
        "Team collaboration tools",
        "White-label options"
      ],
      icon: <Check className="h-6 w-6" />,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Choose Your Plan</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. Upgrade or downgrade at any time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="gradient-blue px-4 py-1 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? 'gradient-blue' : 'bg-slate-700'}`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'gradient-blue text-white border-0 hover:opacity-90' 
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  {plan.name === 'Freemium' ? 'Get Started Free' : 'Start Trial'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
