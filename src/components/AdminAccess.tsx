
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminAccess = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('kevin@ogleconic.com');
  const [password, setPassword] = useState('qadmin');
  const [firstName, setFirstName] = useState('Kevin');
  const [lastName, setLastName] = useState('Admin');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting admin sign in with:', email);
        const { error } = await signIn(email, password);
        if (error) {
          console.error('Admin sign in error:', error);
          
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Admin login issue",
              description: "Please ensure you're using 'qadmin' as the password. If the account was just created, try refreshing and logging in again.",
              variant: "destructive",
              duration: 7000
            });
          } else {
            toast({
              title: "Error signing in",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Welcome back, Admin!",
            description: "You've successfully signed in."
          });
          navigate('/dashboard');
        }
      } else {
        console.log('Attempting to create admin account with:', email);
        
        if (password !== 'qadmin') {
          toast({
            title: "Invalid admin credentials",
            description: "Please use the correct initial admin password: qadmin",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName
        });
        
        if (error) {
          console.error('Admin sign up error:', error);
          
          if (error.message.includes('User already registered')) {
            toast({
              title: "Admin account already exists",
              description: "This email is already registered. Switching to login mode - try signing in.",
              variant: "destructive"
            });
            setIsLogin(true);
          } else {
            toast({
              title: "Error creating admin account",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Admin account ready!",
            description: "Account created successfully. You can now sign in with your admin credentials.",
            duration: 5000
          });
          setIsLogin(true);
          setPassword('qadmin');
        }
      }
    } catch (error) {
      console.error('Admin authentication error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSetup = () => {
    setEmail('kevin@ogleconic.com');
    setPassword('qadmin');
    setFirstName('Kevin');
    setLastName('Admin');
    setIsLogin(false);
  };

  const handleQuickLogin = () => {
    setEmail('kevin@ogleconic.com');
    setPassword('qadmin');
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen pt-20 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-lg gradient-blue">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            Admin Access
          </CardTitle>
          <p className="text-gray-400 text-sm">Admin portal access</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Kevin"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      required={!isLogin}
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
                      placeholder="Admin"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="kevin@ogleconic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              {!isLogin && email === 'kevin@ogleconic.com' && (
                <p className="text-yellow-400 text-xs">
                  Creating initial admin account. Use password: qadmin
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="qadmin"
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
              {loading ? 'Please wait...' : (isLogin ? 'Sign In as Admin' : 'Create Admin Account')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Need to create admin account?" : "Already have admin account?"}
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300"
            >
              {isLogin ? 'Create admin account' : 'Sign in as admin'}
            </Button>
          </div>

          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 text-sm font-medium">Quick Setup:</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleQuickSetup}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-xs"
                >
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleQuickLogin}
                  className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white text-xs"
                >
                  Login
                </Button>
              </div>
            </div>
            <p className="text-gray-400 text-xs">
              Email: kevin@ogleconic.com<br />
              Password: qadmin
            </p>
            <p className="text-yellow-400 text-xs mt-1">
              Use "Create" to set up the admin account, then "Login" to access it
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccess;
