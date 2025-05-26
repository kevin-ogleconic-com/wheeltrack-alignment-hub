import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VehicleDataCard from "./VehicleDataCard";
import WheelAlignmentChart from "./WheelAlignmentChart";
import { BarChart3, Car, Database, Plus, TrendingUp } from "lucide-react";

const Dashboard = () => {
  // Sample data with detailed alignment measurements
  const vehicles = [
    {
      id: "1",
      make: "Toyota",
      model: "Camry",
      year: 2022,
      lastAlignment: "2024-01-15",
      status: "good" as const,
      measurements: {
        frontToe: "0.12°",
        rearToe: "-0.08°",
        camber: "0.15°",
        caster: "3.2°"
      }
    },
    {
      id: "2",
      make: "Honda",
      model: "Accord",
      year: 2021,
      lastAlignment: "2024-01-10",
      status: "needs-attention" as const,
      measurements: {
        frontToe: "0.25°",
        rearToe: "-0.15°",
        camber: "0.32°",
        caster: "3.8°"
      }
    }
  ];

  // Detailed wheel alignment data for graphical view
  const wheelAlignmentData = {
    make: "Toyota",
    model: "Camry",
    year: 2022,
    measurements: {
      frontLeftToe: { value: 0.12, unit: "°", min: -0.15, max: 0.15, label: "Front Left Toe" },
      frontRightToe: { value: 0.08, unit: "°", min: -0.15, max: 0.15, label: "Front Right Toe" },
      rearLeftToe: { value: -0.08, unit: "°", min: -0.20, max: 0.20, label: "Rear Left Toe" },
      rearRightToe: { value: 0.25, unit: "°", min: -0.20, max: 0.20, label: "Rear Right Toe" }, // Out of range
      frontLeftCamber: { value: 0.15, unit: "°", min: -0.50, max: 0.50, label: "Front Left Camber" },
      frontRightCamber: { value: -0.35, unit: "°", min: -0.50, max: 0.50, label: "Front Right Camber" },
      rearLeftCamber: { value: 0.22, unit: "°", min: -0.30, max: 0.30, label: "Rear Left Camber" },
      rearRightCamber: { value: 0.45, unit: "°", min: -0.30, max: 0.30, label: "Rear Right Camber" } // Out of range
    }
  };

  // Sample data - in real app this would come from your backend
  const stats = [
    {
      title: "Total Vehicles",
      value: "2",
      limit: "3",
      icon: <Car className="h-5 w-5" />,
      color: "text-blue-400"
    },
    {
      title: "This Month",
      value: "12",
      subtitle: "Alignments",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-green-400"
    },
    {
      title: "Accuracy Rate",
      value: "98.5%",
      subtitle: "Average",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen pt-20 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Manage your vehicle alignment data</p>
          </div>
          <Button className="gradient-blue text-white border-0 hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      {stat.limit && (
                        <span className="text-gray-400 text-sm">/ {stat.limit}</span>
                      )}
                    </div>
                    {stat.subtitle && (
                      <p className="text-gray-400 text-sm">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Wheel Alignment Visualization */}
        <div className="mb-8">
          <WheelAlignmentChart vehicle={wheelAlignmentData} />
        </div>

        {/* Vehicle List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Vehicles</h2>
            <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
              <Database className="h-4 w-4 mr-2" />
              View All Data
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleDataCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>

        {/* Freemium Limit Notice */}
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Freemium Plan Limit</h3>
                <p className="text-gray-300">You're using 2 of 3 vehicle slots. Upgrade to Basic for unlimited vehicles.</p>
              </div>
              <Button className="gradient-blue text-white border-0 hover:opacity-90">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
