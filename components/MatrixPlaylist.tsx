/* eslint-disable @typescript-eslint/ban-ts-comment */
 
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Image, Brain, Box, Layers, Activity, 
  Grid, ArrowDown, Repeat, Sigma, Settings, Plus 
} from 'lucide-react';
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
  TENSOR: 'Tensor Ops'
} as const;

// Common operation presets
const PRESETS = {
  'Basic CNN': ['Conv2D', 'MaxPool2D', 'Flatten', 'Dense'],
  'LSTM Network': ['LSTM', 'Dense'],
  'Image Classification': ['Conv2D', 'BatchNormalization', 'MaxPool2D', 'Dropout', 'Dense'],
  'Autoencoder': ['Conv2D', 'MaxPool2D', 'Conv2DTranspose', 'Dense'],
};

interface Operation {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  common: boolean;
}

// All TensorFlow operations data
const allOperations: Operation[] = [
  // Core Layers
  {
    id: 'dense',
    name: 'Dense',
    category: CATEGORIES.CORE,
    description: 'Regular densely-connected NN layer',
    icon: <Layers className="h-4 w-4" />,
    common: true
  },
  {
    id: 'dropout',
    name: 'Dropout',
    category: CATEGORIES.CORE,
    description: 'Prevents overfitting by randomly dropping units',
    icon: <Layers className="h-4 w-4" />,
    common: true
  },
  {
    id: 'flatten',
    name: 'Flatten',
    category: CATEGORIES.CORE,
    description: 'Flattens input without affecting batch size',
    icon: <Layers className="h-4 w-4" />,
    common: true
  },
  {
    id: 'activation',
    name: 'Activation',
    category: CATEGORIES.CORE,
    description: 'Applies an activation function',
    icon: <Activity className="h-4 w-4" />,
    common: true
  },
  // Convolution Layers
  {
    id: 'conv2d',
    name: 'Conv2D',
    category: CATEGORIES.CONV,
    description: '2D convolution layer',
    icon: <Grid className="h-4 w-4" />,
    common: true
  },
  {
    id: 'maxpool2d',
    name: 'MaxPool2D',
    category: CATEGORIES.POOL,
    description: '2D max pooling operation',
    icon: <ArrowDown className="h-4 w-4" />,
    common: true
  },
  {
    id: 'lstm',
    name: 'LSTM',
    category: CATEGORIES.RNN,
    description: 'Long Short-Term Memory layer',
    icon: <Repeat className="h-4 w-4" />,
    common: true
  },
  // Add all other operations following the same pattern...
];

// Quick-add operation card component
const OperationCard = ({ operation, onAdd }: { operation: Operation, onAdd: (op: Operation) => void }) => (
  <Card className="cursor-pointer hover:bg-gray-50" onClick={() => onAdd(operation)}>
    <CardContent className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {operation.icon}
          <span className="font-medium">{operation.name}</span>
        </div>
        <Plus className="h-4 w-4 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 mt-1">{operation.description}</p>
    </CardContent>
  </Card>
);

const SortableItem = ({ id, operation }: { id: string; operation: Operation }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-2 cursor-grab active:cursor-grabbing">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {operation.icon}
            <span>{operation.name}</span>
          </div>
          <Badge variant="secondary">{operation.category}</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

const TFOperationsBrowser = () => {
  const [selectedOps, setSelectedOps] = useState<Operation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('common');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter operations based on search and category
  const filteredOperations = useMemo(() => {
    let ops = allOperations;
    if (activeCategory !== 'all') {
      ops = ops.filter(op => 
            // @ts-ignore
        activeCategory === 'common' ? op.common : op.category === CATEGORIES[activeCategory.toUpperCase()]
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSelectedOps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addOperation = (op: Operation) => {
    if (!selectedOps.find(selected => selected.id === op.id)) {
      setSelectedOps([...selectedOps, op]);
    }
  };

  const removeOperation = (opId: string) => {
    setSelectedOps(selectedOps.filter(op => op.id !== opId));
  };

  const applyPreset = (presetName: string) => {
        // @ts-ignore
    const presetOps = PRESETS[presetName]
        // @ts-ignore
      .map(name => allOperations.find(op => op.name === name))
          // @ts-ignore
      .filter((op): op is Operation => op !== undefined);
    setSelectedOps(presetOps);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Operations Browser - Left Side */}
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Select Operations</CardTitle>
          <div className="flex gap-2 mt-2">
            {Object.keys(PRESETS).map(preset => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
              >
                {preset}
              </Button>
            ))}
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search operations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="common" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Common
              </TabsTrigger>
              <TabsTrigger value="vision" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Vision
              </TabsTrigger>
              <TabsTrigger value="nlp" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                NLP
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Box className="h-4 w-4" />
                All
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-2 gap-2">
                {filteredOperations.map((op) => (
                  <OperationCard
                    key={op.id}
                    operation={op}
                    onAdd={addOperation}
                  />
                ))}
              </div>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      {/* Selected Operations - Right Side */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Pipeline Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedOps.map(op => op.id)}
                strategy={verticalListSortingStrategy}
              >
                {selectedOps.map((op) => (
                  <SortableItem key={op.id} id={op.id} operation={op} />
                ))}
              </SortableContext>
            </DndContext>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TFOperationsBrowser;