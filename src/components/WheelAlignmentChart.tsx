
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface AlignmentMeasurement {
  value: number;
  unit: string;
  min: number;
  max: number;
  label: string;
}

interface WheelAlignmentChartProps {
  vehicle: {
    make: string;
    model: string;
    year: number;
    measurements: {
      frontLeftToe: AlignmentMeasurement;
      frontRightToe: AlignmentMeasurement;
      rearLeftToe: AlignmentMeasurement;
      rearRightToe: AlignmentMeasurement;
      frontLeftCamber: AlignmentMeasurement;
      frontRightCamber: AlignmentMeasurement;
      rearLeftCamber: AlignmentMeasurement;
      rearRightCamber: AlignmentMeasurement;
    };
  };
}

const WheelAlignmentChart = ({ vehicle }: WheelAlignmentChartProps) => {
  const isOutOfRange = (measurement: AlignmentMeasurement) => {
    return measurement.value < measurement.min || measurement.value > measurement.max;
  };

  const getWheelColor = (toeMeasurement: AlignmentMeasurement, camberMeasurement: AlignmentMeasurement) => {
    const toeOutOfRange = isOutOfRange(toeMeasurement);
    const camberOutOfRange = isOutOfRange(camberMeasurement);
    
    if (toeOutOfRange || camberOutOfRange) {
      return "#ef4444"; // red-500
    }
    return "#10b981"; // green-500
  };

  const renderWheel = (
    x: number, 
    y: number, 
    toeMeasurement: AlignmentMeasurement, 
    camberMeasurement: AlignmentMeasurement,
    position: string
  ) => {
    const wheelColor = getWheelColor(toeMeasurement, camberMeasurement);
    const isProblematic = isOutOfRange(toeMeasurement) || isOutOfRange(camberMeasurement);
    
    return (
      <g key={position}>
        {/* Wheel circle */}
        <circle
          cx={x}
          cy={y}
          r="25"
          fill={wheelColor}
          stroke={isProblematic ? "#dc2626" : "#059669"}
          strokeWidth="3"
          opacity="0.8"
        />
        
        {/* Rim */}
        <circle
          cx={x}
          cy={y}
          r="15"
          fill="none"
          stroke="#374151"
          strokeWidth="2"
        />
        
        {/* Center hub */}
        <circle
          cx={x}
          cy={y}
          r="5"
          fill="#6b7280"
        />
        
        {/* Toe angle indicator */}
        <line
          x1={x}
          y1={y - 35}
          x2={x + (toeMeasurement.value * 10)}
          y2={y - 35}
          stroke={isOutOfRange(toeMeasurement) ? "#ef4444" : "#3b82f6"}
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
        
        {/* Camber angle indicator */}
        <line
          x1={x - 35}
          y1={y}
          x2={x - 35}
          y2={y - (camberMeasurement.value * 10)}
          stroke={isOutOfRange(camberMeasurement) ? "#ef4444" : "#3b82f6"}
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
        
        {/* Position label */}
        <text
          x={x}
          y={y + 45}
          textAnchor="middle"
          fill="#e5e7eb"
          fontSize="12"
          fontWeight="bold"
        >
          {position}
        </text>
      </g>
    );
  };

  const outOfRangeCount = Object.values(vehicle.measurements).filter(isOutOfRange).length;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg text-white">Wheel Alignment Visualization</CardTitle>
        <div className="flex items-center space-x-2">
          {outOfRangeCount > 0 ? (
            <Badge className="bg-red-500 text-white border-0 flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>{outOfRangeCount} Out of Range</span>
            </Badge>
          ) : (
            <Badge className="bg-green-500 text-white border-0 flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>All in Range</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <svg
            viewBox="0 0 400 300"
            className="w-full h-64 bg-slate-900/50 rounded-lg border border-slate-600"
          >
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#3b82f6"
                />
              </marker>
            </defs>
            
            {/* Vehicle outline */}
            <rect
              x="75"
              y="100"
              width="250"
              height="100"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeDasharray="5,5"
              rx="10"
            />
            
            {/* Vehicle label */}
            <text
              x="200"
              y="150"
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="14"
              fontWeight="bold"
            >
              {vehicle.year} {vehicle.make} {vehicle.model}
            </text>
            
            {/* Render wheels */}
            {renderWheel(100, 75, vehicle.measurements.frontLeftToe, vehicle.measurements.frontLeftCamber, "FL")}
            {renderWheel(300, 75, vehicle.measurements.frontRightToe, vehicle.measurements.frontRightCamber, "FR")}
            {renderWheel(100, 225, vehicle.measurements.rearLeftToe, vehicle.measurements.rearLeftCamber, "RL")}
            {renderWheel(300, 225, vehicle.measurements.rearRightToe, vehicle.measurements.rearRightCamber, "RR")}
            
            {/* Legend */}
            <g>
              <text x="20" y="280" fill="#e5e7eb" fontSize="10" fontWeight="bold">Legend:</text>
              <line x1="70" y1="276" x2="90" y2="276" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="95" y="280" fill="#e5e7eb" fontSize="10">Toe</text>
              <line x1="125" y1="285" x2="125" y2="265" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="130" y="280" fill="#e5e7eb" fontSize="10">Camber</text>
              <circle cx="180" cy="276" r="8" fill="#10b981" opacity="0.8" />
              <text x="195" y="280" fill="#e5e7eb" fontSize="10">In Range</text>
              <circle cx="250" cy="276" r="8" fill="#ef4444" opacity="0.8" />
              <text x="265" y="280" fill="#e5e7eb" fontSize="10">Out of Range</text>
            </g>
          </svg>
        </div>
        
        {/* Detailed measurements table */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Front Wheels</h4>
            {Object.entries(vehicle.measurements)
              .filter(([key]) => key.includes('front'))
              .map(([key, measurement]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                  </span>
                  <span className={`font-mono ${isOutOfRange(measurement) ? 'text-red-400' : 'text-green-400'}`}>
                    {measurement.value.toFixed(2)}{measurement.unit}
                  </span>
                </div>
              ))}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Rear Wheels</h4>
            {Object.entries(vehicle.measurements)
              .filter(([key]) => key.includes('rear'))
              .map(([key, measurement]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                  </span>
                  <span className={`font-mono ${isOutOfRange(measurement) ? 'text-red-400' : 'text-green-400'}`}>
                    {measurement.value.toFixed(2)}{measurement.unit}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WheelAlignmentChart;
