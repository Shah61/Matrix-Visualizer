import React from 'react';
import { Input } from '@/components/ui/input';
import { OperationConfig } from '../types/operations';

interface ConfigFieldProps {
  field: OperationConfig;
  value: any;
  onChange: (value: any) => void;
}

export const ConfigField: React.FC<ConfigFieldProps> = ({ field, value, onChange }) => {
  switch (field.type) {
    case 'number':
      return (
        <Input
          type="number"
          value={value}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full"
        />
      );
      
    case 'select':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
      
    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm">{value ? 'Enabled' : 'Disabled'}</span>
        </div>
      );
      
    case 'range':
      return (
        <input
          type="range"
          value={value}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full"
        />
      );
      
    default:
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      );
  }
};