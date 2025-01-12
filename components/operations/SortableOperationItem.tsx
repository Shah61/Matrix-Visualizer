import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Trash2, GripVertical } from 'lucide-react';
import { Operation } from '../types/operations';
import { ConfigurationPanel } from './ConfigurationPanel';

interface SortableOperationItemProps {
  operation: Operation;
  config: Record<string, any>;
  onConfigChange: (key: string, value: any) => void;
  onDelete: () => void;
  id: string;
}

export const SortableOperationItem: React.FC<SortableOperationItemProps> = ({
  operation,
  config,
  onConfigChange,
  onDelete,
  id
}) => {
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
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div {...attributes} {...listeners} className="cursor-grab">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              {operation.icon}
              <span className="font-medium">{operation.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {operation.icon}
                      {operation.name} Configuration
                    </DialogTitle>
                  </DialogHeader>
                  <ConfigurationPanel
                    operation={operation}
                    config={config}
                    onChange={onConfigChange}
                  />
                </DialogContent>
              </Dialog>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDelete}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};