/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Part 1: Core Types and Interfaces
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import * as Icons from 'lucide-react';

// DND Kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

// Define ALL categories
const CATEGORIES = {
  CORE: 'Core Layers',
  CONV: 'Convolutional',
  POOL: 'Pooling',
  RNN: 'Recurrent',
  ATTN: 'Attention',
  NORM: 'Normalization',
  PREP: 'Preprocessing',
  MERGE: 'Merge',
  LOSS: 'Loss Functions',
  OPT: 'Optimizers',
  METRICS: 'Metrics',
  REG: 'Regularization',
  TENSOR: 'Tensor Ops',
  CUSTOM: 'Custom Layers',
  IMG: 'Image Processing',
  ACTIV: 'Activation Functions',
  EMBED: 'Embedding Layers',
  NOISE: 'Noise Layers',
  SHAPE: 'Shape Operations',
  DIST: 'Distribution Layers',
  VIS: 'Visualization',
  DEBUG: 'Debugging Layers',
  OPTIM: 'Optimization',
  QUANT: 'Quantization',
  SPARSE: 'Sparse Operations',
  PROB: 'Probabilistic',
  TIME: 'Time Series',
  GRAPH: 'Graph Neural Networks',
  TPU: 'TPU Specific',
  GPU: 'GPU Specific',
  IO: 'Input/Output',
  TEXT: 'Text Processing',
  AUDIO: 'Audio Processing',
  VIDEO: 'Video Processing',
  AUGMENT: 'Data Augmentation',
  INIT: 'Initializers',
  CONST: 'Constraints',
  CALLBACK: 'Callbacks',
  SIGNAL: 'Signal Processing',
  BN: 'Batch Normalization',
  RANDOM: 'Random Operations',
  FEATURE: 'Feature Columns'  
} as const;

// ALL activation functions
const ACTIVATIONS = [
  'relu', 'sigmoid', 'tanh', 'softmax', 'elu', 'selu', 'softplus', 'softsign',
  'hard_sigmoid', 'exponential', 'linear', 'relu6', 'leaky_relu', 'prelu',
  'swish', 'mish', 'gelu', 'standardized_gelu', 'quick_gelu'
];

// ALL padding types
const PADDING_TYPES = ['valid', 'same', 'causal', 'full'];

// ALL interpolation methods
const INTERPOLATION_METHODS = ['nearest', 'bilinear', 'bicubic', 'area', 'lanczos3', 'lanczos5', 'gaussian', 'mitchellcubic'];

// ALL initializers
const INITIALIZERS = [
  'zeros', 'ones', 'constant', 'random_normal', 'random_uniform', 'truncated_normal',
  'glorot_normal', 'glorot_uniform', 'he_normal', 'he_uniform', 'identity',
  'orthogonal', 'variance_scaling'
];

// ALL regularizers
const REGULARIZERS = ['l1', 'l2', 'l1_l2', 'orthogonal', 'none'];

// ALL constraints
const CONSTRAINTS = ['max_norm', 'min_max_norm', 'non_neg', 'unit_norm', 'radial_constraint'];

// Interface definitions
interface OperationConfig {
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

type CategoryType = typeof CATEGORIES[keyof typeof CATEGORIES];



interface Operation {
  id: string;
  name: string;
  category: CategoryType;  // Use the CategoryType instead of typeof CATEGORIES[number]
  description: string;
  icon: React.ReactNode;
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

// Part 2: ALL Operations Data
const allOperations: Operation[] = [
  // Core Layers
  {
    id: 'dense',
    name: 'Dense',
    category: CATEGORIES.CORE,
    description: 'Regular densely-connected NN layer',
    icon: <Icons.Layers className="h-4 w-4" />,
    common: true,
    config: {
      units: {
        type: 'number',
        label: 'Units',
        default: 32,
        min: 1,
        required: true,
        description: 'Dimensionality of the output space'
      },
      activation: {
        type: 'select',
        label: 'Activation',
        default: 'relu',
        options: ACTIVATIONS,
        description: 'Activation function'
      },
      use_bias: {
        type: 'boolean',
        label: 'Use Bias',
        default: true,
        description: 'Whether to include a bias'
      },
      kernel_initializer: {
        type: 'select',
        label: 'Kernel Initializer',
        default: 'glorot_uniform',
        options: INITIALIZERS,
        description: 'Initializer for the kernel weights matrix'
      },
      bias_initializer: {
        type: 'select',
        label: 'Bias Initializer',
        default: 'zeros',
        options: INITIALIZERS,
        description: 'Initializer for the bias vector'
      },
      kernel_regularizer: {
        type: 'select',
        label: 'Kernel Regularizer',
        default: 'none',
        options: REGULARIZERS,
        description: 'Regularizer function applied to kernel weights matrix'
      },
      bias_regularizer: {
        type: 'select',
        label: 'Bias Regularizer',
        default: 'none',
        options: REGULARIZERS,
        description: 'Regularizer function applied to bias vector'
      },
      activity_regularizer: {
        type: 'select',
        label: 'Activity Regularizer',
        default: 'none',
        options: REGULARIZERS,
        description: 'Regularizer function applied to layer output'
      },
      kernel_constraint: {
        type: 'select',
        label: 'Kernel Constraint',
        default: 'none',
        options: CONSTRAINTS,
        description: 'Constraint function applied to kernel weights matrix'
      },
      bias_constraint: {
        type: 'select',
        label: 'Bias Constraint',
        default: 'none',
        options: CONSTRAINTS,
        description: 'Constraint function applied to bias vector'
      }
    },
    gpu_support: true,
    tpu_support: true,
    version_added: '1.0.0',
    performance_tips: [
      'Use appropriate batch sizes for better performance',
      'Consider using mixed precision training for faster computation'
    ],
    examples: [
      'model.add(Dense(32, activation="relu"))',
      'Dense(1, activation="sigmoid")(inputs)'
    ]
  },
    {
      id: 'conv2d',
      name: 'Conv2D',
      category: CATEGORIES.CONV,
      description: '2D convolution layer',
      icon: <Icons.Grid className="h-4 w-4" />,
      common: true,
      config: {
        filters: {
          type: 'number',
          label: 'Filters',
          default: 32,
          min: 1,
          required: true,
          description: 'Number of output filters'
        },
        kernel_size: {
          type: 'tuple',
          label: 'Kernel Size',
          default: [3, 3],
          description: 'Height and width of the convolution window'
        },
        strides: {
          type: 'tuple',
          label: 'Strides',
          default: [1, 1],
          description: 'Strides of the convolution'
        },
        padding: {
          type: 'select',
          label: 'Padding',
          default: 'valid',
          options: PADDING_TYPES,
          description: 'Padding method'
        },
        data_format: {
          type: 'select',
          label: 'Data Format',
          default: 'channels_last',
          options: ['channels_last', 'channels_first'],
          description: 'Channel ordering'
        },
        dilation_rate: {
          type: 'tuple',
          label: 'Dilation Rate',
          default: [1, 1],
          description: 'Dilation rate for dilated convolution'
        },
        groups: {
          type: 'number',
          label: 'Groups',
          default: 1,
          min: 1,
          description: 'Number of grouped convolutions'
        },
        activation: {
          type: 'select',
          label: 'Activation',
          default: 'relu',
          options: ACTIVATIONS,
          description: 'Activation function'
        },
        use_bias: {
          type: 'boolean',
          label: 'Use Bias',
          default: true,
          description: 'Whether to include a bias'
        },
        kernel_initializer: {
          type: 'select',
          label: 'Kernel Initializer',
          default: 'glorot_uniform',
          options: INITIALIZERS
        },
        bias_initializer: {
          type: 'select',
          label: 'Bias Initializer',
          default: 'zeros',
          options: INITIALIZERS
        },
        kernel_regularizer: {
          type: 'select',
          label: 'Kernel Regularizer',
          default: 'none',
          options: REGULARIZERS
        },
        bias_regularizer: {
          type: 'select',
          label: 'Bias Regularizer',
          default: 'none',
          options: REGULARIZERS
        }
      },
      gpu_support: true,
      tpu_support: true,
      version_added: '1.0.0',
      performance_tips: [
        'Use power of 2 for filter counts',
        'Consider using mixed precision training',
        'Batch size should be tuned for hardware'
      ]
    },
  
    // Pooling Layers
    {
      id: 'maxpool2d',
      name: 'MaxPool2D',
      category: CATEGORIES.POOL,
      description: '2D max pooling operation',
      icon: <Icons.ArrowDown className="h-4 w-4" />,
      common: true,
      config: {
        pool_size: {
          type: 'tuple',
          label: 'Pool Size',
          default: [2, 2],
          description: 'Size of the pooling window'
        },
        strides: {
          type: 'tuple',
          label: 'Strides',
          default: [2, 2],
          description: 'Strides of the pooling operation'
        },
        padding: {
          type: 'select',
          label: 'Padding',
          default: 'valid',
          options: PADDING_TYPES,
          description: 'Padding method'
        },
        data_format: {
          type: 'select',
          label: 'Data Format',
          default: 'channels_last',
          options: ['channels_last', 'channels_first']
        }
      },
      gpu_support: true,
      tpu_support: true
    },
  
    // LSTM Layer
    {
      id: 'lstm',
      name: 'LSTM',
      category: CATEGORIES.RNN,
      description: 'Long Short-Term Memory layer',
      icon: <Icons.Repeat className="h-4 w-4" />,
      common: true,
      config: {
        units: {
          type: 'number',
          label: 'Units',
          default: 64,
          min: 1,
          required: true,
          description: 'Dimensionality of the output space'
        },
        activation: {
          type: 'select',
          label: 'Activation',
          default: 'tanh',
          options: ACTIVATIONS,
          description: 'Activation function for the inner states'
        },
        recurrent_activation: {
          type: 'select',
          label: 'Recurrent Activation',
          default: 'sigmoid',
          options: ACTIVATIONS,
          description: 'Activation function for the recurrent step'
        },
        use_bias: {
          type: 'boolean',
          label: 'Use Bias',
          default: true,
          description: 'Whether to use a bias vector'
        },
        kernel_initializer: {
          type: 'select',
          label: 'Kernel Initializer',
          default: 'glorot_uniform',
          options: INITIALIZERS,
          description: 'Initializer for input weights'
        },
        recurrent_initializer: {
          type: 'select',
          label: 'Recurrent Initializer',
          default: 'orthogonal',
          options: INITIALIZERS,
          description: 'Initializer for recurrent weights'
        },
        bias_initializer: {
          type: 'select',
          label: 'Bias Initializer',
          default: 'zeros',
          options: INITIALIZERS
        },
        unit_forget_bias: {
          type: 'boolean',
          label: 'Unit Forget Bias',
          default: true,
          description: 'Add 1 to forget gate bias'
        },
        return_sequences: {
          type: 'boolean',
          label: 'Return Sequences',
          default: false,
          description: 'Whether to return the full sequence'
        },
        return_state: {
          type: 'boolean',
          label: 'Return State',
          default: false,
          description: 'Whether to return the last state'
        },
        stateful: {
          type: 'boolean',
          label: 'Stateful',
          default: false,
          description: 'Whether to reuse last state as initial state'
        },
        dropout: {
          type: 'range',
          label: 'Dropout',
          default: 0,
          min: 0,
          max: 1,
          step: 0.1,
          description: 'Fraction of units to drop for input gates'
        },
        recurrent_dropout: {
          type: 'range',
          label: 'Recurrent Dropout',
          default: 0,
          min: 0,
          max: 1,
          step: 0.1,
          description: 'Fraction of units to drop for recurrent connections'
        }
      },
      gpu_support: true,
      tpu_support: true,
      performance_tips: [
        'Use CuDNN implementation when possible',
        'Batch sequences of similar length together',
        'Consider bidirectional wrapper for better results'
      ]
    },
  
    // GRU Layer
    {
      id: 'gru',
      name: 'GRU',
      category: CATEGORIES.RNN,
      description: 'Gated Recurrent Unit layer',
      icon: <Icons.GitBranch className="h-4 w-4" />,
      common: true,
      config: {
        units: {
          type: 'number',
          label: 'Units',
          default: 64,
          min: 1,
          required: true,
          description: 'Dimensionality of the output space'
        },
        activation: {
          type: 'select',
          label: 'Activation',
          default: 'tanh',
          options: ACTIVATIONS,
          description: 'Activation function'
        },
        recurrent_activation: {
          type: 'select',
          label: 'Recurrent Activation',
          default: 'sigmoid',
          options: ACTIVATIONS,
          description: 'Activation function for recurrent step'
        },
        use_bias: {
          type: 'boolean',
          label: 'Use Bias',
          default: true
        },
        return_sequences: {
          type: 'boolean',
          label: 'Return Sequences',
          default: false
        },
        return_state: {
          type: 'boolean',
          label: 'Return State',
          default: false
        },
        stateful: {
          type: 'boolean',
          label: 'Stateful',
          default: false
        }
      },
      gpu_support: true,
      tpu_support: true
    },
  
    // Attention Layer
    {
      id: 'attention',
      name: 'Attention',
      category: CATEGORIES.ATTN,
      description: 'Attention mechanism layer',
      icon: <Icons.Eye className="h-4 w-4" />,
      common: true,
      config: {
        use_scale: {
          type: 'boolean',
          label: 'Use Scale',
          default: true,
          description: 'Whether to scale attention scores'
        },
        score_mode: {
          type: 'select',
          label: 'Score Mode',
          default: 'dot',
          options: ['dot', 'general', 'additive'],
          description: 'The attention score mode to use'
        },
        dropout: {
          type: 'range',
          label: 'Dropout',
          default: 0,
          min: 0,
          max: 1,
          step: 0.1
        }
      },
      gpu_support: true,
      tpu_support: true
    },
  
    // MultiHeadAttention Layer
    {
      id: 'multi_head_attention',
      name: 'MultiHeadAttention',
      category: CATEGORIES.ATTN,
      description: 'Multi-head attention mechanism',
      icon: <Icons.Focus className="h-4 w-4" />,
      common: true,
      config: {
        num_heads: {
          type: 'number',
          label: 'Number of Heads',
          default: 8,
          min: 1,
          required: true,
          description: 'Number of attention heads'
        },
        key_dim: {
          type: 'number',
          label: 'Key Dimension',
          default: 64,
          min: 1,
          description: 'Size of each attention head'
        },
        value_dim: {
          type: 'number',
          label: 'Value Dimension',
          default: 64,
          min: 1,
          description: 'Size of each value head'
        },
        dropout: {
          type: 'range',
          label: 'Dropout',
          default: 0,
          min: 0,
          max: 1,
          step: 0.1,
          description: 'Dropout rate'
        },
        use_bias: {
          type: 'boolean',
          label: 'Use Bias',
          default: true,
          description: 'Whether to use bias'
        }
      },
      gpu_support: true,
      tpu_support: true,
      performance_tips: [
        'Set num_heads to be divisible by key_dim',
        'Use power of 2 for dimensions',
        'Consider using mixed precision training'
      ]
    },
  
    // BatchNormalization Layer
    {
      id: 'batch_normalization',
      name: 'BatchNormalization',
      category: CATEGORIES.NORM,
      description: 'Batch normalization layer',
      icon: <Icons.Activity className="h-4 w-4" />,
      common: true,
      config: {
        axis: {
          type: 'number',
          label: 'Axis',
          default: -1,
          description: 'The axis that should be normalized'
        },
        momentum: {
          type: 'range',
          label: 'Momentum',
          default: 0.99,
          min: 0,
          max: 1,
          step: 0.01,
          description: 'Momentum for the moving average'
        },
        epsilon: {
          type: 'number',
          label: 'Epsilon',
          default: 0.001,
          min: 0.000001,
          description: 'Small float added to variance'
        },
        center: {
          type: 'boolean',
          label: 'Center',
          default: true,
          description: 'Add offset of beta'
        },
        scale: {
          type: 'boolean',
          label: 'Scale',
          default: true,
          description: 'Multiply by gamma'
        }
      },
      gpu_support: true,
      tpu_support: true
    },
  
    // Dropout Layer
    {
      id: 'dropout',
      name: 'Dropout',
      category: CATEGORIES.REG,
      description: 'Randomly sets input units to 0',
      icon: <Icons.Shield className="h-4 w-4" />,
      common: true,
      config: {
        rate: {
          type: 'range',
          label: 'Rate',
          default: 0.2,
          min: 0,
          max: 1,
          step: 0.1,
          description: 'Fraction of units to drop'
        },
        noise_shape: {
          type: 'array',
          label: 'Noise Shape',
          default: null,
          description: 'Shape of the binary dropout mask'
        },
        seed: {
          type: 'number',
          label: 'Seed',
          default: null,
          description: 'Random seed for reproducibility'
        }
      },
      gpu_support: true,
      tpu_support: true
    },
  
    // Conv2DTranspose Layer
    {
      id: 'conv2d_transpose',
      name: 'Conv2DTranspose',
      category: CATEGORIES.CONV,
      description: 'Transposed convolution layer',
      icon: <Icons.RefreshCcw className="h-4 w-4" />,
      common: false,
      config: {
        filters: {
          type: 'number',
          label: 'Filters',
          default: 32,
          min: 1,
          required: true,
          description: 'Number of output filters'
        },
        kernel_size: {
          type: 'tuple',
          label: 'Kernel Size',
          default: [3, 3],
          description: 'Height and width of the convolution window'
        },
        strides: {
          type: 'tuple',
          label: 'Strides',
          default: [1, 1],
          description: 'Strides of the convolution'
        },
        padding: {
          type: 'select',
          label: 'Padding',
          default: 'valid',
          options: PADDING_TYPES,
          description: 'Padding method'
        },
        output_padding: {
          type: 'tuple',
          label: 'Output Padding',
          default: null,
          description: 'Additional padding for output shape'
        }
      },
      gpu_support: true,
      tpu_support: true
    },
  // SeparableConv2D Layer
  {
    id: 'separable_conv2d',
    name: 'SeparableConv2D',
    category: CATEGORIES.CONV,
    description: 'Depthwise separable 2D convolution',
    icon: <Icons.Layers className="h-4 w-4" />,
    common: false,
    config: {
      filters: {
        type: 'number',
        label: 'Filters',
        default: 32,
        min: 1,
        required: true,
        description: 'Number of output filters'
      },
      kernel_size: {
        type: 'tuple',
        label: 'Kernel Size',
        default: [3, 3],
        description: 'Size of the convolution window'
      },
      strides: {
        type: 'tuple',
        label: 'Strides',
        default: [1, 1],
        description: 'Strides of the convolution'
      },
      padding: {
        type: 'select',
        label: 'Padding',
        default: 'valid',
        options: PADDING_TYPES,
        description: 'Padding method'
      },
      depth_multiplier: {
        type: 'number',
        label: 'Depth Multiplier',
        default: 1,
        min: 1,
        description: 'Number of depthwise convolution output channels'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // GlobalAveragePooling2D Layer
  {
    id: 'global_average_pooling2d',
    name: 'GlobalAveragePooling2D',
    category: CATEGORIES.POOL,
    description: 'Global average pooling operation for 2D data',
    icon: <Icons.Minimize2 className="h-4 w-4" />,
    common: true,
    config: {
      data_format: {
        type: 'select',
        label: 'Data Format',
        default: 'channels_last',
        options: ['channels_last', 'channels_first'],
        description: 'Channel ordering'
      },
      keepdims: {
        type: 'boolean',
        label: 'Keep Dimensions',
        default: false,
        description: 'Keep the spatial dimensions'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // TextVectorization Layer
  {
    id: 'text_vectorization',
    name: 'TextVectorization',
    category: CATEGORIES.PREP,
    description: 'Text preprocessing layer',
    icon: <Icons.Hash className="h-4 w-4" />,
    common: true,
    config: {
      max_tokens: {
        type: 'number',
        label: 'Max Tokens',
        default: 10000,
        min: 1,
        description: 'Maximum size of the vocabulary'
      },
      standardize: {
        type: 'select',
        label: 'Standardize',
        default: 'lower_and_strip_punctuation',
        options: [
          'lower_and_strip_punctuation',
          'lower',
          'strip_punctuation',
          'none'
        ],
        description: 'Text standardization method'
      },
      split: {
        type: 'select',
        label: 'Split',
        default: 'whitespace',
        options: ['whitespace', 'character'],
        description: 'Split method for tokenization'
      },
      ngrams: {
        type: 'number',
        label: 'N-grams',
        default: null,
        min: 1,
        description: 'N-gram size to generate'
      },
      output_mode: {
        type: 'select',
        label: 'Output Mode',
        default: 'int',
        options: ['int', 'binary', 'count', 'tf_idf'],
        description: 'Output encoding method'
      }
    },
    gpu_support: false,
    tpu_support: false
  },

  // Embedding Layer
  {
    id: 'embedding',
    name: 'Embedding',
    category: CATEGORIES.EMBED,
    description: 'Turns positive integers into dense vectors',
    icon: <Icons.Database className="h-4 w-4" />,
    common: true,
    config: {
      input_dim: {
        type: 'number',
        label: 'Input Dim',
        default: 1000,
        min: 1,
        required: true,
        description: 'Size of the vocabulary'
      },
      output_dim: {
        type: 'number',
        label: 'Output Dim',
        default: 100,
        min: 1,
        required: true,
        description: 'Length of the dense embedding'
      },
      embeddings_initializer: {
        type: 'select',
        label: 'Embeddings Initializer',
        default: 'uniform',
        options: INITIALIZERS,
        description: 'Initializer for embeddings matrix'
      },
      embeddings_regularizer: {
        type: 'select',
        label: 'Embeddings Regularizer',
        default: 'none',
        options: REGULARIZERS,
        description: 'Regularizer for embeddings matrix'
      },
      embeddings_constraint: {
        type: 'select',
        label: 'Embeddings Constraint',
        default: 'none',
        options: CONSTRAINTS,
        description: 'Constraint for embeddings matrix'
      },
      mask_zero: {
        type: 'boolean',
        label: 'Mask Zero',
        default: false,
        description: 'Whether to mask zero values'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Conv1D Layer
  {
    id: 'conv1d',
    name: 'Conv1D',
    category: CATEGORIES.CONV,
    description: '1D convolution layer',
    icon: <Icons.MinusSquare className="h-4 w-4" />,
    common: false,
    config: {
      filters: {
        type: 'number',
        label: 'Filters',
        default: 32,
        min: 1,
        required: true,
        description: 'Number of output filters'
      },
      kernel_size: {
        type: 'number',
        label: 'Kernel Size',
        default: 3,
        min: 1,
        description: 'Size of the convolution window'
      },
      strides: {
        type: 'number',
        label: 'Strides',
        default: 1,
        min: 1,
        description: 'Stride length of the convolution'
      },
      padding: {
        type: 'select',
        label: 'Padding',
        default: 'valid',
        options: PADDING_TYPES,
        description: 'Padding method'
      },
      dilation_rate: {
        type: 'number',
        label: 'Dilation Rate',
        default: 1,
        min: 1,
        description: 'Dilation rate for dilated convolution'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // LayerNormalization
  {
    id: 'layer_normalization',
    name: 'LayerNormalization',
    category: CATEGORIES.NORM,
    description: 'Layer normalization layer',
    icon: <Icons.Activity className="h-4 w-4" />,
    common: true,
    config: {
      axis: {
        type: 'number',
        label: 'Axis',
        default: -1,
        description: 'The axis or axes to normalize'
      },
      epsilon: {
        type: 'number',
        label: 'Epsilon',
        default: 1e-3,
        min: 1e-7,
        description: 'Small float added to variance'
      },
      center: {
        type: 'boolean',
        label: 'Center',
        default: true,
        description: 'If True, add offset of beta'
      },
      scale: {
        type: 'boolean',
        label: 'Scale',
        default: true,
        description: 'If True, multiply by gamma'
      }
    },
    gpu_support: true,
    tpu_support: true
  },
// Bidirectional Wrapper
{
    id: 'bidirectional',
    name: 'Bidirectional',
    category: CATEGORIES.RNN,
    description: 'Bidirectional wrapper for RNNs',
    icon: <Icons.ArrowLeftRight className="h-4 w-4" />,
    common: true,
    config: {
      layer: {
        type: 'select',
        label: 'Layer Type',
        default: 'lstm',
        options: ['lstm', 'gru', 'simple_rnn'],
        description: 'The RNN layer to wrap'
      },
      merge_mode: {
        type: 'select',
        label: 'Merge Mode',
        default: 'concat',
        options: ['sum', 'mul', 'concat', 'ave'],
        description: 'Mode to merge bidirectional outputs'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // TimeDistributed Wrapper
  {
    id: 'time_distributed',
    name: 'TimeDistributed',
    category: CATEGORIES.CORE,
    description: 'Applies a layer to every temporal slice',
    icon: <Icons.Clock className="h-4 w-4" />,
    common: false,
    config: {
      layer: {
        type: 'select',
        label: 'Layer',
        default: 'dense',
        options: ['dense', 'conv1d', 'conv2d'],
        description: 'The layer to apply'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Cropping2D Layer
  {
    id: 'cropping2d',
    name: 'Cropping2D',
    category: CATEGORIES.CONV,
    description: 'Crops 2D input data',
    icon: <Icons.Scissors className="h-4 w-4" />,
    common: false,
    config: {
      cropping: {
        type: 'tuple',
        label: 'Cropping',
        default: [[0, 0], [0, 0]],
        description: 'Cropping pattern'
      },
      data_format: {
        type: 'select',
        label: 'Data Format',
        default: 'channels_last',
        options: ['channels_last', 'channels_first']
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Add Operation
  {
    id: 'add',
    name: 'Add',
    category: CATEGORIES.MERGE,
    description: 'Layer that adds a list of inputs',
    icon: <Icons.Plus className="h-4 w-4" />,
    common: true,
    config: {},
    gpu_support: true,
    tpu_support: true
  },

  // Multiply Operation
  {
    id: 'multiply',
    name: 'Multiply',
    category: CATEGORIES.MERGE,
    description: 'Layer that multiplies a list of inputs',
    icon: <Icons.X className="h-4 w-4" />,
    common: true,
    config: {},
    gpu_support: true,
    tpu_support: true
  },

  // Average Operation
  {
    id: 'average',
    name: 'Average',
    category: CATEGORIES.MERGE,
    description: 'Layer that averages a list of inputs',
    icon: <Icons.DivideSquare className="h-4 w-4" />,
    common: true,
    config: {},
    gpu_support: true,
    tpu_support: true
  },

  // Maximum Operation
  {
    id: 'maximum',
    name: 'Maximum',
    category: CATEGORIES.MERGE,
    description: 'Layer that computes element-wise maximum',
    icon: <Icons.TrendingUp className="h-4 w-4" />,
    common: false,
    config: {},
    gpu_support: true,
    tpu_support: true
  },

  // Minimum Operation
  {
    id: 'minimum',
    name: 'Minimum',
    category: CATEGORIES.MERGE,
    description: 'Layer that computes element-wise minimum',
    icon: <Icons.TrendingDown className="h-4 w-4" />,
    common: false,
    config: {},
    gpu_support: true,
    tpu_support: true
  },

  // Concatenate Operation
  {
    id: 'concatenate',
    name: 'Concatenate',
    category: CATEGORIES.MERGE,
    description: 'Layer that concatenates a list of inputs',
    icon: <Icons.Combine className="h-4 w-4" />,
    common: true,
    config: {
      axis: {
        type: 'number',
        label: 'Axis',
        default: -1,
        description: 'Axis along which to concatenate'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Dot Operation
  {
    id: 'dot',
    name: 'Dot',
    category: CATEGORIES.MERGE,
    description: 'Layer that computes dot product',
    icon: <Icons.Dot className="h-4 w-4" />,
    common: false,
    config: {
      axes: {
        type: 'tuple',
        label: 'Axes',
        default: [-1, -1],
        description: 'Axes along which to compute dot product'
      },
      normalize: {
        type: 'boolean',
        label: 'Normalize',
        default: false,
        description: 'Whether to L2-normalize samples'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // RandomFlip Layer
  {
    id: 'random_flip',
    name: 'RandomFlip',
    category: CATEGORIES.AUGMENT,
    description: 'Randomly flips inputs',
    icon: <Icons.FlipHorizontal className="h-4 w-4" />,
    common: false,
    config: {
      mode: {
        type: 'select',
        label: 'Mode',
        default: 'horizontal_and_vertical',
        options: ['horizontal', 'vertical', 'horizontal_and_vertical'],
        description: 'Flip mode to use'
      },
      seed: {
        type: 'number',
        label: 'Seed',
        default: null,
        description: 'Random seed for reproducibility'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // RandomRotation Layer
  {
    id: 'random_rotation',
    name: 'RandomRotation',
    category: CATEGORIES.AUGMENT,
    description: 'Randomly rotates inputs',
    icon: <Icons.RotateCcw className="h-4 w-4" />,
    common: false,
    config: {
      factor: {
        type: 'range',
        label: 'Factor',
        default: 0.2,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Rotation range as fraction of 2π'
      },
      fill_mode: {
        type: 'select',
        label: 'Fill Mode',
        default: 'reflect',
        options: ['constant', 'reflect', 'wrap', 'nearest'],
        description: 'Points outside boundary handling'
      },
      interpolation: {
        type: 'select',
        label: 'Interpolation',
        default: 'bilinear',
        options: INTERPOLATION_METHODS,
        description: 'Interpolation method to use'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // RandomZoom Layer
  {
    id: 'random_zoom',
    name: 'RandomZoom',
    category: CATEGORIES.AUGMENT,
    description: 'Randomly zooms inputs',
    icon: <Icons.ZoomIn className="h-4 w-4" />,
    common: false,
    config: {
      height_factor: {
        type: 'range',
        label: 'Height Factor',
        default: 0.2,
        min: -1,
        max: 1,
        step: 0.1,
        description: 'Vertical zoom range'
      },
      width_factor: {
        type: 'range',
        label: 'Width Factor',
        default: 0.2,
        min: -1,
        max: 1,
        step: 0.1,
        description: 'Horizontal zoom range'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // RandomContrast Layer
  {
    id: 'random_contrast',
    name: 'RandomContrast',
    category: CATEGORIES.AUGMENT,
    description: 'Randomly adjusts contrast',
    icon: <Icons.Contrast className="h-4 w-4" />,
    common: false,
    config: {
      factor: {
        type: 'range',
        label: 'Factor',
        default: 0.2,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Contrast adjustment range'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Loss Functions
  {
    id: 'binary_crossentropy',
    name: 'BinaryCrossentropy',
    category: CATEGORIES.LOSS,
    description: 'Binary crossentropy loss',
    icon: <Icons.AlertTriangle className="h-4 w-4" />,
    common: true,
    config: {
      from_logits: {
        type: 'boolean',
        label: 'From Logits',
        default: false,
        description: 'Whether to interpret predictions as logits'
      },
      label_smoothing: {
        type: 'range',
        label: 'Label Smoothing',
        default: 0,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Label smoothing factor'
      }
    }
  },

  {
    id: 'categorical_crossentropy',
    name: 'CategoricalCrossentropy',
    category: CATEGORIES.LOSS,
    description: 'Categorical crossentropy loss',
    icon: <Icons.AlertTriangle className="h-4 w-4" />,
    common: true,
    config: {
      from_logits: {
        type: 'boolean',
        label: 'From Logits',
        default: false,
        description: 'Whether to interpret predictions as logits'
      },
      label_smoothing: {
        type: 'range',
        label: 'Label Smoothing',
        default: 0,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Label smoothing factor'
      }
    }
  },

  // Optimizers
  {
    id: 'adam',
    name: 'Adam',
    category: CATEGORIES.OPT,
    description: 'Adam optimizer',
    icon: <Icons.Zap className="h-4 w-4" />,
    common: true,
    config: {
      learning_rate: {
        type: 'number',
        label: 'Learning Rate',
        default: 0.001,
        min: 0,
        description: 'Learning rate'
      },
      beta_1: {
        type: 'range',
        label: 'Beta 1',
        default: 0.9,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Exponential decay rate for 1st moment'
      },
      beta_2: {
        type: 'range',
        label: 'Beta 2',
        default: 0.999,
        min: 0,
        max: 1,
        step: 0.001,
        description: 'Exponential decay rate for 2nd moment'
      },
      epsilon: {
        type: 'number',
        label: 'Epsilon',
        default: 1e-7,
        min: 0,
        description: 'Small constant for numerical stability'
      }
    }
  },

  // RMSprop Optimizer
  {
    id: 'rmsprop',
    name: 'RMSprop',
    category: CATEGORIES.OPT,
    description: 'RMSprop optimizer',
    icon: <Icons.Zap className="h-4 w-4" />,
    common: true,
    config: {
      learning_rate: {
        type: 'number',
        label: 'Learning Rate',
        default: 0.001,
        min: 0,
        description: 'Learning rate'
      },
      rho: {
        type: 'range',
        label: 'Rho',
        default: 0.9,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Decay rate'
      },
      momentum: {
        type: 'range',
        label: 'Momentum',
        default: 0,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Momentum factor'
      },
      epsilon: {
        type: 'number',
        label: 'Epsilon',
        default: 1e-7,
        min: 0,
        description: 'Small constant for numerical stability'
      }
    }
  },

  // SGD Optimizer
  {
    id: 'sgd',
    name: 'SGD',
    category: CATEGORIES.OPT,
    description: 'Stochastic gradient descent optimizer',
    icon: <Icons.TrendingDown className="h-4 w-4" />,
    common: true,
    config: {
      learning_rate: {
        type: 'number',
        label: 'Learning Rate',
        default: 0.01,
        min: 0,
        description: 'Learning rate'
      },
      momentum: {
        type: 'range',
        label: 'Momentum',
        default: 0,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Momentum factor'
      },
      nesterov: {
        type: 'boolean',
        label: 'Nesterov',
        default: false,
        description: 'Whether to apply Nesterov momentum'
      }
    }
  },

  // Metrics
  {
    id: 'accuracy',
    name: 'Accuracy',
    category: CATEGORIES.METRICS,
    description: 'Accuracy metric',
    icon: <Icons.Gauge className="h-4 w-4" />,
    common: true,
    config: {
      threshold: {
        type: 'range',
        label: 'Threshold',
        default: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Classification threshold'
      }
    }
  },

  // Precision Metric
  {
    id: 'precision',
    name: 'Precision',
    category: CATEGORIES.METRICS,
    description: 'Precision metric',
    icon: <Icons.Target className="h-4 w-4" />,
    common: true,
    config: {
      thresholds: {
        type: 'range',
        label: 'Thresholds',
        default: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Classification threshold'
      }
    }
  },

  // Recall Metric
  {
    id: 'recall',
    name: 'Recall',
    category: CATEGORIES.METRICS,
    description: 'Recall metric',
    icon: <Icons.Target className="h-4 w-4" />,
    common: true,
    config: {
      thresholds: {
        type: 'range',
        label: 'Thresholds',
        default: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Classification threshold'
      }
    }
  },

  // AUC Metric
  {
    id: 'auc',
    name: 'AUC',
    category: CATEGORIES.METRICS,
    description: 'Area Under the Curve metric',
    icon: <Icons.LineChart className="h-4 w-4" />,
    common: true,
    config: {
      num_thresholds: {
        type: 'number',
        label: 'Number of Thresholds',
        default: 200,
        min: 1,
        description: 'Number of thresholds to use'
      },
      curve: {
        type: 'select',
        label: 'Curve',
        default: 'ROC',
        options: ['ROC', 'PR'],
        description: 'Curve type to use'
      }
    }
  },
// Signal Processing Layers
{
    id: 'stft',
    name: 'STFT',
    category: CATEGORIES.SIGNAL,
    description: 'Short-time Fourier transform layer',
    icon: <Icons.Waves className="h-4 w-4" />,
    common: false,
    config: {
      frame_length: {
        type: 'number',
        label: 'Frame Length',
        default: 256,
        min: 1,
        description: 'Length of each frame'
      },
      frame_step: {
        type: 'number',
        label: 'Frame Step',
        default: 128,
        min: 1,
        description: 'Number of samples to step between frames'
      },
      fft_length: {
        type: 'number',
        label: 'FFT Length',
        default: null,
        description: 'Size of FFT to apply'
      }
    },
    gpu_support: true,
    tpu_support: false
  },

  // Audio Processing
  {
    id: 'melspectrogram',
    name: 'MelSpectrogram',
    category: CATEGORIES.AUDIO,
    description: 'Computes mel-spectrograms from audio signals',
    icon: <Icons.Music className="h-4 w-4" />,
    common: false,
    config: {
      sample_rate: {
        type: 'number',
        label: 'Sample Rate',
        default: 22050,
        min: 1,
        description: 'Audio sample rate'
      },
      n_fft: {
        type: 'number',
        label: 'N FFT',
        default: 2048,
        min: 1,
        description: 'Length of FFT window'
      },
      n_mels: {
        type: 'number',
        label: 'N Mels',
        default: 128,
        min: 1,
        description: 'Number of mel bands'
      },
      fmin: {
        type: 'number',
        label: 'Min Frequency',
        default: 0,
        min: 0,
        description: 'Minimum frequency'
      },
      fmax: {
        type: 'number',
        label: 'Max Frequency',
        default: null,
        description: 'Maximum frequency'
      }
    },
    gpu_support: true,
    tpu_support: false
  },

  // Graph Neural Network Layers
  {
    id: 'graph_conv',
    name: 'GraphConvolution',
    category: CATEGORIES.GRAPH,
    description: 'Graph convolutional layer',
    icon: <Icons.Network className="h-4 w-4" />,
    common: false,
    config: {
      units: {
        type: 'number',
        label: 'Units',
        default: 32,
        min: 1,
        description: 'Dimensionality of output space'
      },
      use_bias: {
        type: 'boolean',
        label: 'Use Bias',
        default: true,
        description: 'Whether to use bias'
      },
      activation: {
        type: 'select',
        label: 'Activation',
        default: 'relu',
        options: ACTIVATIONS,
        description: 'Activation function'
      },
      kernel_initializer: {
        type: 'select',
        label: 'Kernel Initializer',
        default: 'glorot_uniform',
        options: INITIALIZERS
      }
    },
    gpu_support: true,
    tpu_support: false
  },

  // Advanced Optimization Layers
  {
    id: 'gradient_reversal',
    name: 'GradientReversal',
    category: CATEGORIES.OPTIM,
    description: 'Gradient reversal layer for domain adaptation',
    icon: <Icons.RefreshCw className="h-4 w-4" />,
    common: false,
    config: {
      lambda: {
        type: 'number',
        label: 'Lambda',
        default: 1.0,
        description: 'Gradient reversal strength'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // TPU Specific Operations
  {
    id: 'tpu_embedding',
    name: 'TPUEmbedding',
    category: CATEGORIES.TPU,
    description: 'TPU-optimized embedding layer',
    icon: <Icons.Cpu className="h-4 w-4" />,
    common: false,
    config: {
      vocabulary_size: {
        type: 'number',
        label: 'Vocabulary Size',
        default: 10000,
        min: 1,
        description: 'Size of vocabulary'
      },
      embedding_dim: {
        type: 'number',
        label: 'Embedding Dimension',
        default: 128,
        min: 1,
        description: 'Dimension of embedding vectors'
      },
      partition_strategy: {
        type: 'select',
        label: 'Partition Strategy',
        default: 'div',
        options: ['div', 'mod'],
        description: 'How to partition embeddings'
      }
    },
    gpu_support: false,
    tpu_support: true
  },

  // Quantization Layers
  {
    id: 'quantize',
    name: 'Quantize',
    category: CATEGORIES.QUANT,
    description: 'Quantizes tensors to reduced precision',
    icon: <Icons.Binary className="h-4 w-4" />,
    common: false,
    config: {
      bits: {
        type: 'number',
        label: 'Bits',
        default: 8,
        min: 1,
        max: 32,
        description: 'Number of bits for quantization'
      },
      axis: {
        type: 'number',
        label: 'Axis',
        default: -1,
        description: 'Axis along which to quantize'
      },
      symmetric: {
        type: 'boolean',
        label: 'Symmetric',
        default: true,
        description: 'Use symmetric quantization'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Probabilistic Layers
  {
    id: 'random_normal',
    name: 'RandomNormal',
    category: CATEGORIES.PROB,
    description: 'Layer that generates random normal tensors',
    icon: <Icons.Waves className="h-4 w-4" />,
    common: false,
    config: {
      mean: {
        type: 'number',
        label: 'Mean',
        default: 0.0,
        description: 'Mean of normal distribution'
      },
      stddev: {
        type: 'number',
        label: 'Standard Deviation',
        default: 1.0,
        min: 0,
        description: 'Standard deviation of normal distribution'
      },
      seed: {
        type: 'number',
        label: 'Seed',
        default: null,
        description: 'Random seed for reproducibility'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Video Processing Layers
  {
    id: 'conv3d',
    name: 'Conv3D',
    category: CATEGORIES.VIDEO,
    description: '3D convolution layer for spatiotemporal data',
    icon: <Icons.Box className="h-4 w-4" />, // Using Box instead of Cube
    common: false,
    config: {
      filters: {
        type: 'number',
        label: 'Filters',
        default: 32,
        min: 1,
        required: true,
        description: 'Number of output filters'
      },
      kernel_size: {
        type: 'tuple',
        label: 'Kernel Size',
        default: [3, 3, 3],
        description: 'Size of the 3D convolution window'
      },
      strides: {
        type: 'tuple',
        label: 'Strides',
        default: [1, 1, 1],
        description: 'Strides of the convolution'
      },
      padding: {
        type: 'select',
        label: 'Padding',
        default: 'valid',
        options: PADDING_TYPES,
        description: 'Padding method'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Text Processing Specialized Layers
  {
    id: 'positional_embedding',
    name: 'PositionalEmbedding',
    category: CATEGORIES.TEXT,
    description: 'Adds positional information to embeddings',
    icon: <Icons.AlignJustify className="h-4 w-4" />,
    common: false,
    config: {
      sequence_length: {
        type: 'number',
        label: 'Sequence Length',
        default: 512,
        min: 1,
        description: 'Maximum sequence length'
      },
      embedding_dim: {
        type: 'number',
        label: 'Embedding Dimension',
        default: 256,
        min: 1,
        description: 'Dimension of embeddings'
      },
      trainable: {
        type: 'boolean',
        label: 'Trainable',
        default: true,
        description: 'Whether positions are trainable'
      }
    },
    gpu_support: true,
    tpu_support: true
  },
// Advanced Regularization Layers
{
    id: 'activity_regularization',
    name: 'ActivityRegularization',
    category: CATEGORIES.REG,
    description: 'Layer that applies an activity regularization loss',
    icon: <Icons.Shield className="h-4 w-4" />,
    common: false,
    config: {
      l1: {
        type: 'number',
        label: 'L1',
        default: 0.0,
        min: 0,
        description: 'L1 regularization factor'
      },
      l2: {
        type: 'number',
        label: 'L2',
        default: 0.0,
        min: 0,
        description: 'L2 regularization factor'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Spatial Dropout
  {
    id: 'spatial_dropout',
    name: 'SpatialDropout2D',
    category: CATEGORIES.REG,
    description: 'Spatial Dropout for convolutional inputs',
    icon: <Icons.Grid className="h-4 w-4" />,
    common: false,
    config: {
      rate: {
        type: 'range',
        label: 'Rate',
        default: 0.2,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Fraction of features to drop'
      },
      data_format: {
        type: 'select',
        label: 'Data Format',
        default: 'channels_last',
        options: ['channels_last', 'channels_first'],
        description: 'Channel ordering'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Distribution Strategy Layers
  {
    id: 'parameter_server_strategy',
    name: 'ParameterServerStrategy',
    category: CATEGORIES.DIST,
    description: 'Distribution strategy for parameter server training',
    icon: <Icons.Network className="h-4 w-4" />,
    common: false,
    config: {
      cluster_resolver: {
        type: 'object',
        label: 'Cluster Resolver',
        default: null,
        description: 'TensorFlow cluster resolver'
      },
      variable_partitioner: {
        type: 'select',
        label: 'Variable Partitioner',
        default: 'none',
        options: ['none', 'min_size', 'fixed_size'],
        description: 'How to partition variables'
      }
    },
    gpu_support: true,
    tpu_support: false
  },

  // Mixed Precision Training
  {
    id: 'mixed_precision',
    name: 'MixedPrecision',
    category: CATEGORIES.OPTIM,
    description: 'Enables mixed precision training',
    icon: <Icons.Gauge className="h-4 w-4" />,
    common: false,
    config: {
      dtype: {
        type: 'select',
        label: 'Data Type',
        default: 'mixed_float16',
        options: ['mixed_float16', 'mixed_bfloat16'],
        description: 'Mixed precision data type'
      },
      loss_scale: {
        type: 'select',
        label: 'Loss Scale',
        default: 'dynamic',
        options: ['dynamic', 'fixed'],
        description: 'Loss scaling strategy'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Feature Column Layers
  {
    id: 'numeric_column',
    name: 'NumericColumn',
    category: CATEGORIES.FEATURE,
    description: 'Feature column for numeric data',
    icon: <Icons.Hash className="h-4 w-4" />,
    common: true,
    config: {
      key: {
        type: 'text',
        label: 'Key',
        default: '',
        required: true,
        description: 'Feature name'
      },
      shape: {
        type: 'array',
        label: 'Shape',
        default: [1],
        description: 'Shape of numeric feature'
      },
      default_value: {
        type: 'number',
        label: 'Default Value',
        default: null,
        description: 'Value for missing entries'
      },
      dtype: {
        type: 'select',
        label: 'Data Type',
        default: 'float32',
        options: ['float32', 'float64', 'int32', 'int64'],
        description: 'Data type of feature'
      },
      normalizer_fn: {
        type: 'function',
        label: 'Normalizer Function',
        default: null,
        description: 'Function to normalize features'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Custom Training Loops
  {
    id: 'gradient_tape',
    name: 'GradientTape',
    category: CATEGORIES.CUSTOM,
    description: 'Custom training with automatic differentiation',
    icon: <Icons.Edit3 className="h-4 w-4" />,
    common: false,
    config: {
      persistent: {
        type: 'boolean',
        label: 'Persistent',
        default: false,
        description: 'Whether tape can compute multiple gradients'
      },
      watch_accessed_variables: {
        type: 'boolean',
        label: 'Watch Accessed Variables',
        default: true,
        description: 'Automatically watch accessed variables'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Model Parallel Layers
  {
    id: 'model_parallel',
    name: 'ModelParallel',
    category: CATEGORIES.DIST,
    description: 'Enables model parallelism across devices',
    icon: <Icons.SplitSquareHorizontal className="h-4 w-4" />,
    common: false,
    config: {
      devices: {
        type: 'array',
        label: 'Devices',
        default: [],
        description: 'List of devices for distribution'
      },
      partition_dims: {
        type: 'array',
        label: 'Partition Dimensions',
        default: [1],
        description: 'How to partition each layer'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Metrics Computation Layers
  {
    id: 'f1_score',
    name: 'F1Score',
    category: CATEGORIES.METRICS,
    description: 'Computes F1 score metric',
    icon: <Icons.Target className="h-4 w-4" />,
    common: true,
    config: {
      average: {
        type: 'select',
        label: 'Average',
        default: 'binary',
        options: ['binary', 'micro', 'macro', 'weighted'],
        description: 'Averaging strategy'
      },
      threshold: {
        type: 'range',
        label: 'Threshold',
        default: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Classification threshold'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Data Pipeline Operations
  {
    id: 'data_pipeline',
    name: 'DataPipeline',
    category: CATEGORIES.IO,
    description: 'Configures input data pipeline',
    icon: <Icons.Database className="h-4 w-4" />,
    common: true,
    config: {
      batch_size: {
        type: 'number',
        label: 'Batch Size',
        default: 32,
        min: 1,
        description: 'Size of batches'
      },
      shuffle_buffer_size: {
        type: 'number',
        label: 'Shuffle Buffer Size',
        default: 10000,
        min: 0,
        description: 'Size of shuffle buffer'
      },
      prefetch_buffer_size: {
        type: 'number',
        label: 'Prefetch Buffer Size',
        default: 1,
        min: 0,
        description: 'Size of prefetch buffer'
      },
      num_parallel_calls: {
        type: 'number',
        label: 'Parallel Calls',
        default: -1,
        description: 'Number of parallel calls (-1 for auto)'
      }
    },
    gpu_support: true,
    tpu_support: true
  },

  // Custom Callback Operations
  {
    id: 'early_stopping',
    name: 'EarlyStopping',
    category: CATEGORIES.CALLBACK,
    description: 'Stop training when metric has stopped improving',
    icon: <Icons.StopCircle className="h-4 w-4" />,
    common: true,
    config: {
      monitor: {
        type: 'text',
        label: 'Monitor',
        default: 'val_loss',
        description: 'Quantity to monitor'
      },
      min_delta: {
        type: 'number',
        label: 'Min Delta',
        default: 0,
        description: 'Minimum change to qualify as improvement'
      },
      patience: {
        type: 'number',
        label: 'Patience',
        default: 0,
        min: 0,
        description: 'Number of epochs with no improvement'
      },
      restore_best_weights: {
        type: 'boolean',
        label: 'Restore Best Weights',
        default: false,
        description: 'Whether to restore model weights from best epoch'
      }
    },
    gpu_support: true,
    tpu_support: true
  }
]

  const OperationCard = ({ operation, onAdd }: { operation: Operation, onAdd: (op: Operation) => void }) => (
    <Card className="cursor-pointer hover:bg-gray-50" onClick={() => onAdd(operation)}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {operation.icon}
            <span className="font-medium">{operation.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={operation.common ? "default" : "secondary"}>
              {operation.category}
            </Badge>
            <Icons.Plus className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{operation.description}</p>
      </CardContent>
    </Card>
  );
  
  const OperationDetails = ({ operation }: { operation: Operation }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icons.Info className="h-4 w-4 mr-2" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {operation.icon}
            {operation.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-gray-600">{operation.description}</p>
          </div>
          {operation.performance_tips && (
            <div className="space-y-2">
              <h3 className="font-medium">Performance Tips</h3>
              <ul className="list-disc pl-4 space-y-1">
                {operation.performance_tips.map((tip, i) => (
                  <li key={i} className="text-gray-600">{tip}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-4">
            <Badge variant={operation.gpu_support ? "default" : "secondary"}>
              GPU {operation.gpu_support ? "✓" : "✗"}
            </Badge>
            <Badge variant={operation.tpu_support ? "default" : "secondary"}>
              TPU {operation.tpu_support ? "✓" : "✗"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  
  const ConfigurationPanel = ({ 
    operation, 
    config, 
    onChange 
  }: { 
    operation: Operation;
    config: Record<string, any>;
    onChange: (key: string, value: any) => void;
  }) => {
    // Early return if no config
    if (!operation.config) return null;
  
  
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="config">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Icons.Settings className="h-4 w-4" />
              Configuration
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-2">
              {Object.entries(operation.config).map(([key, field]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <ConfigField
                    field={field}
                    value={config[key] ?? field.default}
                    onChange={(value) => onChange(key, value)}
                  />
                  {field.description && (
                    <p className="text-xs text-gray-500">{field.description}</p>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };
  
  const ConfigField = ({ 
    field, 
    value, 
    onChange 
  }: {
    field: OperationConfig;
    value: any;
    onChange: (value: any) => void;
  }) => {
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
  
  const OperationsList = ({ 
    operations,
    onOperationClick
  }: {
    operations: Operation[];
    onOperationClick: (operation: Operation) => void;
  }) => {
    return (
      <div className="grid grid-cols-2 gap-2">
        {operations.map((operation) => (
          <OperationCard
            key={operation.id}
            operation={operation}
            onAdd={onOperationClick}
          />
        ))}
      </div>
    );
  };
  
  // Replace Flask icon in CategoryTabs component
const CategoryTabs = ({
    categories,
    activeCategory,
    onCategoryChange
  }: {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
  }) => (
    <Tabs value={activeCategory} onValueChange={onCategoryChange}>
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="common" className="flex items-center gap-2">
          <Icons.Star className="h-4 w-4" />
          Common
        </TabsTrigger>
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Icons.Database className="h-4 w-4" />
          All
        </TabsTrigger>
        <TabsTrigger value="custom" className="flex items-center gap-2">
          <Icons.Code className="h-4 w-4" />
          Custom
        </TabsTrigger>
        <TabsTrigger value="experimental" className="flex items-center gap-2">
          <Icons.Beaker className="h-4 w-4" /> 
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
  
  const SearchBar = ({
    value,
    onChange
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="relative">
      <Icons.Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search operations..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
  
  export const TFOperationsBrowser = () => {
    const [selectedOps, setSelectedOps] = useState<Operation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('common');
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
    const [operationConfigs, setOperationConfigs] = useState<Record<string, Record<string, any>>>({});
  
    const filteredOperations = useMemo(() => {
      let ops = allOperations;
      
      if (activeCategory !== 'all') {
        ops = ops.filter(op => 
          activeCategory === 'common' ? op.common : op.category === CATEGORIES[activeCategory.toUpperCase() as keyof typeof CATEGORIES]
        );
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        ops = ops.filter(op => 
          op.name.toLowerCase().includes(term) || 
          op.description.toLowerCase().includes(term)
        );
      }
      
      return ops;
    }, [searchTerm, activeCategory]);
  
    const handleOperationAdd = useCallback((operation: Operation) => {
      setSelectedOps(prev => {
        if (prev.find(op => op.id === operation.id)) return prev;
        return [...prev, operation];
      });
      
      if (operation.config) {
        setOperationConfigs(prev => ({
          ...prev,
          [operation.id]: Object.fromEntries(
            Object.entries(operation.config ?? {}).map(([key, field]) => [key, field.default])
          )
        }));
      }
    }, []);
  
    const handleConfigChange = useCallback((opId: string, key: string, value: any) => {
      setOperationConfigs(prev => ({
        ...prev,
        [opId]: {
          ...prev[opId],
          [key]: value
        }
      }));
    }, []);
  
    return (
      <div className="grid grid-cols-12 gap-4">
        {/* Operations Browser - Left Side */}
        <Card className="col-span-8">
          <CardHeader>
            <CardTitle>Select Operations</CardTitle>
            <div className="space-y-4">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <CategoryTabs
                categories={Object.keys(CATEGORIES)}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <OperationsList
                operations={filteredOperations}
                onOperationClick={handleOperationAdd}
              />
            </ScrollArea>
          </CardContent>
        </Card>
  
        {/* Selected Operations - Right Side */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pipeline Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {selectedOps.map((operation) => (
                <div key={operation.id} className="mb-4">
                  <Card>
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {operation.icon}
                          <span className="font-medium">{operation.name}</span>
                        </div>
                        <OperationDetails operation={operation} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ConfigurationPanel
                        operation={operation}
                        config={operationConfigs[operation.id] || {}}
                        onChange={(key, value) => handleConfigChange(operation.id, key, value)}
                      />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default TFOperationsBrowser;