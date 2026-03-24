import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { OverviewTab } from './tabs/OverviewTab';
import { PayablesTab } from './tabs/PayablesTab';

const DashboardContent = () => {
  const { activeTab } = useDashboard();

  return (
    <DashboardLayout>
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'payables' && <PayablesTab />}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
