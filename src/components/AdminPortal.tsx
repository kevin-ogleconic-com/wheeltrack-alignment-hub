
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Shield, Database, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  created_at: string;
}

interface AlignmentRecord {
  id: string;
  user_id: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  customer_name?: string;
  created_at: string;
  user_email?: string;
}

const AdminPortal = ({ onBack }: { onBack: () => void }) => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [records, setRecords] = useState<AlignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = userRole === 'admin';
  const canViewData = userRole === 'admin' || userRole === 'technical_support';

  const fetchUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id, 
          email, 
          first_name, 
          last_name, 
          created_at,
          user_roles!inner(role)
        `);

      if (profilesError) throw profilesError;

      const usersWithRoles = profilesData?.map(profile => ({
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        created_at: profile.created_at,
        role: profile.user_roles[0]?.role || 'standard_user'
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive"
      });
    }
  };

  const fetchAllRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('alignment_records')
        .select(`
          id,
          user_id,
          vehicle_make,
          vehicle_model,
          vehicle_year,
          customer_name,
          created_at,
          profiles!inner(email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const recordsWithEmails = data?.map(record => ({
        ...record,
        user_email: record.profiles?.email
      })) || [];

      setRecords(recordsWithEmails);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast({
        title: "Error",
        description: "Failed to load alignment records.",
        variant: "destructive"
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully."
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (canViewData) {
        await Promise.all([
          fetchUsers(),
          fetchAllRecords()
        ]);
      }
      setLoading(false);
    };

    loadData();
  }, [canViewData]);

  if (!canViewData) {
    return (
      <div className="min-h-screen pt-20 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400 mb-4">You don't have permission to access the admin portal.</p>
            <Button onClick={onBack} variant="outline" className="border-slate-600 text-gray-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400">Manage users, roles, and view system data</p>
          </div>
          <Button onClick={onBack} variant="outline" className="border-slate-600 text-gray-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-slate-700">
              <Database className="h-4 w-4 mr-2" />
              Alignment Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Loading users...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div 
                        key={user.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                      >
                        <div className="mb-3 sm:mb-0">
                          <p className="text-white font-medium">{user.email}</p>
                          {(user.first_name || user.last_name) && (
                            <p className="text-gray-400 text-sm">
                              {user.first_name} {user.last_name}
                            </p>
                          )}
                          <p className="text-gray-400 text-sm">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                            user.role === 'technical_support' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {user.role.replace('_', ' ').toUpperCase()}
                          </span>
                          {isAdmin && (
                            <Select
                              value={user.role}
                              onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                            >
                              <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard_user">Standard User</SelectItem>
                                <SelectItem value="technical_support">Technical Support</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">All Alignment Records</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Loading records...</p>
                  </div>
                ) : records.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No alignment records found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {records.map((record) => (
                      <div 
                        key={record.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {record.vehicle_year} {record.vehicle_make} {record.vehicle_model}
                          </p>
                          <p className="text-blue-400 text-sm">{record.user_email}</p>
                          {record.customer_name && (
                            <p className="text-gray-400 text-sm">Customer: {record.customer_name}</p>
                          )}
                          <p className="text-gray-400 text-sm">
                            {new Date(record.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;
