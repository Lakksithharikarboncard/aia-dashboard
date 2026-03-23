import { useState } from 'react';
import { Box, Group, Text, UnstyledButton } from '@mantine/core';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { TrendBadge } from '../components/shared/TrendBadge';
import { GrainToggle, type Grain } from '../components/shared/GrainToggle';
import { BarChart } from '@mantine/charts';
import { KPIGrid } from '../components/widgets/KPIGrid';
import { IconSparkles } from '@tabler/icons-react';
import { formatCurrency } from '../utils/formatters';

const CASHFLOW_DATA: Record<Grain, { date: string; Inflow: number; Outflow: number }[]> = {
  Day: [
    { date: 'Mon', Inflow: 320000, Outflow: 210000 },
    { date: 'Tue', Inflow: 280000, Outflow: 350000 },
    { date: 'Wed', Inflow: 410000, Outflow: 290000 },
    { date: 'Thu', Inflow: 190000, Outflow: 240000 },
    { date: 'Fri', Inflow: 500000, Outflow: 310000 },
  ],
  Week: [
    { date: 'W1', Inflow: 1200000, Outflow: 800000  },
    { date: 'W2', Inflow: 900000,  Outflow: 1100000 },
    { date: 'W3', Inflow: 1500000, Outflow: 950000  },
    { date: 'W4', Inflow: 1100000, Outflow: 1000000 },
  ],
  Month: [
    { date: 'Jan', Inflow: 3500000, Outflow: 2800000 },
    { date: 'Feb', Inflow: 4200000, Outflow: 3100000 },
    { date: 'Mar', Inflow: 3800000, Outflow: 3400000 },
    { date: 'Apr', Inflow: 4500000, Outflow: 3600000 },
    { date: 'May', Inflow: 4100000, Outflow: 3200000 },
    { date: 'Jun', Inflow: 4700000, Outflow: 3850000 },
  ],
};

const LiveBadge = () => (
  <Box
    style={{
      backgroundColor: 'var(--color-live-badge)',
      color: 'white',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    }}
  >
    LIVE
  </Box>
);

const AIInsightsChip = () => (
  <UnstyledButton
    style={{
      border: '1px solid var(--color-border)',
      borderRadius: '20px',
      padding: '6px 12px',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}
  >
    <IconSparkles size={14} color="#D97706" />
    <Text ff="Space Grotesk" fw={500} size="12px" c="var(--color-text-secondary)">
      3 signals
    </Text>
    <Box style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#D97706' }} />
    <Text ff="Space Grotesk" fw={600} size="10px" c="#D97706">BETA</Text>
  </UnstyledButton>
);

const BillRow = ({ vendor, billNo, amount, age, color }: { vendor: string; billNo: string; amount: number; age: string; color: string }) => (
  <Group justify="space-between" mt={4} wrap="nowrap">
    <Text ff="Space Grotesk" size="12px" c="var(--color-text-secondary)" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {vendor} · {billNo}
    </Text>
    <Group gap={8}>
      <Text ff="Albert Sans" fw={600} size="12px" c="var(--color-text-primary)" className="num">{formatCurrency(amount)}</Text>
      <Text ff="Space Grotesk" size="11px" c={color} fw={500}>{age}</Text>
    </Group>
  </Group>
);

export const CashTab = () => {
  const [cashGrain, setCashGrain] = useState<Grain>('Week');

  return (
    <Box p="24px">
      <Group justify="flex-end" mb={16}>
        <AIInsightsChip />
      </Group>
      <KPIGrid>
        {/* W10 — Cash Balance */}
        <WidgetCard id="w10-cash-full" title="Cash Balance" colSpan={6}>
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <Box>
              <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" mb={4} className="num">
                {formatCurrency(1245000)}
              </Text>
              <TrendBadge value={8.5} label="vs last month" type="cash" />
            </Box>
            <Box mt={16} style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
              <Group justify="space-between" pb={10}>
                <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">HDFC Current A/c</Text>
                <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(820000)}</Text>
              </Group>
              <Group justify="space-between" pt={10} style={{ borderTop: '1px solid var(--color-border)' }}>
                <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">SBI Savings A/c</Text>
                <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(425000)}</Text>
              </Group>
            </Box>
          </Box>
        </WidgetCard>

        {/* W12 — Cash Inflow vs Outflow */}
        <WidgetCard
          id="w12-cash-flow"
          title="Cash Inflow vs Outflow"
          colSpan={6}
          titleExtra={<GrainToggle value={cashGrain} onChange={setCashGrain} />}
        >
          <BarChart
            h={200}
            data={CASHFLOW_DATA[cashGrain]}
            dataKey="date"
            series={[
              { name: 'Inflow',  color: 'var(--color-accent-blue)', label: 'Inflow' },
              { name: 'Outflow', color: '#CBD5E1', label: 'Outflow' },
            ]}
            tickLine="none"
            gridAxis="x"
            withLegend
            legendProps={{ verticalAlign: 'bottom', height: 30 }}
            valueFormatter={(val) => formatCurrency(val)}
            styles={{
              axis: { fontFamily: 'Space Grotesk', fontSize: 11, fill: 'var(--color-text-ghost)' },
            }}
          />
        </WidgetCard>

        {/* W13 — Upcoming Payments */}
        <WidgetCard
          id="w13-upcoming-cash"
          title="Upcoming Payments"
          colSpan={12}
          titleExtra={<LiveBadge />}
        >
          <Box mb={8}>
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" style={{ fontStyle: 'italic' }}>
              Relative to today — not affected by date filter
            </Text>
          </Box>
          
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-inner)', overflow: 'hidden', minHeight: 180 }}>
            {/* OVERDUE */}
            <Box style={{ backgroundColor: 'var(--color-critical-bg)', padding: '16px 20px', borderRight: '1px solid var(--color-border)' }}>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-critical)" mb={4} style={{ letterSpacing: '0.8px' }}>OVERDUE</Text>
              <Text ff="Albert Sans" size="28px" fw={700} c="var(--color-critical)" className="num">{formatCurrency(345000)}</Text>
              <Text ff="Space Grotesk" size="12px" c="var(--color-critical)" fw={500} opacity={0.7} mb={12}>12 bills</Text>
              
              <BillRow vendor="Vendor X" billNo="#1042" amount={140000} age="14d overdue" color="var(--color-critical)" />
              <BillRow vendor="Supplier Y" billNo="#892" amount={90000} age="11d overdue" color="var(--color-critical)" />
              <BillRow vendor="Agency Z" billNo="#331" amount={72000} age="9d overdue" color="var(--color-critical)" />
              <Text ff="Space Grotesk" size="12px" c="var(--color-critical)" mt={8} fw={500}>+ 9 more bills</Text>
            </Box>

            {/* 0-7 DAYS */}
            <Box style={{ backgroundColor: 'white', padding: '16px 20px', borderRight: '1px solid var(--color-border)' }}>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-muted)" mb={4} style={{ letterSpacing: '0.8px' }}>DUE IN 0–7 DAYS</Text>
              <Text ff="Albert Sans" size="28px" fw={700} c="var(--color-text-primary)" className="num">{formatCurrency(180000)}</Text>
              <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mb={12}>5 bills</Text>
              
              <BillRow vendor="Vendor A" billNo="#205" amount={60000} age="Due 24 Mar" color="var(--color-text-ghost)" />
              <BillRow vendor="Vendor B" billNo="#301" amount={75000} age="Due 25 Mar" color="var(--color-text-ghost)" />
              <BillRow vendor="Vendor C" billNo="#144" amount={45000} age="Due 27 Mar" color="var(--color-text-ghost)" />
            </Box>

            {/* 8-15 DAYS */}
            <Box style={{ backgroundColor: 'white', padding: '16px 20px' }}>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-muted)" mb={4} style={{ letterSpacing: '0.8px' }}>DUE IN 8–15 DAYS</Text>
              <Text ff="Albert Sans" size="28px" fw={700} c="var(--color-text-primary)" className="num">{formatCurrency(420000)}</Text>
              <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mb={12}>8 bills</Text>
              
              <BillRow vendor="Vendor D" billNo="#408" amount={120000} age="Due 31 Mar" color="var(--color-text-ghost)" />
              <BillRow vendor="Vendor E" billNo="#519" amount={90000} age="Due 3 Apr" color="var(--color-text-ghost)" />
              <BillRow vendor="Vendor F" billNo="#312" amount={60000} age="Due 5 Apr" color="var(--color-text-ghost)" />
            </Box>
          </Box>
        </WidgetCard>
      </KPIGrid>
    </Box>
  );
};
