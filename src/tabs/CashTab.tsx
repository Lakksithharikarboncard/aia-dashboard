import React, { useState } from 'react';
import { Box, Group, Text, Tooltip, Badge, Divider } from '@mantine/core';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { ChartCard } from '../components/widgets/ChartCard';
import { TrendBadge } from '../components/shared/TrendBadge';
import { GrainToggle, type Grain } from '../components/shared/GrainToggle';
import { BarChart } from '@mantine/charts';
import { KPIGrid } from '../components/widgets/KPIGrid';
import { AIInsightsCompact } from '../components/shared/AIInsightsStrip';

const NUM: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum" on, "lnum" on',
  letterSpacing: '-0.015em',
};

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
  <Tooltip label="Always shows payments due relative to today." withArrow>
    <Badge
      color="teal"
      variant="light"
      size="xs"
      style={{ cursor: 'default', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.04em' }}
    >
      Live
    </Badge>
  </Tooltip>
);

export const CashTab = () => {
  const [cashGrain, setCashGrain] = useState<Grain>('Week');

  return (
    <KPIGrid>
      <AIInsightsCompact />

      {/* Row 1 */}

      {/* W10 — Cash Balance */}
      <WidgetCard id="w10-cash-full" title="Cash Balance" colSpan={5}>
        {/* Anchored: primary metric + trend top, account breakdown anchors bottom */}
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <Box>
            <Text ff="Albert Sans" fw={500} size="40px" c="#12131A" mb={8} style={NUM}>₹12,45,000</Text>
            <TrendBadge value={8.5} label="vs last month" />
          </Box>
          {/* Account breakdown — anchored to card bottom */}
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Group justify="space-between" py={10} style={{ borderTop: '1px solid rgba(18,19,26,0.07)' }}>
              <Text ff="Space Grotesk" size="13px" c="#6B6E7A">HDFC Current A/c</Text>
              <Text ff="Albert Sans" fw={500} size="13px" c="#12131A" style={NUM}>₹8,20,000</Text>
            </Group>
            <Group justify="space-between" py={10} style={{ borderTop: '1px solid rgba(18,19,26,0.07)' }}>
              <Text ff="Space Grotesk" size="13px" c="#6B6E7A">SBI Savings A/c</Text>
              <Text ff="Albert Sans" fw={500} size="13px" c="#12131A" style={NUM}>₹4,25,000</Text>
            </Group>
          </Box>
        </Box>
      </WidgetCard>

      {/* W11 — Cash Runway */}
      <WidgetCard id="w11-cash-runway" title="Cash Runway" colSpan={2}>
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
          <Text ff="Albert Sans" fw={500} size="52px" c="#2268D1" style={{ ...NUM, lineHeight: 1 }}>~42</Text>
          <Text ff="Space Grotesk" size="12px" c="#8A8C96" fw={500}>days runway</Text>
          <Divider w="40px" my={12} color="rgba(18,19,26,0.1)" />
          <Text ff="Space Grotesk" size="11px" c="#8A8C96" ta="center">₹29,643/day avg outflow</Text>
        </Box>
      </WidgetCard>

      {/* W12 — Cash Inflow vs Outflow */}
      <ChartCard
        id="w12-cash-flow"
        title="Cash Inflow vs Outflow"
        colSpan={5}
        height={200}
        headerExtra={<GrainToggle value={cashGrain} onChange={setCashGrain} />}
      >
        <BarChart
          h={200}
          data={CASHFLOW_DATA[cashGrain]}
          dataKey="date"
          series={[
            { name: 'Inflow',  color: '#2268D1', label: 'Inflow' },
            { name: 'Outflow', color: '#D0D4DC', label: 'Outflow' },
          ]}
          tickLine="none"
          gridAxis="none"
          withLegend
          legendProps={{ verticalAlign: 'bottom', height: 30 }}
          styles={{
            axis: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fill: '#8A8C96' },
          }}
        />
      </ChartCard>

      {/* Row 2 — Upcoming Payments */}
      <WidgetCard
        id="w13-upcoming-cash"
        title="Upcoming Payments"
        colSpan={12}
        titleExtra={<LiveBadge />}
      >
        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 14 }}>
          {/* Overdue */}
          <Box style={{ backgroundColor: 'rgba(224,52,43,0.06)', padding: '8px 12px', borderRadius: 0 }}>
            <Text ff="Space Grotesk" size="11px" fw={600} c="#8A8C96" mb={8} style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>Overdue</Text>
            <Text ff="Albert Sans" size="36px" fw={600} c="#E0342B" style={NUM}>₹3,45,000</Text>
            <Text ff="Space Grotesk" size="12px" c="#E0342B" mt={4} fw={500}>12 bills</Text>
          </Box>
          {/* 0-7 days */}
          <PaymentBucket label="0 – 7 days" amount="₹1,80,000" count="5 bills" />
          {/* 8-15 days */}
          <PaymentBucket label="8 – 15 days" amount="₹4,20,000" count="8 bills" />
        </Box>
      </WidgetCard>
    </KPIGrid>
  );
};

function PaymentBucket({ label, amount, count }: { label: string; amount: string; count: string }) {
  return (
    <Box style={{ backgroundColor: '#F5F6F8', padding: '8px 12px', borderRadius: 0, border: '1px solid rgba(18,19,26,0.06)' }}>
      <Text ff="Space Grotesk" size="11px" fw={600} c="#8A8C96" mb={8} style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</Text>
      <Text ff="Albert Sans" size="36px" fw={600} c="#12131A" style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.015em' }}>{amount}</Text>
      <Text ff="Space Grotesk" size="12px" c="#8A8C96" mt={4}>{count}</Text>
    </Box>
  );
}
