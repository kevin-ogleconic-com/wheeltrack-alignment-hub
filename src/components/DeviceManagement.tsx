
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Plus, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DeviceUID {
  id: string;
  uid_96bit: string;
  device_name: string | null;
  is_active: boolean;
  last_authenticated_at: string | null;
  created_at: string;
}

const DeviceManagement = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [devices, setDevices] = useState<DeviceUID[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDevice, setNewDevice] = useState({
    uid_96bit: '',
    device_name: ''
  });

  const fetchDevices = async () => {
    if (!user) return;

    try {
      // Use the raw query approach directly since device_uids table is not in types
      const response = await fetch(`https://jsiwxyffmoktxouniklx.supabase.co/rest/v1/device_uids?owner_user_id=eq.${user.id}&order=created_at.desc`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzaXd4eWZmbW9rdHhvdW5pa2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODE1NTAsImV4cCI6MjA2Mzg1NzU1MH0.USd8B04xm2XOqyNtR2wQkjzww6WEa-6eers63zmCNmw',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }

      const deviceData = await response.json();
      setDevices(deviceData || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast({
        title: "Error",
        description: "Failed to load devices.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [user]);

  const validateUID = (uid: string) => {
    // Remove any spaces or hyphens for validation
    const cleanUID = uid.replace(/[\s-]/g, '');
    // Check if it's exactly 24 hex characters (96 bits)
    return /^[0-9A-Fa-f]{24}$/.test(cleanUID);
  };

  const formatUID = (uid: string) => {
    // Format as groups of 4 characters for better readability
    const cleanUID = uid.replace(/[\s-]/g, '');
    return cleanUID.match(/.{1,4}/g)?.join('-') || uid;
  };

  const handleAddDevice = async () => {
    if (!newDevice.uid_96bit || !newDevice.device_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const cleanUID = newDevice.uid_96bit.replace(/[\s-]/g, '');
    
    if (!validateUID(cleanUID)) {
      toast({
        title: "Invalid UID",
        description: "UID must be exactly 24 hexadecimal characters (96 bits).",
        variant: "destructive"
      });
      return;
    }

    try {
      // Use raw HTTP request to avoid type issues
      const response = await fetch(`https://jsiwxyffmoktxouniklx.supabase.co/rest/v1/device_uids`, {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzaXd4eWZmbW9rdHhvdW5pa2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODE1NTAsImV4cCI6MjA2Mzg1NzU1MH0.USd8B04xm2XOqyNtR2wQkjzww6WEa-6eers63zmCNmw',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          uid_96bit: cleanUID,
          device_name: newDevice.device_name,
          owner_user_id: user?.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409 || errorData.code === '23505') {
          toast({
            title: "Device Already Exists",
            description: "This UID is already registered.",
            variant: "destructive"
          });
        } else {
          throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
        }
        return;
      }

      toast({
        title: "Device Added",
        description: "Device has been successfully registered."
      });

      setNewDevice({ uid_96bit: '', device_name: '' });
      setShowAddDialog(false);
      fetchDevices();
    } catch (error) {
      console.error('Error adding device:', error);
      toast({
        title: "Error",
        description: "Failed to add device.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`https://jsiwxyffmoktxouniklx.supabase.co/rest/v1/device_uids?id=eq.${deviceId}`, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzaXd4eWZmbW9rdHhvdW5pa2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODE1NTAsImV4cCI6MjA2Mzg1NzU1MH0.USd8B04xm2XOqyNtR2wQkjzww6WEa-6eers63zmCNmw',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      toast({
        title: "Device Removed",
        description: "Device has been successfully removed."
      });

      fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
      toast({
        title: "Error",
        description: "Failed to remove device.",
        variant: "destructive"
      });
    }
  };

  const toggleDeviceStatus = async (deviceId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`https://jsiwxyffmoktxouniklx.supabase.co/rest/v1/device_uids?id=eq.${deviceId}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzaXd4eWZmbW9rdHhvdW5pa2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODE1NTAsImV4cCI6MjA2Mzg1NzU1MH0.USd8B04xm2XOqyNtR2wQkjzww6WEa-6eers63zmCNmw',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          is_active: !currentStatus
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      toast({
        title: currentStatus ? "Device Deactivated" : "Device Activated",
        description: `Device has been ${currentStatus ? 'deactivated' : 'activated'}.`
      });

      fetchDevices();
    } catch (error) {
      console.error('Error updating device status:', error);
      toast({
        title: "Error",
        description: "Failed to update device status.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (device: DeviceUID) => {
    if (!device.is_active) {
      return (
        <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
          <AlertCircle className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      );
    }
    
    if (device.last_authenticated_at) {
      const lastAuth = new Date(device.last_authenticated_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastAuth.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 1) {
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Online
          </Badge>
        );
      }
    }
    
    return (
      <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
        <Clock className="h-3 w-3 mr-1" />
        Ready
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading devices...</p>
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-6 w-6 text-blue-400" />
            <CardTitle className="text-white">Device Management</CardTitle>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gradient-blue text-white border-0 hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Register New Device</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Add a new device by entering its 96-bit UID and a descriptive name.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="device_name" className="text-gray-300">Device Name</Label>
                  <Input
                    id="device_name"
                    placeholder="e.g., Shop Alignment Machine #1"
                    value={newDevice.device_name}
                    onChange={(e) => setNewDevice({ ...newDevice, device_name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="uid_96bit" className="text-gray-300">96-bit UID</Label>
                  <Input
                    id="uid_96bit"
                    placeholder="e.g., 1A2B3C4D5E6F7890ABCDEF12"
                    value={newDevice.uid_96bit}
                    onChange={(e) => setNewDevice({ ...newDevice, uid_96bit: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter 24 hexadecimal characters (0-9, A-F)
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddDialog(false)}
                    className="border-slate-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddDevice}
                    className="gradient-blue text-white border-0 hover:opacity-90"
                  >
                    Add Device
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {devices.length === 0 ? (
          <div className="text-center py-8">
            <Smartphone className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No devices registered yet</p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="gradient-blue text-white border-0 hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Device
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <Card key={device.id} className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium truncate">
                      {device.device_name || 'Unnamed Device'}
                    </h3>
                    {getStatusBadge(device)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">UID:</span>
                      <p className="text-gray-300 font-mono text-xs break-all">
                        {formatUID(device.uid_96bit)}
                      </p>
                    </div>
                    
                    {device.last_authenticated_at && (
                      <div>
                        <span className="text-gray-400">Last Auth:</span>
                        <p className="text-gray-300">
                          {new Date(device.last_authenticated_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-gray-400">Registered:</span>
                      <p className="text-gray-300">
                        {new Date(device.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleDeviceStatus(device.id, device.is_active)}
                      className="border-slate-500 text-gray-300 hover:bg-slate-600"
                    >
                      {device.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDevice(device.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceManagement;
