import React from 'react';
import { AppShell, Group, Text, Box, Select, UnstyledButton } from '@mantine/core';
import { useDashboard } from '../../context/DashboardContext';
import {
  IconLayoutDashboard,
  IconBuildingBank,
  IconReceipt2,
} from '@tabler/icons-react';
import { SidePanel } from './SidePanel';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { tab: 'overview',  icon: IconLayoutDashboard, label: 'Overview' },
  { tab: 'cash',      icon: IconBuildingBank,    label: 'Cash' },
  { tab: 'payables',  icon: IconReceipt2,        label: 'Payables & Receivables' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { activeTab, setActiveTab, dateRange, setDateRange, isPanelOpen, closePanel } = useDashboard();

  return (
    <AppShell
      header={{ height: 56 }}
      padding="md"
      styles={{
        main: {
          background: '#E2E5EA',
          minWidth: '1280px',
          overflowX: 'auto',
        },
      }}
    >
      {/* ─── Header ─────────────────────────────────────────── */}
      <AppShell.Header
        style={{
          backgroundColor: '#FCFCFC',
          borderBottom: '1px solid rgba(18,19,26,0.08)',
          zIndex: 200,
        }}
      >
        <Group h="100%" px={20} justify="space-between" wrap="nowrap">
          {/* Left: Brand + Org + Nav */}
          <Group gap={0} align="stretch" wrap="nowrap" style={{ height: '100%' }}>
            {/* Wordmark */}
            <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 16 }}>
              <Text
                ff="Albert Sans"
                fw={700}
                size="18px"
                c="#0E1018"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
              >
                AIA
              </Text>
              <Text
                ff="Space Grotesk"
                size="9px"
                c="#8A8C96"
                fw={500}
                style={{ letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1, marginTop: 2 }}
              >
                AI Accountant
              </Text>
            </Box>

            {/* Divider */}
            <Box style={{ width: 1, height: 28, backgroundColor: 'rgba(18,19,26,0.1)', alignSelf: 'center', marginRight: 16 }} />

            {/* Org context */}
            <Group gap={7} align="center" wrap="nowrap" style={{ marginRight: 24 }}>
              <Box
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 0,
                  backgroundColor: '#2268D1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Text ff="Albert Sans" fw={700} size="10px" c="white" style={{ lineHeight: 1 }}>A</Text>
              </Box>
              <Text ff="Space Grotesk" size="13px" fw={500} c="#12131A">Acme Corp</Text>
            </Group>

            {/* Divider */}
            <Box style={{ width: 1, height: 28, backgroundColor: 'rgba(18,19,26,0.1)', alignSelf: 'center', marginRight: 4 }} />

            {/* Nav tabs */}
            {NAV_ITEMS.map(({ tab, icon: Icon, label }) => (
              <NavTab
                key={tab}
                active={activeTab === tab}
                label={label}
                icon={<Icon size={15} strokeWidth={1.75} />}
                onClick={() => { setActiveTab(tab); closePanel(); }}
              />
            ))}
          </Group>

          {/* Right: Date selector */}
          <Select
            placeholder="This Month"
            data={[
              { group: 'Calendar', items: ['Last 7 Days', 'This Month', 'Last Month', 'This Quarter', 'This Year'] },
              { group: 'Fiscal Quarters', items: ['Q1 Apr–Jun', 'Q2 Jul–Sep', 'Q3 Oct–Dec', 'Q4 Jan–Mar'] },
            ]}
            value={dateRange}
            onChange={(val) => val && setDateRange(val)}
            size="sm"
            w={160}
            styles={{
              input: {
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                backgroundColor: '#F5F6F8',
                border: '1px solid rgba(18,19,26,0.1)',
                borderRadius: 0,
                color: '#12131A',
                height: 34,
                minHeight: 34,
              },
            }}
          />
        </Group>
      </AppShell.Header>

      {/* ─── Main content ────────────────────────────────────── */}
      <AppShell.Main>
        <Box style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: isPanelOpen ? 'repeat(9, 1fr)' : 'repeat(12, 1fr)',
              gap: '20px',
              transition: 'grid-template-columns 0.2s ease',
            }}
          >
            {children}
          </Box>
        </Box>
      </AppShell.Main>

      {/* ─── Side panel (fixed overlay) ──────────────────────── */}
      <SidePanel />
    </AppShell>
  );
};

// ─── Nav tab with bottom-border active indicator ──────────────────────────────

function NavTab({
  icon,
  active,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Box style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
      <UnstyledButton
        onClick={onClick}
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '0 14px',
          color: active ? '#12131A' : '#8A8C96',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          transition: 'color 0.15s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {icon}
        {label}
      </UnstyledButton>
      {/* Bottom active indicator */}
      <Box
        style={{
          position: 'absolute',
          bottom: 0,
          left: 14,
          right: 14,
          height: 2,
          backgroundColor: active ? '#2268D1' : 'transparent',
          borderRadius: 0,
          transition: 'background-color 0.15s ease',
        }}
      />
    </Box>
  );
}
