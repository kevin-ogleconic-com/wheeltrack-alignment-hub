
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TestTube, CheckCircle, XCircle } from 'lucide-react';

const DeviceAuthTest = () => {
  const { toast } = useToast();
  const [testUID, setTestUID] = useState('');
  const [testing, setTesting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const testDeviceAuth = async () => {
    if (!testUID) {
      toast({
        title: "Validation Error",
        description: "Please enter a UID to test.",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('device-auth', {
        body: { uid_96bit: testUID }
      });

      if (error) {
        console.error('Function error:', error);
        setLastResult({ 
          success: false, 
          error: error.message || 'Unknown error',
          timestamp: new Date().toLocaleString()
        });
        return;
      }

      setLastResult({ 
        success: data.is_valid, 
        data,
        timestamp: new Date().toLocaleString()
      });

      if (data.is_valid) {
        toast({
          title: "Authentication Successful",
          description: `Device ${data.device_name || 'Unknown'} authenticated successfully.`
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: data.message || "Device authentication failed.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Test error:', error);
      setLastResult({ 
        success: false, 
        error: 'Network or function error',
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <TestTube className="h-6 w-6 text-blue-400" />
          <CardTitle className="text-white">Device Auth Test</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="test_uid" className="text-gray-300">Test UID</Label>
          <Input
            id="test_uid"
            placeholder="Enter 96-bit UID to test"
            value={testUID}
            onChange={(e) => setTestUID(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white font-mono"
          />
        </div>

        <Button 
          onClick={testDeviceAuth}
          disabled={testing}
          className="w-full gradient-blue text-white border-0 hover:opacity-90"
        >
          {testing ? 'Testing...' : 'Test Authentication'}
        </Button>

        {lastResult && (
          <div className={`p-3 rounded border ${
            lastResult.success 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-red-500/20 border-red-500/30'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {lastResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                lastResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {lastResult.success ? 'Success' : 'Failed'}
              </span>
            </div>
            
            <div className="text-xs text-gray-300 space-y-1">
              <p>Time: {lastResult.timestamp}</p>
              {lastResult.data && (
                <>
                  <p>Message: {lastResult.data.message}</p>
                  {lastResult.data.device_name && (
                    <p>Device: {lastResult.data.device_name}</p>
                  )}
                </>
              )}
              {lastResult.error && (
                <p>Error: {lastResult.error}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceAuthTest;
