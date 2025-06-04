
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Database, Plus } from 'lucide-react';

interface VehicleSpec {
  id: string;
  make: string;
  model: string;
  year: number;
  trim_level?: string;
  front_toe_min?: number;
  front_toe_max?: number;
  front_camber_min?: number;
  front_camber_max?: number;
  front_caster_min?: number;
  front_caster_max?: number;
  rear_toe_min?: number;
  rear_toe_max?: number;
  rear_camber_min?: number;
  rear_camber_max?: number;
}

const VehicleSpecificationLookup = () => {
  const { toast } = useToast();
  const [specifications, setSpecifications] = useState<VehicleSpec[]>([]);
  const [filteredSpecs, setFilteredSpecs] = useState<VehicleSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const fetchSpecifications = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_specifications')
        .select('*')
        .order('make', { ascending: true })
        .order('model', { ascending: true })
        .order('year', { ascending: false });

      if (error) throw error;
      setSpecifications(data || []);
      setFilteredSpecs(data || []);
    } catch (error) {
      console.error('Error fetching specifications:', error);
      toast({
        title: "Error",
        description: "Failed to load vehicle specifications.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecifications();
  }, []);

  useEffect(() => {
    let filtered = specifications;

    if (searchTerm) {
      filtered = filtered.filter(spec => 
        spec.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spec.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMake) {
      filtered = filtered.filter(spec => spec.make === selectedMake);
    }

    if (selectedYear) {
      filtered = filtered.filter(spec => spec.year === parseInt(selectedYear));
    }

    setFilteredSpecs(filtered);
  }, [searchTerm, selectedMake, selectedYear, specifications]);

  const uniqueMakes = [...new Set(specifications.map(spec => spec.make))].sort();
  const uniqueYears = [...new Set(specifications.map(spec => spec.year))].sort((a, b) => b - a);

  const SpecificationRow = ({ label, min, max, unit = "°" }: { label: string; min?: number; max?: number; unit?: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-b-0">
      <span className="text-gray-400 text-sm">{label}:</span>
      <span className="text-white font-mono text-sm">
        {min !== undefined && max !== undefined ? `${min}${unit} to ${max}${unit}` : 'N/A'}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5" />
            Vehicle Specification Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search make/model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={selectedMake} onValueChange={setSelectedMake}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Makes</SelectItem>
                {uniqueMakes.map(make => (
                  <SelectItem key={make} value={make}>{make}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Years</SelectItem>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="gradient-blue text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Spec
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Specifications List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading specifications...</p>
        </div>
      ) : filteredSpecs.length === 0 ? (
        <div className="text-center py-8">
          <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No specifications found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSpecs.map((spec) => (
            <Card key={spec.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {spec.year} {spec.make} {spec.model}
                  {spec.trim_level && (
                    <span className="text-gray-400 text-base ml-2">({spec.trim_level})</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Toe Specifications */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Toe Specifications</h4>
                    <div className="space-y-1">
                      <SpecificationRow 
                        label="Front Toe" 
                        min={spec.front_toe_min} 
                        max={spec.front_toe_max} 
                      />
                      <SpecificationRow 
                        label="Rear Toe" 
                        min={spec.rear_toe_min} 
                        max={spec.rear_toe_max} 
                      />
                    </div>
                  </div>

                  {/* Camber Specifications */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Camber Specifications</h4>
                    <div className="space-y-1">
                      <SpecificationRow 
                        label="Front Camber" 
                        min={spec.front_camber_min} 
                        max={spec.front_camber_max} 
                      />
                      <SpecificationRow 
                        label="Rear Camber" 
                        min={spec.rear_camber_min} 
                        max={spec.rear_camber_max} 
                      />
                    </div>
                  </div>

                  {/* Caster Specifications */}
                  <div className="md:col-span-2">
                    <h4 className="text-white font-medium mb-3">Caster Specifications</h4>
                    <div className="space-y-1">
                      <SpecificationRow 
                        label="Front Caster" 
                        min={spec.front_caster_min} 
                        max={spec.front_caster_max} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleSpecificationLookup;
