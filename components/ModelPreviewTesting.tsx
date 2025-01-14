// components/model/ModelPreviewTesting.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  FileImage,
  BarChart2,
  AlertCircle
} from 'lucide-react';

// Sample test cases with different outcomes
const sampleTestCases = {
  'cat_vs_dog': {
    name: 'Cat vs Dog Classification',
    sampleResults: [
      { prediction: 'Cat', confidence: 92.5, actual: 'Cat', correct: true },
      { prediction: 'Dog', confidence: 88.3, actual: 'Dog', correct: true },
      { prediction: 'Cat', confidence: 67.8, actual: 'Dog', correct: false },
    ],
    accuracy: 85.5,
    avgConfidence: 82.9
  },
  'digit_recognition': {
    name: 'Digit Recognition',
    sampleResults: [
      { prediction: '7', confidence: 98.1, actual: '7', correct: true },
      { prediction: '4', confidence: 95.4, actual: '4', correct: true },
      { prediction: '9', confidence: 91.2, actual: '9', correct: true },
    ],
    accuracy: 96.2,
    avgConfidence: 94.9
  },
  'face_emotion': {
    name: 'Emotion Detection',
    sampleResults: [
      { prediction: 'Happy', confidence: 89.7, actual: 'Happy', correct: true },
      { prediction: 'Sad', confidence: 75.3, actual: 'Neutral', correct: false },
      { prediction: 'Angry', confidence: 82.1, actual: 'Angry', correct: true },
    ],
    accuracy: 78.4,
    avgConfidence: 82.4
  }
};

const ModelPreviewTesting = () => {
    const [selectedTest, setSelectedTest] = useState('cat_vs_dog');
    const currentTest = sampleTestCases[selectedTest as keyof typeof sampleTestCases];
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Model Preview & Testing
            </div>
            <Badge variant="outline">Sample Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
        {/* Test Case Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Dataset</label>
          <Select 
            value={selectedTest} 
            onValueChange={setSelectedTest}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cat_vs_dog">Cat vs Dog Classification</SelectItem>
              <SelectItem value="digit_recognition">Digit Recognition</SelectItem>
              <SelectItem value="face_emotion">Emotion Detection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span className="font-medium">Sample Results</span>
            </div>
            <Badge variant={currentTest.accuracy > 90 ? "secondary" : "outline"}>
              {currentTest.accuracy}% Accuracy
            </Badge>
          </div>

          {/* Sample Predictions */}
          <div className="space-y-3">
            {currentTest.sampleResults.map((result, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    <span className="font-medium">Sample {index + 1}</span>
                  </div>
                  <Badge variant={result.correct ? "secondary" : "destructive"}>
                    {result.correct ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Prediction: {result.prediction}</span>
                    <span>Actual: {result.actual}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Confidence</span>
                      <span>{result.confidence}%</span>
                    </div>
                    <Progress value={result.confidence} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Summary */}
          <div className="p-3 border rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Confidence</span>
              <span>{currentTest.avgConfidence}%</span>
            </div>
            <Progress value={currentTest.avgConfidence} />
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <span className="font-medium">Model Performance:</span> {' '}
            {currentTest.accuracy > 90 
              ? 'Excellent performance on test data. Ready for deployment.'
              : 'Consider additional training or architecture adjustments.'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPreviewTesting;