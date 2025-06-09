
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EnhancedVehicleCard from '../EnhancedVehicleCard';
import { Car, Plus } from 'lucide-react';

interface AlignmentRecord {
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

interface AlignmentRecordsTabProps {
  records: AlignmentRecord[];
  loading: boolean;
  onShowForm: () => void;
  onViewDetails: (record: AlignmentRecord) => void;
}

const AlignmentRecordsTab = ({ 
  records, 
  loading, 
  onShowForm, 
  onViewDetails 
}: AlignmentRecordsTabProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Alignment Records</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8">
            <Car className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No alignment records yet</p>
            <Button 
              onClick={onShowForm}
              className="gradient-blue text-white border-0 hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Record
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {records.map((record) => (
              <EnhancedVehicleCard 
                key={record.id} 
                record={record}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlignmentRecordsTab;
