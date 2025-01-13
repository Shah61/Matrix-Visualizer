export const CATEGORIES = {
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
  
  export const ACTIVATIONS = [
    'relu', 'sigmoid', 'tanh', 'softmax', 'elu', 'selu', 'softplus', 'softsign',
    'hard_sigmoid', 'exponential', 'linear', 'relu6', 'leaky_relu', 'prelu',
    'swish', 'mish', 'gelu', 'standardized_gelu', 'quick_gelu'
  ];
  
  export const PADDING_TYPES = ['valid', 'same', 'causal', 'full'];
  
  export const INTERPOLATION_METHODS = [
    'nearest', 'bilinear', 'bicubic', 'area', 'lanczos3', 'lanczos5', 'gaussian', 'mitchellcubic'
  ];
  
  export const INITIALIZERS = [
    'zeros', 'ones', 'constant', 'random_normal', 'random_uniform', 'truncated_normal',
    'glorot_normal', 'glorot_uniform', 'he_normal', 'he_uniform', 'identity',
    'orthogonal', 'variance_scaling'
  ];
  
  export const REGULARIZERS = ['l1', 'l2', 'l1_l2', 'orthogonal', 'none'];
  
  export const CONSTRAINTS = ['max_norm', 'min_max_norm', 'non_neg', 'unit_norm', 'radial_constraint'];