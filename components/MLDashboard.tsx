/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as Icons from 'lucide-react';

interface ImageItem {
    id: number;
    name: string;
  }

const ModelMetricsCard = () => {
  // Sample training metrics data
  const trainingData = [
    { epoch: 1, loss: 0.5, accuracy: 0.75, val_loss: 0.6, val_accuracy: 0.7 },
    { epoch: 2, loss: 0.4, accuracy: 0.8, val_loss: 0.5, val_accuracy: 0.75 },
    { epoch: 3, loss: 0.3, accuracy: 0.85, val_loss: 0.45, val_accuracy: 0.8 },
    { epoch: 4, loss: 0.25, accuracy: 0.88, val_loss: 0.4, val_accuracy: 0.82 },
    { epoch: 5, loss: 0.2, accuracy: 0.9, val_loss: 0.35, val_accuracy: 0.85 }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.LineChart className="h-5 w-5" />
          Training Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trainingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="epoch" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="accuracy" stroke="#2563eb" name="Training Accuracy" />
            <Line type="monotone" dataKey="val_accuracy" stroke="#16a34a" name="Validation Accuracy" />
            <Line type="monotone" dataKey="loss" stroke="#dc2626" name="Training Loss" />
            <Line type="monotone" dataKey="val_loss" stroke="#ea580c" name="Validation Loss" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const DatasetStatsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.Database className="h-5 w-5" />
          Dataset Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-secondary/20 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Training Samples</div>
            <div className="text-2xl font-bold">50,000</div>
          </div>
          <div className="p-4 bg-secondary/20 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Validation Samples</div>
            <div className="text-2xl font-bold">10,000</div>
          </div>
          <div className="p-4 bg-secondary/20 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Classes</div>
            <div className="text-2xl font-bold">10</div>
          </div>
          <div className="p-4 bg-secondary/20 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Image Size</div>
            <div className="text-2xl font-bold">224×224</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

  // Keep your existing ModelArchitectureCard component unchanged
  const ModelArchitectureCard = () => {
    // Your existing code remains the same
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Network className="h-5 w-5" />
            Model Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="space-y-2">
                {['Input', 'Conv2D', 'MaxPool2D', 'Conv2D', 'MaxPool2D', 'Dense', 'Output'].map((layer, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-32 h-10 border rounded-lg flex items-center justify-center bg-secondary">
                      {layer}
                    </div>
                    {i < 6 && <Icons.ArrowDown className="h-4 w-4 mx-auto my-1" />}
                  </div>
                ))}
              </div>
            </div>
            
            <Alert>
              <AlertTitle className="flex items-center gap-2">
                <Icons.Info className="h-4 w-4" />
                Model Summary
              </AlertTitle>
              <AlertDescription>
                <div className="text-sm space-y-1">
                  <p>Total Parameters: 1.4M</p>
                  <p>Trainable Parameters: 1.3M</p>
                  <p>Non-trainable Parameters: 0.1M</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Modify your main MLDashboard component
  const MLDashboard = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <ModelMetricsCard />
          <DatasetStatsCard />
        </div>

        <ModelArchitectureCard />
      </div>
    );
  };
  
  export default MLDashboard;