
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, User, Clock, Wrench, FileText, Target, TrendingUp, X } from "lucide-react";

interface VehicleRecord {
  id: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  customer_name?: string;
  customer_phone?: string;
  license_plate?: string;
  vin?: string;
  mileage?: number;
  completion_status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  alignment_type?: string;
  technician_name?: string;
  service_advisor?: string;
  work_order_number?: string;
  notes?: string;
  created_at: string;
  before_measurements?: any;
  after_measurements?: any;
  specifications?: any;
  front_left_toe?: number;
  front_right_toe?: number;
  rear_left_toe?: number;
  rear_right_toe?: number;
  front_left_camber?: number;
  front_right_camber?: number;
  rear_left_camber?: number;
  rear_right_camber?: number;
  front_left_caster?: number;
  front_right_caster?: number;
}

interface VehicleDetailModalProps {
  record: VehicleRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

const VehicleDetailModal = ({ record, isOpen, onClose }: VehicleDetailModalProps) => {
  if (!record) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-500/20 text-green-400', label: 'Completed' };
      case 'in_progress':
        return { color: 'bg-blue-500/20 text-blue-400', label: 'In Progress' };
      case 'on_hold':
        return { color: 'bg-yellow-500/20 text-yellow-400', label: 'On Hold' };
      default:
        return { color: 'bg-gray-500/20 text-gray-400', label: 'Pending' };
    }
  };

  const statusConfig = getStatusConfig(record.completion_status);

  const MeasurementRow = ({ label, value, unit = "°" }: { label: string; value?: number; unit?: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
      <span className="text-gray-400">{label}:</span>
      <span className="text-white font-mono">
        {value !== undefined ? `${value}${unit}` : 'N/A'}
      </span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-white">
              {record.vehicle_year} {record.vehicle_make} {record.vehicle_model}
            </DialogTitle>
            <Badge className={statusConfig.color}>
              {statusConfig.label}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vehicle Information */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Make:</span>
                      <p className="text-white">{record.vehicle_make}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Model:</span>
                      <p className="text-white">{record.vehicle_model}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Year:</span>
                      <p className="text-white">{record.vehicle_year}</p>
                    </div>
                    {record.license_plate && (
                      <div>
                        <span className="text-gray-400">License Plate:</span>
                        <p className="text-white">{record.license_plate}</p>
                      </div>
                    )}
                    {record.vin && (
                      <div className="col-span-2">
                        <span className="text-gray-400">VIN:</span>
                        <p className="text-white font-mono">{record.vin}</p>
                      </div>
                    )}
                    {record.mileage && (
                      <div>
                        <span className="text-gray-400">Mileage:</span>
                        <p className="text-white">{record.mileage.toLocaleString()} mi</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer & Service Information */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Service Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    {record.customer_name && (
                      <div>
                        <span className="text-gray-400">Customer:</span>
                        <p className="text-white">{record.customer_name}</p>
                      </div>
                    )}
                    {record.customer_phone && (
                      <div>
                        <span className="text-gray-400">Phone:</span>
                        <p className="text-white">{record.customer_phone}</p>
                      </div>
                    )}
                    {record.work_order_number && (
                      <div>
                        <span className="text-gray-400">Work Order:</span>
                        <p className="text-white font-mono">{record.work_order_number}</p>
                      </div>
                    )}
                    {record.technician_name && (
                      <div>
                        <span className="text-gray-400">Technician:</span>
                        <p className="text-white">{record.technician_name}</p>
                      </div>
                    )}
                    {record.service_advisor && (
                      <div>
                        <span className="text-gray-400">Service Advisor:</span>
                        <p className="text-white">{record.service_advisor}</p>
                      </div>
                    )}
                    {record.alignment_type && (
                      <div>
                        <span className="text-gray-400">Alignment Type:</span>
                        <p className="text-white capitalize">{record.alignment_type.replace('_', ' ')}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Date Created:</span>
                      <p className="text-white">{new Date(record.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="measurements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Toe Measurements */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Toe Measurements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MeasurementRow label="Front Left Toe" value={record.front_left_toe} />
                  <MeasurementRow label="Front Right Toe" value={record.front_right_toe} />
                  <MeasurementRow label="Rear Left Toe" value={record.rear_left_toe} />
                  <MeasurementRow label="Rear Right Toe" value={record.rear_right_toe} />
                </CardContent>
              </Card>

              {/* Camber Measurements */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Camber Measurements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MeasurementRow label="Front Left Camber" value={record.front_left_camber} />
                  <MeasurementRow label="Front Right Camber" value={record.front_right_camber} />
                  <MeasurementRow label="Rear Left Camber" value={record.rear_left_camber} />
                  <MeasurementRow label="Rear Right Camber" value={record.rear_right_camber} />
                </CardContent>
              </Card>

              {/* Caster Measurements */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Caster Measurements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MeasurementRow label="Front Left Caster" value={record.front_left_caster} />
                  <MeasurementRow label="Front Right Caster" value={record.front_right_caster} />
                  <div className="py-2 border-b border-slate-700/50">
                    <span className="text-gray-400 text-sm">Rear caster not applicable</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-4">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Manufacturer Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center py-8">
                  Manufacturer specifications will be displayed here when available.
                  <br />
                  Integration with vehicle specification database coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Service Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {record.notes ? (
                  <p className="text-white whitespace-pre-wrap">{record.notes}</p>
                ) : (
                  <p className="text-gray-400 text-center py-4">No notes available for this service.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline" className="border-slate-600 text-gray-300">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailModal;
