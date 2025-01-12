import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Image, X, Settings2, Maximize2, Filter } from 'lucide-react';
import { ImageItem } from '../types/operations';
import DataShufflingDialog from '../DataShufflingDialog';

interface ImageUploadSectionProps {
  onFileUpload: (file: File) => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [bufferImages, setBufferImages] = useState<ImageItem[]>([]);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0
  });

  const [basicConfig, setBasicConfig] = useState({
    height: 224,
    width: 224,
    normalize: true
  });

  const [advancedConfig, setAdvancedConfig] = useState({
    resizing: {
      method: 'bilinear',
      preserveAspectRatio: true,
      antialias: true
    },
    preprocessing: {
      centerCrop: false,
      channelFirst: false,
      grayscale: false
    },
    advanced: {
      alignCorners: false,
      gamma: 1.0
    }
  });

  useEffect(() => {
    if (uploadedFile) {
      setImages(Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `Image ${i + 1}`,
      })));
    }
  }, [uploadedFile]);

  const shuffleBuffer = async () => {
    if (images.length <= 1) return;
    setIsShuffling(true);
    
    const bufferSize = 4;
    for (let i = 0; i < images.length; i += bufferSize) {
      const buffer = images.slice(i, i + bufferSize);
      setBufferImages(buffer);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const shuffledBuffer = [...buffer].sort(() => Math.random() - 0.5);
      setBufferImages(shuffledBuffer);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    setIsShuffling(false);
  };

  const resizeMethods = [
    { value: 'bilinear', label: 'Bilinear', description: 'Best for general use' },
    { value: 'bicubic', label: 'Bicubic', description: 'Better quality but slower' },
    { value: 'nearest', label: 'Nearest', description: 'Fastest but lower quality' },
    { value: 'lanczos3', label: 'Lanczos3', description: 'High quality for downscaling' }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setUploadedFile(file);
    onFileUpload(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedFile(null);
    setImagePreview('');
    setImageDimensions({ width: 0, height: 0 });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Image Input</CardTitle>
            <CardDescription>Configure image preprocessing</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label>Advanced Mode</Label>
              <Switch
                checked={isAdvancedMode}
                onCheckedChange={setIsAdvancedMode}
              />
            </div>
            {uploadedFile && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRemoveImage}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Remove Image
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragging ? 'border-primary bg-secondary/20' : 'border-border'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <Image className="h-10 w-10 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your image here, or{' '}
                  <label className="text-primary hover:underline cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports JPG, PNG, WebP images
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Preview
                </h3>
                <div className="border rounded-lg p-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-auto rounded"
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      setImageDimensions({
                        width: img.naturalWidth,
                        height: img.naturalHeight
                      });
                    }}
                  />
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-secondary/50 p-2 rounded">
                        <p className="text-xs font-medium text-muted-foreground">Format</p>
                        <p>{uploadedFile.type.split('/')[1].toUpperCase()}</p>
                      </div>
                      <div className="bg-secondary/50 p-2 rounded">
                        <p className="text-xs font-medium text-muted-foreground">Dimensions</p>
                        <p>{imageDimensions.width} × {imageDimensions.height}</p>
                      </div>
                      <div className="bg-secondary/50 p-2 rounded">
                        <p className="text-xs font-medium text-muted-foreground">Size</p>
                        <p>{formatFileSize(uploadedFile.size)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Required Settings
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Basic parameters needed for image processing
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Target Height</Label>
                      <Input
                        type="number"
                        value={basicConfig.height}
                        onChange={(e) => setBasicConfig(prev => ({
                          ...prev,
                          height: parseInt(e.target.value)
                        }))}
                        min={1}
                      />
                      <p className="text-xs text-muted-foreground">Output image height in pixels</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Target Width</Label>
                      <Input
                        type="number"
                        value={basicConfig.width}
                        onChange={(e) => setBasicConfig(prev => ({
                          ...prev,
                          width: parseInt(e.target.value)
                        }))}
                        min={1}
                      />
                      <p className="text-xs text-muted-foreground">Output image width in pixels</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Normalize Values</Label>
                      <p className="text-xs text-muted-foreground">Scale pixel values to 0-1 range</p>
                    </div>
                    <Switch
                      checked={basicConfig.normalize}
                      onCheckedChange={(checked) => setBasicConfig(prev => ({
                        ...prev,
                        normalize: checked
                      }))}
                    />
                  </div>
                </div>

                {isAdvancedMode && (
                  <div className="space-y-6 mt-6">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <Settings2 className="h-4 w-4" />
                        Advanced Settings
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Fine-tune the preprocessing pipeline
                      </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="resizing">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Maximize2 className="h-4 w-4" />
                            Resizing Options
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                              <Label>Interpolation Method</Label>
                              <Select 
                                value={advancedConfig.resizing.method}
                                onValueChange={(value) => setAdvancedConfig(prev => ({
                                  ...prev,
                                  resizing: { ...prev.resizing, method: value }
                                }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {resizeMethods.map(method => (
                                    <SelectItem key={method.value} value={method.value}>
                                      <div>
                                        <div>{method.label}</div>
                                        <div className="text-xs text-muted-foreground">{method.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label>Preserve Aspect Ratio</Label>
                                <p className="text-xs text-muted-foreground">Maintain image proportions</p>
                              </div>
                              <Switch
                                checked={advancedConfig.resizing.preserveAspectRatio}
                                onCheckedChange={(checked) => setAdvancedConfig(prev => ({
                                  ...prev,
                                  resizing: { ...prev.resizing, preserveAspectRatio: checked }
                                }))}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="preprocessing">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Preprocessing Options
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label>Center Crop</Label>
                                <p className="text-xs text-muted-foreground">Crop from image center</p>
                              </div>
                              <Switch
                                checked={advancedConfig.preprocessing.centerCrop}
                                onCheckedChange={(checked) => setAdvancedConfig(prev => ({
                                  ...prev,
                                  preprocessing: { ...prev.preprocessing, centerCrop: checked }
                                }))}
                              /></div>
                              {/* Data Shuffling Section */}
                              <div className="border-t pt-4 mt-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label>Data Shuffling</Label>
                                    <p className="text-xs text-muted-foreground">
                                      Configure how data is shuffled during preprocessing
                                    </p>
                                  </div>
                                  <DataShufflingDialog />
                                </div>
                              </div>
                        
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Channel First Format</Label>
                                  <p className="text-xs text-muted-foreground">Use NCHW format</p>
                                </div>
                                <Switch
                                  checked={advancedConfig.preprocessing.channelFirst}
                                  onCheckedChange={(checked) => setAdvancedConfig(prev => ({
                                    ...prev,
                                    preprocessing: { ...prev.preprocessing, channelFirst: checked }
                                  }))}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Convert to Grayscale</Label>
                                  <p className="text-xs text-muted-foreground">Single channel output</p>
                                </div>
                                <Switch
                                  checked={advancedConfig.preprocessing.grayscale}
                                  onCheckedChange={(checked) => setAdvancedConfig(prev => ({
                                    ...prev,
                                    preprocessing: { ...prev.preprocessing, grayscale: checked }
                                  }))}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };