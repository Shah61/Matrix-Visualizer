// components/dashboard/DataInsightsDashboard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  PieChart, 
  FileQuestion,
  Images,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

const DataInsightsDashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Data Insights
          </div>
          <Badge variant="outline" className="ml-2">
            Live Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dataset Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Images className="h-4 w-4" />
              <span className="text-sm font-medium">Total Images</span>
            </div>
            <div className="text-2xl font-bold">1,234</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Processed</span>
            </div>
            <div className="text-2xl font-bold">78%</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Issues Found</span>
            </div>
            <div className="text-2xl font-bold">12</div>
          </div>
        </div>

        {/* Data Distribution */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Data Split Distribution
          </h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Training Set</span>
                <span>70% (875 images)</span>
              </div>
              <Progress value={70} className="bg-blue-100" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Validation Set</span>
                <span>20% (250 images)</span>
              </div>
              <Progress value={20} className="bg-green-100" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Test Set</span>
                <span>10% (125 images)</span>
              </div>
              <Progress value={10} className="bg-orange-100" />
            </div>
          </div>
        </div>

        {/* Data Quality Checks */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            Data Quality Checks
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-green-50 rounded">
              <Check className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Image Sizes</div>
                <div className="text-sm text-gray-500">All images meet the required dimensions (224×224)</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-medium">Class Balance</div>
                <div className="text-sm text-gray-500">Minor class imbalance detected. Consider augmentation.</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium">Image Quality</div>
                <div className="text-sm text-gray-500">Average resolution: Good for training</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 border-t pt-4">
          <button className="text-sm text-blue-600 hover:underline">
            View Detailed Report
          </button>
          <span className="text-gray-300">|</span>
          <button className="text-sm text-blue-600 hover:underline">
            Fix Issues
          </button>
          <span className="text-gray-300">|</span>
          <button className="text-sm text-blue-600 hover:underline">
            Export Analysis
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataInsightsDashboard;