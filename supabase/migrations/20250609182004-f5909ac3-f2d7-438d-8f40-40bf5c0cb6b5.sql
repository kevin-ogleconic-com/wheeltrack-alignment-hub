
-- Create devices table for IoT device UID registration
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid VARCHAR(19) UNIQUE NOT NULL, -- Your 19-bit UID
  user_id UUID REFERENCES auth.users(id), -- Links to the authenticated user
  status TEXT DEFAULT 'unassigned', -- e.g., 'unassigned', 'active'
  assigned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own devices" 
  ON public.devices 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can assign unassigned devices to themselves" 
  ON public.devices 
  FOR UPDATE 
  USING (user_id IS NULL);

-- Create function to assign device to user
CREATE OR REPLACE FUNCTION public.assign_device_to_user(device_uid VARCHAR(19))
RETURNS SETOF public.devices AS $$
DECLARE
  current_user_id UUID := auth.uid();
  assigned_device public.devices;
BEGIN
  SELECT * INTO assigned_device
  FROM public.devices
  WHERE uid = device_uid AND user_id IS NULL;

  IF assigned_device IS NULL THEN
    RAISE EXCEPTION 'Device with UID % not found or already assigned.', device_uid;
  END IF;

  UPDATE public.devices
  SET user_id = current_user_id, status = 'active', assigned_at = now()
  WHERE uid = device_uid
  RETURNING * INTO assigned_device;

  RETURN NEXT assigned_device;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.assign_device_to_user(VARCHAR(19)) TO authenticated;
