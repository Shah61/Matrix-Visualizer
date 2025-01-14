import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Settings2, Zap, Target, AlertTriangle, InfoIcon } from 'lucide-react';

// Loss function specific settings
const lossSettings = {
  categorical_crossentropy: {
    description: "For multi-class classification problems",
    requiresOneHot: true,
    recommendedOptimizers: ["adam", "sgd"],
    additionalParams: {
      label_smoothing: {
        default: 0,
        min: 0,
        max: 1,
        step: 0.1
      }
    }
  },
  binary_crossentropy: {
    description: "For binary classification problems",
    requiresOneHot: false,
    recommendedOptimizers: ["adam", "rmsprop"],
    additionalParams: {
      threshold: {
        default: 0.5,
        min: 0,
        max: 1,
        step: 0.1
      }
    }
  },
  mse: {
    description: "For regression problems",
    requiresOneHot: false,
    recommendedOptimizers: ["adam", "rmsprop"],
    additionalParams: {}
  },
  mae: {
    description: "For regression with less sensitivity to outliers",
    requiresOneHot: false,
    recommendedOptimizers: ["adam", "sgd"],
    additionalParams: {}
  }
};

// Optimizer specific settings
const optimizerSettings = {
  adam: {
    description: "Adaptive learning rate optimization algorithm",
    params: {
      learning_rate: {
        default: 0.001,
        min: 0.0001,
        max: 0.01,
        step: 0.0001
      },
      beta1: {
        default: 0.9,
        min: 0,
        max: 1,
        step: 0.1
      },
      beta2: {
        default: 0.999,
        min: 0,
        max: 1,
        step: 0.001
      }
    }
  },
  sgd: {
    description: "Stochastic gradient descent with momentum",
    params: {
      learning_rate: {
        default: 0.01,
        min: 0.0001,
        max: 0.1,
        step: 0.001
      },
      momentum: {
        default: 0.9,
        min: 0,
        max: 1,
        step: 0.1
      }
    }
  },
  rmsprop: {
    description: "Root Mean Square Propagation",
    params: {
      learning_rate: {
        default: 0.001,
        min: 0.0001,
        max: 0.01,
        step: 0.0001
      },
      rho: {
        default: 0.9,
        min: 0,
        max: 1,
        step: 0.1
      }
    }
  },
  adagrad: {
    description: "Adaptive Gradient Algorithm",
    params: {
      learning_rate: {
        default: 0.01,
        min: 0.0001,
        max: 0.1,
        step: 0.001
      },
      initial_accumulator_value: {
        default: 0.1,
        min: 0,
        max: 1,
        step: 0.1
      }
    }
  }
};

const ModelCompilationSettings = () => {
  const [selectedLoss, setSelectedLoss] = useState('categorical_crossentropy');
  const [selectedOptimizer, setSelectedOptimizer] = useState('adam');
  const [parameterValues, setParameterValues] = useState<Record<string, number>>({});

  const currentLossSettings = lossSettings[selectedLoss as keyof typeof lossSettings];
  const currentOptimizerSettings = optimizerSettings[selectedOptimizer as keyof typeof optimizerSettings];

  const handleParameterChange = (param: string, value: number[]) => {
    setParameterValues(prev => ({
      ...prev,
      [param]: value[0]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Loss Function
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Loss Function Selection */}
        <div className="space-y-4">
          <Select 
            value={selectedLoss} 
            onValueChange={setSelectedLoss}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select loss function" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="categorical_crossentropy">Categorical Crossentropy</SelectItem>
              <SelectItem value="binary_crossentropy">Binary Crossentropy</SelectItem>
              <SelectItem value="mse">Mean Squared Error</SelectItem>
              <SelectItem value="mae">Mean Absolute Error</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Loss Function Description */}
          <div className="flex items-start gap-2 p-2 bg-blue-50 rounded text-sm">
            <InfoIcon className="h-4 w-4 text-blue-500 mt-0.5" />
            <span>{currentLossSettings.description}</span>
          </div>

          {/* Loss-specific parameters */}
          {Object.entries(currentLossSettings.additionalParams).map(([param, settings]) => (
            <div key={param} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{param.replace('_', ' ')}</span>
                <span>{parameterValues[param] ?? settings.default}</span>
              </div>
              <Slider
                defaultValue={[settings.default]}
                min={settings.min}
                max={settings.max}
                step={settings.step}
                onValueChange={(value) => handleParameterChange(param, value)}
              />
            </div>
          ))}
        </div>

        {/* Optimizer Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Optimizer
          </h3>
          <Select 
            value={selectedOptimizer} 
            onValueChange={setSelectedOptimizer}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select optimizer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adam" className={
                currentLossSettings.recommendedOptimizers.includes('adam') 
                  ? "text-green-600 font-medium" 
                  : ""
              }>
                ADAM
                {currentLossSettings.recommendedOptimizers.includes('adam') && 
                  " (Recommended)"}
              </SelectItem>
              <SelectItem value="sgd" className={
                currentLossSettings.recommendedOptimizers.includes('sgd') 
                  ? "text-green-600 font-medium" 
                  : ""
              }>
                SGD
                {currentLossSettings.recommendedOptimizers.includes('sgd') && 
                  " (Recommended)"}
              </SelectItem>
              <SelectItem value="rmsprop" className={
                currentLossSettings.recommendedOptimizers.includes('rmsprop') 
                  ? "text-green-600 font-medium" 
                  : ""
              }>
                RMSprop
                {currentLossSettings.recommendedOptimizers.includes('rmsprop') && 
                  " (Recommended)"}
              </SelectItem>
              <SelectItem value="adagrad" className={
                currentLossSettings.recommendedOptimizers.includes('adagrad') 
                  ? "text-green-600 font-medium" 
                  : ""
              }>
                Adagrad
                {currentLossSettings.recommendedOptimizers.includes('adagrad') && 
                  " (Recommended)"}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Optimizer Description */}
          <div className="flex items-start gap-2 p-2 bg-blue-50 rounded text-sm">
            <InfoIcon className="h-4 w-4 text-blue-500 mt-0.5" />
            <span>{currentOptimizerSettings.description}</span>
          </div>

          {/* Optimizer-specific parameters */}
          {Object.entries(currentOptimizerSettings.params).map(([param, settings]) => (
            <div key={param} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{param.replace('_', ' ')}</span>
                <span>{parameterValues[param] ?? settings.default}</span>
              </div>
              <Slider
                defaultValue={[settings.default]}
                min={settings.min}
                max={settings.max}
                step={settings.step}
                onValueChange={(value) => handleParameterChange(param, value)}
              />
            </div>
          ))}
        </div>

        {/* Metrics Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metrics to Monitor
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="accuracy" defaultChecked />
              <label htmlFor="accuracy">Accuracy</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="precision" />
              <label htmlFor="precision">Precision</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="recall" />
              <label htmlFor="recall">Recall</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="f1" />
              <label htmlFor="f1">F1 Score</label>
            </div>
          </div>
        </div>

        {/* Training Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Training Configuration
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Number of Epochs</span>
                <span>100</span>
              </div>
              <Slider
                defaultValue={[100]}
                max={500}
                min={1}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Early Stopping Patience</span>
                <span>10</span>
              </div>
              <Slider
                defaultValue={[10]}
                max={50}
                min={1}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* Hardware Acceleration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Hardware Acceleration
          </h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Switch id="gpu" defaultChecked />
              <label htmlFor="gpu">Use GPU Acceleration</label>
            </div>
            <Badge variant="secondary">Recommended</Badge>
          </div>
        </div>

        {/* Warning for specific combinations */}
        {!currentLossSettings.recommendedOptimizers.includes(selectedOptimizer) && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">
              This optimizer is not recommended for the selected loss function. 
              Consider using {currentLossSettings.recommendedOptimizers.join(' or ')}.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelCompilationSettings;  