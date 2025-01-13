import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const TrainingProgress = () => {
  const [isTraining, setIsTraining] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [epoch, setEpoch] = React.useState(1);
  const [timeRemaining, setTimeRemaining] = React.useState('00:00:00');

  return (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Epoch {epoch}/100</span>
              <span>Time Remaining: {timeRemaining}</span>
            </div>
            <Progress value={progress} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Training Loss</div>
              <div className="text-2xl font-semibold">0.342</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Validation Loss</div>
              <div className="text-2xl font-semibold">0.385</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Training Accuracy</div>
              <div className="text-2xl font-semibold">92.5%</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Validation Accuracy</div>
              <div className="text-2xl font-semibold">91.2%</div>
            </div>
          </div>
        </div>

  );
};

export default TrainingProgress;