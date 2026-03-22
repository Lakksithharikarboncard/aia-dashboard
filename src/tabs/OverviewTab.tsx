import { useState } from 'react';
import { Box, Group, Text, Tooltip, Badge } from '@mantine/core';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { ChartCard } from '../components/widgets/ChartCard';
import { TrendBadge } from '../components/shared/TrendBadge';
import { AIInsightsStrip } from '../components/shared/AIInsightsStrip';
import { GrainToggle, type Grain } from '../components/shared/GrainToggle';
import { CustomerBar } from '../components/shared/CustomerBar';
import { KPIGrid } from '../components/widgets/KPIGrid';
import { Sparkline, LineChart } from '@mantine/charts';

// Number style — tabular numerics, consistent across all KPI values
const NUM: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum" on, "lnum" on',
  letterSpacing: '-0.015em',
};

const REVENUE_DATA: Record<Grain, { date: string; revenue: number }[]> = {
  Day: [
    { date: '1 Jun', revenue: 120000 }, { date: '5 Jun', revenue: 180000 },
    { date: '10 Jun', revenue: 150000 }, { date: '15 Jun', revenue: 210000 },
    { date: '20 Jun', revenue: 190000 }, { date: '25 Jun', revenue: 230000 },
    { date: '30 Jun', revenue: 200000 },
  ],
  Week: [
    { date: 'W1', revenue: 900000 },  { date: 'W2', revenue: 1100000 },
    { date: 'W3', revenue: 980000 },  { date: 'W4', revenue: 1020000 },
  ],
  Month: [
    { date: 'Jan', revenue: 3000000 }, { date: 'Feb', revenue: 3500000 },
    { date: 'Mar', revenue: 3200000 }, { date: 'Apr', revenue: 4000000 },
    { date: 'May', revenue: 4200000 }, { date: 'Jun', revenue: 4500000 },
  ],
};

// ─── Shared label/value row for P&L and AR/AP cards ──────────────────────────
function FinRow({
  label,
  value,
  weight = 'normal',
  topBorder = false,
}: {
  label: React.ReactNode;
  value: string;
  weight?: 'normal' | 'total';
  topBorder?: boolean;
}) {
  const isTotal = weight === 'total';
  return (
    <Group
      justify="space-between"
      style={{
        paddingTop: topBorder ? 14 : 0,
        paddingBottom: 0,
        marginTop: topBorder ? 14 : 0,
        borderTop: topBorder ? '1px solid rgba(18,19,26,0.08)' : 'none',
      }}
    >
      <Box>{label}</Box>
      <Text
        ff="Albert Sans"
        fw={isTotal ? 600 : 500}
        size={isTotal ? '15px' : '14px'}
        c={isTotal ? '#12131A' : '#2C2E36'}
        style={NUM}
      >
        {value}
      </Text>
    </Group>
  );
}

import React from 'react';

export const OverviewTab = () => {
  const [revGrain, setRevGrain] = useState<Grain>('Month');

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ ZONE A */}
      <KPIGrid>
        {/* Row 1 */}

        {/* W1 — Cash Balance */}
        <WidgetCard id="w1-cash" title="Total Cash Balance" colSpan={4} isZoneA>
          {/* Anchored: primary metric top, trend anchors bottom */}
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <Text ff="Albert Sans" fw={500} size="36px" c="#12131A" style={NUM}>₹12,45,000</Text>
            <TrendBadge value={8.5} label="vs last month" />
          </Box>
        </WidgetCard>

        {/* W2 — P&L Compressed */}
        <WidgetCard id="w2-pnl-compressed" title="P&L Summary" colSpan={4} isZoneA>
          {/* Anchored: revenue/gross top, operating profit anchors bottom */}
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <Group justify="space-between">
                <Text ff="Space Grotesk" size="13px" c="#6B6E7A">Revenue</Text>
                <Text ff="Albert Sans" fw={500} size="14px" c="#12131A" style={NUM}>₹45,00,000</Text>
              </Group>
              <Group justify="space-between">
                <Text ff="Space Grotesk" size="13px" c="#6B6E7A">Gross Profit</Text>
                <Text ff="Albert Sans" fw={500} size="14px" c="#12131A" style={NUM}>₹18,50,000</Text>
              </Group>
            </Box>
            <Box style={{ paddingTop: 11, borderTop: '1px solid rgba(18,19,26,0.08)' }}>
              <Group justify="space-between">
                <Text ff="Space Grotesk" fw={600} size="13px" c="#12131A">Operating Profit</Text>
                <Text ff="Albert Sans" fw={600} size="15px" c="#12131A" style={NUM}>₹12,00,000</Text>
              </Group>
            </Box>
          </Box>
        </WidgetCard>

        {/* W3 — Revenue Trend sparkline */}
        <WidgetCard id="w3-rev-spark" title="Revenue Trend" colSpan={4} isZoneA>
          <Sparkline
            w="100%"
            h={56}
            data={[10, 20, 15, 30, 25, 45, 40]}
            color="#2268D1"
            curveType="monotone"
            fillOpacity={0.12}
          />
          <Group mt={10} gap={5} align="baseline">
            <Text ff="Albert Sans" fw={600} size="22px" c="#12131A" style={NUM}>₹45,00,000</Text>
            <Text ff="Space Grotesk" size="12px" c="#8A8C96">this month</Text>
          </Group>
          <TrendBadge value={7.1} label="vs last month" />
        </WidgetCard>

        {/* Row 2 */}

        {/* W4 — DSO */}
        <WidgetCard id="w4-dso" title="Days Sales Outstanding" colSpan={3} isZoneA>
          <Text ff="Albert Sans" fw={500} size="36px" c="#12131A" mb={6} style={NUM}>45 days</Text>
          <StatusChip label="15 days above target" color="red" />
          <Box mt={10}><TrendBadge value={12} label="vs last month" /></Box>
        </WidgetCard>

        {/* W5 — DPO */}
        <WidgetCard id="w5-dpo" title="Days Payable Outstanding" colSpan={3} isZoneA>
          <Text ff="Albert Sans" fw={500} size="36px" c="#12131A" mb={6} style={NUM}>38 days</Text>
          <StatusChip label="Within target range" color="green" />
          <Box mt={10}><TrendBadge value={-5} label="vs last month" /></Box>
        </WidgetCard>

        {/* W6 — Upcoming Payments */}
        <WidgetCard
          id="w6-upcoming"
          title="Upcoming Payments"
          colSpan={6}
          isZoneA
          titleExtra={
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
          }
        >
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 4 }}>
            {/* Overdue */}
            <Box style={{ backgroundColor: 'rgba(224,52,43,0.06)', padding: '6px 10px', borderRadius: 0 }}>
              <Text ff="Space Grotesk" size="11px" fw={600} c="#8A8C96" mb={8} style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Overdue
              </Text>
              <Text ff="Albert Sans" size="28px" fw={600} c="#E0342B" style={NUM}>₹3,45,000</Text>
              <Text ff="Space Grotesk" size="12px" c="#E0342B" mt={4} fw={500}>12 bills</Text>
            </Box>
            {/* 0–7 days */}
            <Box style={{ backgroundColor: '#F5F6F8', padding: '6px 10px', borderRadius: 0, border: '1px solid rgba(18,19,26,0.06)' }}>
              <Text ff="Space Grotesk" size="11px" fw={600} c="#8A8C96" mb={8} style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                0 – 7 days
              </Text>
              <Text ff="Albert Sans" size="28px" fw={600} c="#12131A" style={NUM}>₹1,80,000</Text>
              <Text ff="Space Grotesk" size="12px" c="#8A8C96" mt={4}>5 bills</Text>
            </Box>
            {/* 8–15 days */}
            <Box style={{ backgroundColor: '#F5F6F8', padding: '6px 10px', borderRadius: 0, border: '1px solid rgba(18,19,26,0.06)' }}>
              <Text ff="Space Grotesk" size="11px" fw={600} c="#8A8C96" mb={8} style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                8 – 15 days
              </Text>
              <Text ff="Albert Sans" size="28px" fw={600} c="#12131A" style={NUM}>₹4,20,000</Text>
              <Text ff="Space Grotesk" size="12px" c="#8A8C96" mt={4}>8 bills</Text>
            </Box>
          </Box>
        </WidgetCard>
      </KPIGrid>

      {/* ═══════════════════════════════════════════════════════ AI INSIGHTS */}
      <AIInsightsStrip />

      {/* ═══════════════════════════════════════════════════════ ZONE B */}
      <KPIGrid>
        {/* Row 3 */}

        {/* W7 — P&L Full */}
        <WidgetCard id="w7-pnl-full" title="P&L Statement" colSpan={4}>
          {/* Anchored: statement rows flow from top, Operating Profit is the literal bottom line */}
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 4 }}>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FinRow label={<Text ff="Space Grotesk" size="13px" c="#6B6E7A">Revenue</Text>} value="₹45,00,000" />
              <FinRow label={<Text ff="Space Grotesk" size="13px" c="#6B6E7A">COGS</Text>} value="₹26,50,000" />

              {/* Gross Profit — subtotal */}
              <FinRow
                topBorder
                weight="total"
                label={
                  <Group gap={6} align="center">
                    <Text ff="Space Grotesk" fw={600} size="13px" c="#12131A">Gross Profit</Text>
                    <Box style={{ backgroundColor: 'rgba(20,161,102,0.12)', padding: '2px 6px', borderRadius: 0, fontSize: 11, fontWeight: 600, color: '#14A166', fontFamily: "'Space Grotesk', sans-serif" }}>
                      41%
                    </Box>
                  </Group>
                }
                value="₹18,50,000"
              />

              <FinRow label={<Text ff="Space Grotesk" size="13px" c="#6B6E7A">Operating Expense</Text>} value="₹6,50,000" />
            </Box>

            {/* Flex spacer — Operating Profit anchors to card bottom */}
            <Box style={{ flex: 1 }} />

            {/* Operating Profit — bottom line, literally */}
            <FinRow
              topBorder
              weight="total"
              label={
                <Tooltip label="Revenue minus cost of goods and operating expenses, before tax." withArrow multiline w={210}>
                  <Text
                    ff="Space Grotesk"
                    fw={600}
                    size="13px"
                    c="#12131A"
                    style={{ cursor: 'help', borderBottom: '1px dashed rgba(18,19,26,0.25)', paddingBottom: 1 }}
                  >
                    Operating Profit
                  </Text>
                </Tooltip>
              }
              value="₹12,00,000"
            />
          </Box>
        </WidgetCard>

        {/* W8 — Revenue Trend Full */}
        <ChartCard
          id="w8-rev-full"
          title="Revenue Trend"
          colSpan={8}
          height={230}
          headerExtra={<GrainToggle value={revGrain} onChange={setRevGrain} />}
        >
          <LineChart
            h={230}
            data={REVENUE_DATA[revGrain]}
            dataKey="date"
            series={[{ name: 'revenue', color: '#2268D1', label: 'Revenue' }]}
            curveType="monotone"
            withDots={false}
            gridAxis="x"
            tickLine="none"
            styles={{
              axis: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fill: '#8A8C96' },
            }}
          />
        </ChartCard>

        {/* Row 4 */}

        {/* W9 — Top Customers by Revenue */}
        <WidgetCard id="w9-top-customers" title="Top Customers by Revenue" colSpan={12} needsReview>
          <Box style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CustomerBar name="Acme Corp"    amount="₹12,00,000" percent={65} color="#2268D1" />
            <CustomerBar name="Globex Inc"   amount="₹8,50,000"  percent={48} color="#2268D1" opacity={0.55} />
            <CustomerBar name="Soylent Corp" amount="₹4,20,000"  percent={28} color="#2268D1" opacity={0.35} />
            <CustomerBar name="Initech"      amount="₹1,80,000"  percent={12} color="#2268D1" opacity={0.2} />
          </Box>
        </WidgetCard>
      </KPIGrid>
    </>
  );
};

// ─── Status chip (replaces plain text for target notes) ──────────────────────

function StatusChip({ label, color }: { label: string; color: 'red' | 'green' | 'amber' }) {
  const configs = {
    red:   { bg: 'rgba(224,52,43,0.08)',   text: '#C0302A' },
    green: { bg: 'rgba(20,161,102,0.09)',  text: '#0E7A4D' },
    amber: { bg: 'rgba(217,119,6,0.09)',   text: '#B45309' },
  };
  const { bg, text } = configs[color];
  return (
    <Box style={{ display: 'inline-flex', backgroundColor: bg, padding: '3px 8px', borderRadius: 0 }}>
      <Text ff="Space Grotesk" size="12px" fw={500} c={text}>{label}</Text>
    </Box>
  );
}
