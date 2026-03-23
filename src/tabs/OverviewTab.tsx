import { useState } from 'react';
import { Box, Group, Text, Tooltip } from '@mantine/core';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { TrendBadge } from '../components/shared/TrendBadge';
import { AIInsightsAccordion } from '../components/shared/AIInsightsAccordion';
import { GrainToggle, type Grain } from '../components/shared/GrainToggle';
import { KPIGrid } from '../components/widgets/KPIGrid';
import { AreaChart } from '@mantine/charts';
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
    { date: 'W1', revenue: 900000  }, { date: 'W2', revenue: 1100000 },
    { date: 'W3', revenue: 980000  }, { date: 'W4', revenue: 1020000 },
  ],
  Month: [
    { date: 'Jan', revenue: 3000000 }, { date: 'Feb', revenue: 3500000 },
    { date: 'Mar', revenue: 3200000 }, { date: 'Apr', revenue: 4000000 },
    { date: 'May', revenue: 4200000 }, { date: 'Jun', revenue: 4500000 },
  ],
};

const GRAIN_STATS: Record<Grain, { current: number; prev: number; currentLabel: string; changeLabel: string }> = {
  Day:   { current: 200000, prev: 190000, currentLabel: 'Today',     changeLabel: 'vs yesterday' },
  Week:  { current: 1020000, prev: 980000, currentLabel: 'This week', changeLabel: 'vs last week' },
  Month: { current: 4500000, prev: 4200000, currentLabel: 'This month', changeLabel: 'vs last month' },
};

// ─── Shared components ────────────────────────────────────────────────────────

const LiveBadge = () => (
  <Box style={{ backgroundColor: 'var(--color-live-badge)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
    LIVE
  </Box>
);

const StatusPill = ({ label, sentiment }: { label: string; sentiment: 'positive' | 'negative' }) => (
  <Box style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '10px', backgroundColor: sentiment === 'positive' ? 'var(--color-positive-bg)' : 'var(--color-critical-bg)' }}>
    <Text ff="Space Grotesk" size="11px" fw={600} c={sentiment === 'positive' ? 'var(--color-positive)' : 'var(--color-critical)'}>
      {label}
    </Text>
  </Box>
);

// ─── Tab ──────────────────────────────────────────────────────────────────────

export const OverviewTab = () => {
  const [revGrain, setRevGrain] = useState<Grain>('Month');
  const stats = GRAIN_STATS[revGrain];
  const pctChange = ((stats.current - stats.prev) / stats.prev * 100).toFixed(1);

  return (
    <Box p="24px">
      <KPIGrid>

        {/* ── Row 1: Three KPI cards ──────────────────────────── */}

        {/* W1 — Cash Balance */}
        <WidgetCard id="w1-cash" title="Total Cash Balance" colSpan={4} isZoneA>
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num">
              {formatCurrency(1245000)}
            </Text>
            <TrendBadge value={8.5} label="vs last month" type="cash" />
          </Box>
        </WidgetCard>

        {/* W4 — DSO */}
        <WidgetCard id="w4-dso" title="Days Sales Outstanding" colSpan={4} isZoneA>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num">45 days</Text>
            <StatusPill label="15 days above target" sentiment="negative" />
            <Box mt={4}><TrendBadge value={12} label="vs last month" type="dso" /></Box>
          </Box>
        </WidgetCard>

        {/* W5 — DPO */}
        <WidgetCard id="w5-dpo" title="Days Payable Outstanding" colSpan={4} isZoneA>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num">38 days</Text>
            <StatusPill label="Within target range" sentiment="positive" />
            <Box mt={4}><TrendBadge value={-5} label="vs last month" /></Box>
          </Box>
        </WidgetCard>

        {/* ── Row 2: Upcoming Payments — full width ───────────── */}

        <WidgetCard id="w6-upcoming" title="Upcoming Payments" colSpan={12} isZoneA titleExtra={<LiveBadge />}>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <Box style={{ backgroundColor: 'var(--color-critical-bg)', padding: '14px 18px', borderRadius: 'var(--radius-inner)', border: '1px solid #FECACA' }}>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-critical)" mb={6} style={{ letterSpacing: '0.8px' }}>OVERDUE</Text>
              <Text ff="Albert Sans" size="22px" fw={700} c="var(--color-critical)" className="num">{formatCurrency(345000)}</Text>
              <Text ff="Space Grotesk" size="12px" c="var(--color-critical)" fw={500} mt={2}>12 bills</Text>
            </Box>
            <Box style={{ backgroundColor: 'var(--color-bg-hover)', padding: '14px 18px', borderRadius: 'var(--radius-inner)', border: '1px solid var(--color-border)' }}>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-muted)" mb={6} style={{ letterSpacing: '0.8px' }}>DUE IN 0–7 DAYS</Text>
              <Text ff="Albert Sans" size="22px" fw={700} c="var(--color-text-primary)" className="num">{formatCurrency(180000)}</Text>
              <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mt={2}>5 bills</Text>
            </Box>
            <Box style={{ backgroundColor: 'var(--color-bg-hover)', padding: '14px 18px', borderRadius: 'var(--radius-inner)', border: '1px solid var(--color-border)' }}>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-muted)" mb={6} style={{ letterSpacing: '0.8px' }}>DUE IN 8–15 DAYS</Text>
              <Text ff="Albert Sans" size="22px" fw={700} c="var(--color-text-primary)" className="num">{formatCurrency(420000)}</Text>
              <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mt={2}>8 bills</Text>
            </Box>
          </Box>
        </WidgetCard>

        {/* ── Row 3: AI Insights ──────────────────────────────── */}
        <AIInsightsAccordion />

        {/* ── Row 4: P&L + Revenue Trend ──────────────────────── */}

        {/* W7 — P&L Statement */}
        <WidgetCard id="w7-pnl-full" title="P&L Statement" colSpan={4}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Group justify="space-between">
              <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">Revenue</Text>
              <Text ff="Albert Sans" fw={400} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(4500000)}</Text>
            </Group>
            <Group justify="space-between">
              <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">COGS</Text>
              <Text ff="Albert Sans" fw={400} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(2650000)}</Text>
            </Group>
            <Group justify="space-between" pt={8} style={{ borderTop: '1px solid var(--color-border)' }}>
              <Group gap={6}>
                <Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">Gross Profit</Text>
                <Box style={{ backgroundColor: 'var(--color-positive-bg)', padding: '2px 6px', borderRadius: 'var(--radius-badge)' }}>
                  <Text ff="Space Grotesk" fw={600} size="10px" c="var(--color-positive)">41%</Text>
                </Box>
              </Group>
              <Text ff="Albert Sans" fw={600} size="14px" c="var(--color-text-primary)" className="num">{formatCurrency(1850000)}</Text>
            </Group>
            <Group justify="space-between">
              <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">Operating Expense</Text>
              <Text ff="Albert Sans" fw={400} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(650000)}</Text>
            </Group>
            <Box style={{ flex: 1, minHeight: 20 }} />
            <Group justify="space-between" pt={12} style={{ borderTop: '1px solid var(--color-border)' }}>
              <Tooltip label="Revenue minus cost of goods and operating expenses, before tax.">
                <Text ff="Space Grotesk" fw={700} size="14px" c="var(--color-text-primary)" style={{ cursor: 'help', borderBottom: '1px dashed var(--color-border-strong)' }}>
                  Operating Profit
                </Text>
              </Tooltip>
              <Text ff="Albert Sans" fw={700} size="16px" c="var(--color-text-primary)" className="num">{formatCurrency(1200000)}</Text>
            </Group>
          </Box>
        </WidgetCard>

        {/* W8 — Revenue Trend (improved) */}
        <WidgetCard
          id="w8-rev-full"
          title="Revenue Trend"
          colSpan={8}
          titleExtra={<GrainToggle value={revGrain} onChange={setRevGrain} />}
        >
          {/* Stat header row */}
          <Group justify="space-between" align="flex-end" mb={20}>
            <Box>
              <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" mb={2}>{stats.currentLabel}</Text>
              <Group gap={10} align="baseline">
                <Text ff="Albert Sans" fw={700} size="28px" c="var(--color-text-primary)" className="num">
                  {formatCurrency(stats.current)}
                </Text>
                <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 10, backgroundColor: Number(pctChange) >= 0 ? 'var(--color-positive-bg)' : 'var(--color-critical-bg)' }}>
                  <Text ff="Space Grotesk" fw={600} size="12px" c={Number(pctChange) >= 0 ? 'var(--color-positive)' : 'var(--color-critical)'}>
                    {Number(pctChange) >= 0 ? '↑' : '↓'} {Math.abs(Number(pctChange))}% {stats.changeLabel}
                  </Text>
                </Box>
              </Group>
            </Box>

            {/* Mini legend */}
            <Group gap={16}>
              {REVENUE_DATA[revGrain].slice(-2).map((d, i) => (
                <Box key={i} style={{ textAlign: 'right' }}>
                  <Text ff="Space Grotesk" size="10px" c="var(--color-text-ghost)">{d.date}</Text>
                  <Text ff="Albert Sans" fw={600} size="13px" c={i === 1 ? 'var(--color-accent-blue)' : 'var(--color-text-muted)'} className="num">
                    {formatCurrency(d.revenue)}
                  </Text>
                </Box>
              ))}
            </Group>
          </Group>

          {/* Area chart */}
          <AreaChart
            h={180}
            data={REVENUE_DATA[revGrain]}
            dataKey="date"
            series={[{
              name: 'revenue',
              color: '#2563EB',
              label: 'Revenue',
            }]}
            curveType="monotone"
            withDots
            withGradient
            fillOpacity={0.18}
            gridAxis="y"
            tickLine="none"
            strokeWidth={2.5}
            dotProps={{ r: 3, fill: '#2563EB', strokeWidth: 0 }}
            activeDotProps={{ r: 5, fill: '#2563EB', stroke: '#EFF6FF', strokeWidth: 2 }}
            valueFormatter={(val) => formatCurrency(val as number)}
            styles={{
              axis: { fontFamily: 'Space Grotesk', fontSize: 11, fill: 'var(--color-text-ghost)' },
            }}
          />
        </WidgetCard>

        {/* ── Row 5: Top Customers ────────────────────────────── */}

        {/* W9 — Top Customers */}
        <WidgetCard id="w9-top-customers" title="Top Customers by Revenue" colSpan={12}>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { name: 'Acme Corp',    amount: 1200000, percent: 65, share: '26.7%', trend: '+8.2%', up: true  },
              { name: 'Globex Inc',   amount: 850000,  percent: 48, share: '18.9%', trend: '+3.1%', up: true  },
              { name: 'Soylent Corp', amount: 420000,  percent: 28, share: '9.3%',  trend: '−2.4%', up: false },
              { name: 'Initech',      amount: 180000,  percent: 12, share: '4.0%',  trend: '+0.9%', up: true  },
            ].map((c) => (
              <Box key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Group justify="space-between" align="flex-start">
                  <Text ff="Space Grotesk" fw={500} size="13px" c="var(--color-text-secondary)">{c.name}</Text>
                  <Box style={{ display: 'inline-flex', padding: '1px 6px', borderRadius: 4, backgroundColor: c.up ? 'var(--color-positive-bg)' : 'var(--color-critical-bg)' }}>
                    <Text ff="Space Grotesk" size="11px" fw={500} c={c.up ? 'var(--color-positive)' : 'var(--color-critical)'}>{c.trend}</Text>
                  </Box>
                </Group>
                <Group justify="space-between" align="baseline">
                  <Text ff="Albert Sans" fw={700} size="18px" c="var(--color-text-primary)" className="num">{formatCurrency(c.amount)}</Text>
                  <Text ff="Space Grotesk" size="12px" c="var(--color-text-ghost)">{c.share}</Text>
                </Group>
                {/* Stacked bar */}
                <Box style={{ height: 6, backgroundColor: 'var(--color-bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                  <Box style={{ height: '100%', width: `${c.percent}%`, background: `linear-gradient(90deg, #2563EB, #60A5FA)`, borderRadius: 3 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </WidgetCard>

      </KPIGrid>
    </Box>
  );
};
