
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Car, Save } from 'lucide-react';

interface AlignmentRecordFormProps {
  onSaved?: () => void;
  onCancel?: () => void;
}

const AlignmentRecordForm = ({ onSaved, onCancel }: AlignmentRecordFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: new Date().getFullYear(),
    vin: '',
    customer_name: '',
    customer_phone: '',
    front_left_toe: '',
    front_right_toe: '',
    rear_left_toe: '',
    rear_right_toe: '',
    front_left_camber: '',
    front_right_camber: '',
    rear_left_camber: '',
    rear_right_camber: '',
    front_left_caster: '',
    front_right_caster: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      const recordData = {
        user_id: user.id,
        ...formData,
        // Convert string measurements to numbers where they exist
        front_left_toe: formData.front_left_toe ? parseFloat(formData.front_left_toe) : null,
        front_right_toe: formData.front_right_toe ? parseFloat(formData.front_right_toe) : null,
        rear_left_toe: formData.rear_left_toe ? parseFloat(formData.rear_left_toe) : null,
        rear_right_toe: formData.rear_right_toe ? parseFloat(formData.rear_right_toe) : null,
        front_left_camber: formData.front_left_camber ? parseFloat(formData.front_left_camber) : null,
        front_right_camber: formData.front_right_camber ? parseFloat(formData.front_right_camber) : null,
        rear_left_camber: formData.rear_left_camber ? parseFloat(formData.rear_left_camber) : null,
        rear_right_camber: formData.rear_right_camber ? parseFloat(formData.rear_right_camber) : null,
        front_left_caster: formData.front_left_caster ? parseFloat(formData.front_left_caster) : null,
        front_right_caster: formData.front_right_caster ? parseFloat(formData.front_right_caster) : null,
      };

      const { error } = await supabase
        .from('alignment_records')
        .insert([recordData]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Alignment record saved successfully."
      });

      onSaved?.();
    } catch (error) {
      console.error('Error saving alignment record:', error);
      toast({
        title: "Error",
        description: "Failed to save alignment record. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Car className="h-5 w-5" />
          New Alignment Record
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make" className="text-gray-300">Make</Label>
                <Input
                  id="make"
                  type="text"
                  placeholder="Toyota"
                  value={formData.vehicle_make}
                  onChange={(e) => handleInputChange('vehicle_make', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="text-gray-300">Model</Label>
                <Input
                  id="model"
                  type="text"
                  placeholder="Camry"
                  value={formData.vehicle_model}
                  onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-gray-300">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.vehicle_year}
                  onChange={(e) => handleInputChange('vehicle_year', parseInt(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vin" className="text-gray-300">VIN (Optional)</Label>
                <Input
                  id="vin"
                  type="text"
                  placeholder="1HGBH41JXMN109186"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name" className="text-gray-300">Customer Name</Label>
                <Input
                  id="customer_name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_phone" className="text-gray-300">Phone Number</Label>
                <Input
                  id="customer_phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.customer_phone}
                  onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Alignment Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Alignment Measurements (Degrees)</h3>
            
            {/* Toe Measurements */}
            <div>
              <h4 className="text-md font-medium text-gray-300 mb-3">Toe Measurements</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Front Left</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.12"
                    value={formData.front_left_toe}
                    onChange={(e) => handleInputChange('front_left_toe', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Front Right</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.08"
                    value={formData.front_right_toe}
                    onChange={(e) => handleInputChange('front_right_toe', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Rear Left</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="-0.08"
                    value={formData.rear_left_toe}
                    onChange={(e) => handleInputChange('rear_left_toe', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Rear Right</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.25"
                    value={formData.rear_right_toe}
                    onChange={(e) => handleInputChange('rear_right_toe', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Camber Measurements */}
            <div>
              <h4 className="text-md font-medium text-gray-300 mb-3">Camber Measurements</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Front Left</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.15"
                    value={formData.front_left_camber}
                    onChange={(e) => handleInputChange('front_left_camber', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Front Right</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="-0.35"
                    value={formData.front_right_camber}
                    onChange={(e) => handleInputChange('front_right_camber', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Rear Left</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.22"
                    value={formData.rear_left_camber}
                    onChange={(e) => handleInputChange('rear_left_camber', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Rear Right</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.45"
                    value={formData.rear_right_camber}
                    onChange={(e) => handleInputChange('rear_right_camber', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Caster Measurements */}
            <div>
              <h4 className="text-md font-medium text-gray-300 mb-3">Caster Measurements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Front Left</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="3.2"
                    value={formData.front_left_caster}
                    onChange={(e) => handleInputChange('front_left_caster', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Front Right</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="3.8"
                    value={formData.front_right_caster}
                    onChange={(e) => handleInputChange('front_right_caster', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about the alignment..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              className="gradient-blue text-white border-0 hover:opacity-90 flex-1"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Record'}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                className="border-slate-600 text-gray-300 hover:bg-slate-700 flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AlignmentRecordForm;
