
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface DeviceAuthRequest {
  uid_96bit: string;
}

interface DeviceAuthResponse {
  is_valid: boolean;
  device_id?: string;
  device_name?: string;
  owner_user_id?: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { uid_96bit }: DeviceAuthRequest = await req.json();

    if (!uid_96bit) {
      return new Response(
        JSON.stringify({ 
          is_valid: false, 
          message: 'UID is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate UID format (24 hex characters for 96 bits)
    const cleanUID = uid_96bit.replace(/[\s-]/g, '');
    if (!/^[0-9A-Fa-f]{24}$/.test(cleanUID)) {
      console.log(`Invalid UID format: ${cleanUID}`);
      return new Response(
        JSON.stringify({ 
          is_valid: false, 
          message: 'Invalid UID format. Must be 24 hexadecimal characters.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Authenticating device with UID: ${cleanUID}`);

    // Call the authenticate_device_uid function
    const { data: authResult, error: authError } = await supabase
      .rpc('authenticate_device_uid', { _uid_96bit: cleanUID });

    if (authError) {
      console.error('Database error during authentication:', authError);
      return new Response(
        JSON.stringify({ 
          is_valid: false, 
          message: 'Authentication failed' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const deviceAuth = authResult[0];
    console.log('Authentication result:', deviceAuth);

    if (!deviceAuth?.is_valid) {
      return new Response(
        JSON.stringify({ 
          is_valid: false, 
          message: 'Device not found or inactive' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update the last authentication timestamp
    const { error: updateError } = await supabase
      .rpc('update_device_auth_timestamp', { _uid_96bit: cleanUID });

    if (updateError) {
      console.error('Error updating authentication timestamp:', updateError);
      // Don't fail the authentication, just log the error
    }

    const response: DeviceAuthResponse = {
      is_valid: true,
      device_id: deviceAuth.device_id,
      device_name: deviceAuth.device_name,
      owner_user_id: deviceAuth.owner_user_id,
      message: 'Authentication successful'
    };

    console.log(`Device ${cleanUID} authenticated successfully`);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        is_valid: false, 
        message: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
