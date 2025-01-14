import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings } from 'lucide-react';
import { Operation } from '../types/operations';
import { ConfigField } from '../common/ConfigField';

interface ConfigurationPanelProps {
  operation: Operation;
  config: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  operation,
  config,
  onChange,
}) => {
  if (!operation.config) return null;

  return (
    <div className="space-y-4">
      {/* Static section - always visible */}
      {operation.performance_tips && (
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Performance Tips</h3>
          <ul className="list-disc pl-4 space-y-1">
            {operation.performance_tips.map((tip, i) => (
              <li key={i} className="text-gray-600 text-sm">{tip}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex gap-4">
        <Badge variant={operation.gpu_support ? "default" : "secondary"}>
          GPU {operation.gpu_support ? "✓" : "✗"}
        </Badge>
        <Badge variant={operation.tpu_support ? "default" : "secondary"}>
          TPU {operation.tpu_support ? "✓" : "✗"}
        </Badge>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="config">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-96 w-full pr-4">
              <div className="space-y-4 p-2">
                {Object.entries(operation.config).map(([key, field]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">{field.label}</label>
                      {field.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <ConfigField
                      field={field}
                      value={config[key] ?? field.default}
                      onChange={(value) => onChange(key, value)}
                    />
                    {field.description && (
                      <p className="text-xs text-gray-500">{field.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};