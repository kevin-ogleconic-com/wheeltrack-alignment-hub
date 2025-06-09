
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AlignmentRecordForm from './AlignmentRecordForm';
import AdminPortal from './AdminPortal';
import VehicleDetailModal from './VehicleDetailModal';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import DashboardTabs from './dashboard/DashboardTabs';
import { useToast } from '@/hooks/use-toast';

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
        <DashboardHeader
          userEmail={user?.email}
          userRole={userRole}
          canAccessAdmin={canAccessAdmin}
          onShowAdminPortal={() => setShowAdminPortal(true)}
          onShowForm={() => setShowForm(true)}
          onSignOut={handleSignOut}
        />

        <DashboardStats
          totalRecords={totalRecords}
          thisMonthRecords={thisMonthRecords}
          completedRecords={completedRecords}
          pendingRecords={pendingRecords}
        />

        <DashboardTabs
          records={records}
          loading={loading}
          onShowForm={() => setShowForm(true)}
          onViewDetails={handleViewDetails}
        />

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
