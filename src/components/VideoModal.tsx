
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Play } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal = ({ isOpen, onClose }: VideoModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-4xl mx-4 bg-slate-800/95 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Product Demo Video</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">Demo Video</p>
              <p className="text-gray-500 text-sm">
                See WheelTrack in action - manage alignment data, 
                view manufacturer specs, and analyze vehicle history
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoModal;
