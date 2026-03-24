import { Box, Group, Text } from '@mantine/core';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { TrendBadge } from '../components/shared/TrendBadge';
import { KPIGrid } from '../components/widgets/KPIGrid';
import { formatCurrency } from '../utils/formatters';
import { useDashboard } from '../context/DashboardContext';
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip,
  ResponsiveContainer, LabelList,
} from 'recharts';

// ─── Shared sub-components ───────────────────────────────────────────────────

const StatusPill = ({ label, sentiment }: { label: string; sentiment: 'positive' | 'negative' }) => (
  <Box style={{
    display: 'inline-flex', padding: '2px 8px', borderRadius: '10px',
    backgroundColor: sentiment === 'positive' ? 'var(--color-positive-bg)' : 'var(--color-critical-bg)',
  }}>
    <Text ff="Space Grotesk" size="11px" fw={600} c={sentiment === 'positive' ? 'var(--color-positive)' : 'var(--color-critical)'}>
      {label}
    </Text>
  </Box>
);

const OverdueBadge = ({ amount, count }: { amount: number; count: string }) => (
  <Box style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '2px 8px', borderRadius: '4px',
    backgroundColor: 'var(--color-critical-bg)', border: '1px solid #FECACA',
  }}>
    <Text ff="Space Grotesk" size="12px" c="var(--color-critical)" fw={500}>
      <Text component="span" fw={600} className="num">{formatCurrency(amount)}</Text> overdue · {count}
    </Text>
  </Box>
);

type PulseSentiment = 'positive' | 'negative' | 'neutral';
const DailyPulseBadge = ({ label, sentiment }: { label: string; sentiment: PulseSentiment }) => {
  const s: Record<PulseSentiment, { color: string; border: string }> = {
    positive: { color: '#16A34A', border: '1px solid #BBF7D0' },
    negative: { color: '#DC2626', border: '1px solid #FECACA' },
    neutral:  { color: '#6B7280', border: '1px solid #E5E7EB' },
  };
  return (
    <Box style={{ display: 'inline-flex', padding: '2px 6px', borderRadius: 4, border: s[sentiment].border, background: 'transparent' }}>
      <Text ff="Space Grotesk" fw={500} size="11px" c={s[sentiment].color}>{label}</Text>
    </Box>
  );
};

// ─── Horizontal stacked bar data & chart ─────────────────────────────────────

const AR_AGING_DATA = [{ name: 'AR Aging', current: 77, d30: 11, d60: 8, d90: 2, d90plus: 2 }];
const AP_AGING_DATA = [{ name: 'AP Aging', current: 64, d30: 17, d60: 11, d90: 5, d90plus: 3 }];

const AR_AGING_COLORS = ['#16A34A', '#FDE68A', '#FDBA74', '#F87171', '#DC2626'];
const AP_AGING_COLORS = ['#2563EB', '#93C5FD', '#FDE68A', '#F87171', '#DC2626'];

const AGING_KEYS = ['current', 'd30', 'd60', 'd90', 'd90plus'] as const;
const AGING_LABELS = ['Current', '1–30 days', '31–60 days', '61–90 days', '90+ days'];

const AR_AMOUNTS: Record<typeof AGING_KEYS[number], string> = {
  current: '₹14.3L', d30: '₹2.1L', d60: '₹1.5L', d90: '₹0.4L', d90plus: '₹0.2L',
};
const AP_AMOUNTS: Record<typeof AGING_KEYS[number], string> = {
  current: '₹6.0L', d30: '₹1.6L', d60: '₹1.05L', d90: '₹0.52L', d90plus: '₹0.18L',
};

type AgingKey = typeof AGING_KEYS[number];

const AgingTooltip = ({
  active, payload, amounts,
}: { active?: boolean; payload?: any[]; amounts: Record<AgingKey, string> }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box style={{
      backgroundColor: 'white', border: '1px solid #E5E7EB',
      borderRadius: 8, padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      {payload.map((p: any, i: number) => (
        <Group key={i} gap={8} mb={2}>
          <Box style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.fill, flexShrink: 0 }} />
          <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">{AGING_LABELS[i]}</Text>
          <Text ff="Albert Sans" fw={600} size="11px" c="var(--color-text-primary)" className="num">
            {amounts[AGING_KEYS[i]]} ({p.value}%)
          </Text>
        </Group>
      ))}
    </Box>
  );
};

interface AgingChartProps {
  data: typeof AR_AGING_DATA;
  colors: string[];
  amounts: Record<AgingKey, string>;
}

const AgingHorizontalBar = ({ data, colors, amounts }: AgingChartProps) => (
  <Box>
    <ResponsiveContainer width="100%" height={52}>
      <RechartsBarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={32}>
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis type="category" dataKey="name" hide />
        <RechartTooltip content={<AgingTooltip amounts={amounts} />} cursor={false} />
        {AGING_KEYS.map((key, i) => (
          <Bar key={key} dataKey={key} stackId="aging" fill={colors[i]} radius={i === 0 ? [4, 0, 0, 4] : i === AGING_KEYS.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}>
            <LabelList
              dataKey={key}
              position="inside"
              formatter={(v: any) => (typeof v === 'number' && v >= 8) ? `${v}%` : ''}
              style={{ fontSize: 10, fontFamily: 'Space Grotesk', fill: 'white', fontWeight: 600 }}
            />
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
    {/* Legend */}
    <Group gap={12} mt={8} wrap="wrap">
      {AGING_KEYS.map((key, i) => (
        <Group key={key} gap={4} align="center">
          <Box style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: colors[i], flexShrink: 0 }} />
          <Text ff="Space Grotesk" size="10px" c="var(--color-text-muted)">{AGING_LABELS[i]}</Text>
          <Text ff="Albert Sans" fw={600} size="10px" c="var(--color-text-primary)" className="num">{amounts[key]}</Text>
        </Group>
      ))}
    </Group>
  </Box>
);

// ─── Tab ──────────────────────────────────────────────────────────────────────

export const PayablesTab = () => {
  const { isCurrentPeriod, openPanel } = useDashboard();

  return (
    <Box p="24px">
      <KPIGrid>

        {/* ── Row 1: AR group (6col) | divider | AP group (6col) ── */}

        <WidgetCard id="w-ar-ap-row" title="" colSpan={12} disablePanel style={{ padding: 0, border: 'none', boxShadow: 'none', background: 'transparent' }}>
          <Box style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'stretch' }}>

            {/* AR group */}
            <Box>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-ghost)" mb={12}
                style={{ textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                RECEIVABLES
              </Text>
              <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* AR Outstanding */}
                <Box
                  style={{
                    backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-card)', padding: '20px 24px',
                    boxShadow: 'var(--shadow-card)', cursor: 'pointer',
                  }}
                  onClick={() => openPanel('w14-ar-out')}
                >
                  <Text ff="Space Grotesk" size="12px" fw={500} c="var(--color-text-muted)" mb={8}>AR Outstanding</Text>
                  <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num" mb={6}>₹18.5L</Text>
                  <OverdueBadge amount={420000} count="8 invoices" />
                  {isCurrentPeriod && (
                    <Box mt={6}>
                      <DailyPulseBadge label="↓ ₹2.1L collected" sentiment="positive" />
                    </Box>
                  )}
                  <Box mt={6}><TrendBadge value={3.2} label="vs last month" type="ar_overdue" /></Box>
                </Box>

                {/* DSO */}
                <Box
                  style={{
                    backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-card)', padding: '20px 24px',
                    boxShadow: 'var(--shadow-card)', cursor: 'pointer',
                  }}
                  onClick={() => openPanel('w15-dso')}
                >
                  <Text ff="Space Grotesk" size="12px" fw={500} c="var(--color-text-muted)" mb={8}>Days Sales Outstanding</Text>
                  <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num" mb={6}>45 days</Text>
                  <StatusPill label="+12% vs last month" sentiment="negative" />
                  <Box mt={6}><TrendBadge value={12} label="vs last month" type="dso" /></Box>
                  <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mt={6}>Target: 30 days</Text>
                </Box>

              </Box>
            </Box>

            {/* Vertical divider */}
            <Box style={{ width: 1, backgroundColor: 'var(--color-border)', alignSelf: 'stretch' }} />

            {/* AP group */}
            <Box>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-ghost)" mb={12}
                style={{ textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                PAYABLES
              </Text>
              <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* AP Outstanding */}
                <Box
                  style={{
                    backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-card)', padding: '20px 24px',
                    boxShadow: 'var(--shadow-card)', cursor: 'pointer',
                  }}
                  onClick={() => openPanel('w18-ap-out')}
                >
                  <Text ff="Space Grotesk" size="12px" fw={500} c="var(--color-text-muted)" mb={8}>AP Outstanding</Text>
                  <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num" mb={6}>₹9.45L</Text>
                  <OverdueBadge amount={345000} count="12 bills" />
                  <Box mt={6}><TrendBadge value={8.1} label="vs last month" type="ap_overdue" /></Box>
                </Box>

                {/* DPO */}
                <Box
                  style={{
                    backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-card)', padding: '20px 24px',
                    boxShadow: 'var(--shadow-card)', cursor: 'pointer',
                  }}
                  onClick={() => openPanel('w19-dpo')}
                >
                  <Text ff="Space Grotesk" size="12px" fw={500} c="var(--color-text-muted)" mb={8}>Days Payable Outstanding</Text>
                  <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num" mb={6}>38 days</Text>
                  <StatusPill label="Within target" sentiment="positive" />
                  {isCurrentPeriod && (
                    <Box mt={6}>
                      <DailyPulseBadge label="↓ ₹50K paid" sentiment="neutral" />
                    </Box>
                  )}
                  <Box mt={6}><TrendBadge value={-5} label="vs last month" /></Box>
                </Box>

              </Box>
            </Box>
          </Box>
        </WidgetCard>

        {/* ── Row 2: AR Aging (6col) | AP Aging (6col) ── */}

        <WidgetCard id="w16-ar-aging" title="AR Aging" colSpan={6}>
          <Box mb={8}>
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">
              Total ₹18.5L · 8 overdue invoices
            </Text>
          </Box>
          <AgingHorizontalBar data={AR_AGING_DATA} colors={AR_AGING_COLORS} amounts={AR_AMOUNTS} />
        </WidgetCard>

        <WidgetCard id="w20-ap-aging" title="AP Aging" colSpan={6}>
          <Box mb={8}>
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">
              Total ₹9.45L · 12 overdue bills
            </Text>
          </Box>
          <AgingHorizontalBar data={AP_AGING_DATA} colors={AP_AGING_COLORS} amounts={AP_AMOUNTS} />
        </WidgetCard>

        {/* ── Row 3: Upcoming Payments (4col) | Vendor Spend Concentration (8col) ── */}

        <WidgetCard id="w22-upcoming-ap" title="Upcoming Payments" colSpan={4}
          titleExtra={
            <Box style={{ backgroundColor: 'var(--color-live-badge)', color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              LIVE
            </Box>
          }
        >
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Box>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-critical)" mb={2} style={{ letterSpacing: '0.8px' }}>OVERDUE</Text>
              <Text ff="Albert Sans" fw={700} size="24px" c="var(--color-critical)" className="num">₹3.45L</Text>
              <Text ff="Space Grotesk" size="11px" c="var(--color-critical)" style={{ opacity: 0.7 }}>12 bills</Text>
            </Box>
            <Box style={{ height: 1, backgroundColor: 'var(--color-border)', opacity: 0.5 }} />
            <Box>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-muted)" mb={2} style={{ letterSpacing: '0.8px' }}>DUE 0–7 DAYS</Text>
              <Text ff="Albert Sans" fw={700} size="24px" c="var(--color-text-primary)" className="num">₹1.8L</Text>
              <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">5 bills</Text>
            </Box>
            <Box style={{ height: 1, backgroundColor: 'var(--color-border)', opacity: 0.5 }} />
            <Box>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-muted)" mb={2} style={{ letterSpacing: '0.8px' }}>DUE 8–15 DAYS</Text>
              <Text ff="Albert Sans" fw={700} size="24px" c="var(--color-text-primary)" className="num">₹4.2L</Text>
              <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">8 bills</Text>
            </Box>
          </Box>
        </WidgetCard>

        <WidgetCard id="w21-vendor-spend" title="Vendor Spend Concentration" colSpan={8}>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { name: 'Vendor X',   amount: 400000, percent: 42 },
              { name: 'Supplier Y', amount: 250000, percent: 26 },
              { name: 'Agency Z',   amount: 150000, percent: 16 },
            ].map((c, i) => (
              <Box
                key={c.name}
                style={{ display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' }}
                onClick={() => openPanel('w21-vendor-spend')}
              >
                <Group justify="space-between">
                  <Text ff="Space Grotesk" fw={500} size="13px" c="var(--color-text-secondary)">{c.name}</Text>
                  <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(c.amount)}</Text>
                </Group>
                <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" mb={4}>{c.percent}% of total spend</Text>
                <Box style={{ height: 6, backgroundColor: 'var(--color-bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                  <Box style={{ height: '100%', width: `${c.percent}%`, backgroundColor: 'var(--color-accent-blue)', borderRadius: 3, opacity: 1 - i * 0.2 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </WidgetCard>

      </KPIGrid>
    </Box>
  );
};
