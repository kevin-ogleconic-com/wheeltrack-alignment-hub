
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

  const getTireColor = (toeMeasurement: AlignmentMeasurement, camberMeasurement: AlignmentMeasurement) => {
    const toeOutOfRange = isOutOfRange(toeMeasurement);
    const camberOutOfRange = isOutOfRange(camberMeasurement);
    
    if (toeOutOfRange || camberOutOfRange) {
      return "#ef4444"; // red-500
    }
    return "#10b981"; // green-500
  };

  const renderTire = (
    x: number, 
    y: number, 
    toeMeasurement: AlignmentMeasurement, 
    camberMeasurement: AlignmentMeasurement,
    position: string
  ) => {
    const tireColor = getTireColor(toeMeasurement, camberMeasurement);
    const isProblematic = isOutOfRange(toeMeasurement) || isOutOfRange(camberMeasurement);
    
    return (
      <g key={position}>
        {/* Tire tread pattern (aerial view) */}
        <ellipse
          cx={x}
          cy={y}
          rx="30"
          ry="45"
          fill={tireColor}
          stroke={isProblematic ? "#dc2626" : "#059669"}
          strokeWidth="2"
          opacity="0.8"
        />
        
        {/* Inner tire */}
        <ellipse
          cx={x}
          cy={y}
          rx="20"
          ry="35"
          fill="none"
          stroke="#374151"
          strokeWidth="1"
        />
        
        {/* Tread lines for realistic look */}
        <line x1={x-25} y1={y-30} x2={x+25} y2={y-30} stroke="#1f2937" strokeWidth="1" />
        <line x1={x-25} y1={y-15} x2={x+25} y2={y-15} stroke="#1f2937" strokeWidth="1" />
        <line x1={x-25} y1={y} x2={x+25} y2={y} stroke="#1f2937" strokeWidth="1" />
        <line x1={x-25} y1={y+15} x2={x+25} y2={y+15} stroke="#1f2937" strokeWidth="1" />
        <line x1={x-25} y1={y+30} x2={x+25} y2={y+30} stroke="#1f2937" strokeWidth="1" />
        
        {/* Position label */}
        <text
          x={x}
          y={y-60}
          textAnchor="middle"
          fill="#e5e7eb"
          fontSize="12"
          fontWeight="bold"
        >
          {position}
        </text>
        
        {/* Toe measurement */}
        <text
          x={x}
          y={y+65}
          textAnchor="middle"
          fill={isOutOfRange(toeMeasurement) ? "#ef4444" : "#3b82f6"}
          fontSize="11"
          fontWeight="bold"
        >
          Toe: {toeMeasurement.value.toFixed(2)}{toeMeasurement.unit}
        </text>
        
        {/* Camber measurement */}
        <text
          x={x}
          y={y+78}
          textAnchor="middle"
          fill={isOutOfRange(camberMeasurement) ? "#ef4444" : "#3b82f6"}
          fontSize="11"
          fontWeight="bold"
        >
          Camber: {camberMeasurement.value.toFixed(2)}{camberMeasurement.unit}
        </text>
      </g>
    );
  };

  const outOfRangeCount = Object.values(vehicle.measurements).filter(isOutOfRange).length;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg text-white">Wheel Alignment - Aerial View</CardTitle>
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
            viewBox="0 0 500 400"
            className="w-full h-80 bg-slate-900/50 rounded-lg border border-slate-600"
          >
            {/* Vehicle outline (aerial view) */}
            <rect
              x="150"
              y="120"
              width="200"
              height="160"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeDasharray="5,5"
              rx="15"
            />
            
            {/* Vehicle label */}
            <text
              x="250"
              y="200"
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="14"
              fontWeight="bold"
            >
              {vehicle.year} {vehicle.make} {vehicle.model}
            </text>
            
            {/* Front/Rear labels */}
            <text x="250" y="80" textAnchor="middle" fill="#e5e7eb" fontSize="12" fontWeight="bold">FRONT</text>
            <text x="250" y="370" textAnchor="middle" fill="#e5e7eb" fontSize="12" fontWeight="bold">REAR</text>
            
            {/* Render tires in aerial view positions */}
            {renderTire(120, 140, vehicle.measurements.frontLeftToe, vehicle.measurements.frontLeftCamber, "FL")}
            {renderTire(380, 140, vehicle.measurements.frontRightToe, vehicle.measurements.frontRightCamber, "FR")}
            {renderTire(120, 260, vehicle.measurements.rearLeftToe, vehicle.measurements.rearLeftCamber, "RL")}
            {renderTire(380, 260, vehicle.measurements.rearRightToe, vehicle.measurements.rearRightCamber, "RR")}
            
            {/* Legend */}
            <g>
              <text x="20" y="380" fill="#e5e7eb" fontSize="10" fontWeight="bold">Legend:</text>
              <ellipse cx="80" cy="376" rx="12" ry="8" fill="#10b981" opacity="0.8" />
              <text x="100" y="380" fill="#e5e7eb" fontSize="10">In Range</text>
              <ellipse cx="170" cy="376" rx="12" ry="8" fill="#ef4444" opacity="0.8" />
              <text x="190" y="380" fill="#e5e7eb" fontSize="10">Out of Range</text>
            </g>
          </svg>
        </div>
        
        {/* Specification ranges table */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Specification Ranges</h4>
            <div className="text-gray-400">
              <div>Front Toe: ±0.15°</div>
              <div>Rear Toe: ±0.20°</div>
              <div>Front Camber: ±0.50°</div>
              <div>Rear Camber: ±0.30°</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Status Summary</h4>
            <div className="text-gray-400">
              <div>Total measurements: 8</div>
              <div className={outOfRangeCount > 0 ? "text-red-400" : "text-green-400"}>
                Out of range: {outOfRangeCount}
              </div>
              <div className={outOfRangeCount === 0 ? "text-green-400" : "text-gray-400"}>
                In range: {8 - outOfRangeCount}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WheelAlignmentChart;
