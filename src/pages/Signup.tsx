
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Mail, Lock, User, Smartphone } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceUIDFromURL, setDeviceUIDFromURL] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Read UID and plan from URL on page load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    const plan = queryParams.get('plan');
    
    if (uid) {
      setDeviceUIDFromURL(uid);
      toast({
        title: "Device Found",
        description: `Found device UID: ${uid}. Please sign up to link it to your account.`,
      });
    }
    
    if (plan) {
      setSelectedPlan(plan);
      toast({
        title: "Plan Selected",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan selected.`,
      });
    }
  }, [location.search, toast]);

  // Auto-link device if user is already logged in
  useEffect(() => {
    async function checkUserAndLink() {
      if (user && deviceUIDFromURL) {
        await linkDeviceToUser();
      }
    }
    checkUserAndLink();
  }, [user, deviceUIDFromURL]);

  const linkDeviceToUser = async () => {
    if (!deviceUIDFromURL) return;
    
    try {
      const { data, error } = await supabase.rpc('assign_device_to_user', { 
        device_uid: deviceUIDFromURL 
      });
      
      if (error) throw error;

      toast({
        title: "Device Linked!",
        description: `Device ${deviceUIDFromURL} successfully linked to your account.`,
      });
      
      console.log('Device assigned:', data);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Device linking error:', error.message);
      toast({
        title: "Device Linking Failed",
        description: error.message || 'Failed to link device to your account.',
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName
      });
      
      if (error) {
        console.error('Sign up error:', error);
        
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account already exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive"
          });
          navigate('/auth');
        } else {
          toast({
            title: "Error creating account",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Account created!",
          description: deviceUIDFromURL 
            ? "Please check your email to verify your account. Once verified, your device will be linked automatically."
            : "Please check your email to verify your account, then try signing in.",
          duration: 5000
        });
        
        // If there's a device UID, we'll link it after email verification
        if (!deviceUIDFromURL) {
          navigate('/auth');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-lg gradient-blue">
              {deviceUIDFromURL ? (
                <Smartphone className="h-8 w-8 text-white" />
              ) : (
                <Car className="h-8 w-8 text-white" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            {deviceUIDFromURL ? 'Sign Up & Link Device' : 'Create Your Account'}
          </CardTitle>
          {deviceUIDFromURL && (
            <p className="text-gray-400 text-sm">Device UID: {deviceUIDFromURL}</p>
          )}
          {selectedPlan && (
            <p className="text-blue-400 text-sm">
              {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan Selected
            </p>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-blue text-white border-0 hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">Already have an account?</p>
            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="text-blue-400 hover:text-blue-300"
            >
              Sign in instead
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
