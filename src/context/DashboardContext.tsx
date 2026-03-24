import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type PanelView = 'summary' | 'detail';

interface DashboardState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dateFrom: string;
  dateTo: string;
  setDateFrom: (d: string) => void;
  setDateTo: (d: string) => void;
  isCurrentPeriod: boolean;
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
  const [dateFrom, setDateFrom] = useState('2026-03-01');
  const [dateTo, setDateTo] = useState('2026-03-24');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);
  const [panelView, setPanelView] = useState<PanelView>('summary');
  const [panelData, setPanelData] = useState<any>(null);

  const TODAY = '2026-03-24';
  const isCurrentPeriod = dateTo >= TODAY;

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
        dateFrom,
        dateTo,
        setDateFrom,
        setDateTo,
        isCurrentPeriod,
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
