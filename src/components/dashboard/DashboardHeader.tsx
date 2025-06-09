
import { Button } from '@/components/ui/button';
import { Plus, LogOut, Shield } from 'lucide-react';

interface DashboardHeaderProps {
  userEmail?: string;
  userRole?: string;
  canAccessAdmin: boolean;
  onShowAdminPortal: () => void;
  onShowForm: () => void;
  onSignOut: () => void;
}

const DashboardHeader = ({
  userEmail,
  userRole,
  canAccessAdmin,
  onShowAdminPortal,
  onShowForm,
  onSignOut
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <div className="flex items-center gap-2">
          <p className="text-gray-400">Welcome back, {userEmail}</p>
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
            onClick={onShowAdminPortal}
            className="gradient-blue text-white border-0 hover:opacity-90"
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin Portal
          </Button>
        )}
        <Button 
          onClick={onShowForm}
          className="gradient-blue text-white border-0 hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
        <Button 
          onClick={onSignOut}
          variant="outline"
          className="border-slate-600 text-gray-300 hover:bg-slate-700"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
