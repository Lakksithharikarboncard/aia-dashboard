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

const OverdueBadge = ({ amount, count }: { amount: number; count: string }) => (
  <Box style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 8px', borderRadius: 4,
    backgroundColor: 'var(--color-critical-bg)', border: '1px solid #FECACA',
  }}>
    <Text ff="Space Grotesk" size="11px" c="var(--color-critical)" fw={500}>
      <Text component="span" fw={700} className="num">{formatCurrency(amount)}</Text> overdue · {count}
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
    <Box style={{ display: 'inline-flex', padding: '2px 7px', borderRadius: 4, border: s[sentiment].border }}>
      <Text ff="Space Grotesk" fw={500} size="11px" c={s[sentiment].color}>{label}</Text>
    </Box>
  );
};

const TargetPill = ({ label }: { label: string }) => (
  <Box style={{
    display: 'inline-flex', padding: '2px 7px', borderRadius: 4,
    backgroundColor: 'var(--color-bg-hover)', border: '1px solid var(--color-border)',
  }}>
    <Text ff="Space Grotesk" size="11px" fw={500} c="var(--color-text-muted)">{label}</Text>
  </Box>
);

const WithinTargetPill = () => (
  <Box style={{
    display: 'inline-flex', padding: '2px 7px', borderRadius: 4,
    backgroundColor: 'var(--color-positive-bg)', border: '1px solid #BBF7D0',
  }}>
    <Text ff="Space Grotesk" size="11px" fw={600} c="var(--color-positive)">Within target</Text>
  </Box>
);

// ─── KPI sub-card ─────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  onClick: () => void;
  children: React.ReactNode;
}

const KpiCard = ({ label, value, onClick, children }: KpiCardProps) => (
  <Box
    style={{
      backgroundColor: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-card)',
      padding: '18px 20px',
      boxShadow: 'var(--shadow-card)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}
    onClick={onClick}
  >
    <Text ff="Space Grotesk" size="11px" fw={500} c="var(--color-text-muted)">{label}</Text>
    <Text ff="Albert Sans" fw={700} size="30px" c="var(--color-text-primary)" className="num"
      style={{ lineHeight: 1, letterSpacing: '-0.5px' }}>
      {value}
    </Text>
    {children}
  </Box>
);

// ─── Horizontal stacked aging bar ─────────────────────────────────────────────

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
      borderRadius: 8, padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      {payload.map((p: any, i: number) => (
        <Group key={i} gap={8} mb={i < payload.length - 1 ? 4 : 0}>
          <Box style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.fill, flexShrink: 0 }} />
          <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)" style={{ minWidth: 70 }}>{AGING_LABELS[i]}</Text>
          <Text ff="Albert Sans" fw={600} size="11px" c="var(--color-text-primary)" className="num">
            {amounts[AGING_KEYS[i]]}
          </Text>
          <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)">({p.value}%)</Text>
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
    <ResponsiveContainer width="100%" height={44}>
      <RechartsBarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={44}>
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis type="category" dataKey="name" hide />
        <RechartTooltip content={<AgingTooltip amounts={amounts} />} cursor={false} />
        {AGING_KEYS.map((key, i) => (
          <Bar key={key} dataKey={key} stackId="aging" fill={colors[i]}
            radius={i === 0 ? [6, 0, 0, 6] : i === AGING_KEYS.length - 1 ? [0, 6, 6, 0] : [0, 0, 0, 0]}>
            <LabelList
              dataKey={key}
              position="inside"
              formatter={(v: any) => (typeof v === 'number' && v >= 8) ? `${v}%` : ''}
              style={{ fontSize: 10, fontFamily: 'Space Grotesk', fill: 'white', fontWeight: 700 }}
            />
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>

    {/* Legend — 2 rows × 3 + 2 items */}
    <Box mt={12} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px 0' }}>
      {AGING_KEYS.map((key, i) => (
        <Group key={key} gap={5} align="center" wrap="nowrap">
          <Box style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: colors[i], flexShrink: 0 }} />
          <Box>
            <Text ff="Space Grotesk" size="10px" c="var(--color-text-ghost)" style={{ lineHeight: 1.2 }}>{AGING_LABELS[i]}</Text>
            <Text ff="Albert Sans" fw={700} size="11px" c="var(--color-text-primary)" className="num" style={{ lineHeight: 1.2 }}>{amounts[key]}</Text>
          </Box>
        </Group>
      ))}
    </Box>
  </Box>
);

// ─── Vendor spend row ─────────────────────────────────────────────────────────

const VENDORS = [
  { rank: '01', name: 'Vendor X',   amount: 400000, percent: 42 },
  { rank: '02', name: 'Supplier Y', amount: 250000, percent: 26 },
  { rank: '03', name: 'Agency Z',   amount: 150000, percent: 16 },
  { rank: '04', name: 'Others',     amount: 150000, percent: 16 },
];

// ─── Tab ──────────────────────────────────────────────────────────────────────

export const PayablesTab = () => {
  const { isCurrentPeriod, openPanel } = useDashboard();

  return (
    <Box p="24px">
      <KPIGrid>

        {/* ── Row 1: AR group (6col) | divider | AP group (6col) ── */}

        <WidgetCard id="w-ar-ap-row" title="" colSpan={12} disablePanel
          style={{ padding: 0, border: 'none', boxShadow: 'none', background: 'transparent' }}>
          <Box style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'start' }}>

            {/* AR group */}
            <Box>
              <Text ff="Space Grotesk" size="10px" fw={700} c="var(--color-text-ghost)" mb={10}
                style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                Receivables
              </Text>
              <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                <KpiCard label="AR Outstanding" value="₹18.5L" onClick={() => openPanel('w14-ar-out')}>
                  <OverdueBadge amount={420000} count="8 invoices" />
                  {isCurrentPeriod && <DailyPulseBadge label="↓ ₹2.1L collected" sentiment="positive" />}
                  <TrendBadge value={3.2} label="vs last month" type="ar_overdue" />
                </KpiCard>

                <KpiCard label="Days Sales Outstanding" value="45 days" onClick={() => openPanel('w15-dso')}>
                  <TargetPill label="Target: 30 days" />
                  <TrendBadge value={12} label="vs last month" type="dso" />
                </KpiCard>

              </Box>
            </Box>

            {/* Vertical divider */}
            <Box style={{ width: 1, backgroundColor: 'var(--color-border)', alignSelf: 'stretch', marginTop: 28 }} />

            {/* AP group */}
            <Box>
              <Text ff="Space Grotesk" size="10px" fw={700} c="var(--color-text-ghost)" mb={10}
                style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                Payables
              </Text>
              <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                <KpiCard label="AP Outstanding" value="₹9.45L" onClick={() => openPanel('w18-ap-out')}>
                  <OverdueBadge amount={345000} count="12 bills" />
                  {isCurrentPeriod && <DailyPulseBadge label="↓ ₹50K paid" sentiment="neutral" />}
                  <TrendBadge value={8.1} label="vs last month" type="ap_overdue" />
                </KpiCard>

                <KpiCard label="Days Payable Outstanding" value="38 days" onClick={() => openPanel('w19-dpo')}>
                  <WithinTargetPill />
                  <TrendBadge value={-5} label="vs last month" />
                </KpiCard>

              </Box>
            </Box>
          </Box>
        </WidgetCard>

        {/* ── Row 2: AR Aging (6col) | AP Aging (6col) ── */}

        <WidgetCard id="w16-ar-aging" title="AR Aging" colSpan={6}>
          <Group justify="space-between" align="center" mb={12}>
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">
              Total ₹18.5L across 5 buckets
            </Text>
            <Box style={{
              display: 'inline-flex', padding: '2px 7px', borderRadius: 4,
              backgroundColor: 'var(--color-critical-bg)', border: '1px solid #FECACA',
            }}>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-critical)">23% overdue</Text>
            </Box>
          </Group>
          <AgingHorizontalBar data={AR_AGING_DATA} colors={AR_AGING_COLORS} amounts={AR_AMOUNTS} />
        </WidgetCard>

        <WidgetCard id="w20-ap-aging" title="AP Aging" colSpan={6}>
          <Group justify="space-between" align="center" mb={12}>
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">
              Total ₹9.45L across 5 buckets
            </Text>
            <Box style={{
              display: 'inline-flex', padding: '2px 7px', borderRadius: 4,
              backgroundColor: 'var(--color-critical-bg)', border: '1px solid #FECACA',
            }}>
              <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-critical)">36% overdue</Text>
            </Box>
          </Group>
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
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 180 }}>
            {[
              { bucket: 'OVERDUE',      amount: '₹3.45L', count: '12 bills', color: 'var(--color-critical)', dimColor: 'var(--color-critical-bg)' },
              { bucket: 'DUE 0–7 DAYS', amount: '₹1.8L',  count: '5 bills',  color: 'var(--color-text-primary)', dimColor: 'transparent' },
              { bucket: 'DUE 8–15 DAYS',amount: '₹4.2L',  count: '8 bills',  color: 'var(--color-text-primary)', dimColor: 'transparent' },
            ].map((row, i) => (
              <Box key={row.bucket} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                borderTop: i > 0 ? '1px solid var(--color-border)' : 'none',
                paddingTop: i > 0 ? 12 : 0, paddingBottom: i < 2 ? 12 : 0,
              }}>
                <Text ff="Space Grotesk" size="10px" fw={600} c={i === 0 ? 'var(--color-critical)' : 'var(--color-text-ghost)'}
                  mb={3} style={{ letterSpacing: '0.8px' }}>
                  {row.bucket}
                </Text>
                <Text ff="Albert Sans" fw={700} size="26px" c={row.color} className="num" style={{ lineHeight: 1, letterSpacing: '-0.5px' }}>
                  {row.amount}
                </Text>
                <Text ff="Space Grotesk" size="11px" c={i === 0 ? 'var(--color-critical)' : 'var(--color-text-muted)'}
                  mt={2} style={{ opacity: i === 0 ? 0.7 : 1 }}>
                  {row.count}
                </Text>
              </Box>
            ))}
          </Box>
        </WidgetCard>

        <WidgetCard id="w21-vendor-spend" title="Vendor Spend Concentration" colSpan={8}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Header row */}
            <Group justify="space-between" mb={10}>
              <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">Top vendors by AP spend this period</Text>
              <Text ff="Albert Sans" fw={700} size="11px" c="var(--color-text-primary)" className="num">Total ₹9.5L</Text>
            </Group>

            {VENDORS.map((v, i) => (
              <Box
                key={v.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr auto',
                  gap: 12,
                  alignItems: 'center',
                  paddingTop: i === 0 ? 0 : 12,
                  paddingBottom: i < VENDORS.length - 1 ? 12 : 0,
                  borderTop: i > 0 ? '1px solid var(--color-border)' : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => openPanel('w21-vendor-spend')}
              >
                {/* Rank */}
                <Text ff="Space Grotesk" size="11px" fw={600} c="var(--color-text-ghost)"
                  style={{ letterSpacing: '0.5px' }}>
                  {v.rank}
                </Text>

                {/* Name + bar */}
                <Box>
                  <Group justify="space-between" mb={5}>
                    <Text ff="Space Grotesk" fw={500} size="13px" c="var(--color-text-primary)">{v.name}</Text>
                    <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)">{v.percent}%</Text>
                  </Group>
                  <Box style={{ height: 5, backgroundColor: 'var(--color-bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                    <Box style={{
                      height: '100%',
                      width: `${v.percent}%`,
                      background: i === 0
                        ? 'linear-gradient(90deg, #2563EB, #60A5FA)'
                        : i === 1
                        ? 'linear-gradient(90deg, #7C3AED, #A78BFA)'
                        : i === 2
                        ? 'linear-gradient(90deg, #0D9488, #5EEAD4)'
                        : '#E5E7EB',
                      borderRadius: 3,
                    }} />
                  </Box>
                </Box>

                {/* Amount */}
                <Text ff="Albert Sans" fw={700} size="15px" c="var(--color-text-primary)" className="num"
                  style={{ letterSpacing: '-0.3px', textAlign: 'right', minWidth: 56 }}>
                  {formatCurrency(v.amount)}
                </Text>
              </Box>
            ))}
          </Box>
        </WidgetCard>

      </KPIGrid>
    </Box>
  );
};
