import { createContext, useContext, useState, ReactNode } from 'react';

type ViewType = 'physician' | 'patient' | 'patient-mobile' | 'admin';

interface ViewContextType {
  viewMode: ViewType;
  setViewMode: (mode: ViewType) => void;
  toggleView: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewType>('physician');

  const toggleView = () => {
    // Cycle through: physician -> patient -> patient-mobile -> admin -> physician
    setViewMode(prev => {
      if (prev === 'physician') return 'patient';
      if (prev === 'patient') return 'patient-mobile';
      if (prev === 'patient-mobile') return 'admin';
      return 'physician';
    });
  };

  return (
    <ViewContext.Provider value={{ viewMode, setViewMode, toggleView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}