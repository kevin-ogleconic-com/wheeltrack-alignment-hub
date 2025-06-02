
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VehicleSpecs {
  make: string;
  model: string;
  year: number;
  specifications: {
    frontToe: { min: number; max: number; unit: string };
    rearToe: { min: number; max: number; unit: string };
    frontCamber: { min: number; max: number; unit: string };
    rearCamber: { min: number; max: number; unit: string };
    frontCaster: { min: number; max: number; unit: string };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { make, model, year } = await req.json()

    if (!make || !model || !year) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: make, model, year' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Mock vehicle specifications database
    // In a real implementation, this would connect to a third-party API
    const mockSpecs: Record<string, VehicleSpecs> = {
      'toyota_camry_2022': {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        specifications: {
          frontToe: { min: -0.15, max: 0.15, unit: '°' },
          rearToe: { min: -0.20, max: 0.20, unit: '°' },
          frontCamber: { min: -0.50, max: 0.50, unit: '°' },
          rearCamber: { min: -0.30, max: 0.30, unit: '°' },
          frontCaster: { min: 2.5, max: 4.0, unit: '°' }
        }
      },
      'honda_accord_2021': {
        make: 'Honda',
        model: 'Accord',
        year: 2021,
        specifications: {
          frontToe: { min: -0.12, max: 0.12, unit: '°' },
          rearToe: { min: -0.18, max: 0.18, unit: '°' },
          frontCamber: { min: -0.45, max: 0.45, unit: '°' },
          rearCamber: { min: -0.25, max: 0.25, unit: '°' },
          frontCaster: { min: 2.8, max: 4.2, unit: '°' }
        }
      },
      'ford_f150_2023': {
        make: 'Ford',
        model: 'F-150',
        year: 2023,
        specifications: {
          frontToe: { min: -0.20, max: 0.20, unit: '°' },
          rearToe: { min: -0.25, max: 0.25, unit: '°' },
          frontCamber: { min: -0.60, max: 0.60, unit: '°' },
          rearCamber: { min: -0.40, max: 0.40, unit: '°' },
          frontCaster: { min: 3.0, max: 5.0, unit: '°' }
        }
      }
    }

    // Create lookup key
    const lookupKey = `${make.toLowerCase()}_${model.toLowerCase().replace(/[-\s]/g, '_')}_${year}`
    
    // Find specifications
    let specs = mockSpecs[lookupKey]
    
    // If exact match not found, try to find by make and model for any year
    if (!specs) {
      const genericKey = Object.keys(mockSpecs).find(key => 
        key.startsWith(`${make.toLowerCase()}_${model.toLowerCase().replace(/[-\s]/g, '_')}`)
      )
      if (genericKey) {
        specs = { ...mockSpecs[genericKey], year }
      }
    }

    // If still no specs found, return generic specifications
    if (!specs) {
      specs = {
        make,
        model,
        year,
        specifications: {
          frontToe: { min: -0.15, max: 0.15, unit: '°' },
          rearToe: { min: -0.20, max: 0.20, unit: '°' },
          frontCamber: { min: -0.50, max: 0.50, unit: '°' },
          rearCamber: { min: -0.30, max: 0.30, unit: '°' },
          frontCaster: { min: 2.5, max: 4.0, unit: '°' }
        }
      }
    }

    return new Response(
      JSON.stringify(specs),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in vehicle-specs function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
