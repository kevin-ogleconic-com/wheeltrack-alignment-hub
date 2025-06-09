
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      price: "$199",
      period: "/month",
      description: "Perfect for small shops",
      features: [
        "Up to 5 alignments per day",
        "Basic measurement tools",
        "Email support",
        "Monthly reports",
        "Standard accuracy (±0.2°)"
      ],
      popular: false,
      planId: "basic"
    },
    {
      name: "Pro",
      price: "$399",
      period: "/month",
      description: "Best for growing businesses",
      features: [
        "Unlimited alignments",
        "Advanced analytics",
        "Priority phone support",
        "Real-time reporting",
        "Premium accuracy (±0.1°)",
        "Custom branded reports",
        "API access"
      ],
      popular: true,
      planId: "pro"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large operations",
      features: [
        "Multi-location support",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solution",
        "24/7 phone support",
        "Advanced user management",
        "Custom training"
      ],
      popular: false,
      planId: "enterprise"
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core alignment technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative bg-slate-800/50 border-slate-700 ${
                plan.popular ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular
                      ? "gradient-blue text-white border-0 hover:opacity-90"
                      : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => {
                    if (plan.planId === "enterprise") {
                      // For enterprise, you might want to redirect to a contact form
                      navigate('/contact');
                    } else {
                      navigate(`/signup?plan=${plan.planId}`);
                    }
                  }}
                >
                  {plan.planId === "enterprise" ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            All plans include a 30-day free trial. No credit card required.
          </p>
          <Button 
            variant="ghost" 
            className="text-blue-400 hover:text-blue-300"
            onClick={() => navigate('/signup')}
          >
            Get Started Free →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
