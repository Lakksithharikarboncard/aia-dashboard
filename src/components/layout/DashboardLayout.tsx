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
          background: 'var(--color-bg-page)',
          minHeight: '100vh',
          paddingRight: isPanelOpen ? 360 : 0,
          transition: 'padding-right 0.2s ease-out',
        },
      }}
    >
      {/* ─── Header ─────────────────────────────────────────── */}
      <AppShell.Header
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid var(--color-border)',
          zIndex: 200,
        }}
      >
        <Group h="100%" px={24} justify="space-between" wrap="nowrap">
          {/* Left: Brand + Org + Nav */}
          <Group gap={0} align="stretch" wrap="nowrap" style={{ height: '100%' }}>
            {/* Wordmark */}
            <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 20 }}>
              <Text
                ff="Albert Sans"
                fw={800}
                size="18px"
                c="var(--color-text-primary)"
                style={{ letterSpacing: '-0.04em', lineHeight: 1 }}
              >
                AIA
              </Text>
              <Text
                ff="Space Grotesk"
                size="10px"
                c="var(--color-text-ghost)"
                fw={600}
                style={{ letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1, marginTop: 2 }}
              >
                Accountant
              </Text>
            </Box>

            {/* Divider */}
            <Box style={{ width: 1, height: 24, backgroundColor: 'var(--color-border)', alignSelf: 'center', marginRight: 20 }} />

            {/* Nav tabs */}
            {NAV_ITEMS.map(({ tab, icon: Icon, label }) => (
              <NavTab
                key={tab}
                active={activeTab === tab}
                label={label}
                icon={<Icon size={16} strokeWidth={2} />}
                onClick={() => { setActiveTab(tab); closePanel(); }}
              />
            ))}
          </Group>

          {/* Right: Date selector */}
          <Select
            placeholder="This Month"
            data={[
              'Last 7 Days', 'This Month', 'Last Month', 'This Quarter', 'This Year'
            ]}
            value={dateRange}
            onChange={(val) => val && setDateRange(val)}
            size="sm"
            w={160}
            styles={{
              input: {
                fontFamily: 'Space Grotesk',
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: 'var(--color-bg-hover)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-inner)',
                color: 'var(--color-text-primary)',
                height: 34,
              },
            }}
          />
        </Group>
      </AppShell.Header>

      {/* ─── Main content ────────────────────────────────────── */}
      <AppShell.Main>
        <Box style={{ maxWidth: 1440, margin: '0 auto', width: '100%' }}>
          {children}
        </Box>
      </AppShell.Main>

      {/* ─── Side panel (fixed overlay) ──────────────────────── */}
      <SidePanel />
    </AppShell>
  );
};

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
          gap: 8,
          padding: '0 16px',
          color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          fontFamily: 'Space Grotesk',
          fontSize: 13,
          fontWeight: active ? 600 : 500,
          transition: 'color 0.15s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {icon}
        {label}
      </UnstyledButton>
      {/* Bottom active indicator */}
      {active && (
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 16,
            right: 16,
            height: 2,
            backgroundColor: 'var(--color-accent-blue)',
            borderRadius: '2px 2px 0 0',
          }}
        />
      )}
    </Box>
  );
}
