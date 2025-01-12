import { ReactNode } from 'react';
import { CATEGORIES } from '../constant/operations';

export type CategoryType = typeof CATEGORIES[keyof typeof CATEGORIES];

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
}

export interface ImageItem {
  id: number;
  name: string;
}