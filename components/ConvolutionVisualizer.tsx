'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type Matrix = number[][];
type FilterType = 'identity' | 'edgeDetection1' | 'edgeDetection2' | 'sharpen' | 'boxBlur';

// Main workspace component that contains both users' tabs
const ConvolutionVisualizerTabs = () => {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card className="p-4 mb-8">
        <h1 className="text-3xl font-bold mb-4">Matrix Visualizer Workspaces</h1>
        <Tabs defaultValue="mukhtar" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="mukhtar">Mukhtar</TabsTrigger>
            <TabsTrigger value="haris">Haris</TabsTrigger>
          </TabsList>

          <TabsContent value="mukhtar">
            <div className="border-t pt-4">
              <ConvolutionVisualizer />
            </div>
          </TabsContent>

          <TabsContent value="haris">
            <div className="border-t pt-4">
              <ConvolutionVisualizer />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

// Individual ConvolutionVisualizer component
const ConvolutionVisualizer = () => {
  const [matrixSize, setMatrixSize] = useState<number>(1);
  const [inputSize, setInputSize] = useState<number>(1);
  const [numberOfTables, setNumberOfTables] = useState<number>(1);
  const [normalMatrices, setNormalMatrices] = useState<Matrix[]>([]);
  const [normalInputMatrix, setNormalInputMatrix] = useState<Matrix>([]);
  const [normalOutputMatrices, setNormalOutputMatrices] = useState<Matrix[]>([]);
  const [inputMatrix, setInputMatrix] = useState<Matrix>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('identity');
  const [outputMatrix, setOutputMatrix] = useState<Matrix>([]);
  const [activeTab, setActiveTab] = useState('normal');
  const [isError, setIsError] = useState(false);
  const [stripes, setStripes] = useState<number>(1);

  const tableCounts = [1, 2, 4, 8, 16];

  const filters: Record<FilterType, Matrix> = {
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

  // Generate matrices with stripes for normal tab kernels
  useEffect(() => {
    if (activeTab === 'normal') {
      const newMatrices: Matrix[] = Array(numberOfTables).fill(0).map(() => {
        const matrix = Array(matrixSize).fill(0).map(() =>
          Array(matrixSize).fill(0)
        );
        
        const stripeWidth = Math.max(1, Math.floor(matrixSize / stripes));
        
        for (let i = 0; i < matrixSize; i++) {
          for (let j = 0; j < matrixSize; j++) {
            const stripeIndex = Math.floor(j / stripeWidth);
            matrix[i][j] = stripeIndex % 2 === 0 ? 1 : -1;
          }
        }
        
        return matrix;
      });
      setNormalMatrices(newMatrices);
    }
  }, [matrixSize, numberOfTables, activeTab, stripes]);

  // Generate random input matrix for normal tab
  useEffect(() => {
    if (activeTab === 'normal') {
      const newMatrix: Matrix = Array(inputSize).fill(0).map(() =>
        Array(inputSize).fill(0).map(() => 
          Math.floor(Math.random() * 256)
        )
      );
      setNormalInputMatrix(newMatrix);
    }
  }, [inputSize, activeTab]);

  const applyFilter = (input: Matrix, filter: Matrix): Matrix => {
    const size = input.length;
    const filterSize = filter.length;
    const padding = Math.floor(filterSize / 2);
    
    const output: Matrix = Array(size).fill(0).map(() => Array(size).fill(0));
    
    for(let i = padding; i < size - padding; i++) {
      for(let j = padding; j < size - padding; j++) {
        let sum = 0;
        for(let fi = 0; fi < filterSize; fi++) {
          for(let fj = 0; fj < filterSize; fj++) {
            sum += input[i - padding + fi][j - padding + fj] * filter[fi][fj];
          }
        }
        output[i][j] = Math.round(sum);
      }
    }
    
    return output;
  };

  // Calculate outputs for normal tab
  useEffect(() => {
    if (activeTab === 'normal') {
      if (inputSize < matrixSize) {
        setIsError(true);
        setNormalOutputMatrices([]);
      } else {
        setIsError(false);
        const outputs = normalMatrices.map(matrix => applyFilter(normalInputMatrix, matrix));
        setNormalOutputMatrices(outputs);
      }
    }
  }, [normalMatrices, normalInputMatrix, matrixSize, inputSize, activeTab]);

  // Generate random matrix for advanced tab
  useEffect(() => {
    if (activeTab === 'advanced') {
      const newMatrix: Matrix = Array(matrixSize).fill(0).map(() =>
        Array(matrixSize).fill(0).map(() => 
          Math.floor(Math.random() * 100)
        )
      );
      setInputMatrix(newMatrix);
    }
  }, [matrixSize, activeTab]);

  // Update output when filter changes for advanced tab
  useEffect(() => {
    if (inputMatrix.length > 0 && activeTab === 'advanced') {
      const output = applyFilter(inputMatrix, filters[selectedFilter]);
      setOutputMatrix(output);
    }
  }, [selectedFilter, inputMatrix, activeTab]);

  const formatFilterValue = (value: number): string => {
    if (value === 0) return '0';
    if (Math.abs(value) === 1/9) return '1/9';
    return value.toString();
  };

  const renderMatrixCells = (matrix: Matrix, filterSize: number = 3) => {
    const padding = Math.floor(filterSize / 2);
    const innerRows = matrix.slice(padding, matrix.length - padding);
    
    return (
      <table className="border-collapse">
        <tbody>
          {innerRows.map((row, i) => (
            <tr key={i}>
              {row.slice(padding, row.length - padding).map((cell, j) => (
                <td key={j} className="border border-gray-300 p-2 text-center min-w-12">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Matrix Visualizer</h1>

      <Tabs defaultValue="normal" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="normal">Normal</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="normal" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Kernel Matrix Size: {matrixSize}x{matrixSize}
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={matrixSize}
                onChange={(e) => setMatrixSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Number of Stripes:</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(num => (
                  <Button
                    key={num}
                    variant={stripes === num ? "default" : "outline"}
                    onClick={() => setStripes(num)}
                  >
                    {num} {num === 1 ? 'Stripe' : 'Stripes'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Number of Tables</h2>
              <div className="flex flex-wrap gap-2">
                {tableCounts.map(count => (
                  <Button
                    key={count}
                    variant={numberOfTables === count ? "default" : "outline"}
                    onClick={() => setNumberOfTables(count)}
                  >
                    {count} {count === 1 ? 'Table' : 'Tables'}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {normalMatrices.map((matrix, idx) => (
              <Card key={`kernel-${idx}`}>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Kernel Matrix {idx + 1} (-1 to 1)</h2>
                  <div className="overflow-auto max-h-96">
                    <table className="border-collapse">
                      <tbody>
                        {matrix.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} className="border border-gray-300 p-2 text-center min-w-12">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Input Matrix Size: {inputSize}x{inputSize}
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={inputSize}
              onChange={(e) => setInputSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Input Matrix (0-255)</h2>
              <div className="overflow-auto max-h-96">
                <table className="border-collapse">
                  <tbody>
                    {normalInputMatrix.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="border border-gray-300 p-2 text-center min-w-12">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {isError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Input matrix size must be greater than or equal to kernel size to generate output
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {normalOutputMatrices.map((matrix, idx) => (
                <Card key={`output-${idx}`}>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Output Matrix {idx + 1}</h2>
                    <div className="overflow-auto max-h-96">
                      {renderMatrixCells(matrix, matrixSize)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="advanced">
          <div className="space-y-4 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Matrix Size: {matrixSize}x{matrixSize}
              </label>
              <input
                type="range"
                min="2"
                max="32"
                value={matrixSize}
                onChange={(e) => setMatrixSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Select Filter:</label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as FilterType)}
                className="w-full p-2 border rounded"
              >
                <option value="identity">Identity</option>
                <option value="edgeDetection1">Edge Detection 1</option>
                <option value="edgeDetection2">Edge Detection 2</option>
                <option value="sharpen">Sharpen</option>
                <option value="boxBlur">Box Blur</option>
              </select>
            </div>

            <Card className="bg-gray-50">
  <CardContent className="p-4">
    <h3 className="text-md font-semibold mb-2">Current Filter Matrix:</h3>
    <div className="flex justify-center">
      <table className="border-collapse">
        <tbody>
          {filters[selectedFilter].map((row, i) => (
            <tr key={i}>
              {row.map((value, j) => (
                <td key={j} className="border border-gray-300 p-2 text-center min-w-12">
                  {formatFilterValue(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Input Matrix</h2>
                <div className="overflow-auto max-h-96">
                  <table className="border-collapse">
                    <tbody>
                      {inputMatrix.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="border border-gray-300 p-2 text-center min-w-12">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Output Matrix</h2>
                <div className="overflow-auto max-h-96">
                  {renderMatrixCells(outputMatrix, filters[selectedFilter].length)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConvolutionVisualizerTabs;