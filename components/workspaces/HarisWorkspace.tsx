/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import { Tabs, TabsTrigger, TabsList } from "@radix-ui/react-tabs";
import { FilterType } from "./types";
import TFOperationsBrowser from "../MatrixPlaylist";
import { Matrix } from "./types";

const HarisWorkspace = () => {
  // Remove all kernel-related state variables
  const [inputSize, setInputSize] = useState<number>(1);
  const [inputMatrix, setInputMatrix] = useState<Matrix>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('identity');
  const [outputMatrix, setOutputMatrix] = useState<Matrix>([]);
  const [activeTab, setActiveTab] = useState('normal');
  const [isError, setIsError] = useState(false);

  return (
    <div className="p-4">
      <Tabs defaultValue="normal" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="normal">Normal</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <TFOperationsBrowser />
        </div>
      </Tabs>   
    </div>
  );
};

export default HarisWorkspace;