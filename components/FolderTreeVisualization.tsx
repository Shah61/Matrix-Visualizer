import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as Icons from 'lucide-react';

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
}

interface FolderTreeProps {
  className?: string;
}

const FolderTreeVisualization: React.FC<FolderTreeProps> = ({ className }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['dataset']));

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

  const renderTree = (node: TreeNode, path = '') => {
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
        <div className="bg-secondary/20 rounded-lg p-4">
          {renderTree(folderStructure)}
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderTreeVisualization;