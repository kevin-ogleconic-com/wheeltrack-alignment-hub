
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Calendar, Wrench } from "lucide-react";

interface VehicleDataProps {
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    lastAlignment: string;
    status: 'good' | 'needs-attention' | 'critical';
    measurements: {
      frontToe: string;
      rearToe: string;
      camber: string;
      caster: string;
    };
  };
}

const VehicleDataCard = ({ vehicle }: VehicleDataProps) => {
  const statusColors = {
    good: 'bg-green-500',
    'needs-attention': 'bg-yellow-500',
    critical: 'bg-red-500'
  };

  const statusLabels = {
    good: 'Good',
    'needs-attention': 'Needs Attention',
    critical: 'Critical'
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg gradient-blue-subtle">
            <Car className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Last aligned: {vehicle.lastAlignment}</span>
            </div>
          </div>
        </div>
        <Badge className={`${statusColors[vehicle.status]} text-white border-0`}>
          {statusLabels[vehicle.status]}
        </Badge>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Front Toe:</span>
              <span className="text-white font-mono">{vehicle.measurements.frontToe}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rear Toe:</span>
              <span className="text-white font-mono">{vehicle.measurements.rearToe}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Camber:</span>
              <span className="text-white font-mono">{vehicle.measurements.camber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Caster:</span>
              <span className="text-white font-mono">{vehicle.measurements.caster}</span>
            </div>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
          <Wrench className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleDataCard;
