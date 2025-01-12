import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import * as Icons from 'lucide-react';

interface ShuffleConfig {
  bufferSize: number;
  randomSeed?: number;
  stratified: boolean;
  shuffleStrategy: 'simple' | 'balanced' | 'weighted';
}

const DataShufflingDialog = () => {
  const [config, setConfig] = useState<ShuffleConfig>({
    bufferSize: 4,
    stratified: false,
    shuffleStrategy: 'simple'
  });

  const [isShuffling, setIsShuffling] = useState(false);
  const [currentBuffer, setCurrentBuffer] = useState<string[]>([]);

  // Simulated dataset examples
  const [dataset] = useState([
    { id: 1, label: 'Class A', color: 'bg-blue-500' },
    { id: 2, label: 'Class B', color: 'bg-green-500' },
    { id: 3, label: 'Class A', color: 'bg-blue-500' },
    { id: 4, label: 'Class C', color: 'bg-yellow-500' },
    { id: 5, label: 'Class B', color: 'bg-green-500' },
    { id: 6, label: 'Class A', color: 'bg-blue-500' },
    { id: 7, label: 'Class C', color: 'bg-yellow-500' },
    { id: 8, label: 'Class B', color: 'bg-green-500' },
  ]);

  const simulateShuffle = async () => {
    setIsShuffling(true);
    const bufferSize = config.bufferSize;
    
    for (let i = 0; i < dataset.length; i += bufferSize) {
      const buffer = dataset.slice(i, i + bufferSize).map(item => item.label);
      setCurrentBuffer(buffer);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const shuffledBuffer = [...buffer].sort(() => Math.random() - 0.5);
      setCurrentBuffer(shuffledBuffer);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    setIsShuffling(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Icons.Shuffle className="h-4 w-4" />
          Configure Shuffling
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icons.Shuffle className="h-5 w-5" />
            Data Shuffling Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Buffer visualization */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Current Buffer</h4>
              <Badge variant={isShuffling ? "secondary" : "outline"}>
                {isShuffling ? "Shuffling..." : "Ready"}
              </Badge>
            </div>
            <Card className="p-4">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: config.bufferSize }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-16 rounded-lg border-2 flex items-center justify-center
                      ${isShuffling ? 'animate-pulse' : ''} 
                      ${currentBuffer[idx] ? dataset.find(d => d.label === currentBuffer[idx])?.color || 'bg-gray-100' : 'bg-gray-100'}`
                    }
                  >
                    <span className="text-xs font-medium text-white">
                      {currentBuffer[idx] || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Separator />

          {/* Configuration options */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buffer Size</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[config.bufferSize]}
                  onValueChange={([value]) => setConfig({ ...config, bufferSize: value })}
                  min={2}
                  max={8}
                  step={2}
                  className="flex-1"
                />
                <span className="text-sm w-12 text-right">{config.bufferSize}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Stratified Shuffling</label>
                <p className="text-xs text-muted-foreground">
                  Maintain class distribution in each batch
                </p>
              </div>
              <Switch
                checked={config.stratified}
                onCheckedChange={(checked) => setConfig({ ...config, stratified: checked })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Shuffling Strategy</label>
              <div className="grid grid-cols-3 gap-2">
                {['simple', 'balanced', 'weighted'].map((strategy) => (
                  <Button
                    key={strategy}
                    variant={config.shuffleStrategy === strategy ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfig({ ...config, shuffleStrategy: strategy as ShuffleConfig['shuffleStrategy'] })}
                  >
                    {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              Buffer size affects memory usage and randomization quality. Larger buffers provide better
              randomization but require more memory.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2">
            <Button
              onClick={simulateShuffle}
              disabled={isShuffling}
              className="gap-2"
            >
              <Icons.Play className="h-4 w-4" />
              {isShuffling ? 'Shuffling...' : 'Preview Shuffle'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataShufflingDialog;