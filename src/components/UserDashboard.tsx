import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import AlignmentRecordForm from './AlignmentRecordForm';
import AdminPortal from './AdminPortal';
import { Car, Plus, Database, User, LogOut, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlignmentRecord {
  id: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  customer_name: string;
  created_at: string;
}

const UserDashboard = () => {
  const { user, userRole, signOut } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<AlignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  const canAccessAdmin = userRole === 'admin' || userRole === 'technical_support';

  const fetchRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('alignment_records')
        .select('id, vehicle_make, vehicle_model, vehicle_year, customer_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
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

  return (
    <div className="min-h-screen pt-20 p-4">
      <div className="container mx-auto max-w-6xl">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Records</p>
                  <p className="text-2xl font-bold text-white">{records.length}</p>
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
                  <p className="text-2xl font-bold text-white">
                    {records.filter(r => 
                      new Date(r.created_at).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
                <Car className="h-5 w-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Account</p>
                  <p className="text-lg font-bold text-white">Free Plan</p>
                </div>
                <User className="h-5 w-5 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Records List */}
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
              <div className="space-y-4">
                {records.map((record) => (
                  <div 
                    key={record.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                      <div className="p-2 rounded-lg gradient-blue-subtle">
                        <Car className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {record.vehicle_year} {record.vehicle_make} {record.vehicle_model}
                        </p>
                        {record.customer_name && (
                          <p className="text-gray-400 text-sm">Customer: {record.customer_name}</p>
                        )}
                        <p className="text-gray-400 text-sm">
                          {new Date(record.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white w-full sm:w-auto"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
