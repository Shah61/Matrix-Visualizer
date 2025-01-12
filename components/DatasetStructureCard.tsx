/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as Icons from 'lucide-react';

// Type definitions for File System Access API
interface FileSystemDirectoryHandle {
  kind: 'directory';
  name: string;
  values(): AsyncIterableIterator<FileSystemHandle>;
}

interface FileSystemFileHandle {
  kind: 'file';
  name: string;
  getFile(): Promise<File>;
}

type FileSystemHandle = FileSystemFileHandle | FileSystemDirectoryHandle;

declare global {
  interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
  }
}

// Type definitions for our file structure
interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  size?: number;
  path: string;
}

const FileTreeNode = ({ node, level = 0 }: { node: FileNode; level?: number }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const indent = level * 20; // Indent each level by 20px

  return (
    <div>
      <div 
        className="flex items-center py-1 hover:bg-secondary/50 rounded px-2" 
        style={{ marginLeft: `${indent}px` }}
      >
        {node.type === 'directory' ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm"
          >
            {isExpanded ? (
              <Icons.ChevronDown className="h-4 w-4" />
            ) : (
              <Icons.ChevronRight className="h-4 w-4" />
            )}
            <Icons.Folder className="h-4 w-4 text-blue-500" />
            {node.name}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm ml-6">
            <Icons.FileText className="h-4 w-4 text-gray-500" />
            {node.name}
          </div>
        )}
      </div>

      {node.type === 'directory' && isExpanded && node.children && (
        <div className="ml-2">
          {node.children.map((child, index) => (
            <FileTreeNode key={`${child.path}-${index}`} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const DatasetStructureCard = () => {
  const [fileStructure, setFileStructure] = useState<FileNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFileEntry = async (entry: any): Promise<FileNode> => {
    const children: FileNode[] = [];
    
    if (entry.kind === 'file') {
      const file = await entry.getFile();
      return {
        name: entry.name,
        type: 'file',
        size: file.size,
        path: entry.name
      };
    }
    
    // If it's a directory, process all its entries
    const dirReader = entry.createReader();
    let entries = await new Promise<any[]>((resolve) => {
      dirReader.readEntries((entries: any[]) => resolve(entries));
    });
    
    for (const childEntry of entries) {
      children.push(await processFileEntry(childEntry));
    }
    
    return {
      name: entry.name,
      type: 'directory',
      children: children,
      path: entry.name
    };
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const items = Array.from(e.dataTransfer.items);
    if (items.length === 0) return;

    // Get the folder
    const entry = items[0].webkitGetAsEntry();
    if (!entry || !entry.isDirectory) {
      alert('Please drop a folder');
      return;
    }

    const structure = await processFileEntry(entry);
    setFileStructure(structure);
  };

  const handleFolderSelect = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      const structure: FileNode = {
        name: handle.name,
        type: 'directory',
        children: [],
        path: handle.name
      };

      async function processHandle(dirHandle: FileSystemDirectoryHandle, parentNode: FileNode) {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            parentNode.children?.push({
              name: entry.name,
              type: 'file',
              size: file.size,
              path: `${parentNode.path}/${entry.name}`
            });
          } else if (entry.kind === 'directory') {
            const newDir: FileNode = {
              name: entry.name,
              type: 'directory',
              children: [],
              path: `${parentNode.path}/${entry.name}`
            };
            parentNode.children?.push(newDir);
            await processHandle(entry, newDir);
          }
        }
      }

      await processHandle(handle, structure);
      setFileStructure(structure);
    } catch (err) {
      console.error('Error selecting folder:', err);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Dataset Structure</CardTitle>
      </CardHeader>
      <CardContent>
        {!fileStructure ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragging ? 'border-primary bg-secondary/20' : 'border-border'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <Icons.Folder className="h-10 w-10 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your dataset folder here, or
                </p>
                <Button 
                  variant="link" 
                  onClick={handleFolderSelect}
                  className="mt-2"
                >
                  Choose Folder
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Dataset folder structure:
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFileStructure(null)}
                className="text-red-500 hover:text-red-700"
              >
                <Icons.X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <FileTreeNode node={fileStructure} />
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatasetStructureCard;