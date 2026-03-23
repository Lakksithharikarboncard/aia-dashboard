import React from 'react';
import { AppShell, Group, Text, Box, UnstyledButton } from '@mantine/core';
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
  const { activeTab, setActiveTab, dateFrom, dateTo, setDateFrom, setDateTo, isPanelOpen, closePanel } = useDashboard();

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

            {/* Org name */}
            <Box style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRight: '1px solid var(--color-border)', height: '100%' }}>
              <Box style={{ width: 24, height: 24, backgroundColor: '#2563EB', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Text ff="Space Grotesk" fw={600} size="12px" c="white" style={{ lineHeight: 1 }}>A</Text>
              </Box>
              <Text ff="Space Grotesk" fw={500} size="13px" c="var(--color-text-secondary)">Acme Corp</Text>
            </Box>

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

          {/* Right: Date range */}
          <DateRangePicker from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} />
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

function DateRangePicker({
  from, to, onFromChange, onToChange,
}: {
  from: string; to: string; onFromChange: (d: string) => void; onToChange: (d: string) => void;
}) {
  const inputStyle: React.CSSProperties = {
    fontFamily: 'Space Grotesk',
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    width: 96,
    cursor: 'pointer',
    colorScheme: 'light',
  };

  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'var(--color-bg-hover)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        padding: '0 10px',
        height: 34,
      }}
    >
      <input
        type="date"
        value={from}
        max={to}
        onChange={(e) => onFromChange(e.target.value)}
        style={inputStyle}
      />
      <Box style={{ width: 1, height: 14, backgroundColor: 'var(--color-border)' }} />
      <input
        type="date"
        value={to}
        min={from}
        onChange={(e) => onToChange(e.target.value)}
        style={inputStyle}
      />
    </Box>
  );
}

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
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'var(--color-accent-blue)',
            borderRadius: '2px 2px 0 0',
          }}
        />
      )}
    </Box>
  );
}
