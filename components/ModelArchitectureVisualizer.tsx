import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Box, ArrowDown, Grid, Layers2 } from 'lucide-react';
import { LayerConfig } from './workspaces/types';  

interface ModelArchitectureVisualizerProps {
  layers: LayerConfig[];
}

// Demo layers data
const demoArchitectureLayers: LayerConfig[] = [
  {
    id: 'input_1',
    name: 'Input',
    type: 'Input Layer',
    description: 'Input layer for image data',
    outputShape: '[None, 224, 224, 3]',
    icon: <Box className="h-4 w-4" />,
    common: true,
    gpu_support: true,
    tpu_support: true
  },
  {
    id: 'conv2d_1',
    name: 'Conv2D',
    type: 'Convolutional',
    description: '2D convolution layer',
    outputShape: '[None, 224, 224, 64]',
    icon: <Grid className="h-4 w-4" />,
    common: true,
    gpu_support: true,
    tpu_support: true,
    config: {
      filters: 64,
      kernel_size: [3, 3],
      activation: 'relu'
    }
  },
  {
    id: 'maxpool2d_1',
    name: 'MaxPooling2D',
    type: 'Pooling',
    description: 'Max pooling operation',
    outputShape: '[None, 112, 112, 64]',
    icon: <ArrowDown className="h-4 w-4" />,
    common: true,
    gpu_support: true,
    tpu_support: true,
    config: {
      pool_size: [2, 2]
    }
  },
  {
    id: 'dense_1',
    name: 'Dense',
    type: 'Core Layers',
    description: 'Fully connected layer',
    outputShape: '[None, 512]',
    icon: <Layers2 className="h-4 w-4" />,
    common: true,
    gpu_support: true,
    tpu_support: true,
    config: {
      units: 512,
      activation: 'relu'
    }
  },
  {
    id: 'output',
    name: 'Dense',
    type: 'Core Layers',
    description: 'Output layer',
    outputShape: '[None, 10]',
    icon: <Layers2 className="h-4 w-4" />,
    common: true,
    gpu_support: true,
    tpu_support: true,
    config: {
      units: 10,
      activation: 'softmax'
    }
  }
];

const ModelArchitectureVisualizer: React.FC<ModelArchitectureVisualizerProps> = ({ layers }) => {
  // Use demo data if no layers are provided
  const displayLayers = layers.length > 0 ? layers : demoArchitectureLayers;

  return (
        <div className="flex flex-col items-center gap-2">
          {displayLayers.map((layer, index) => (
            <React.Fragment key={layer.id}>
              <div className="w-full max-w-md p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {layer.icon || <Box className="h-4 w-4 text-blue-500" />}
                    <span className="font-medium">{layer.name}</span>
                  </div>
                  <Badge variant="secondary">{layer.type}</Badge>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Output Shape: {layer.outputShape}
                </div>
                {layer.config && (
                  <div className="mt-1 text-xs text-gray-400">
                    {Object.entries(layer.config)
                      .filter(([_, value]) => value !== undefined)
                      .map(([key, value]) => (
                        `${key}: ${Array.isArray(value) ? value.join('×') : value}`
                      )).join(', ')}
                  </div>
                )}
              </div>
              {index < displayLayers.length - 1 && (
                <ArrowDown className="h-4 w-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
  );
};

export default ModelArchitectureVisualizer;