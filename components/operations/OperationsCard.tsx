import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Operation } from '../types/operations';

interface OperationCardProps {
  operation: Operation;
  onAdd: (op: Operation) => void;
}

export const OperationCard: React.FC<OperationCardProps> = ({ operation, onAdd }) => {
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-md" 
      onClick={() => onAdd(operation)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Header section with name and plus icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="text-primary flex-shrink-0">{operation.icon}</div>
              <span className="font-medium truncate">{operation.name}</span>
            </div>
            <Plus className="h-4 w-4 text-primary transition-transform duration-200 hover:scale-110 flex-shrink-0 ml-2" />
          </div>
          
          {/* Description and badge section */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 line-clamp-2">{operation.description}</p>
            <Badge 
              variant={operation.common ? "default" : "secondary"} 
              className="text-xs px-2 py-0.5 max-w-fit"
            >
              {operation.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};