import { useState } from 'react';
import { Box, Group, Text, Tooltip } from '@mantine/core';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { TrendBadge } from '../components/shared/TrendBadge';
import { AIInsightsAccordion } from '../components/shared/AIInsightsAccordion';
import { GrainToggle, type Grain } from '../components/shared/GrainToggle';
import { KPIGrid } from '../components/widgets/KPIGrid';
import { AreaChart, BarChart } from '@mantine/charts';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartTooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

// ─── Data ────────────────────────────────────────────────────────────────────

const REVENUE_DATA: Record<Grain, { date: string; revenue: number }[]> = {
  Day: [
    { date: '1 Jun', revenue: 120000 }, { date: '5 Jun', revenue: 180000 },
    { date: '10 Jun', revenue: 150000 }, { date: '15 Jun', revenue: 210000 },
    { date: '20 Jun', revenue: 190000 }, { date: '25 Jun', revenue: 230000 },
    { date: '30 Jun', revenue: 200000 },
  ],
  Week: [
    { date: 'W1', revenue: 900000 }, { date: 'W2', revenue: 1100000 },
    { date: 'W3', revenue: 980000 }, { date: 'W4', revenue: 1020000 },
  ],
  Month: [
    { date: 'Jan', revenue: 3000000 }, { date: 'Feb', revenue: 3500000 },
    { date: 'Mar', revenue: 3200000 }, { date: 'Apr', revenue: 4000000 },
    { date: 'May', revenue: 4200000 }, { date: 'Jun', revenue: 4500000 },
  ],
};

const GRAIN_STATS: Record<Grain, { current: number; prev: number; label: string; changeLabel: string }> = {
  Day:   { current: 200000,  prev: 190000,  label: 'Today',      changeLabel: 'vs yesterday'  },
  Week:  { current: 1020000, prev: 980000,  label: 'This week',  changeLabel: 'vs last week'  },
  Month: { current: 4500000, prev: 4200000, label: 'This month', changeLabel: 'vs last month' },
};

const REV_VS_EXP_DATA = [
  { month: 'Jan', Revenue: 30,   Expense: 25,   'Net Surplus': 5   },
  { month: 'Feb', Revenue: 31.5, Expense: 26,   'Net Surplus': 5.5 },
  { month: 'Mar', Revenue: 32,   Expense: 26.5, 'Net Surplus': 5.5 },
  { month: 'Apr', Revenue: 34,   Expense: 27,   'Net Surplus': 7   },
  { month: 'May', Revenue: 38,   Expense: 28,   'Net Surplus': 10  },
  { month: 'Jun', Revenue: 45,   Expense: 33,   'Net Surplus': 12  },
];

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

const EXPENSE_CATEGORIES = [
  { label: 'COGS',      amount: 2650000, color: '#2563EB' },
  { label: 'Salaries',  amount: 320000,  color: '#6366F1' },
  { label: 'Rent',      amount: 120000,  color: '#0EA5E9' },
  { label: 'Marketing', amount: 95000,   color: '#8B5CF6' },
  { label: 'Other',     amount: 115000,  color: '#94A3B8' },
];
const EXPENSE_TOTAL = EXPENSE_CATEGORIES.reduce((s, c) => s + c.amount, 0);

const LiveBadge = () => (
  <Box style={{
    backgroundColor: 'var(--color-live-badge)', color: 'white',
    padding: '2px 8px', borderRadius: '10px', fontSize: '10px',
    fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase',
  }}>
    LIVE
  </Box>
);

// ─── Tab ──────────────────────────────────────────────────────────────────────

export const OverviewTab = () => {
  const [revGrain, setRevGrain] = useState<Grain>('Month');
  const [cashGrain, setCashGrain] = useState<Grain>('Week');
  const stats = GRAIN_STATS[revGrain];
  const pctChange = ((stats.current - stats.prev) / stats.prev * 100).toFixed(1);

  return (
    <Box p="24px">
      <KPIGrid>

        {/* ── Row 1: Gross Profit (3) | Cash Balance (3) | Revenue vs Expense (6) ── */}

        <WidgetCard id="w7-gross-profit" title="Gross Profit" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Box>
              <Group gap={6} align="baseline" mb={4}>
                <Text ff="Albert Sans" fw={700} size="26px" c="var(--color-text-primary)" className="num">
                  {formatCurrency(1850000)}
                </Text>
                <Box style={{ backgroundColor: '#EFF6FF', padding: '1px 6px', borderRadius: 4 }}>
                  <Text ff="Space Grotesk" fw={500} size="11px" c="#2563EB">41%</Text>
                </Box>
              </Group>
              <TrendBadge value={7.6} label="vs last month" type="revenue" />
            </Box>
            <Box style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, marginTop: 10 }}>
              <Group justify="space-between" mb={4}>
                <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">Revenue</Text>
                <Text ff="Albert Sans" size="12px" c="var(--color-text-primary)" className="num">{formatCurrency(4500000)}</Text>
              </Group>
              <Group justify="space-between">
                <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">COGS</Text>
                <Text ff="Albert Sans" size="12px" c="var(--color-text-primary)" className="num">{formatCurrency(2650000)}</Text>
              </Group>
            </Box>
          </Box>
        </WidgetCard>

        <WidgetCard id="w10-cash-full" title="Cash Balance" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Box>
              <Text ff="Albert Sans" fw={700} size="26px" c="var(--color-text-primary)" className="num" mb={4}>
                {formatCurrency(1245000)}
              </Text>
              <TrendBadge value={8.5} label="vs last month" type="cash" />
            </Box>
            <Box style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, marginTop: 10 }}>
              <Group justify="space-between" mb={4}>
                <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">HDFC Current A/c</Text>
                <Text ff="Albert Sans" fw={600} size="12px" c="var(--color-text-primary)" className="num">{formatCurrency(820000)}</Text>
              </Group>
              <Group justify="space-between">
                <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">SBI Savings A/c</Text>
                <Text ff="Albert Sans" fw={600} size="12px" c="var(--color-text-primary)" className="num">{formatCurrency(425000)}</Text>
              </Group>
            </Box>
          </Box>
        </WidgetCard>

        <WidgetCard id="w10-rev-vs-exp" title="Revenue vs Expense" colSpan={6}>
          <Group justify="space-between" align="center" mb={10}>
            <Group gap={8} align="baseline">
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-text-primary)" className="num">
                {formatCurrency(1200000)}
              </Text>
              <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)">net surplus · Jun</Text>
              <Box style={{ display: 'inline-flex', padding: '1px 6px', borderRadius: 10, backgroundColor: 'var(--color-positive-bg)' }}>
                <Text ff="Space Grotesk" fw={600} size="11px" c="var(--color-positive)">↑ 26.7%</Text>
              </Box>
            </Group>
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)">vs last month</Text>
          </Group>
          <ResponsiveContainer width="100%" height={140}>
            <ComposedChart data={REV_VS_EXP_DATA} margin={{ top: 2, right: 36, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tickFormatter={(v) => `₹${v}L`} tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} width={42} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `₹${v}L`} tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} width={36} domain={[0, 20]} />
              <RechartTooltip formatter={(value, name) => [`₹${value}L`, name as string]} contentStyle={{ fontFamily: 'Space Grotesk', fontSize: 12, border: '1px solid #E5E7EB', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontFamily: 'Space Grotesk', fontSize: 11, paddingTop: 4 }} iconType="square" />
              <Bar yAxisId="left" dataKey="Revenue" fill="#2563EB" radius={[3, 3, 0, 0]} maxBarSize={28} />
              <Bar yAxisId="left" dataKey="Expense" fill="#CBD5E1" radius={[3, 3, 0, 0]} maxBarSize={28} />
              <Line yAxisId="right" type="monotone" dataKey="Net Surplus" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2, r: 4 }} activeDot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </WidgetCard>

        {/* ── Row 2: P&L Summary (3) | Cash Inflow vs Outflow (6) | Expense Breakdown (3) ── */}

        <WidgetCard id="w7-pnl-full" title="P&L Summary" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Group justify="space-between">
              <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">Revenue</Text>
              <Text ff="Albert Sans" size="12px" c="var(--color-text-primary)" className="num">{formatCurrency(4500000)}</Text>
            </Group>
            <Group justify="space-between">
              <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">COGS</Text>
              <Text ff="Albert Sans" size="12px" c="var(--color-text-primary)" className="num">{formatCurrency(2650000)}</Text>
            </Group>
            <Group justify="space-between" pt={6} style={{ borderTop: '1px solid var(--color-border)' }}>
              <Group gap={4}>
                <Text ff="Space Grotesk" fw={600} size="12px" c="var(--color-text-primary)">Gross Profit</Text>
                <Box style={{ backgroundColor: 'var(--color-positive-bg)', padding: '1px 5px', borderRadius: 4 }}>
                  <Text ff="Space Grotesk" fw={600} size="10px" c="var(--color-positive)">41%</Text>
                </Box>
              </Group>
              <Text ff="Albert Sans" fw={600} size="12px" c="var(--color-text-primary)" className="num">{formatCurrency(1850000)}</Text>
            </Group>
            <Group justify="space-between">
              <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">Opex</Text>
              <Text ff="Albert Sans" size="12px" c="var(--color-text-primary)" className="num">{formatCurrency(650000)}</Text>
            </Group>
            <Group justify="space-between" pt={6} style={{ borderTop: '1px solid var(--color-border)' }}>
              <Tooltip label="Revenue minus COGS and operating expenses, before tax.">
                <Text ff="Space Grotesk" fw={700} size="12px" c="var(--color-text-primary)" style={{ cursor: 'help', borderBottom: '1px dashed var(--color-border)' }}>
                  Op. Profit
                </Text>
              </Tooltip>
              <Text ff="Albert Sans" fw={700} size="14px" c="var(--color-positive)" className="num">{formatCurrency(1200000)}</Text>
            </Group>
          </Box>
        </WidgetCard>

        <WidgetCard
          id="w12-cash-flow"
          title="Cash Inflow vs Outflow"
          colSpan={6}
          titleExtra={<GrainToggle value={cashGrain} onChange={setCashGrain} />}
        >
          <BarChart
            h={150}
            data={CASHFLOW_DATA[cashGrain]}
            dataKey="date"
            series={[
              { name: 'Inflow',  color: 'var(--color-accent-blue)', label: 'Inflow' },
              { name: 'Outflow', color: '#CBD5E1', label: 'Outflow' },
            ]}
            tickLine="none"
            gridAxis="x"
            withLegend
            legendProps={{ verticalAlign: 'bottom', height: 24 }}
            valueFormatter={(val) => formatCurrency(val)}
            styles={{ axis: { fontFamily: 'Space Grotesk', fontSize: 10, fill: 'var(--color-text-ghost)' } }}
          />
        </WidgetCard>

        <WidgetCard id="w11-exp-breakdown" title="Expense Breakdown" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Group justify="space-between" mb={10} align="baseline">
              <Text ff="Albert Sans" fw={700} size="16px" c="var(--color-text-primary)" className="num">
                {formatCurrency(EXPENSE_TOTAL)}
              </Text>
              <TrendBadge value={3.8} label="vs last month" />
            </Group>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, justifyContent: 'space-between' }}>
              {EXPENSE_CATEGORIES.map((cat) => {
                const pct = Math.round((cat.amount / EXPENSE_TOTAL) * 100);
                return (
                  <Box key={cat.label}>
                    <Group justify="space-between" mb={3}>
                      <Group gap={5} align="center">
                        <Box style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cat.color, flexShrink: 0 }} />
                        <Text ff="Space Grotesk" size="11px" fw={500} c="var(--color-text-secondary)">{cat.label}</Text>
                      </Group>
                      <Group gap={6}>
                        <Text ff="Albert Sans" fw={600} size="11px" c="var(--color-text-primary)" className="num">{formatCurrency(cat.amount)}</Text>
                        <Text ff="Space Grotesk" size="10px" c="var(--color-text-ghost)">{pct}%</Text>
                      </Group>
                    </Group>
                    <Box style={{ height: 3, backgroundColor: 'var(--color-bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                      <Box style={{ height: '100%', width: `${pct}%`, backgroundColor: cat.color, borderRadius: 3, opacity: 0.85 }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </WidgetCard>

        {/* ── Row 3: AI Insights (12col) ── */}

        <WidgetCard id="w-ai-insights" title="" colSpan={12} disablePanel>
          <AIInsightsAccordion />
        </WidgetCard>

        {/* ── Row 4: Revenue Trend (5) | Top Customers (4) | Upcoming Payments (3) ── */}

        <WidgetCard
          id="w8-rev-full"
          title="Revenue Trend"
          colSpan={5}
          titleExtra={<GrainToggle value={revGrain} onChange={setRevGrain} />}
        >
          <Group justify="space-between" align="center" mb={10}>
            <Group gap={8} align="baseline">
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-text-primary)" className="num">
                {formatCurrency(stats.current)}
              </Text>
              <Box style={{ display: 'inline-flex', padding: '1px 6px', borderRadius: 10, backgroundColor: Number(pctChange) >= 0 ? 'var(--color-positive-bg)' : 'var(--color-critical-bg)' }}>
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

        <WidgetCard id="w9-top-customers" title="Top Customers by Revenue" colSpan={4}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', justifyContent: 'space-between' }}>
            {[
              { name: 'Acme Corp',    amount: 1200000, percent: 65, trend: '+8.2%', up: true  },
              { name: 'Globex Inc',   amount: 850000,  percent: 48, trend: '+3.1%', up: true  },
              { name: 'Soylent Corp', amount: 420000,  percent: 28, trend: '−2.4%', up: false },
              { name: 'Initech',      amount: 180000,  percent: 12, trend: '+0.9%', up: true  },
            ].map((c) => (
              <Box key={c.name}>
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

        <WidgetCard id="w13-upcoming-cash" title="Upcoming Payments" colSpan={3} titleExtra={<LiveBadge />}>
          <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Box>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-critical)" mb={2} style={{ letterSpacing: '0.8px' }}>OVERDUE</Text>
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-critical)" className="num">{formatCurrency(345000)}</Text>
              <Text ff="Space Grotesk" size="11px" c="var(--color-critical)" opacity={0.7}>12 bills</Text>
            </Box>
            <Box style={{ height: 1, backgroundColor: 'var(--color-border)', opacity: 0.5 }} />
            <Box>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-muted)" mb={2} style={{ letterSpacing: '0.8px' }}>DUE 0–7 DAYS</Text>
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-text-primary)" className="num">{formatCurrency(180000)}</Text>
              <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">5 bills</Text>
            </Box>
            <Box style={{ height: 1, backgroundColor: 'var(--color-border)', opacity: 0.5 }} />
            <Box>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-muted)" mb={2} style={{ letterSpacing: '0.8px' }}>DUE 8–15 DAYS</Text>
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-text-primary)" className="num">{formatCurrency(420000)}</Text>
              <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">8 bills</Text>
            </Box>
          </Box>
        </WidgetCard>

      </KPIGrid>
    </Box>
  );
};
