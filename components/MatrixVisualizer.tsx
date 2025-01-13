'use client'

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MukhtarWorkspace from './workspaces/MukhtarWorspace';
import HarisWorkspace from './workspaces/HarisWorkspace';

const MatrixVisualizer = () => {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Matrix Visualizer Workspaces</h1>
      <Tabs defaultValue="mukhtar" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="mukhtar">Mukhtar's Workspace</TabsTrigger>
          <TabsTrigger value="haris">Haris's Workspace</TabsTrigger>
        </TabsList>

        <TabsContent value="mukhtar">
          <div className="pt-4">
            <MukhtarWorkspace />
          </div>
        </TabsContent>

        <TabsContent value="haris">
          <div className="pt-4">
            <HarisWorkspace />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatrixVisualizer;