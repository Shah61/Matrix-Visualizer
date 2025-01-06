// components/workspaces/types.ts

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