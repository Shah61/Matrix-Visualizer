import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as Icons from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { FileSystemDirectoryHandle } from './workspaces/types';

type TreeNode = {
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
}

type FolderTreeProps = {
  className?: string;
}

declare global {
  interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
  }
}

const FolderTreeVisualization: React.FC<FolderTreeProps> = ({ className }): JSX.Element => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['dataset']));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<FileSystemDirectoryHandle | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const handleFolderSelect = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      try {
        const directoryHandle = await window.showDirectoryPicker();
        setSelectedFolder(directoryHandle);
      } catch (err) {
        // Silently handle abort error
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        // Re-throw any other errors to be caught by outer try-catch
        throw err;
      }
  
    } catch (err) {
      // Handle any non-abort errors
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const items = Array.from(e.dataTransfer.items);
    const folderItem = items.find(item => item.kind === 'file' && 
      item.webkitGetAsEntry()?.isDirectory);

    if (!folderItem) {
      setError('Please drop a folder');
      return;
    }

    try {
      const directoryHandle = await window.showDirectoryPicker();
      setSelectedFolder(directoryHandle);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const folderStructure: TreeNode = {
    name: 'dataset',
    type: 'folder',
    children: [
      {
        name: 'train',
        type: 'folder',
        children: [
          { 
            name: 'class1', 
            type: 'folder', 
            children: [
              { name: 'img1.jpg', type: 'file' },
              { name: 'img2.jpg', type: 'file' },
            ]
          },
          { 
            name: 'class2', 
            type: 'folder', 
            children: [
              { name: 'img3.jpg', type: 'file' },
              { name: 'img4.jpg', type: 'file' },
            ]
          },
        ],
      },
      {
        name: 'validation',
        type: 'folder',
        children: [
          { 
            name: 'class1', 
            type: 'folder', 
            children: [
              { name: 'img5.jpg', type: 'file' },
            ]
          },
          { 
            name: 'class2', 
            type: 'folder', 
            children: [
              { name: 'img6.jpg', type: 'file' },
            ]
          },
        ],
      },
    ],
  };

  const renderTree = (node: TreeNode, path: string = ''): JSX.Element => {
    const currentPath = `${path}/${node.name}`;
    const isExpanded = expandedFolders.has(currentPath);
    
    return (
      <div key={currentPath} className="pl-4">
        <div className="flex items-center gap-2 py-1">
          {node.type === 'folder' ? (
            <>
              <button
                onClick={() => {
                  const newExpanded = new Set(expandedFolders);
                  if (isExpanded) {
                    newExpanded.delete(currentPath);
                  } else {
                    newExpanded.add(currentPath);
                  }
                  setExpandedFolders(newExpanded);
                }}
                className="focus:outline-none"
                type="button"
              >
                {isExpanded ? (
                  <Icons.ChevronDown className="h-4 w-4" />
                ) : (
                  <Icons.ChevronRight className="h-4 w-4" />
                )}
              </button>
              <Icons.Folder className="h-4 w-4 text-primary" />
              <span>{node.name}</span>
            </>
          ) : (
            <>
              <Icons.FileText className="h-4 w-4 ml-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{node.name}</span>
            </>
          )}
        </div>
        {node.type === 'folder' && isExpanded && node.children && (
          <div className="border-l">
            {node.children.map((child) => renderTree(child, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.FolderTree className="h-5 w-5" />
          Dataset Structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {!selectedFolder && (
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDraggingOver ? 'border-primary bg-primary/5' : 'border-border'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <Icons.Folder className="h-12 w-12 text-muted-foreground" />
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your dataset folder here, or
                  </p>
                  <button
                    onClick={handleFolderSelect}
                    disabled={isLoading}
                    className="text-primary hover:underline focus:outline-none"
                    type="button"
                  >
                    Choose Folder
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {selectedFolder && (
            <div className="bg-secondary/20 rounded-lg p-4">
              {renderTree(folderStructure)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderTreeVisualization;