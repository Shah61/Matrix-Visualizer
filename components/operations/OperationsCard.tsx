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
            <Plus className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{operation.description}</p>
      </CardContent>
    </Card>
  );
};