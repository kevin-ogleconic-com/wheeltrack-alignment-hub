
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      const { data, error } = await supabase.rpc('get_user_role', {
        _user_id: userId
      });
      
      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('standard_user'); // Default fallback
        return;
      }
      
      console.log('User role fetched:', data);
      setUserRole(data);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('standard_user'); // Default fallback
    }
  };

  const refreshUserRole = async () => {
    if (user?.id) {
      await fetchUserRole(user.id);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth...');
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }
        
        console.log('AuthProvider: Initial session:', session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        console.log('AuthProvider: Setting loading to false');
        setLoading(false);
      }
    };

    // Set up auth state listener - IMPORTANT: No async function here
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No session');
        
        // Update state synchronously
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle role fetching in a separate microtask to avoid React hook violations
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
        
        // Ensure loading is false after any auth state change
        setLoading(false);
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    console.log('AuthProvider: Signing up user:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });

    // Check if this is the admin user and assign admin role
    if (!error && email === 'kevin@ogleconic.com') {
      console.log('Admin signup detected, will assign admin role...');
      // The trigger will create the user with standard_user role
      // We need to update it to admin role after user creation
      setTimeout(async () => {
        try {
          console.log('Assigning admin role...');
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            console.log('Updating user role to admin for user:', userData.user.id);
            const { error: roleError } = await supabase.from('user_roles').upsert({
              user_id: userData.user.id,
              role: 'admin'
            });
            
            if (roleError) {
              console.error('Error assigning admin role:', roleError);
            } else {
              console.log('Admin role assigned successfully');
            }
          }
        } catch (roleError) {
          console.error('Error assigning admin role:', roleError);
        }
      }, 2000); // Increased timeout to ensure user is created first
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Signing in user:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    console.log('AuthProvider: Signing out user');
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUserRole
  };

  console.log('AuthProvider: Rendering with loading:', loading, 'user:', user?.email || 'No user');

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
