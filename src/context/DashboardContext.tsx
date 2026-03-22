import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type PanelView = 'summary' | 'detail';

interface DashboardState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  isPanelOpen: boolean;
  activeWidgetId: string | null;
  panelView: PanelView;
  panelData: any;
  openPanel: (widgetId: string, view?: PanelView, data?: any) => void;
  closePanel: () => void;
  setPanelView: (view: PanelView) => void;
}

const DashboardContext = createContext<DashboardState | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('This Month');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);
  const [panelView, setPanelView] = useState<PanelView>('summary');
  const [panelData, setPanelData] = useState<any>(null);

  const openPanel = (widgetId: string, view: PanelView = 'summary', data: any = null) => {
    setActiveWidgetId(widgetId);
    setPanelView(view);
    setPanelData(data);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        dateRange,
        setDateRange,
        isPanelOpen,
        activeWidgetId,
        panelView,
        panelData,
        openPanel,
        closePanel,
        setPanelView,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};
