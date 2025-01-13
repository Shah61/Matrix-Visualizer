import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from '@dnd-kit/sortable';

// Import components
import { SearchBar } from './search/SearchBar';
import { CategoryTabs } from './operations/CategoryTabs';
import { OperationsList } from './operations/OperationList';
import { SortableOperationItem } from './operations/SortableOperationItem';
import { ImageUploadSection } from './image/ImageUploadSection';
import DatasetStructureCard from './DatasetStructureCard';
import MLDashboard from './MLDashboard';

// Import types and data
import { LayerConfig, Operation } from './types/operations';
import { allOperations, CATEGORIES } from './types/operationsData';
import ImageProcessingPipeline from './image/ImageProcessingPipeline';
import HyperparameterTuning from './HyperparameterTuning';
import ModelArchitectureVisualizer from './ModelArchitectureVisualizer';
import TrainingProgress from './TrainingProgress';
import { Layers, Clock, Play, RotateCcw, Sliders } from 'lucide-react';
import { Button } from './ui/button';

export const TFOperationsBrowser = () => {
  const [selectedOps, setSelectedOps] = useState<Operation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('common');
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [operationConfigs, setOperationConfigs] = useState<Record<string, Record<string, any>>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSelectedOps((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleOperationAdd = useCallback((operation: Operation) => {
    setSelectedOps(prev => {
      // Create a unique ID for this instance of the operation
      const uniqueId = `${operation.id}_${Date.now()}`;
      const newOperation = {
        ...operation,
        id: uniqueId // Override the original ID with our unique one
      };
      return [...prev, newOperation];
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

  const handleDeleteOperation = (opId: string) => {
    setSelectedOps(prev => prev.filter(op => op.id !== opId));
    setOperationConfigs(prev => {
      const newConfigs = { ...prev };
      delete newConfigs[opId];
      return newConfigs;
    });
  };

  const handleConfigChange = useCallback((opId: string, key: string, value: any) => {
    setOperationConfigs(prev => ({
      ...prev,
      [opId]: {
        ...prev[opId],
        [key]: value
      }
    }));
  }, []);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const architectureLayers: LayerConfig[] = selectedOps.map(op => ({
    id: op.id,
    name: op.name,
    type: op.category,
    description: op.description,
    outputShape: op.config?.outputShape || 'Not specified',
    icon: op.icon,
    common: op.common,
    gpu_support: op.gpu_support || false,
    tpu_support: op.tpu_support || false,
    config: op.config ? {
      units: op.config.units?.default,
      filters: op.config.filters?.default,
      kernel_size: op.config.kernel_size?.default,
      activation: op.config.activation?.default,
      rate: op.config.rate?.default,
      use_bias: op.config.use_bias?.default,
    } : undefined,
    performance_tips: op.performance_tips,
    version_added: op.version_added
  }));

  return (
    <div className="space-y-4">
      {/* Top row - Build Your Model and Dataset Structure */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-9">
          <CardHeader>
            <CardTitle>Build Your Model</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploadSection onFileUpload={handleFileUpload} />
          </CardContent>
        </Card>

        <div className="col-span-3">
          <DatasetStructureCard />
        </div>
      </div>

       {/* Model Architecture and Training Section */}
       <div className="grid grid-cols-12 gap-4">
  <div className="col-span-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Live Model Architecture
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] overflow-auto">
        <ModelArchitectureVisualizer layers={architectureLayers} />
      </CardContent>
    </Card>
  </div>

  <div className="col-span-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Training Progress
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] overflow-auto">
        <TrainingProgress />
      </CardContent>
    </Card>
  </div>

  <div className="col-span-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sliders className="h-5 w-5" />
          Hyperparameter Tuning
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] overflow-auto">
        <HyperparameterTuning />
      </CardContent>
    </Card>
  </div>
</div>
      {/* Bottom section - Operations Browser and Pipeline Configuration */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left side - Operations Browser */}
        <Card>
          <CardContent className="p-6">
            <CategoryTabs
              categories={Object.keys(CATEGORIES)}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <div className="mt-4">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
            <ScrollArea className="h-[600px] mt-4">
              <OperationsList
                operations={filteredOperations}
                onOperationClick={handleOperationAdd}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right side - Pipeline Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedOps.map(op => op.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {selectedOps.map((operation) => (
                    <SortableOperationItem
                      key={operation.id}
                      id={operation.id}
                      operation={operation}
                      config={operationConfigs[operation.id] || {}}
                      onConfigChange={(key, value) => handleConfigChange(operation.id, key, value)}
                      onDelete={() => handleDeleteOperation(operation.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ML Dashboard */}
      <div className="mt-4">
        <MLDashboard />
      </div>
    </div>
  );
};

export default TFOperationsBrowser;