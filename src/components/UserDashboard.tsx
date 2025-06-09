
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import AlignmentRecordForm from './AlignmentRecordForm';
import AdminPortal from './AdminPortal';
import EnhancedVehicleCard from './EnhancedVehicleCard';
import VehicleDetailModal from './VehicleDetailModal';
import VehicleSpecificationLookup from './VehicleSpecificationLookup';
import DeviceManagement from './DeviceManagement';
import { Car, Plus, Database, User, LogOut, Shield, Settings, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const UserDashboard = () => {
  const { user, userRole, signOut } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<AlignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AlignmentRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const canAccessAdmin = userRole === 'admin' || userRole === 'technical_support';

  const fetchRecords = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching alignment records for user:', user.id);
      const { data, error } = await supabase
        .from('alignment_records')
        .select(`
          id, vehicle_make, vehicle_model, vehicle_year, customer_name, customer_phone,
          license_plate, vin, mileage, completion_status, alignment_type, technician_name,
          service_advisor, work_order_number, notes, created_at, before_measurements,
          after_measurements, specifications, front_left_toe, front_right_toe,
          rear_left_toe, rear_right_toe, front_left_camber, front_right_camber,
          rear_left_camber, rear_right_camber, front_left_caster, front_right_caster
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched records:', data);
      
      // Type assertion to ensure completion_status matches our expected union type
      const typedData = (data || []).map(record => ({
        ...record,
        completion_status: (record.completion_status || 'pending') as 'pending' | 'in_progress' | 'completed' | 'on_hold'
      }));
      
      setRecords(typedData);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast({
        title: "Error",
        description: "Failed to load alignment records.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleRecordSaved = () => {
    setShowForm(false);
    fetchRecords();
  };

  const handleViewDetails = (record: AlignmentRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out."
    });
  };

  if (showAdminPortal) {
    return <AdminPortal onBack={() => setShowAdminPortal(false)} />;
  }

  if (showForm) {
    return (
      <div className="min-h-screen pt-20 p-4">
        <div className="container mx-auto max-w-4xl">
          <AlignmentRecordForm 
            onSaved={handleRecordSaved}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  // Dashboard Statistics
  const totalRecords = records.length;
  const thisMonthRecords = records.filter(r => 
    new Date(r.created_at).getMonth() === new Date().getMonth()
  ).length;
  const completedRecords = records.filter(r => r.completion_status === 'completed').length;
  const pendingRecords = records.filter(r => r.completion_status === 'pending').length;

  console.log('Dashboard stats:', { totalRecords, thisMonthRecords, completedRecords, pendingRecords });

  return (
    <div className="min-h-screen pt-20 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <div className="flex items-center gap-2">
              <p className="text-gray-400">Welcome back, {user?.email}</p>
              {userRole && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  userRole === 'admin' ? 'bg-red-500/20 text-red-400' :
                  userRole === 'technical_support' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {userRole.replace('_', ' ').toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {canAccessAdmin && (
              <Button 
                onClick={() => setShowAdminPortal(true)}
                className="gradient-blue text-white border-0 hover:opacity-90"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Portal
              </Button>
            )}
            <Button 
              onClick={() => setShowForm(true)}
              className="gradient-blue text-white border-0 hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Records</p>
                  <p className="text-2xl font-bold text-white">{totalRecords}</p>
                </div>
                <Database className="h-5 w-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">{thisMonthRecords}</p>
                </div>
                <Car className="h-5 w-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-white">{completedRecords}</p>
                </div>
                <Settings className="h-5 w-5 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-white">{pendingRecords}</p>
                </div>
                <User className="h-5 w-5 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
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
                      onClick={() => setShowForm(true)}
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
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications">
            <VehicleSpecificationLookup />
          </TabsContent>

          <TabsContent value="devices">
            <DeviceManagement />
          </TabsContent>
        </Tabs>

        {/* Vehicle Detail Modal */}
        <VehicleDetailModal 
          record={selectedRecord}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRecord(null);
          }}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
