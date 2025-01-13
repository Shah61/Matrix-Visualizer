import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings2, ImageDown, Zap, BarChart3 } from 'lucide-react';

const ImageProcessingPipeline = () => {
  const [settings, setSettings] = useState({
    autoTune: false,
    prefetch: true,
    interleave: true,
    grayscale: true,
    noiseReduction: 0.5,
    contrast: 0.5,
    edgeDetection: 0.5,
  });

  return (
    <div className="space-y-6">
      {/* Advanced Settings Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Advanced Settings
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">AutoTune</label>
              <Switch 
                checked={settings.autoTune}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({...prev, autoTune: checked}))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Prefetch Data</label>
              <Switch 
                checked={settings.prefetch}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({...prev, prefetch: checked}))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Interleave Testing</label>
              <Switch 
                checked={settings.interleave}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({...prev, interleave: checked}))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Processing Pipeline Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageDown className="h-5 w-5" />
              Image Processing Pipeline
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Convert to Grayscale</label>
                <Switch 
                  checked={settings.grayscale}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({...prev, grayscale: checked}))}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Noise Reduction</label>
                  <span className="text-sm text-gray-500">{settings.noiseReduction}</span>
                </div>
                <Slider
                  value={[settings.noiseReduction]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) => 
                    setSettings(prev => ({...prev, noiseReduction: value}))}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Contrast Enhancement</label>
                  <span className="text-sm text-gray-500">{settings.contrast}</span>
                </div>
                <Slider
                  value={[settings.contrast]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) => 
                    setSettings(prev => ({...prev, contrast: value}))}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Edge Detection Strength</label>
                  <span className="text-sm text-gray-500">{settings.edgeDetection}</span>
                </div>
                <Slider
                  value={[settings.edgeDetection]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) => 
                    setSettings(prev => ({...prev, edgeDetection: value}))}
                />
              </div>
            </div>

            {/* Preview Section */}
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <div className="text-sm text-gray-500 text-center">
                Image preview will appear here
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageProcessingPipeline;