import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings2 } from 'lucide-react';

export const DataShufflingDialog = () => {
  const [config, setConfig] = useState({
    bufferSize: 1000,
    reshuffle: true,
    seed: 42,
    deterministic: true
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Data Shuffling Configuration</DialogTitle>
          <DialogDescription>
            Configure how your dataset is shuffled during training
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Buffer Size</Label>
            <Input
              type="number"
              value={config.bufferSize}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                bufferSize: parseInt(e.target.value)
              }))}
              min={1}
            />
            <p className="text-xs text-muted-foreground">
              Number of elements to buffer before shuffling
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Reshuffle Each Iteration</Label>
              <p className="text-xs text-muted-foreground">
                Reshuffle data after each epoch
              </p>
            </div>
            <Switch
              checked={config.reshuffle}
              onCheckedChange={(checked) => setConfig(prev => ({
                ...prev,
                reshuffle: checked
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Random Seed</Label>
            <Input
              type="number"
              value={config.seed}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                seed: parseInt(e.target.value)
              }))}
            />
            <p className="text-xs text-muted-foreground">
              Seed for reproducible shuffling
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Deterministic</Label>
              <p className="text-xs text-muted-foreground">
                Use deterministic operations where possible
              </p>
            </div>
            <Switch
              checked={config.deterministic}
              onCheckedChange={(checked) => setConfig(prev => ({
                ...prev,
                deterministic: checked
              }))}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};