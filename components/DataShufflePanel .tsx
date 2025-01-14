import React, { useState, useCallback, memo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shuffle, 
  Settings2, 
  RefreshCcw, 
  Repeat, 
  HelpCircle, 
  AlertCircle,
  Save,
  RotateCcw 
} from 'lucide-react';

// Types and Interfaces
interface InfoTooltipProps {
  text: string;
}

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
  tooltip?: string;
}

interface ShuffleSettings {
  seed: string;
  reshuffleEachEpoch: boolean;
  repeatCount: number;
  prefetchSize: string;
  shuffleScope: string;
  isAdvancedMode: boolean;
  validationErrors: {
    [key: string]: string | null;
  };
}

interface ShuffleConfigProps {
  onSettingsChange?: (settings: ShuffleSettings) => void;
  onSave?: (settings: ShuffleSettings) => void;
  onReset?: () => void;
  initialSettings?: Partial<ShuffleSettings>;
}

// Error Boundary Component
class ShuffleConfigErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert className="bg-red-50 text-red-800">
          <AlertDescription>
            Something went wrong. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}

// Tooltip Component
const InfoTooltip: React.FC<InfoTooltipProps> = memo(({ text }) => (
  <div className="group relative inline-block ml-1">
    <HelpCircle className="w-4 h-4 text-gray-400 inline cursor-help" />
    <div 
      role="tooltip" 
      className="hidden group-hover:block absolute z-10 w-64 p-2 text-sm bg-gray-900 text-white rounded-lg -left-20 top-6"
    >
      {text}
      <div className="absolute w-2 h-2 bg-gray-900 rotate-45 -top-1 left-[5.5rem]" />
    </div>
  </div>
));

// Settings Group Component
const SettingsGroup: React.FC<SettingsGroupProps> = memo(({ title, children, tooltip }) => (
  <div className="space-y-2">
    <div className="flex items-center">
      <label className="text-sm font-medium">{title}</label>
      {tooltip && <InfoTooltip text={tooltip} />}
    </div>
    {children}
  </div>
));

// Default Settings
const defaultSettings: ShuffleSettings = {
  seed: '',
  reshuffleEachEpoch: true,
  repeatCount: 1,
  prefetchSize: 'AUTOTUNE',
  shuffleScope: 'full',
  isAdvancedMode: false,
  validationErrors: {}
};

// Main Component
const ShuffleConfig: React.FC<ShuffleConfigProps> = ({
  onSettingsChange,
  onSave,
  onReset,
  initialSettings = {}
}) => {
  const [settings, setSettings] = useState<ShuffleSettings>({
    ...defaultSettings,
    ...initialSettings
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('shuffleSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('shuffleSettings', JSON.stringify(settings));
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  const getValidationMessage = (key: keyof ShuffleSettings, value: any): string | null => {
    const validations: Record<string, (val: any) => string | null> = {
      seed: (val) => {
        if (val && !/^\d+$/.test(val)) return 'Seed must be a number';
        if (val && Number(val) < 0) return 'Seed must be positive';
        return null;
      },
      repeatCount: (val) => {
        if (val < 1) return 'Minimum repeat count is 1';
        if (val > 100) return 'Maximum repeat count is 100';
        return null;
      }
    };
    return validations[key]?.(value) ?? null;
  };

  const updateSetting = useCallback((key: keyof ShuffleSettings, value: any) => {
    setSettings(prev => {
      const validationError = getValidationMessage(key, value);
      return {
        ...prev,
        validationErrors: {
          ...prev.validationErrors,
          [key]: validationError
        },
        [key]: value
      };
    });
  }, []);

  const generateRandomSeed = useCallback(async () => {
    setIsGenerating(true);
    try {
      const newSeed = Math.floor(Math.random() * 10000);
      updateSetting('seed', newSeed.toString());
    } finally {
      setIsGenerating(false);
    }
  }, [updateSetting]);

  const handleSave = () => {
    const hasErrors = Object.values(settings.validationErrors).some(error => error !== null);
    if (!hasErrors) {
      onSave?.(settings);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    onReset?.();
    localStorage.removeItem('shuffleSettings');
  };

  return (
    <Card className="w-full max-w-2xl bg-white shadow-lg mx-auto sm:mx-0">
      <CardHeader className="space-y-1 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Shuffle className="w-5 h-5" />
            Shuffle Configuration
          </CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 text-sm flex items-center gap-1 text-gray-600 hover:text-gray-700 transition-colors"
              aria-label="Reset settings"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => updateSetting('isAdvancedMode', !settings.isAdvancedMode)}
              className="px-3 py-2 text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
              aria-label="Toggle advanced mode"
            >
              <Settings2 className="w-4 h-4" />
              {settings.isAdvancedMode ? 'Simple Mode' : 'Advanced Mode'}
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6 px-4 sm:px-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <SettingsGroup 
            title="Random Seed" 
            tooltip="A fixed seed ensures the same shuffle pattern each time. Leave empty for random shuffling."
          >
            <div className="flex gap-2">
              <input
                type="number"
                value={settings.seed}
                onChange={(e) => updateSetting('seed', e.target.value)}
                placeholder="Leave empty for random"
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  ${settings.validationErrors.seed ? 'border-red-500' : ''}`}
                aria-label="Random seed input"
              />
              <button
                onClick={generateRandomSeed}
                disabled={isGenerating}
                className={`px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-1 transition-colors
                  ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Generate random seed"
              >
                <RefreshCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Generate
              </button>
            </div>
            {settings.validationErrors.seed && (
              <p className="text-sm text-red-500 mt-1" role="alert">
                {settings.validationErrors.seed}
              </p>
            )}
          </SettingsGroup>

          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.reshuffleEachEpoch}
                onChange={(e) => updateSetting('reshuffleEachEpoch', e.target.checked)}
                className="sr-only peer"
                aria-label="Reshuffle each epoch toggle"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
                after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border 
                after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              />
            </label>
            <span className="text-sm font-medium">Reshuffle Each Epoch</span>
            <InfoTooltip text="When enabled, data will be reshuffled at the beginning of each training epoch" />
          </div>

          {settings.isAdvancedMode && (
            <>
              <SettingsGroup 
                title="Shuffle Scope" 
                tooltip="Choose how much of your dataset to shuffle"
              >
                <select
                  value={settings.shuffleScope}
                  onChange={(e) => updateSetting('shuffleScope', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Shuffle scope selection"
                >
                  <option value="full">Full Dataset</option>
                  <option value="batch">Within Batches</option>
                  <option value="class">Within Classes</option>
                  <option value="custom">Custom Range</option>
                </select>
              </SettingsGroup>

              <SettingsGroup 
                title="Repeat Count" 
                tooltip="Number of times to repeat the dataset after shuffling"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.repeatCount}
                    onChange={(e) => updateSetting('repeatCount', Number(e.target.value))}
                    min="1"
                    max="100"
                    className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      ${settings.validationErrors.repeatCount ? 'border-red-500' : ''}`}
                    aria-label="Repeat count input"
                  />
                  <Repeat className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">times</span>
                </div>
                {settings.validationErrors.repeatCount && (
                  <p className="text-sm text-red-500 mt-1" role="alert">
                    {settings.validationErrors.repeatCount}
                  </p>
                )}
              </SettingsGroup>

              <SettingsGroup 
                title="Prefetch Size" 
                tooltip="Number of batches to prefetch for optimized performance"
              >
                <select
                  value={settings.prefetchSize}
                  onChange={(e) => updateSetting('prefetchSize', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Prefetch size selection"
                >
                  <option value="AUTOTUNE">AUTOTUNE (Recommended)</option>
                  <option value="1">1 batch</option>
                  <option value="2">2 batches</option>
                  <option value="4">4 batches</option>
                  <option value="8">8 batches</option>
                  <option value="custom">Custom</option>
                </select>
              </SettingsGroup>
            </>
          )}
        </form>

        {/* Settings Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            Current Configuration
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Seed: {settings.seed || 'Random'}</p>
            <p>• Reshuffle Each Epoch: {settings.reshuffleEachEpoch ? 'Yes' : 'No'}</p>
            {settings.isAdvancedMode && (
              <>
                <p>• Shuffle Scope: {settings.shuffleScope.charAt(0).toUpperCase() + settings.shuffleScope.slice(1)}</p>
                <p>• Repeat Count: {settings.repeatCount}</p>
                <p>• Prefetch Size: {settings.prefetchSize}</p>
              </>
            )}
          </div>
        </div>

        {/* Performance Tips */}
        <Alert className="bg-blue-50 text-blue-800">
          <AlertDescription className="text-sm">
            💡 Tip: For optimal performance, use AUTOTUNE prefetch size with a moderate buffer size. 
            This allows TensorFlow to automatically optimize data pipeline performance.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default memo(ShuffleConfig);