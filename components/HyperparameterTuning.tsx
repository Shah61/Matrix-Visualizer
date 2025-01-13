import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Sliders } from 'lucide-react';

const HyperparameterTuning = () => {
  const [params, setParams] = React.useState({
    learningRate: 0.001,
    batchSize: 32,
    optimizer: 'adam',
    dropout: 0.2,
    useAugmentation: true
  });

  return (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Learning Rate</label>
            <div className="flex items-center gap-4">
              <Slider
                value={[params.learningRate * 1000]}
                min={0}
                max={10}
                step={0.1}
                onValueChange={([value]) => 
                  setParams(prev => ({...prev, learningRate: value / 1000}))}
              />
              <span className="text-sm w-16">{params.learningRate}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Batch Size</label>
            <Select 
              value={params.batchSize.toString()}
              onValueChange={(value) => 
                setParams(prev => ({...prev, batchSize: parseInt(value)}))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[16, 32, 64, 128, 256].map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Optimizer</label>
            <Select 
              value={params.optimizer}
              onValueChange={(value) => 
                setParams(prev => ({...prev, optimizer: value}))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['adam', 'sgd', 'rmsprop', 'adagrad'].map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {opt.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dropout Rate</label>
            <div className="flex items-center gap-4">
              <Slider
                value={[params.dropout * 100]}
                min={0}
                max={50}
                step={5}
                onValueChange={([value]) => 
                  setParams(prev => ({...prev, dropout: value / 100}))}
              />
              <span className="text-sm w-16">{params.dropout}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Data Augmentation</label>
            <Switch
              checked={params.useAugmentation}
              onCheckedChange={(checked) =>
                setParams(prev => ({...prev, useAugmentation: checked}))}
            />
          </div>
        </div>
  );
};

export default HyperparameterTuning;