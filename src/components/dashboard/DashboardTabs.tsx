
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Database, Smartphone } from 'lucide-react';
import AlignmentRecordsTab from './AlignmentRecordsTab';
import VehicleSpecificationLookup from '../VehicleSpecificationLookup';
import DeviceManagement from '../DeviceManagement';

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

interface DashboardTabsProps {
  records: AlignmentRecord[];
  loading: boolean;
  onShowForm: () => void;
  onViewDetails: (record: AlignmentRecord) => void;
}

const DashboardTabs = ({ 
  records, 
  loading, 
  onShowForm, 
  onViewDetails 
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="records" className="space-y-6">
      <TabsList className="bg-slate-800 border-slate-700">
        <TabsTrigger value="records" className="data-[state=active]:bg-slate-700">
          <Car className="h-4 w-4 mr-2" />
          Alignment Records
        </TabsTrigger>
        <TabsTrigger value="specifications" className="data-[state=active]:bg-slate-700">
          <Database className="h-4 w-4 mr-2" />
          Vehicle Specifications
        </TabsTrigger>
        <TabsTrigger value="devices" className="data-[state=active]:bg-slate-700">
          <Smartphone className="h-4 w-4 mr-2" />
          Device Management
        </TabsTrigger>
      </TabsList>

      <TabsContent value="records">
        <AlignmentRecordsTab 
          records={records}
          loading={loading}
          onShowForm={onShowForm}
          onViewDetails={onViewDetails}
        />
      </TabsContent>

      <TabsContent value="specifications">
        <VehicleSpecificationLookup />
      </TabsContent>

      <TabsContent value="devices">
        <DeviceManagement />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
