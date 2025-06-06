
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Mail, Lock, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isAdminSignup = email === 'kevin@ogleconic.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting to sign in with:', email);
        const { error } = await signIn(email, password);
        if (error) {
          console.error('Sign in error:', error);
          
          // Provide more specific error messages
          if (error.message.includes('Invalid login credentials')) {
            if (email === 'kevin@ogleconic.com') {
              toast({
                title: "Admin login issue",
                description: "Please ensure you're using 'qadmin' as the password. If the account was just created, try refreshing and logging in again.",
                variant: "destructive",
                duration: 7000
              });
            } else {
              toast({
                title: "Invalid credentials",
                description: "Please check your email and password. If you just signed up, you may need to verify your email first.",
                variant: "destructive"
              });
            }
          } else {
            toast({
              title: "Error signing in",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in."
          });
          navigate('/dashboard');
        }
      } else {
        console.log('Attempting to sign up with:', email);
        
        if (isAdminSignup && password !== 'qadmin') {
          toast({
            title: "Invalid admin credentials",
            description: "Please use the correct initial admin password: qadmin",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const { error } = await signUp(email, password, {
          first_name: firstName || (isAdminSignup ? 'Kevin' : ''),
          last_name: lastName || (isAdminSignup ? 'Admin' : '')
        });
        
        if (error) {
          console.error('Sign up error:', error);
          
          // Handle specific error cases
          if (error.message.includes('User already registered')) {
            toast({
              title: "Account already exists",
              description: "This email is already registered. Switching to login mode - try signing in.",
              variant: "destructive"
            });
            setIsLogin(true); // Switch to login mode
          } else if (error.message.includes('Signup disabled')) {
            toast({
              title: "Signup temporarily disabled",
              description: "Please contact support or try again later.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Error creating account",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          if (isAdminSignup) {
            toast({
              title: "Admin account ready!",
              description: "Account created successfully. You can now sign in with your admin credentials.",
              duration: 5000
            });
            // Auto-switch to login for admin
            setIsLogin(true);
            setPassword('qadmin'); // Keep the correct password
          } else {
            toast({
              title: "Account created!",
              description: "Please check your email to verify your account, then try signing in.",
              duration: 5000
            });
          }
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

  const handleQuickAdminSetup = () => {
    setEmail('kevin@ogleconic.com');
    setPassword('qadmin');
    setFirstName('Kevin');
    setLastName('Admin');
    setIsLogin(false);
  };

  const handleQuickAdminLogin = () => {
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
              {isAdminSignup ? (
                <Shield className="h-8 w-8 text-white" />
              ) : (
                <Car className="h-8 w-8 text-white" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            {isAdminSignup ? 'Admin Access' : (isLogin ? 'Sign In' : 'Create Account')}
          </CardTitle>
          {isAdminSignup && (
            <p className="text-gray-400 text-sm">Admin portal access</p>
          )}
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
                      placeholder="John"
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
                      placeholder="Doe"
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
                  placeholder={isAdminSignup ? "kevin@ogleconic.com" : "john@example.com"}
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
                  placeholder={isAdminSignup ? "qadmin" : "••••••••"}
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
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </div>

          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 text-sm font-medium">Admin Access:</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleQuickAdminSetup}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-xs"
                >
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleQuickAdminLogin}
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

export default AuthPage;
