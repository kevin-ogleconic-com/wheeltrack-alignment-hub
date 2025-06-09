
import { Card, CardContent } from '@/components/ui/card';
import { Database, Car, Settings, User } from 'lucide-react';

interface DashboardStatsProps {
  totalRecords: number;
  thisMonthRecords: number;
  completedRecords: number;
  pendingRecords: number;
}

const DashboardStats = ({
  totalRecords,
  thisMonthRecords,
  completedRecords,
  pendingRecords
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Records</p>
              <p className="text-2xl font-bold text-white">{totalRecords}</p>
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
              <p className="text-2xl font-bold text-white">{thisMonthRecords}</p>
            </div>
            <Car className="h-5 w-5 text-green-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{completedRecords}</p>
            </div>
            <Settings className="h-5 w-5 text-purple-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{pendingRecords}</p>
            </div>
            <User className="h-5 w-5 text-yellow-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
