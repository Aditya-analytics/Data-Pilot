import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface DatasetContextType {
  datasetId: string | null;
  setDatasetId: (id: string | null) => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [datasetId, setDatasetId] = useState<string | null>(null);

  return (
    <DatasetContext.Provider value={{ datasetId, setDatasetId }}>
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
};
