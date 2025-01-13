import { ReactNode } from 'react';
import { CATEGORIES } from '../constant/operations';

export type CategoryType = typeof CATEGORIES[keyof typeof CATEGORIES];

// Config interfaces
export interface OperationConfig {
  type: 'number' | 'select' | 'boolean' | 'text' | 'range' | 'tuple' | 'array' | 'object' | 'function';
  label: string;
  default: any;
  options?: string[] | number[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  description?: string;
  validation?: (value: any) => boolean;
  dependsOn?: string[];
  advanced?: boolean;
  units?: string;
  placeholder?: string;
  group?: string;
}

// Layer Configuration
// In your types file
export interface LayerConfig {
  id: string;
  name: string;
  type: CategoryType;
  description: string;
  outputShape: string | number[] | OperationConfig; // Update this line to match your data structure
  icon: ReactNode;
  common: boolean;
  gpu_support: boolean;
  tpu_support: boolean;
  config?: {
    units?: number;
    filters?: number;
    kernel_size?: number | [number, number];
    activation?: string;
    rate?: number;
    use_bias?: boolean;
    [key: string]: any;
  };
  performance_tips?: string[];
  version_added?: string;
}

// Main Operation interface
export interface Operation {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  icon: ReactNode;
  common: boolean;
  config?: Record<string, OperationConfig>;
  inputs?: number;
  outputs?: number;
  tensorflow_doc?: string;
  keras_doc?: string;
  examples?: string[];
  limitations?: string[];
  version_added?: string;
  deprecated?: boolean;
  warning?: string;
  alternatives?: string[];
  performance_tips?: string[];
  gpu_support?: boolean;
  tpu_support?: boolean;
  paper_reference?: string;
  tags?: string[];
  related_ops?: string[];
  layerConfig?: LayerConfig; // Add reference to LayerConfig
}

export interface ImageItem {
  id: number;
  name: string;
}

// Matrix and Filter Types (if you need them here)
export type Matrix = number[][];
export type FilterType = 'identity' | 'edgeDetection1' | 'edgeDetection2' | 'sharpen' | 'boxBlur';

export const DEFAULT_FILTERS: Record<FilterType, Matrix> = {
  identity: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
  ],
  edgeDetection1: [
    [1, 0, -1],
    [0, 0, 0],
    [-1, 0, 1]
  ],
  edgeDetection2: [
    [0, 1, 0],
    [1, -4, 1],
    [0, 1, 0]
  ],
  sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ],
  boxBlur: [
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9]
  ]
};