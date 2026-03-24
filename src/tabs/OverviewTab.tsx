import { useState } from 'react';
import { Box, Group, Text } from '@mantine/core';
import { IconTrendingUp, IconArrowNarrowUp } from '@tabler/icons-react';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { TrendBadge } from '../components/shared/TrendBadge';
import { AIInsightsAccordion } from '../components/shared/AIInsightsAccordion';
import { GrainToggle, type Grain } from '../components/shared/GrainToggle';
import { KPIGrid } from '../components/widgets/KPIGrid';
import { AreaChart } from '@mantine/charts';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartTooltip, ResponsiveContainer, Cell,
  AreaChart as RechartsAreaChart, Area,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useDashboard } from '../context/DashboardContext';

// ─── Daily Pulse Badge ────────────────────────────────────────────────────────

type PulseSentiment = 'positive' | 'negative' | 'neutral';

const DailyPulseBadge = ({ label, sentiment }: { label: string; sentiment: PulseSentiment }) => {
  const styles: Record<PulseSentiment, { color: string; border: string }> = {
    positive: { color: '#16A34A', border: '1px solid #BBF7D0' },
    negative: { color: '#DC2626', border: '1px solid #FECACA' },
    neutral:  { color: '#6B7280', border: '1px solid #E5E7EB' },
  };
  const s = styles[sentiment];
  return (
    <Box style={{ display: 'inline-flex', padding: '2px 6px', borderRadius: 4, border: s.border, background: 'transparent' }}>
      <Text ff="Space Grotesk" fw={500} size="11px" c={s.color}>{label}</Text>
    </Box>
  );
};

// ─── Revenue vs Expense: custom tooltip & legend ─────────────────────────────

const REV_EXP_SERIES = [
  { key: 'Revenue',    color: '#2563EB', shape: 'bar'  },
  { key: 'Expense',   color: '#CBD5E1', shape: 'bar'  },
  { key: 'Net Income', color: '#16A34A', shape: 'line' },
] as const;

const RevExpTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Box style={{
      backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: 10,
      padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: 168,
    }}>
      <Text ff="Space Grotesk" fw={600} size="10px" c="var(--color-text-ghost)"
        style={{ textTransform: 'uppercase', letterSpacing: '0.6px' }} mb={8}>
        {label}
      </Text>
      {REV_EXP_SERIES.map(({ key, color, shape }) => {
        const entry = payload.find((p: any) => p.dataKey === key || p.name === key);
        if (!entry) return null;
        return (
          <Group key={key} justify="space-between" gap={20} mb={4} wrap="nowrap">
            <Group gap={6} align="center">
              {shape === 'bar'
                ? <Box style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: color, flexShrink: 0 }} />
                : <Box style={{ width: 12, height: 2, borderRadius: 1, backgroundColor: color, flexShrink: 0 }} />
              }
              <Text ff="Space Grotesk" size="11px" c="var(--color-text-secondary)">{key}</Text>
            </Group>
            <Text ff="Albert Sans" fw={600} size="12px" c="var(--color-text-primary)" className="num">
              ₹{entry.value}L
            </Text>
          </Group>
        );
      })}
    </Box>
  );
};

const RevExpLegend = () => (
  <Group gap={20} justify="center" mt={10}>
    {REV_EXP_SERIES.map(({ key, color, shape }) => (
      <Group key={key} gap={5} align="center">
        {shape === 'bar'
          ? <Box style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color, flexShrink: 0 }} />
          : <Box style={{ width: 14, height: 2, borderRadius: 1, backgroundColor: color, flexShrink: 0 }} />
        }
        <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">{key}</Text>
      </Group>
    ))}
  </Group>
);

// ─── Cash Inflow vs Outflow: stacked area chart ──────────────────────────────

const CASHFLOW_AREA_DATA: Record<Grain, { date: string; Inflow: number; Outflow: number }[]> = {
  Day: [
    { date: 'Mon', Inflow: 3.2, Outflow: 2.1 },
    { date: 'Tue', Inflow: 2.8, Outflow: 3.5 },
    { date: 'Wed', Inflow: 4.1, Outflow: 2.9 },
    { date: 'Thu', Inflow: 1.9, Outflow: 2.4 },
    { date: 'Fri', Inflow: 3.8, Outflow: 2.8 },
  ],
  Week: [
    { date: 'W1', Inflow: 12,   Outflow: 8   },
    { date: 'W2', Inflow: 9,    Outflow: 11  },
    { date: 'W3', Inflow: 14,   Outflow: 9.5 },
    { date: 'W4', Inflow: 11,   Outflow: 9   },
  ],
  Month: [
    { date: 'Oct', Inflow: 32, Outflow: 28 },
    { date: 'Nov', Inflow: 35, Outflow: 30 },
    { date: 'Dec', Inflow: 38, Outflow: 33 },
    { date: 'Jan', Inflow: 38, Outflow: 30 },
    { date: 'Feb', Inflow: 41, Outflow: 35 },
    { date: 'Mar', Inflow: 45, Outflow: 33 },
  ],
};


const CashFlowTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const inflow  = payload.find((p: any) => p.dataKey === 'Inflow')?.value  ?? 0;
  const outflow = payload.find((p: any) => p.dataKey === 'Outflow')?.value ?? 0;
  const net = +(inflow - outflow).toFixed(1);
  return (
    <Box style={{
      backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: 10,
      padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: 160,
    }}>
      <Text ff="Space Grotesk" fw={600} size="10px" c="var(--color-text-ghost)"
        style={{ textTransform: 'uppercase', letterSpacing: '0.6px' }} mb={8}>
        {label}
      </Text>
      {[
        { key: 'Inflow',  color: '#2563EB', val: inflow  },
        { key: 'Outflow', color: '#94A3B8', val: outflow },
      ].map(({ key, color, val }) => (
        <Group key={key} justify="space-between" gap={20} mb={4} wrap="nowrap">
          <Group gap={6} align="center">
            <Box style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-secondary)">{key}</Text>
          </Group>
          <Text ff="Albert Sans" fw={600} size="12px" c="var(--color-text-primary)" className="num">₹{val}L</Text>
        </Group>
      ))}
      <Box style={{ borderTop: '1px solid #F3F4F6', marginTop: 6, paddingTop: 6 }}>
        <Group justify="space-between" wrap="nowrap">
          <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">Net</Text>
          <Text ff="Albert Sans" fw={700} size="12px" className="num"
            c={net >= 0 ? 'var(--color-positive)' : 'var(--color-critical)'}>
            {net >= 0 ? '+' : ''}₹{net}L
          </Text>
        </Group>
      </Box>
    </Box>
  );
};

// ─── Data ────────────────────────────────────────────────────────────────────

const GP_SPARKLINE = [
  { month: 'Oct', value: 32 },
  { month: 'Nov', value: 35 },
  { month: 'Dec', value: 38 },
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 41 },
  { month: 'Mar', value: 18.5 },
];

const REV_VS_EXP_DATA = [
  { month: 'Oct', Revenue: 30,   Expense: 23,   'Net Income': 7   },
  { month: 'Nov', Revenue: 32,   Expense: 24.5, 'Net Income': 7.5 },
  { month: 'Dec', Revenue: 33.5, Expense: 25,   'Net Income': 8.5 },
  { month: 'Jan', Revenue: 36,   Expense: 27,   'Net Income': 9   },
  { month: 'Feb', Revenue: 42,   Expense: 30,   'Net Income': 12  },
  { month: 'Mar', Revenue: 45,   Expense: 33,   'Net Income': 12  },
];

// P&L Waterfall: spacer lifts the bar to the correct position
const PNL_WATERFALL = [
  { label: 'Revenue',      spacer: 0,    value: 45,   type: 'total',    color: '#2563EB' },
  { label: 'COGS',         spacer: 18.5, value: 26.5, type: 'decrease', color: '#FCA5A5' },
  { label: 'Gross Profit', spacer: 0,    value: 18.5, type: 'subtotal', color: '#16A34A' },
  { label: 'OpEx',         spacer: 12,   value: 6.5,  type: 'decrease', color: '#FCA5A5' },
  { label: 'Net Profit',   spacer: 0,    value: 12,   type: 'end',      color: '#15803D' },
];


const EXPENSE_CATEGORIES = [
  { label: 'Salaries',  amount: 357500, percent: 55, color: '#2563EB' },
  { label: 'Marketing', amount: 130000, percent: 20, color: '#6366F1' },
  { label: 'Infra',     amount: 97500,  percent: 15, color: '#0EA5E9' },
  { label: 'Travel',    amount: 32500,  percent: 5,  color: '#8B5CF6' },
  { label: 'Other',     amount: 32500,  percent: 5,  color: '#94A3B8' },
];
const EXPENSE_TOTAL = 650000;

const REVENUE_DATA: Record<Grain, { date: string; revenue: number }[]> = {
  Day: [
    { date: '1 Mar',  revenue: 120000 }, { date: '5 Mar',  revenue: 180000 },
    { date: '10 Mar', revenue: 150000 }, { date: '15 Mar', revenue: 210000 },
    { date: '20 Mar', revenue: 190000 }, { date: '24 Mar', revenue: 230000 },
  ],
  Week: [
    { date: 'W1', revenue: 900000  }, { date: 'W2', revenue: 1100000 },
    { date: 'W3', revenue: 980000  }, { date: 'W4', revenue: 1020000 },
  ],
  Month: [
    { date: 'Oct', revenue: 3000000 }, { date: 'Nov', revenue: 3200000 },
    { date: 'Dec', revenue: 3350000 }, { date: 'Jan', revenue: 3600000 },
    { date: 'Feb', revenue: 4200000 }, { date: 'Mar', revenue: 4500000 },
  ],
};

const GRAIN_STATS: Record<Grain, { current: number; prev: number; label: string; changeLabel: string }> = {
  Day:   { current: 230000,  prev: 190000,  label: 'Today',      changeLabel: 'vs yesterday'  },
  Week:  { current: 1020000, prev: 980000,  label: 'This week',  changeLabel: 'vs last week'  },
  Month: { current: 4500000, prev: 4200000, label: 'This month', changeLabel: 'vs last month' },
};

// ─── Custom Waterfall Tooltip ─────────────────────────────────────────────────

const WaterfallTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const entry = PNL_WATERFALL.find(d => d.label === label);
  if (!entry) return null;
  return (
    <Box style={{
      backgroundColor: 'white', border: '1px solid #E5E7EB',
      borderRadius: 8, padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)" mb={2}>{label}</Text>
      <Text ff="Albert Sans" fw={700} size="14px" c={entry.type === 'decrease' ? '#DC2626' : entry.color} className="num">
        {entry.type === 'decrease' ? '−' : ''}₹{entry.value}L
      </Text>
    </Box>
  );
};

// ─── Tab ──────────────────────────────────────────────────────────────────────

export const OverviewTab = () => {
  const { isCurrentPeriod, openPanel } = useDashboard();
  const [revGrain, setRevGrain] = useState<Grain>('Month');
  const [cashGrain, setCashGrain] = useState<Grain>('Month');
  const stats = GRAIN_STATS[revGrain];
  const pctChange = ((stats.current - stats.prev) / stats.prev * 100).toFixed(1);

  return (
    <Box p="24px">
      <KPIGrid>

        {/* ── Row 1: Gross Profit (3) | Cash Balance (3) | Revenue vs Expense (6) ──
             Contract: every card is display:flex flex-col with minHeight:270.
             KPI header = flexShrink:0. Chart zone = flex:1 minHeight:0.
             CSS Grid equalises height across the row automatically.         ── */}

        {/* ── Gross Profit ── */}
        <WidgetCard
          id="w7-gross-profit" title="Gross Profit" colSpan={3}
          titleExtra={<IconTrendingUp size={15} color="#9CA3AF" />}
        >
          {/* Flex wrapper fills WidgetCard's content Box */}
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 220 }}>

            {/* KPI header — fixed height */}
            <Box style={{ flexShrink: 0 }}>
              <Group gap={8} align="baseline" mb={4}>
                <Text ff="Albert Sans" fw={800} size="32px" c="var(--color-text-primary)" className="num"
                  style={{ lineHeight: 1, letterSpacing: '-1px' }}>
                  ₹18.5L
                </Text>
                <Box style={{ backgroundColor: '#F0FDF4', padding: '2px 6px', borderRadius: 4, border: '1px solid #BBF7D0' }}>
                  <Text ff="Space Grotesk" fw={600} size="11px" c="#16A34A">+7.6%</Text>
                </Box>
              </Group>
              <Group justify="space-between" mb={12}>
                <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">41% Gross Margin</Text>
                <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)">vs last month</Text>
              </Group>
              <Box style={{ height: 1, backgroundColor: '#F3F4F6' }} />
            </Box>

            {/* Sparkline — flex: 1 now works, absolute gives AreaChart a pixel height */}
            <Box style={{ flex: 1, minHeight: 80, position: 'relative', paddingTop: 10 }}>
              <Box style={{ position: 'absolute', top: 10, right: 0, bottom: 0, left: 0 }}>
                <AreaChart
                  h="100%"
                  data={GP_SPARKLINE}
                  dataKey="month"
                  series={[{ name: 'value', color: '#2563EB' }]}
                  curveType="monotone"
                  withDots={false}
                  withGradient
                  fillOpacity={0.18}
                  gridAxis="none"
                  tickLine="none"
                  withXAxis
                  withYAxis={false}
                  strokeWidth={2}
                  valueFormatter={(v) => `₹${v}L`}
                  styles={{ axis: { fontFamily: 'Space Grotesk', fontSize: 10, fill: '#9CA3AF' } }}
                />
              </Box>
            </Box>

          </Box>
        </WidgetCard>

        {/* ── Cash Balance ── */}
        <WidgetCard id="w10-cash-full" title="" colSpan={3}
          style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 270 }}>

          {/* Header zone — flexShrink: 0 */}
          <Box style={{
            flexShrink: 0,
            background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            borderBottom: '1px solid var(--color-border)',
            padding: '20px 24px 18px',
          }}>
            <Text ff="Space Grotesk" fw={600} size="11px" c="var(--color-text-ghost)"
              style={{ textTransform: 'uppercase', letterSpacing: '0.8px' }} mb={10}>
              Cash Balance
            </Text>
            <Text ff="Albert Sans" fw={900} size="40px" c="var(--color-text-primary)" className="num"
              style={{ lineHeight: 1, letterSpacing: '-1.5px' }} mb={6}>
              ₹12.45L
            </Text>
            <Text ff="Space Grotesk" fw={500} size="13px" c="var(--color-text-secondary)" mb={14}>
              Across 2 accounts
            </Text>
            <Box style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0',
              padding: '6px 10px', borderRadius: 8,
            }}>
              <IconArrowNarrowUp size={14} color="#10b981" strokeWidth={2.5} />
              <Text ff="Space Grotesk" fw={700} size="12px" c="#10b981">
                {isCurrentPeriod ? '₹45K today' : '8.5% vs last month'}
              </Text>
            </Box>
          </Box>

          {/* Body zone — flex: 1 fills remaining height */}
          <Box style={{ flex: 1, padding: '14px 24px 0', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
            <Text ff="Space Grotesk" fw={600} size="10px" c="var(--color-text-ghost)"
              style={{ textTransform: 'uppercase', letterSpacing: '0.8px' }} mb={10}>
              Account Breakdown
            </Text>
            {[
              { label: 'HDFC Current A/c', amount: '₹8.2L' },
              { label: 'SBI Savings A/c',  amount: '₹4.25L' },
            ].map((acc, i) => (
              <Box key={acc.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 0',
                borderBottom: i === 0 ? '1px solid #f3f4f6' : 'none',
              }}>
                <Text ff="Space Grotesk" fw={500} size="13px" c="var(--color-text-primary)">{acc.label}</Text>
                <Text ff="Albert Sans" fw={800} size="17px" c="var(--color-text-primary)" className="num"
                  style={{ letterSpacing: '-0.5px' }}>{acc.amount}</Text>
              </Box>
            ))}
          </Box>
        </WidgetCard>

        {/* ── Revenue vs Expense ── */}
        <WidgetCard id="w10-rev-vs-exp" title="Revenue vs Expense" colSpan={6}>

          {/* Flex wrapper fills WidgetCard's content Box and becomes the flex parent */}
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 220 }}>

            {/* KPI header — fixed height */}
            <Box style={{ flexShrink: 0, marginBottom: 12 }}>
              <Group justify="space-between" align="flex-end">
                <Box>
                  <Text ff="Albert Sans" fw={800} size="32px" c="var(--color-text-primary)" className="num"
                    style={{ lineHeight: 1, letterSpacing: '-1px' }}>
                    ₹12L
                  </Text>
                  <Group gap={6} align="center" mt={5}>
                    <Box style={{
                      display: 'inline-flex', alignItems: 'center',
                      backgroundColor: 'var(--color-positive-bg)', border: '1px solid #BBF7D0',
                      padding: '2px 7px', borderRadius: 6,
                    }}>
                      <Text ff="Space Grotesk" fw={700} size="11px" c="var(--color-positive)">↑ 10.1%</Text>
                    </Box>
                    <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)">vs last month</Text>
                  </Group>
                </Box>
                <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)" style={{ paddingBottom: 2 }}>
                  net income · Mar 2026
                </Text>
              </Group>
            </Box>

            {/* Chart — flex: 1 now works because parent is a flex container */}
            <Box style={{ flex: 1, minHeight: 140, position: 'relative' }}>
              <Box style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={REV_VS_EXP_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 0" />
                    <XAxis dataKey="month"
                      tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Space Grotesk', fontWeight: 500 }}
                      axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `₹${v}L`}
                      tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Space Grotesk' }}
                      axisLine={false} tickLine={false} width={40} domain={[0, 52]} />
                    <RechartTooltip content={<RevExpTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={26} />
                    <Bar dataKey="Expense" fill="#CBD5E1" radius={[4, 4, 0, 0]} maxBarSize={26} />
                    <Line type="monotone" dataKey="Net Income" stroke="#16A34A" strokeWidth={2.5}
                      dot={{ fill: '#16A34A', stroke: '#FFFFFF', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 5, fill: '#16A34A', stroke: '#FFFFFF', strokeWidth: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            {/* Legend pinned at bottom */}
            <Box style={{ flexShrink: 0, paddingTop: 8 }}>
              <RevExpLegend />
            </Box>

          </Box>
        </WidgetCard>

        {/* ── Row 2: P&L Waterfall (4) | Cash Inflow vs Outflow (5) | Expense Breakdown (3) ── */}

        <WidgetCard id="w2-pnl-compressed" title="P&L Summary" colSpan={4}>
          <Box mb={4}>
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">Revenue → Net Profit bridge</Text>
          </Box>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={PNL_WATERFALL} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Space Grotesk' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `₹${v}L`}
                tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Space Grotesk' }}
                axisLine={false} tickLine={false} width={42}
              />
              <RechartTooltip content={<WaterfallTooltip />} />
              {/* Invisible spacer bar */}
              <Bar dataKey="spacer" stackId="wf" fill="transparent" stroke="none" legendType="none" />
              {/* Visible value bar with per-entry colors */}
              <Bar dataKey="value" stackId="wf" radius={[3, 3, 0, 0]} maxBarSize={48}>
                {PNL_WATERFALL.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    stroke={entry.type === 'end' ? '#15803D' : 'none'}
                    strokeWidth={entry.type === 'end' ? 2 : 0}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </WidgetCard>

        <WidgetCard
          id="w12-cash-flow"
          title="Cash Inflow vs Outflow"
          colSpan={5}
          titleExtra={
            <Group gap={8} align="center">
              {isCurrentPeriod && (
                <DailyPulseBadge label="Net +₹12K today" sentiment="positive" />
              )}
              <GrainToggle value={cashGrain} onChange={setCashGrain} />
            </Group>
          }
        >
          {/* Chart */}
          <ResponsiveContainer width="100%" height={190}>
            <RechartsAreaChart
              data={CASHFLOW_AREA_DATA[cashGrain]}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#94A3B8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="date"
                tickLine={false} axisLine={false} tickMargin={8}
                tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Space Grotesk' }}
              />
              <YAxis
                tickFormatter={(v) => `₹${v}L`}
                tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Space Grotesk' }}
                axisLine={false} tickLine={false} width={40}
              />
              <RechartTooltip content={<CashFlowTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
              <Area
                dataKey="Inflow" type="natural"
                stroke="#2563EB" strokeWidth={2}
                fill="url(#inflowGrad)"
                dot={false} activeDot={{ r: 4, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                dataKey="Outflow" type="natural"
                stroke="#94A3B8" strokeWidth={2}
                fill="url(#outflowGrad)"
                dot={false} activeDot={{ r: 4, fill: '#94A3B8', stroke: '#fff', strokeWidth: 2 }}
              />
            </RechartsAreaChart>
          </ResponsiveContainer>

          {/* Legend */}
          <Group gap={16} mt={8}>
            {[
              { label: 'Inflow',  color: '#2563EB' },
              { label: 'Outflow', color: '#94A3B8' },
            ].map(({ label, color }) => (
              <Group key={label} gap={5} align="center">
                <Box style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
                <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">{label}</Text>
              </Group>
            ))}
          </Group>
        </WidgetCard>

        <WidgetCard id="w11-exp-breakdown" title="Expense Breakdown" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Group justify="space-between" mb={10} align="baseline">
              <Text ff="Albert Sans" fw={700} size="16px" c="var(--color-text-primary)" className="num">
                {formatCurrency(EXPENSE_TOTAL)}
              </Text>
              <TrendBadge value={3.2} label="vs last month" />
            </Group>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'space-between' }}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <Box key={cat.label}>
                  <Group justify="space-between" mb={3}>
                    <Group gap={5} align="center">
                      <Box style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cat.color, flexShrink: 0 }} />
                      <Text ff="Space Grotesk" size="11px" fw={500} c="var(--color-text-secondary)">{cat.label}</Text>
                    </Group>
                    <Group gap={6}>
                      <Text ff="Albert Sans" fw={600} size="11px" c="var(--color-text-primary)" className="num">{formatCurrency(cat.amount)}</Text>
                      <Text ff="Space Grotesk" size="10px" c="var(--color-text-ghost)">{cat.percent}%</Text>
                    </Group>
                  </Group>
                  <Box style={{ height: 3, backgroundColor: 'var(--color-bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                    <Box style={{ height: '100%', width: `${cat.percent}%`, backgroundColor: cat.color, borderRadius: 3, opacity: 0.85 }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </WidgetCard>

        {/* ── Row 3: AI Insights (12col) ── */}

        <WidgetCard id="w-ai-insights" title="" colSpan={12} disablePanel>
          <AIInsightsAccordion />
        </WidgetCard>

        {/* ── Row 4: Revenue Trend (6) | Top Customers (6) ── */}

        <WidgetCard
          id="w8-rev-full"
          title="Revenue Trend"
          colSpan={6}
          titleExtra={<GrainToggle value={revGrain} onChange={setRevGrain} />}
        >
          <Group justify="space-between" align="center" mb={10}>
            <Group gap={8} align="baseline">
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-text-primary)" className="num">
                {formatCurrency(stats.current)}
              </Text>
              <Box style={{
                display: 'inline-flex', padding: '1px 6px', borderRadius: 10,
                backgroundColor: Number(pctChange) >= 0 ? 'var(--color-positive-bg)' : 'var(--color-critical-bg)',
              }}>
                <Text ff="Space Grotesk" fw={600} size="11px" c={Number(pctChange) >= 0 ? 'var(--color-positive)' : 'var(--color-critical)'}>
                  {Number(pctChange) >= 0 ? '↑' : '↓'} {Math.abs(Number(pctChange))}%
                </Text>
              </Box>
            </Group>
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)">{stats.changeLabel}</Text>
          </Group>
          <AreaChart
            h={120}
            data={REVENUE_DATA[revGrain]}
            dataKey="date"
            series={[{ name: 'revenue', color: '#2563EB', label: 'Revenue' }]}
            curveType="monotone"
            withDots
            withGradient
            fillOpacity={0.12}
            gridAxis="y"
            tickLine="none"
            strokeWidth={2}
            dotProps={{ r: 3, fill: '#2563EB', strokeWidth: 0 }}
            activeDotProps={{ r: 4, fill: '#2563EB', stroke: '#EFF6FF', strokeWidth: 2 }}
            valueFormatter={(val) => formatCurrency(val as number)}
            styles={{ axis: { fontFamily: 'Space Grotesk', fontSize: 10, fill: 'var(--color-text-ghost)' } }}
          />
        </WidgetCard>

        <WidgetCard id="w9-top-customers" title="Top Customers by Revenue" colSpan={6}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', justifyContent: 'space-between' }}>
            {[
              { name: 'Acme Corp',    amount: 1200000, percent: 65, trend: '+8.2%', up: true  },
              { name: 'Globex Inc',   amount: 850000,  percent: 48, trend: '+3.1%', up: true  },
              { name: 'Soylent Corp', amount: 420000,  percent: 28, trend: '−2.4%', up: false },
              { name: 'Initech',      amount: 180000,  percent: 12, trend: '+0.9%', up: true  },
            ].map((c) => (
              <Box
                key={c.name}
                style={{ cursor: 'pointer' }}
                onClick={() => openPanel('w9-top-customers')}
              >
                <Group justify="space-between" align="center" mb={4}>
                  <Group gap={6} align="center">
                    <Text ff="Space Grotesk" fw={500} size="12px" c="var(--color-text-secondary)">{c.name}</Text>
                    <Box style={{ display: 'inline-flex', padding: '1px 5px', borderRadius: 4, backgroundColor: c.up ? 'var(--color-positive-bg)' : 'var(--color-critical-bg)' }}>
                      <Text ff="Space Grotesk" size="10px" fw={500} c={c.up ? 'var(--color-positive)' : 'var(--color-critical)'}>{c.trend}</Text>
                    </Box>
                  </Group>
                  <Text ff="Albert Sans" fw={700} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(c.amount)}</Text>
                </Group>
                <Box style={{ height: 4, backgroundColor: 'var(--color-bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                  <Box style={{ height: '100%', width: `${c.percent}%`, background: 'linear-gradient(90deg, #2563EB, #60A5FA)', borderRadius: 3 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </WidgetCard>


      </KPIGrid>
    </Box>
  );
};
