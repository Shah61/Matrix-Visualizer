import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Database, Code, Beaker } from 'lucide-react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange
}) => (
  <Tabs value={activeCategory} onValueChange={onCategoryChange}>
    <TabsList className="grid grid-cols-4">
      <TabsTrigger value="common" className="flex items-center gap-2">
        <Star className="h-4 w-4" />
        Common
      </TabsTrigger>
      <TabsTrigger value="all" className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        All
      </TabsTrigger>
      <TabsTrigger value="custom" className="flex items-center gap-2">
        <Code className="h-4 w-4" />
        Custom
      </TabsTrigger>
      <TabsTrigger value="experimental" className="flex items-center gap-2">
        <Beaker className="h-4 w-4" />
        Experimental
      </TabsTrigger>
    </TabsList>
  </Tabs>
);