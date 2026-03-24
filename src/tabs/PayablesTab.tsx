import { Box, Group, Text } from '@mantine/core';
import { WidgetCard } from '../components/widgets/WidgetCard';
import { TrendBadge } from '../components/shared/TrendBadge';
import { BarChart } from '@mantine/charts';
import { KPIGrid } from '../components/widgets/KPIGrid';
import { formatCurrency } from '../utils/formatters';

const StatusPill = ({ label, sentiment }: { label: string; sentiment: 'positive' | 'negative' }) => (
  <Box
    style={{
      display: 'inline-flex',
      padding: '2px 8px',
      borderRadius: '10px',
      backgroundColor: sentiment === 'positive' ? 'var(--color-positive-bg)' : 'var(--color-critical-bg)',
    }}
  >
    <Text
      ff="Space Grotesk"
      size="11px"
      fw={600}
      c={sentiment === 'positive' ? 'var(--color-positive)' : 'var(--color-critical)'}
    >
      {label}
    </Text>
  </Box>
);

const OverdueBadge = ({ amount, count }: { amount: number; count: string }) => (
  <Box
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '2px 8px',
      borderRadius: '4px',
      backgroundColor: 'var(--color-critical-bg)',
      border: '1px solid #FECACA',
    }}
  >
    <Text ff="Space Grotesk" size="12px" c="var(--color-critical)" fw={500}>
      <Text component="span" fw={600} className="num">{formatCurrency(amount)}</Text> overdue · {count}
    </Text>
  </Box>
);

export const PayablesTab = () => {
  return (
    <Box p="24px">
      <KPIGrid>
        {/* Row 1 — AR Outstanding | DSO | AP Outstanding | DPO */}
        <WidgetCard id="w14-ar-out" title="AR Outstanding" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num">{formatCurrency(1850000)}</Text>
            <OverdueBadge amount={420000} count="8 invoices" />
            <Box mt={4}><TrendBadge value={3.2} label="vs last month" type="ar_overdue" /></Box>
            <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mt={4}>Avg collection: 42 days</Text>
          </Box>
        </WidgetCard>

        <WidgetCard id="w15-dso" title="Days Sales Outstanding" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num">45 days</Text>
            <StatusPill label="15 days above target" sentiment="negative" />
            <Box mt={4}><TrendBadge value={12} label="vs last month" type="dso" /></Box>
            <Box style={{ height: 1, backgroundColor: 'var(--color-border)', margin: '8px 0' }} />
            <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">Acme Corp contributing 14 days</Text>
          </Box>
        </WidgetCard>

        <WidgetCard id="w18-ap-out" title="AP Outstanding" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num">{formatCurrency(945000)}</Text>
            <OverdueBadge amount={345000} count="12 bills" />
            <Box mt={4}><TrendBadge value={8.1} label="vs last month" type="ap_overdue" /></Box>
            <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mt={4}>Vendor X — largest at ₹4.00L</Text>
          </Box>
        </WidgetCard>

        <WidgetCard id="w19-dpo" title="Days Payable Outstanding" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num">38 days</Text>
            <StatusPill label="Within target range" sentiment="positive" />
            <Box mt={4}><TrendBadge value={-5} label="vs last month" /></Box>
            <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mt={4}>Vendor X {formatCurrency(210000)} outstanding</Text>
          </Box>
        </WidgetCard>

        {/* Row 2 — AR Aging (6col) | AP Aging (6col) */}
        <WidgetCard id="w16-ar-aging" title="AR Aging" colSpan={6}>
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
            series={[{ name: 'amount', color: 'var(--color-accent-blue)', label: 'AR' }]}
            gridAxis="x"
            tickLine="none"
            valueFormatter={(val) => formatCurrency(val)}
            styles={{ axis: { fontFamily: 'Space Grotesk', fontSize: 11, fill: 'var(--color-text-ghost)' } }}
          />
        </WidgetCard>

        <WidgetCard id="w20-ap-aging" title="AP Aging" colSpan={6}>
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
            series={[{ name: 'amount', color: '#6366F1', label: 'AP' }]}
            gridAxis="x"
            tickLine="none"
            valueFormatter={(val) => formatCurrency(val)}
            styles={{ axis: { fontFamily: 'Space Grotesk', fontSize: 11, fill: 'var(--color-text-ghost)' } }}
          />
        </WidgetCard>

        {/* Row 3 — Vendor Spend Concentration (12col) */}
        <WidgetCard id="w21-vendor-spend" title="Vendor Spend Concentration" colSpan={12}>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { name: 'Vendor X',   amount: 400000, percent: 42 },
              { name: 'Supplier Y', amount: 250000, percent: 26 },
              { name: 'Agency Z',   amount: 150000, percent: 16 },
            ].map((c, i) => (
              <Box key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
