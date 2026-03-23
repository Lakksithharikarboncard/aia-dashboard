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

const UpcomingSummaryItem = ({ label, amount, count, type }: { label: string; amount: number; count: string; type: 'overdue' | 'upcoming' }) => (
  <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Text ff="Space Grotesk" size="10px" fw={600} c={type === 'overdue' ? 'var(--color-critical)' : 'var(--color-text-muted)'} style={{ letterSpacing: '0.8px' }}>
      {label}
    </Text>
    <Text ff="Albert Sans" size="18px" fw={700} c={type === 'overdue' ? 'var(--color-critical)' : 'var(--color-text-primary)'} className="num">
      {formatCurrency(amount)}
    </Text>
    <Text ff="Space Grotesk" size="11px" c={type === 'overdue' ? 'var(--color-critical)' : 'var(--color-text-muted)'} opacity={type === 'overdue' ? 0.7 : 1}>
      {count}
    </Text>
  </Box>
);

export const PayablesTab = () => {
  return (
    <Box p="24px">
      <KPIGrid>
        {/* Row 1 — 4 KPI Cards */}
        <WidgetCard id="w14-ar-out" title="AR Outstanding" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num">{formatCurrency(1850000)}</Text>
            <OverdueBadge amount={420000} count="8 invoices" />
            <Box mt={4}><TrendBadge value={3.2} label="vs last month" type="ar_overdue" /></Box>
            <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mt={4}>Avg collection: 42 days</Text>
          </Box>
        </WidgetCard>

        <WidgetCard id="w15-dso-full" title="Days Sales Outstanding" colSpan={3}>
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

        <WidgetCard id="w19-dpo-full" title="Days Payable Outstanding" colSpan={3}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Text ff="Albert Sans" fw={700} size="32px" c="var(--color-text-primary)" className="num">38 days</Text>
            <StatusPill label="Within target range" sentiment="positive" />
            <Box mt={4}><TrendBadge value={-5} label="vs last month" /></Box>
            <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mt={4}>Vendor X {formatCurrency(210000)} outstanding</Text>
          </Box>
        </WidgetCard>

        {/* Row 2 — Aging charts */}
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

        {/* Row 3 — Equal height cards 4 | 4 | 4 */}
        <WidgetCard id="w17-top-ar" title="Top Customers — Overdue AR" colSpan={4} style={{ alignSelf: 'stretch', height: '100%' }}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
             {[
               { name: 'Acme Corp', amount: 210000, percent: 50 },
               { name: 'Soylent Corp', amount: 120000, percent: 28 },
               { name: 'Globex Inc', amount: 90000, percent: 21 },
             ].map((c) => (
               <Box key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                 <Group justify="space-between">
                   <Text ff="Space Grotesk" fw={500} size="13px" c="var(--color-text-secondary)">{c.name}</Text>
                   <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(c.amount)}</Text>
                 </Group>
                 <Box style={{ height: 6, backgroundColor: 'var(--color-bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                    <Box style={{ height: '100%', width: `${c.percent}%`, backgroundColor: 'var(--color-critical)', borderRadius: 3, opacity: 1 - ([0, 0.4, 0.6][([
                      'Acme Corp', 'Soylent Corp', 'Globex Inc'
                    ].indexOf(c.name))] || 0) }} />
                 </Box>
               </Box>
             ))}
          </Box>
        </WidgetCard>

        <WidgetCard id="w21-vendor-spend" title="Vendor Spend Concentration" colSpan={4} style={{ alignSelf: 'stretch', height: '100%' }}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
             {[
               { name: 'Vendor X', amount: 400000, percent: 42 },
               { name: 'Supplier Y', amount: 250000, percent: 26 },
               { name: 'Agency Z', amount: 150000, percent: 16 },
             ].map((c) => (
               <Box key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                 <Group justify="space-between">
                   <Text ff="Space Grotesk" fw={500} size="13px" c="var(--color-text-secondary)">{c.name}</Text>
                   <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(c.amount)}</Text>
                 </Group>
                 <Box style={{ height: 6, backgroundColor: 'var(--color-bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                    <Box style={{ height: '100%', width: `${c.percent}%`, backgroundColor: 'var(--color-accent-blue)', borderRadius: 3, opacity: 1 - ([0, 0.4, 0.6][([
                      'Vendor X', 'Supplier Y', 'Agency Z'
                    ].indexOf(c.name))] || 0) }} />
                 </Box>
               </Box>
             ))}
          </Box>
        </WidgetCard>

        <WidgetCard id="w22-upcoming-ap" title="Upcoming Payments (AP)" colSpan={4} titleExtra={<LiveBadge />} style={{ alignSelf: 'stretch', height: '100%' }}>
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <UpcomingSummaryItem label="OVERDUE" amount={345000} count="12 bills" type="overdue" />
            <Box style={{ height: 1, backgroundColor: 'var(--color-border)', margin: '4px 0', opacity: 0.5 }} />
            <UpcomingSummaryItem label="DUE 0–7 DAYS" amount={180000} count="5 bills" type="upcoming" />
            <Box style={{ height: 1, backgroundColor: 'var(--color-border)', margin: '4px 0', opacity: 0.5 }} />
            <UpcomingSummaryItem label="DUE 8–15 DAYS" amount={420000} count="8 bills" type="upcoming" />
          </Box>
        </WidgetCard>
      </KPIGrid>
      
    </Box>
  );
};
