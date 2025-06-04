
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Calendar, Wrench, AlertTriangle, CheckCircle, Clock, User } from "lucide-react";

interface VehicleRecord {
  id: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  customer_name?: string;
  license_plate?: string;
  mileage?: number;
  completion_status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  alignment_type?: string;
  technician_name?: string;
  service_advisor?: string;
  work_order_number?: string;
  created_at: string;
  before_measurements?: any;
  after_measurements?: any;
}

interface EnhancedVehicleCardProps {
  record: VehicleRecord;
  onViewDetails: (record: VehicleRecord) => void;
}

const EnhancedVehicleCard = ({ record, onViewDetails }: EnhancedVehicleCardProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          color: 'bg-green-500/20 text-green-400 border-green-500/30', 
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Completed'
        };
      case 'in_progress':
        return { 
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', 
          icon: <Wrench className="h-3 w-3" />,
          label: 'In Progress'
        };
      case 'on_hold':
        return { 
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 
          icon: <AlertTriangle className="h-3 w-3" />,
          label: 'On Hold'
        };
      default:
        return { 
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', 
          icon: <Clock className="h-3 w-3" />,
          label: 'Pending'
        };
    }
  };

  const statusConfig = getStatusConfig(record.completion_status);

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg gradient-blue-subtle">
              <Car className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">
                {record.vehicle_year} {record.vehicle_make} {record.vehicle_model}
              </CardTitle>
              {record.license_plate && (
                <p className="text-sm text-gray-400">Plate: {record.license_plate}</p>
              )}
            </div>
          </div>
          <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer & Work Order Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {record.customer_name && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Customer:</span>
              <span className="text-white">{record.customer_name}</span>
            </div>
          )}
          {record.work_order_number && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">WO#:</span>
              <span className="text-white font-mono">{record.work_order_number}</span>
            </div>
          )}
          {record.mileage && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Mileage:</span>
              <span className="text-white">{record.mileage.toLocaleString()} mi</span>
            </div>
          )}
          {record.alignment_type && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Type:</span>
              <span className="text-white capitalize">{record.alignment_type.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        {/* Technician & Service Advisor */}
        {(record.technician_name || record.service_advisor) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2 border-t border-slate-700">
            {record.technician_name && (
              <div>
                <span className="text-gray-400">Technician:</span>
                <p className="text-white">{record.technician_name}</p>
              </div>
            )}
            {record.service_advisor && (
              <div>
                <span className="text-gray-400">Advisor:</span>
                <p className="text-white">{record.service_advisor}</p>
              </div>
            )}
          </div>
        )}

        {/* Date and Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{new Date(record.created_at).toLocaleDateString()}</span>
          </div>
          <Button 
            onClick={() => onViewDetails(record)}
            variant="outline" 
            size="sm"
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
          >
            <Wrench className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedVehicleCard;
