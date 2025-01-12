import React from 'react';
import { Operation } from '../types/operations';
import { OperationCard } from './OperationsCard';
interface OperationsListProps {
  operations: Operation[];
  onOperationClick: (operation: Operation) => void;
}

export const OperationsList: React.FC<OperationsListProps> = ({ 
  operations,
  onOperationClick
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {operations.map((operation) => (
        <OperationCard
          key={operation.id}
          operation={operation}
          onAdd={onOperationClick}
        />
      ))}
    </div>
  );
};