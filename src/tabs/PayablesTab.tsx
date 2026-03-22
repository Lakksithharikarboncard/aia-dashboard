import React from 'react';
import { Box, Group, Text, Tooltip, Badge } from '@mantine/core';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { ChartCard } from '../components/widgets/ChartCard';
import { TrendBadge } from '../components/shared/TrendBadge';
import { CustomerBar } from '../components/shared/CustomerBar';
import { BarChart } from '@mantine/charts';
import { KPIGrid } from '../components/widgets/KPIGrid';
import { AIInsightsCompact } from '../components/shared/AIInsightsStrip';

const NUM: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum" on, "lnum" on',
  letterSpacing: '-0.015em',
};

function StatusChip({ label, color }: { label: string; color: 'red' | 'green' | 'amber' }) {
  const configs = {
    red:   { bg: 'rgba(224,52,43,0.08)',  text: '#C0302A' },
    green: { bg: 'rgba(20,161,102,0.09)', text: '#0E7A4D' },
    amber: { bg: 'rgba(217,119,6,0.09)',  text: '#B45309' },
  };
  const { bg, text } = configs[color];
  return (
    <Box style={{ display: 'inline-flex', backgroundColor: bg, padding: '3px 8px', borderRadius: 0 }}>
      <Text ff="Space Grotesk" size="12px" fw={500} c={text}>{label}</Text>
    </Box>
  );
}

function OverdueBadge({ amount, count }: { amount: string; count: string }) {
  return (
    <Group align="center" gap={6} mt={6}>
      <Box style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#E0342B', flexShrink: 0 }} />
      <Text ff="Space Grotesk" size="12px" c="#E0342B">
        <Text component="span" fw={600} style={NUM}>{amount}</Text>
        {' '}overdue · {count}
      </Text>
    </Group>
  );
}

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

export const PayablesTab = () => {
  return (
    <KPIGrid>
      <AIInsightsCompact />

      {/* Row 1 — AR left, AP right */}
      <WidgetCard id="w14-ar-out" title="AR Outstanding" colSpan={3}>
        <Text ff="Albert Sans" fw={500} size="34px" c="#12131A" mb={6} style={NUM}>₹18,50,000</Text>
        <OverdueBadge amount="₹4,20,000" count="8 invoices" />
        <Box mt={10}><TrendBadge value={-3.2} label="vs last month" /></Box>
        <Text ff="Space Grotesk" size="12px" mt={8} c="#8A8C96">Avg collection: 42 days</Text>
      </WidgetCard>

      <WidgetCard id="w15-dso-full" title="Days Sales Outstanding" colSpan={3}>
        <Text ff="Albert Sans" fw={500} size="34px" c="#12131A" mb={6} style={NUM}>45 days</Text>
        <StatusChip label="15 days above target" color="red" />
        <Box mt={10}><TrendBadge value={12} label="vs last month" /></Box>
        <Text ff="Space Grotesk" size="12px" mt={8} c="#8A8C96">Acme Corp contributing 14 days</Text>
      </WidgetCard>

      <WidgetCard id="w18-ap-out" title="AP Outstanding" colSpan={3}>
        <Text ff="Albert Sans" fw={500} size="34px" c="#12131A" mb={6} style={NUM}>₹9,45,000</Text>
        <OverdueBadge amount="₹3,45,000" count="12 bills" />
        <Box mt={10}><TrendBadge value={8.1} label="vs last month" /></Box>
        <Text ff="Space Grotesk" size="12px" mt={8} c="#8A8C96">Vendor X — largest at ₹4,00,000</Text>
      </WidgetCard>

      <WidgetCard id="w19-dpo-full" title="Days Payable Outstanding" colSpan={3}>
        <Text ff="Albert Sans" fw={500} size="34px" c="#12131A" mb={6} style={NUM}>38 days</Text>
        <StatusChip label="Within target range" color="green" />
        <Box mt={10}><TrendBadge value={-5} label="vs last month" /></Box>
        <Text ff="Space Grotesk" size="12px" mt={8} c="#8A8C96">Vendor X ₹2,10,000 outstanding</Text>
      </WidgetCard>

      {/* Row 2 — Aging charts */}
      <ChartCard id="w16-ar-aging" title="AR Aging" colSpan={6} height={200}>
        <BarChart
          h={200}
          data={[
            { bucket: 'Current', amount: 1430000 },
            { bucket: '1–30',    amount: 210000  },
            { bucket: '31–60',   amount: 150000  },
            { bucket: '61–90',   amount: 40000   },
            { bucket: '90+',     amount: 20000   },
          ]}
          dataKey="bucket"
          series={[{ name: 'amount', color: '#2268D1', label: 'AR' }]}
          gridAxis="none"
          tickLine="none"
          styles={{ axis: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fill: '#8A8C96' } }}
        />
      </ChartCard>

      <ChartCard id="w20-ap-aging" title="AP Aging" colSpan={6} height={200}>
        <BarChart
          h={200}
          data={[
            { bucket: 'Current', amount: 600000 },
            { bucket: '1–30',    amount: 200000 },
            { bucket: '31–60',   amount: 100000 },
            { bucket: '61–90',   amount: 30000  },
            { bucket: '90+',     amount: 15000  },
          ]}
          dataKey="bucket"
          series={[{ name: 'amount', color: '#AAACB5', label: 'AP' }]}
          gridAxis="none"
          tickLine="none"
          styles={{ axis: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fill: '#8A8C96' } }}
        />
      </ChartCard>

      {/* Row 3 */}

      {/* W17 — Top Customers Overdue AR */}
      <WidgetCard id="w17-top-ar" title="Top Customers — Overdue AR" colSpan={6}>
        <Box style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CustomerBar name="Acme Corp"    amount="₹2,10,000" percent={50} color="#E0342B" />
          <CustomerBar name="Soylent Corp" amount="₹1,20,000" percent={28} color="#E0342B" opacity={0.6} />
          <CustomerBar name="Globex Inc"   amount="₹90,000"   percent={21} color="#E0342B" opacity={0.4} />
        </Box>
      </WidgetCard>

      {/* W21 — Vendor Spend Concentration */}
      <WidgetCard id="w21-vendor-spend" title="Vendor Spend Concentration" colSpan={3}>
        <Box style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CustomerBar name="Vendor X"   amount="₹4,00,000" percent={42} color="#2268D1" />
          <CustomerBar name="Supplier Y" amount="₹2,50,000" percent={26} color="#2268D1" opacity={0.55} />
          <CustomerBar name="Agency Z"   amount="₹1,50,000" percent={16} color="#2268D1" opacity={0.35} />
        </Box>
      </WidgetCard>

      {/* W22 — Upcoming Payments AP */}
      <WidgetCard
        id="w22-upcoming-ap"
        title="Upcoming Payments"
        colSpan={3}
        titleExtra={<LiveBadge />}
      >
        <Box style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {/* Overdue */}
          <Box style={{ backgroundColor: 'rgba(224,52,43,0.06)', padding: '8px 10px', borderRadius: 0 }}>
            <Group justify="space-between" mb={3}>
              <Text ff="Space Grotesk" size="11px" fw={600} c="#8A8C96" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>Overdue</Text>
              <Text ff="Space Grotesk" size="11px" c="#8A8C96">12 bills</Text>
            </Group>
            <Text ff="Albert Sans" size="20px" fw={600} c="#E0342B" style={NUM}>₹3,45,000</Text>
          </Box>
          {/* 0-7 days */}
          <Box style={{ backgroundColor: '#F5F6F8', padding: '8px 10px', borderRadius: 0, border: '1px solid rgba(18,19,26,0.06)' }}>
            <Group justify="space-between" mb={3}>
              <Text ff="Space Grotesk" size="11px" fw={600} c="#8A8C96" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>0–7 days</Text>
              <Text ff="Space Grotesk" size="11px" c="#8A8C96">5 bills</Text>
            </Group>
            <Text ff="Albert Sans" size="20px" fw={600} c="#12131A" style={NUM}>₹1,80,000</Text>
          </Box>
          {/* 8-15 days */}
          <Box style={{ backgroundColor: '#F5F6F8', padding: '8px 10px', borderRadius: 0, border: '1px solid rgba(18,19,26,0.06)' }}>
            <Group justify="space-between" mb={3}>
              <Text ff="Space Grotesk" size="11px" fw={600} c="#8A8C96" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>8–15 days</Text>
              <Text ff="Space Grotesk" size="11px" c="#8A8C96">8 bills</Text>
            </Group>
            <Text ff="Albert Sans" size="20px" fw={600} c="#12131A" style={NUM}>₹4,20,000</Text>
          </Box>
        </Box>
      </WidgetCard>
    </KPIGrid>
  );
};
