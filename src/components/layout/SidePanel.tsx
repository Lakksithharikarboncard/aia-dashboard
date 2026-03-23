import { useEffect, useState } from 'react';
import { Box, Group, Text, UnstyledButton, ScrollArea } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';

// ─── Display names map ───────────────────────────────────────────────────────

const WIDGET_DISPLAY_NAMES: Record<string, string> = {
  'w1-cash':           'Cash Balance',
  'w2-pnl-compressed': 'P&L Summary',
  'w3-rev-spark':      'Revenue Trend',
  'w4-dso':            'Days Sales Outstanding',
  'w5-dpo':            'Days Payable Outstanding',
  'w6-upcoming':       'Upcoming Payments',
  'w7-gross-profit':   'Gross Profit',
  'w7-pnl-full':       'P&L Statement',
  'w8-rev-full':       'Revenue Trend',
  'w9-top-customers':  'Top Customers',
  'w10-cash-full':     'Cash Balance',
  'w10-rev-vs-exp':    'Revenue vs Expense',
  'w11-exp-breakdown': 'Expense Breakdown',
  'w12-cash-flow':     'Cash Inflow vs Outflow',
  'w13-upcoming-cash': 'Upcoming Payments',
  'w14-ar-out':        'AR Outstanding',
  'w15-dso':           'Days Sales Outstanding',
  'w15-dso-full':      'Days Sales Outstanding',
  'w16-ar-aging':      'AR Aging',
  'w17-top-ar':        'Top Customers — Overdue AR',
  'w18-ap-out':        'AP Outstanding',
  'w19-dpo':           'Days Payable Outstanding',
  'w19-dpo-full':      'Days Payable Outstanding',
  'w20-ap-aging':      'AP Aging',
  'w21-vendor-spend':  'Vendor Spend Concentration',
  'w22-upcoming-ap':   'Upcoming Payments',
};

// ─── Shared UI Components ────────────────────────────────────────────────────

const SectionLabel = ({ label }: { label: string }) => (
  <Text
    ff="Space Grotesk"
    size="10px"
    fw={600}
    c="var(--color-text-ghost)"
    style={{ textTransform: 'uppercase', letterSpacing: '0.8px' }}
    mb={10}
  >
    {label}
  </Text>
);

const PanelSection = ({ children, last }: { children: React.ReactNode; last?: boolean }) => (
  <Box style={{
    padding: '18px 0',
    borderBottom: last ? 'none' : '1px solid var(--color-border)',
    paddingBottom: last ? 24 : 18,
  }}>
    {children}
  </Box>
);

const Hairline = () => (
  <Box style={{ height: 1, backgroundColor: 'var(--color-border)', margin: '8px 0' }} />
);

const StatusBadge = ({ label, variant }: { label: string; variant: 'overdue' | 'due' | 'positive' | 'warning' }) => {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    overdue:  { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
    due:      { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' },
    positive: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    warning:  { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  };
  const s = styles[variant];
  return (
    <Box style={{ display: 'inline-flex', padding: '2px 6px', borderRadius: 4, backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
      <Text ff="Space Grotesk" size="11px" fw={500} c={s.text}>{label}</Text>
    </Box>
  );
};

const TH = ({ label, align = 'left' }: { label: string; align?: 'left' | 'right' }) => (
  <th style={{ textAlign: align, paddingBottom: 8, fontWeight: 'normal' }}>
    <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-ghost)" style={{ textTransform: 'uppercase', letterSpacing: '0.8px' }}>
      {label}
    </Text>
  </th>
);

const TD = ({ children, align = 'left', bold }: { children: React.ReactNode; align?: 'left' | 'right'; bold?: boolean }) => (
  <td style={{ padding: '9px 0', textAlign: align, verticalAlign: 'middle' }}>
    {bold
      ? <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{children}</Text>
      : <Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{children}</Text>
    }
  </td>
);

const TR = ({ children }: { children: React.ReactNode }) => (
  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{children}</tr>
);

// ─── Collapsible P&L sub-item ────────────────────────────────────────────────

const PLSubRow = ({ label, amount }: { label: string; amount: number }) => (
  <Group justify="space-between" style={{ paddingLeft: 16, paddingTop: 4 }}>
    <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">└─ {label}</Text>
    <Text ff="Albert Sans" size="12px" c="var(--color-text-muted)" className="num">{formatCurrency(amount)}</Text>
  </Group>
);

// ─── Panel content per widget ────────────────────────────────────────────────

const PanelReport = ({ widgetId }: { widgetId: string }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('Acme Corp');
  const [selectedVendor, setSelectedVendor] = useState('Vendor X');

  // DSO / DPO shared
  const isDSO = ['w4-dso', 'w15-dso', 'w15-dso-full'].includes(widgetId);
  const isDPO = ['w5-dpo', 'w19-dpo', 'w19-dpo-full'].includes(widgetId);
  const isUpcoming = ['w6-upcoming', 'w13-upcoming-cash', 'w22-upcoming-ap'].includes(widgetId);
  const isCash = ['w1-cash', 'w10-cash-full'].includes(widgetId);

  if (widgetId === 'w7-gross-profit') {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="THIS PERIOD" />
          <Group justify="space-between" mb={6}>
            <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">Gross Profit</Text>
            <Text ff="Albert Sans" fw={700} size="13px" c="var(--color-text-primary)" className="num">₹18.5L</Text>
          </Group>
          <Group justify="space-between" mb={6}>
            <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">Gross Margin</Text>
            <Box style={{ backgroundColor: '#EFF6FF', padding: '1px 6px', borderRadius: 4 }}>
              <Text ff="Space Grotesk" fw={600} size="12px" c="#2563EB">41%</Text>
            </Box>
          </Group>
          <Group justify="space-between" mb={6}>
            <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">Revenue</Text>
            <Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">₹45L</Text>
          </Group>
          <Group justify="space-between" mb={6}>
            <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">COGS</Text>
            <Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">₹26.5L</Text>
          </Group>
          <Group justify="space-between">
            <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">Delta</Text>
            <Text ff="Space Grotesk" size="12px" fw={600} c="var(--color-positive)">↑ ₹1.3L vs last month</Text>
          </Group>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="COMPARISON" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="METRIC" />
                <TH label="THIS MONTH" align="right" />
                <TH label="LAST MONTH" align="right" />
                <TH label="CHANGE" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Revenue',      thisMonth: '₹45L',   lastMonth: '₹42L',  change: '↑ 7.1%',  up: true  },
                { metric: 'COGS',         thisMonth: '₹26.5L', lastMonth: '₹24.8L',change: '↑ 6.9%',  up: false },
                { metric: 'Gross Profit', thisMonth: '₹18.5L', lastMonth: '₹17.2L',change: '↑ 7.6%',  up: true  },
                { metric: 'Gross Margin', thisMonth: '41%',    lastMonth: '40.9%', change: '↑ 0.1pp', up: true  },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.metric}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">{row.thisMonth}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" size="13px" c="var(--color-text-muted)" className="num">{row.lastMonth}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" fw={500} c={row.up ? 'var(--color-positive)' : 'var(--color-critical)'}>{row.change}</Text>
                  </td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
      </Box>
    );
  }

  if (isCash) {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="ACCOUNT BALANCES" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="ACCOUNT" />
                <TH label="TYPE" />
                <TH label="BALANCE" align="right" />
                <TH label="CHANGE" align="right" />
              </tr>
            </thead>
            <tbody>
              <TR>
                <TD>HDFC Current A/c</TD>
                <TD><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">Current</Text></TD>
                <TD align="right" bold>₹8.2L</TD>
                <td style={{ padding: '9px 0', textAlign: 'right' }}>
                  <Text ff="Space Grotesk" size="12px" c="var(--color-positive)">↑ ₹45,000</Text>
                </td>
              </TR>
              <tr>
                <TD>SBI Savings A/c</TD>
                <TD><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">Savings</Text></TD>
                <TD align="right" bold>₹4.25L</TD>
                <td style={{ padding: '9px 0', textAlign: 'right' }}>
                  <Text ff="Space Grotesk" size="12px" c="var(--color-critical)">↓ ₹12,000</Text>
                </td>
              </tr>
            </tbody>
          </table>
          <Hairline />
          <Group justify="space-between">
            <Text ff="Space Grotesk" fw={700} size="14px" c="var(--color-text-primary)">Total Balance</Text>
            <Group gap={8}>
              <Text ff="Albert Sans" fw={700} size="15px" c="var(--color-text-primary)" className="num">{formatCurrency(1245000)}</Text>
              <Text ff="Space Grotesk" size="12px" c="var(--color-positive)" fw={600}>↑ 8.5%</Text>
            </Group>
          </Group>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="RECENT MOVEMENTS" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="DATE" />
                <TH label="DESCRIPTION" />
                <TH label="AMOUNT" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { date: '14 Nov', desc: 'NEFT from Acme Corp',    amt: 250000, credit: true  },
                { date: '13 Nov', desc: 'Vendor X Payment',       amt: 140000, credit: false },
                { date: '12 Nov', desc: 'NEFT from Globex',       amt: 85000,  credit: true  },
                { date: '11 Nov', desc: 'Salary disbursement',    amt: 420000, credit: false },
                { date: '10 Nov', desc: 'NEFT from Soylent',      amt: 120000, credit: true  },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}>
                    <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.date}</Text>
                  </td>
                  <td style={{ padding: '9px 0' }}>
                    <Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.desc}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Albert Sans" fw={600} size="13px" className="num"
                      c={row.credit ? 'var(--color-positive)' : 'var(--color-critical)'}>
                      {row.credit ? '+' : '−'}{formatCurrency(row.amt)}
                    </Text>
                  </td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
      </Box>
    );
  }

  if (widgetId === 'w2-pnl-compressed') {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="THIS PERIOD" />
          <Group justify="space-between" mb={6}>
            <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">Revenue</Text>
            <Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">₹45L</Text>
          </Group>
          <Group justify="space-between" mb={4}>
            <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">COGS</Text>
            <Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">₹26.5L</Text>
          </Group>
          <Hairline />
          <Group justify="space-between" mb={6}>
            <Group gap={6}>
              <Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">Gross Profit</Text>
              <Box style={{ backgroundColor: '#EFF6FF', padding: '1px 6px', borderRadius: 4 }}>
                <Text ff="Space Grotesk" fw={500} size="11px" c="#2563EB">41%</Text>
              </Box>
            </Group>
            <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">₹18.5L</Text>
          </Group>
          <Group justify="space-between" mb={4}>
            <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">Operating Expense</Text>
            <Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">₹6.5L</Text>
          </Group>
          <Hairline />
          <Group justify="space-between">
            <Text ff="Space Grotesk" fw={700} size="14px" c="var(--color-text-primary)">Operating Profit</Text>
            <Text ff="Albert Sans" fw={700} size="14px" c="var(--color-text-primary)" className="num">₹12L</Text>
          </Group>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="VS LAST MONTH" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="" />
                <TH label="THIS MONTH" align="right" />
                <TH label="LAST MONTH" align="right" />
                <TH label="CHANGE" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Revenue',          thisMonth: '₹45L',   lastMonth: '₹42L',   change: '+7.1%',  up: true },
                { label: 'Gross Profit',     thisMonth: '₹18.5L', lastMonth: '₹17.2L', change: '+7.6%',  up: true },
                { label: 'Operating Expense',thisMonth: '₹6.5L',  lastMonth: '₹6.3L',  change: '+3.2%',  up: false },
                { label: 'Operating Profit', thisMonth: '₹12L',   lastMonth: '₹10.9L', change: '+10.1%', up: true },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}>
                    <Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.label}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">{row.thisMonth}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Albert Sans" size="13px" c="var(--color-text-muted)" className="num">{row.lastMonth}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" fw={500} c={row.up ? 'var(--color-positive)' : 'var(--color-critical)'}>
                      {row.up ? '↑' : '↓'} {row.change.replace(/^[+\-]/, '')}
                    </Text>
                  </td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
      </Box>
    );
  }

  if (widgetId === 'w3-rev-spark' || widgetId === 'w8-rev-full') {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="CURRENT PERIOD" />
          <Group gap={8} align="baseline">
            <Text ff="Albert Sans" fw={700} size="24px" c="var(--color-text-primary)" className="num">₹45L</Text>
            <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">this month</Text>
          </Group>
          <Box mt={6}>
            <Box style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 10, backgroundColor: '#F0FDF4' }}>
              <Text ff="Space Grotesk" size="12px" fw={600} c="var(--color-positive)">↑ 7.1% vs last month</Text>
            </Box>
          </Box>
        </PanelSection>
        <PanelSection>
          <SectionLabel label="MONTHLY BREAKDOWN" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="MONTH" />
                <TH label="REVENUE" align="right" />
                <TH label="MOM CHANGE" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { month: 'Jan 2024', rev: '₹30L',   change: '—',      up: null },
                { month: 'Feb 2024', rev: '₹31.5L', change: '5.0%',   up: true },
                { month: 'Mar 2024', rev: '₹32L',   change: '1.6%',   up: true },
                { month: 'Apr 2024', rev: '₹34L',   change: '6.3%',   up: true },
                { month: 'May 2024', rev: '₹38L',   change: '11.8%',  up: true },
                { month: 'Jun 2024', rev: '₹45L',   change: '18.4%',  up: true },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}>
                    <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">{row.month}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{row.rev}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px"
                      c={row.up === null ? 'var(--color-text-ghost)' : row.up ? 'var(--color-positive)' : 'var(--color-critical)'}>
                      {row.up !== null ? (row.up ? '↑ ' : '↓ ') : ''}{row.change}
                    </Text>
                  </td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="TOP CUSTOMERS THIS MONTH" />
          {[
            { name: 'Acme Corp',    amt: '₹12L',  share: '26.7%' },
            { name: 'Globex Inc',   amt: '₹8.5L', share: '18.9%' },
            { name: 'Soylent Corp', amt: '₹4.2L', share: '9.3%'  },
          ].map((c, i) => (
            <Group key={i} justify="space-between" py={6} style={{ borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
              <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">{c.name}</Text>
              <Group gap={8}>
                <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{c.amt}</Text>
                <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{c.share}</Text>
              </Group>
            </Group>
          ))}
        </PanelSection>
      </Box>
    );
  }

  if (isDSO) {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="METRIC" />
          <Group gap={8} align="baseline" mb={8}>
            <Text ff="Albert Sans" fw={700} size="28px" c="var(--color-text-primary)" className="num">45 days</Text>
          </Group>
          <Box mb={6}>
            <Box style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 10, backgroundColor: '#FEF2F2' }}>
              <Text ff="Space Grotesk" size="12px" fw={500} c="var(--color-critical)">↑ 12% vs last month</Text>
            </Box>
          </Box>
          <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mb={8}>Target: 40 days</Text>
          <StatusBadge label="15 days above target" variant="overdue" />
        </PanelSection>
        <PanelSection>
          <SectionLabel label="CUSTOMER CONTRIBUTION" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="CUSTOMER" />
                <TH label="CONTRIB" align="right" />
                <TH label="AVG DAYS" align="right" />
                <TH label="OUTSTANDING" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Acme Corp',    contrib: '14d', pct: '31%', avg: '67d', amt: 210000 },
                { name: 'Soylent Corp', contrib: '8d',  pct: '18%', avg: '43d', amt: 120000 },
                { name: 'Globex Inc',   contrib: '6d',  pct: '13%', avg: '38d', amt: 90000  },
                { name: 'Others',       contrib: '17d', pct: '38%', avg: '—',   amt: 430000 },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}>
                    <Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.name}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.contrib} · {row.pct}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.avg}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(row.amt)}</Text>
                  </td>
                </TR>
              ))}
              <tr style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '9px 0' }}>
                  <Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">Total</Text>
                </td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}>
                  <Text ff="Space Grotesk" fw={600} size="12px" c="var(--color-text-primary)">45d · 100%</Text>
                </td>
                <td />
                <td style={{ padding: '9px 0', textAlign: 'right' }}>
                  <Text ff="Albert Sans" fw={700} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(860000)}</Text>
                </td>
              </tr>
            </tbody>
          </table>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="TREND — LAST 3 MONTHS" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="MONTH" /><TH label="DSO" align="right" /><TH label="CHANGE" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { month: 'Apr', dso: '38 days', change: '—',    up: null },
                { month: 'May', dso: '41 days', change: '7.9%', up: true },
                { month: 'Jun', dso: '45 days', change: '9.8%', up: true },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">{row.month}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">{row.dso}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" c={row.up === null ? 'var(--color-text-ghost)' : 'var(--color-critical)'}>{row.up ? '↑ ' : ''}{row.change}</Text>
                  </td>
                </TR>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="11px" c="var(--color-warning)" mt={10} style={{ fontStyle: 'italic' }}>
            DSO has risen 3 consecutive months.
          </Text>
        </PanelSection>
      </Box>
    );
  }

  if (isDPO) {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="METRIC" />
          <Group gap={8} align="baseline" mb={8}>
            <Text ff="Albert Sans" fw={700} size="28px" c="var(--color-text-primary)" className="num">38 days</Text>
          </Group>
          <Box mb={6}>
            <Box style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 10, backgroundColor: '#F9FAFB' }}>
              <Text ff="Space Grotesk" size="12px" fw={500} c="var(--color-text-muted)">↓ 5% vs last month</Text>
            </Box>
          </Box>
          <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mb={8}>Target range: 30–45 days</Text>
          <StatusBadge label="Within target range" variant="positive" />
        </PanelSection>
        <PanelSection>
          <SectionLabel label="VENDOR CONTRIBUTION" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="VENDOR" />
                <TH label="CONTRIB" align="right" />
                <TH label="AVG DAYS" align="right" />
                <TH label="OUTSTANDING" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Vendor X',   contrib: '12d', pct: '32%', avg: '45d', amt: 210000 },
                { name: 'Supplier Y', contrib: '8d',  pct: '21%', avg: '38d', amt: 140000 },
                { name: 'Agency Z',   contrib: '5d',  pct: '13%', avg: '32d', amt: 80000  },
                { name: 'Others',     contrib: '13d', pct: '34%', avg: '—',   amt: 295000 },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.name}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.contrib} · {row.pct}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.avg}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(row.amt)}</Text>
                  </td>
                </TR>
              ))}
              <tr style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">Total</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" fw={600} size="12px" c="var(--color-text-primary)">38d · 100%</Text></td>
                <td />
                <td style={{ padding: '9px 0', textAlign: 'right' }}>
                  <Text ff="Albert Sans" fw={700} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(725000)}</Text>
                </td>
              </tr>
            </tbody>
          </table>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="TREND — LAST 3 MONTHS" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="MONTH" /><TH label="DPO" align="right" /><TH label="CHANGE" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { month: 'Apr', dpo: '42 days', change: '—',    down: null },
                { month: 'May', dpo: '40 days', change: '4.8%', down: true },
                { month: 'Jun', dpo: '38 days', change: '5.0%', down: true },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">{row.month}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">{row.dpo}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" c={row.down === null ? 'var(--color-text-ghost)' : 'var(--color-text-muted)'}>{row.down ? '↓ ' : ''}{row.change}</Text>
                  </td>
                </TR>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="11px" c="var(--color-warning)" mt={10} style={{ fontStyle: 'italic' }}>
            DPO is declining but remains within target floor (30 days).
          </Text>
        </PanelSection>
      </Box>
    );
  }

  if (isUpcoming) {
    return (
      <Box>
        <PanelSection>
          <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-critical)" mb={6} style={{ letterSpacing: '0.8px', textTransform: 'uppercase' }}>OVERDUE</Text>
          <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mb={10}>{formatCurrency(345000)} · 12 bills</Text>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="VENDOR / BILL NO" /><TH label="AMOUNT" align="right" /><TH label="OVERDUE" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { vendor: 'Vendor X',   bill: '#1042', amt: 140000, age: '14d overdue' },
                { vendor: 'Supplier Y', bill: '#892',  amt: 90000,  age: '11d overdue' },
                { vendor: 'Agency Z',   bill: '#331',  amt: 72000,  age: '9d overdue'  },
                { vendor: 'Petty Cash', bill: '#112',  amt: 43000,  age: '6d overdue'  },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.vendor} · {row.bill}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-critical)">{row.age}</Text></td>
                </TR>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="11px" c="var(--color-critical)" mt={8} fw={500}>+ 8 more bills — {formatCurrency(200000)} total</Text>
        </PanelSection>
        <PanelSection>
          <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-muted)" mb={6} style={{ letterSpacing: '0.8px', textTransform: 'uppercase' }}>DUE IN 0–7 DAYS</Text>
          <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mb={10}>{formatCurrency(180000)} · 5 bills</Text>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="VENDOR / BILL NO" /><TH label="AMOUNT" align="right" /><TH label="DUE DATE" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { vendor: 'Vendor A', bill: '#205', amt: 60000, due: 'Due 2 Nov' },
                { vendor: 'Vendor B', bill: '#301', amt: 75000, due: 'Due 4 Nov' },
                { vendor: 'Vendor C', bill: '#144', amt: 45000, due: 'Due 6 Nov' },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.vendor} · {row.bill}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-ghost)">{row.due}</Text></td>
                </TR>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" mt={8}>+ 2 more bills</Text>
        </PanelSection>
        <PanelSection last>
          <Text ff="Space Grotesk" size="10px" fw={600} c="var(--color-text-muted)" mb={6} style={{ letterSpacing: '0.8px', textTransform: 'uppercase' }}>DUE IN 8–15 DAYS</Text>
          <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mb={10}>{formatCurrency(420000)} · 8 bills</Text>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="VENDOR / BILL NO" /><TH label="AMOUNT" align="right" /><TH label="DUE DATE" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { vendor: 'Vendor D', bill: '#408', amt: 120000, due: 'Due 9 Nov'  },
                { vendor: 'Vendor E', bill: '#519', amt: 90000,  due: 'Due 12 Nov' },
                { vendor: 'Vendor F', bill: '#312', amt: 60000,  due: 'Due 15 Nov' },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.vendor} · {row.bill}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-ghost)">{row.due}</Text></td>
                </TR>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" mt={8}>+ 5 more bills</Text>
        </PanelSection>
      </Box>
    );
  }

  if (widgetId === 'w7-pnl-full') {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="INCOME STATEMENT" />
          <Group justify="space-between" mb={2}>
            <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">Revenue</Text>
            <Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">₹45L</Text>
          </Group>
          <PLSubRow label="Sales Accounts" amount={3850000} />
          <PLSubRow label="Direct Incomes" amount={650000} />
          <Box mt={8} mb={2}>
            <Group justify="space-between">
              <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">COGS</Text>
              <Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">₹26.5L</Text>
            </Group>
            <PLSubRow label="Purchase Accounts" amount={2200000} />
            <PLSubRow label="Direct Expenses" amount={450000} />
          </Box>
          <Hairline />
          <Group justify="space-between" mb={2}>
            <Group gap={6}>
              <Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">Gross Profit</Text>
              <Box style={{ backgroundColor: '#EFF6FF', padding: '1px 6px', borderRadius: 4 }}>
                <Text ff="Space Grotesk" size="11px" fw={500} c="#2563EB">41% margin</Text>
              </Box>
            </Group>
            <Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">₹18.5L</Text>
          </Group>
          <Hairline />
          <Group justify="space-between" mt={2} mb={2}>
            <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">Operating Expense</Text>
            <Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">₹6.5L</Text>
          </Group>
          <PLSubRow label="Indirect Expenses" amount={650000} />
          <Hairline />
          <Group justify="space-between" mt={4}>
            <Text ff="Space Grotesk" fw={700} size="14px" c="var(--color-text-primary)">Operating Profit</Text>
            <Text ff="Albert Sans" fw={700} size="14px" c="var(--color-text-primary)" className="num">₹12L</Text>
          </Group>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="VS LAST MONTH" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="" />
                <TH label="THIS MONTH" align="right" />
                <TH label="LAST MONTH" align="right" />
                <TH label="CHANGE" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Revenue',           thisMonth: '₹45L',   lastMonth: '₹42L',   change: '7.1%',  up: true },
                { label: 'Gross Profit',      thisMonth: '₹18.5L', lastMonth: '₹17.2L', change: '7.6%',  up: true },
                { label: 'Operating Expense', thisMonth: '₹6.5L',  lastMonth: '₹6.3L',  change: '3.2%',  up: false },
                { label: 'Operating Profit',  thisMonth: '₹12L',   lastMonth: '₹10.9L', change: '10.1%', up: true },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.label}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" size="13px" c="var(--color-text-primary)" className="num">{row.thisMonth}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" size="13px" c="var(--color-text-muted)" className="num">{row.lastMonth}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" fw={500} c={row.up ? 'var(--color-positive)' : 'var(--color-critical)'}>
                      {row.up ? '↑' : '↓'} {row.change}
                    </Text>
                  </td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
      </Box>
    );
  }

  if (widgetId === 'w9-top-customers') {
    const invoicesByCustomer: Record<string, { inv: string; amt: number; due: string; status: string; statusVariant: 'overdue' | 'due' }[]> = {
      'Acme Corp': [
        { inv: 'INV-2241', amt: 210000, due: '15 Oct 2024', status: 'Overdue 30d', statusVariant: 'overdue' },
        { inv: 'INV-2318', amt: 320000, due: '12 Nov 2024', status: 'Due in 12d',  statusVariant: 'due'     },
        { inv: 'INV-2401', amt: 670000, due: '30 Nov 2024', status: 'Due in 30d',  statusVariant: 'due'     },
      ],
      'Globex Inc': [
        { inv: 'INV-2187', amt: 90000,  due: '28 Oct 2024', status: 'Overdue 17d', statusVariant: 'overdue' },
        { inv: 'INV-2302', amt: 760000, due: '20 Nov 2024', status: 'Due in 20d',  statusVariant: 'due'     },
      ],
      'Soylent Corp': [
        { inv: 'INV-2198', amt: 120000, due: '22 Oct 2024', status: 'Overdue 23d', statusVariant: 'overdue' },
        { inv: 'INV-2389', amt: 300000, due: '4 Dec 2024',  status: 'Due in 34d',  statusVariant: 'due'     },
      ],
    };

    const invoices = invoicesByCustomer[selectedCustomer] || [];

    return (
      <Box>
        <PanelSection>
          <SectionLabel label="RANKINGS — BY REVENUE" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="#" />
                <TH label="CUSTOMER" />
                <TH label="REVENUE" align="right" />
                <TH label="SHARE" align="right" />
                <TH label="VS LM" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: 'Acme Corp',    rev: '₹12L',   share: '26.7%', change: '8.2%',  up: true  },
                { rank: 2, name: 'Globex Inc',   rev: '₹8.5L',  share: '18.9%', change: '3.1%',  up: true  },
                { rank: 3, name: 'Soylent Corp', rev: '₹4.2L',  share: '9.3%',  change: '2.4%',  up: false },
                { rank: 4, name: 'Initech',      rev: '₹1.8L',  share: '4.0%',  change: '0.9%',  up: true  },
                { rank: 5, name: 'Others',       rev: '₹18.5L', share: '41.1%', change: '—',     up: null  },
              ].map((row) => (
                <tr
                  key={row.rank}
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                    cursor: row.name !== 'Others' ? 'pointer' : 'default',
                    backgroundColor: selectedCustomer === row.name ? 'var(--color-bg-hover)' : 'transparent',
                  }}
                  onClick={() => row.name !== 'Others' && setSelectedCustomer(row.name)}
                >
                  <td style={{ padding: '9px 4px 9px 0' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-ghost)">{row.rank}</Text></td>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)" fw={selectedCustomer === row.name ? 600 : 400}>{row.name}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{row.rev}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.share}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" c={row.up === null ? 'var(--color-text-ghost)' : row.up ? 'var(--color-positive)' : 'var(--color-critical)'}>
                      {row.up !== null ? (row.up ? '↑ ' : '↓ ') : ''}{row.change}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label={`OPEN INVOICES — ${selectedCustomer.toUpperCase()}`} />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="INVOICE" /><TH label="AMOUNT" align="right" /><TH label="DUE DATE" align="right" /><TH label="STATUS" align="right" /></tr>
            </thead>
            <tbody>
              {invoices.map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.inv}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.due}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><StatusBadge label={row.status} variant={row.statusVariant} /></td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
      </Box>
    );
  }

  if (widgetId === 'w14-ar-out') {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="SUMMARY" />
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <Box>
              <SectionLabel label="TOTAL AR" />
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-text-primary)" className="num">{formatCurrency(1850000)}</Text>
            </Box>
            <Box>
              <SectionLabel label="OVERDUE" />
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-critical)" className="num">{formatCurrency(420000)}</Text>
              <Text ff="Space Grotesk" size="11px" c="var(--color-critical)">8 invoices</Text>
            </Box>
            <Box>
              <SectionLabel label="AVG AGE" />
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-text-primary)" className="num">42 days</Text>
            </Box>
          </Box>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="OPEN INVOICES" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="CUSTOMER" />
                <TH label="INVOICE" />
                <TH label="AMOUNT" align="right" />
                <TH label="DUE DATE" align="right" />
                <TH label="STATUS" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Acme Corp',    inv: 'INV-2241', amt: 210000, due: '15 Oct 2024', status: 'Overdue 30d', v: 'overdue' as const },
                { name: 'Soylent Corp', inv: 'INV-2198', amt: 120000, due: '22 Oct 2024', status: 'Overdue 23d', v: 'overdue' as const },
                { name: 'Globex Inc',   inv: 'INV-2187', amt: 90000,  due: '28 Oct 2024', status: 'Overdue 17d', v: 'overdue' as const },
                { name: 'Initech',      inv: 'INV-2301', amt: 180000, due: '5 Nov 2024',  status: 'Due in 5d',   v: 'due' as const     },
                { name: 'Umbrella Co',  inv: 'INV-2318', amt: 320000, due: '12 Nov 2024', status: 'Due in 12d',  v: 'due' as const     },
                { name: 'Acme Corp',    inv: 'INV-2402', amt: 670000, due: '30 Nov 2024', status: 'Due in 30d',  v: 'due' as const     },
                { name: 'Soylent Corp', inv: 'INV-2389', amt: 210000, due: '4 Dec 2024',  status: 'Due in 34d',  v: 'due' as const     },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.name}</Text>
                  </td>
                  <td style={{ padding: '9px 0' }}>
                    <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.inv}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.due}</Text>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <StatusBadge label={row.status} variant={row.v} />
                  </td>
                </TR>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" mt={12} style={{ fontStyle: 'italic' }}>
            Advance payments received (not yet invoiced): ₹0
          </Text>
        </PanelSection>
      </Box>
    );
  }

  if (widgetId === 'w16-ar-aging') {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="BUCKET SUMMARY" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="BUCKET" /><TH label="INVOICES" align="right" /><TH label="AMOUNT" align="right" /><TH label="% TOTAL AR" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { bucket: 'Current',    inv: 22, amt: 1430000, pct: '77.3%' },
                { bucket: '1–30 days',  inv: 3,  amt: 210000,  pct: '11.4%' },
                { bucket: '31–60 days', inv: 2,  amt: 120000,  pct: '6.5%'  },
                { bucket: '61–90 days', inv: 1,  amt: 65000,   pct: '3.5%'  },
                { bucket: '90+ days',   inv: 1,  amt: 25000,   pct: '1.4%'  },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.bucket}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-muted)">{row.inv}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.pct}</Text></td>
                </TR>
              ))}
              <tr style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">Total</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">29</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={700} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(1850000)}</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" fw={600} size="12px" c="var(--color-text-primary)">100%</Text></td>
              </tr>
            </tbody>
          </table>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="ALL OVERDUE INVOICES" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="CUSTOMER" /><TH label="INVOICE" /><TH label="AMOUNT" align="right" /><TH label="DAYS OVERDUE" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { name: 'Acme Corp',    inv: 'INV-2241', amt: 210000, days: '30d'  },
                { name: 'Soylent Corp', inv: 'INV-2198', amt: 120000, days: '23d'  },
                { name: 'Globex Inc',   inv: 'INV-2187', amt: 90000,  days: '17d'  },
                { name: 'Acme Corp',    inv: 'INV-2089', amt: 65000,  days: '68d'  },
                { name: 'Soylent Corp', inv: 'INV-1998', amt: 25000,  days: '94d'  },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.name}</Text></td>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.inv}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-critical)">{row.days}</Text></td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
      </Box>
    );
  }

  if (widgetId === 'w17-top-ar') {
    const arInvoices: Record<string, { inv: string; amt: number; due: string; days: string }[]> = {
      'Acme Corp': [
        { inv: 'INV-2241', amt: 210000, due: '15 Oct 2024', days: '30d overdue' },
        { inv: 'INV-2089', amt: 65000,  due: '17 Sep 2024', days: '68d overdue' },
      ],
      'Soylent Corp': [
        { inv: 'INV-2198', amt: 120000, due: '22 Oct 2024', days: '23d overdue' },
        { inv: 'INV-1998', amt: 25000,  due: '18 Sep 2024', days: '94d overdue' },
      ],
      'Globex Inc': [
        { inv: 'INV-2187', amt: 90000, due: '28 Oct 2024', days: '17d overdue' },
      ],
    };
    const invoices = arInvoices[selectedCustomer] || arInvoices['Acme Corp'];
    const displayCustomer = selectedCustomer in arInvoices ? selectedCustomer : 'Acme Corp';

    return (
      <Box>
        <PanelSection>
          <SectionLabel label="OVERDUE RANKINGS" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="#" /><TH label="CUSTOMER" /><TH label="OVERDUE AR" align="right" /><TH label="% TOTAL" align="right" /><TH label="OLDEST" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: 'Acme Corp',    amt: 210000, pct: '50.0%', oldest: '30d (INV-2241)' },
                { rank: 2, name: 'Soylent Corp', amt: 120000, pct: '28.6%', oldest: '23d (INV-2198)' },
                { rank: 3, name: 'Globex Inc',   amt: 90000,  pct: '21.4%', oldest: '17d (INV-2187)' },
              ].map((row) => (
                <tr
                  key={row.rank}
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer', backgroundColor: displayCustomer === row.name ? 'var(--color-bg-hover)' : 'transparent' }}
                  onClick={() => setSelectedCustomer(row.name)}
                >
                  <td style={{ padding: '9px 4px 9px 0' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-ghost)">{row.rank}</Text></td>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)" fw={displayCustomer === row.name ? 600 : 400}>{row.name}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-critical)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.pct}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)">{row.oldest}</Text></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mt={10}>
            Total overdue: {formatCurrency(420000)} across 8 invoices
          </Text>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label={`INVOICES — ${displayCustomer.toUpperCase()}`} />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="INVOICE" /><TH label="AMOUNT" align="right" /><TH label="DUE DATE" align="right" /><TH label="OVERDUE" align="right" /></tr>
            </thead>
            <tbody>
              {invoices.map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.inv}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.due}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-critical)">{row.days}</Text></td>
                </TR>
              ))}
            </tbody>
          </table>
          {displayCustomer === 'Acme Corp' && (
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-muted)" mt={12}>
              Last payment from Acme Corp: ₹5,00,000 on 3 Sep 2024
            </Text>
          )}
        </PanelSection>
      </Box>
    );
  }

  if (widgetId === 'w18-ap-out') {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="SUMMARY" />
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <Box>
              <SectionLabel label="TOTAL AP" />
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-text-primary)" className="num">{formatCurrency(945000)}</Text>
            </Box>
            <Box>
              <SectionLabel label="OVERDUE" />
              <Text ff="Albert Sans" fw={700} size="20px" c="var(--color-critical)" className="num">{formatCurrency(345000)}</Text>
              <Text ff="Space Grotesk" size="11px" c="var(--color-critical)">12 bills</Text>
            </Box>
            <Box>
              <SectionLabel label="LARGEST VENDOR" />
              <Text ff="Albert Sans" fw={700} size="16px" c="var(--color-text-primary)">Vendor X</Text>
              <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" className="num">₹4L</Text>
            </Box>
          </Box>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="OPEN BILLS" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="VENDOR" /><TH label="BILL NO" /><TH label="AMOUNT" align="right" /><TH label="DUE DATE" align="right" /><TH label="STATUS" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { vendor: 'Vendor X',   bill: 'BL-441', amt: 140000, due: '18 Oct 2024', status: 'Overdue 14d', v: 'overdue' as const },
                { vendor: 'Supplier Y', bill: 'BL-398', amt: 90000,  due: '21 Oct 2024', status: 'Overdue 11d', v: 'overdue' as const },
                { vendor: 'Agency Z',   bill: 'BL-412', amt: 72000,  due: '23 Oct 2024', status: 'Overdue 9d',  v: 'overdue' as const },
                { vendor: 'Petty Cash', bill: 'BL-112', amt: 43000,  due: '26 Oct 2024', status: 'Overdue 6d',  v: 'overdue' as const },
                { vendor: 'Vendor X',   bill: 'BL-519', amt: 260000, due: '8 Nov 2024',  status: 'Due in 8d',   v: 'due' as const     },
                { vendor: 'Supplier Y', bill: 'BL-521', amt: 90000,  due: '14 Nov 2024', status: 'Due in 14d',  v: 'due' as const     },
                { vendor: 'Agency Z',   bill: 'BL-498', amt: 78000,  due: '18 Nov 2024', status: 'Due in 18d',  v: 'due' as const     },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.vendor}</Text></td>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.bill}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.due}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><StatusBadge label={row.status} variant={row.v} /></td>
                </TR>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" mt={12} style={{ fontStyle: 'italic' }}>
            Vendor advances paid (not yet billed): ₹0
          </Text>
        </PanelSection>
      </Box>
    );
  }

  if (widgetId === 'w20-ap-aging') {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="BUCKET SUMMARY" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="BUCKET" /><TH label="BILLS" align="right" /><TH label="AMOUNT" align="right" /><TH label="% TOTAL AP" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { bucket: 'Current',    bills: 18, amt: 610000, pct: '64.6%' },
                { bucket: '1–30 days',  bills: 6,  amt: 160000, pct: '16.9%' },
                { bucket: '31–60 days', bills: 4,  amt: 105000, pct: '11.1%' },
                { bucket: '61–90 days', bills: 3,  amt: 52000,  pct: '5.5%'  },
                { bucket: '90+ days',   bills: 1,  amt: 18000,  pct: '1.9%'  },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.bucket}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-muted)">{row.bills}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.pct}</Text></td>
                </TR>
              ))}
              <tr style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">Total</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">32</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={700} size="13px" c="var(--color-text-primary)" className="num">{formatCurrency(945000)}</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" fw={600} size="12px" c="var(--color-text-primary)">100%</Text></td>
              </tr>
            </tbody>
          </table>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="ALL OVERDUE BILLS" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="VENDOR" /><TH label="BILL NO" /><TH label="AMOUNT" align="right" /><TH label="DUE DATE" align="right" /><TH label="DAYS OVERDUE" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { vendor: 'Vendor X',   bill: 'BL-441', amt: 140000, due: '18 Oct', days: '14d' },
                { vendor: 'Supplier Y', bill: 'BL-398', amt: 90000,  due: '21 Oct', days: '11d' },
                { vendor: 'Agency Z',   bill: 'BL-412', amt: 72000,  due: '23 Oct', days: '9d'  },
                { vendor: 'Petty Cash', bill: 'BL-112', amt: 43000,  due: '26 Oct', days: '6d'  },
                { vendor: 'Vendor X',   bill: 'BL-302', amt: 52000,  due: '14 Sep', days: '47d' },
                { vendor: 'Supplier Y', bill: 'BL-287', amt: 35000,  due: '20 Sep', days: '41d' },
                { vendor: 'Vendor X',   bill: 'BL-198', amt: 18000,  due: '15 Aug', days: '77d' },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.vendor}</Text></td>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.bill}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.due}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-critical)">{row.days}</Text></td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
      </Box>
    );
  }

  if (widgetId === 'w21-vendor-spend') {
    const vendorBills: Record<string, { bill: string; amt: number; date: string; status: string; v: 'overdue' | 'due' }[]> = {
      'Vendor X': [
        { bill: 'BL-441', amt: 140000, date: '18 Oct 2024', status: 'Overdue 14d', v: 'overdue' },
        { bill: 'BL-519', amt: 260000, date: '8 Nov 2024',  status: 'Due in 8d',   v: 'due'     },
      ],
      'Supplier Y': [
        { bill: 'BL-398', amt: 90000,  date: '21 Oct 2024', status: 'Overdue 11d', v: 'overdue' },
        { bill: 'BL-521', amt: 90000,  date: '14 Nov 2024', status: 'Due in 14d',  v: 'due'     },
      ],
      'Agency Z': [
        { bill: 'BL-412', amt: 72000, date: '23 Oct 2024', status: 'Overdue 9d', v: 'overdue' },
        { bill: 'BL-498', amt: 78000, date: '18 Nov 2024', status: 'Due in 18d', v: 'due'     },
      ],
    };
    const bills = vendorBills[selectedVendor] || vendorBills['Vendor X'];
    const isHighConcentration = selectedVendor === 'Vendor X';

    return (
      <Box>
        <PanelSection>
          <SectionLabel label="TOP VENDORS" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="#" /><TH label="VENDOR" /><TH label="BILLED" align="right" /><TH label="SHARE" align="right" /><TH label="VS LM" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: 'Vendor X',   amt: 400000, share: '42.3%', change: '5.2%', up: true  },
                { rank: 2, name: 'Supplier Y', amt: 250000, share: '26.5%', change: '1.8%', up: false },
                { rank: 3, name: 'Agency Z',   amt: 150000, share: '15.9%', change: '0.4%', up: true  },
                { rank: 4, name: 'Others',     amt: 145000, share: '15.3%', change: '—',    up: null  },
              ].map((row) => (
                <tr
                  key={row.rank}
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: row.name !== 'Others' ? 'pointer' : 'default', backgroundColor: selectedVendor === row.name ? 'var(--color-bg-hover)' : 'transparent' }}
                  onClick={() => row.name !== 'Others' && setSelectedVendor(row.name)}
                >
                  <td style={{ padding: '9px 4px 9px 0' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-ghost)">{row.rank}</Text></td>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)" fw={selectedVendor === row.name ? 600 : 400}>{row.name}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.share}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" c={row.up === null ? 'var(--color-text-ghost)' : row.up ? 'var(--color-positive)' : 'var(--color-critical)'}>
                      {row.up !== null ? (row.up ? '↑ ' : '↓ ') : ''}{row.change}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="11px" c={isHighConcentration ? 'var(--color-warning)' : 'var(--color-text-muted)'} mt={10}>
            Vendor X accounts for 42.3% of total billed spend this month.
          </Text>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label={`BILLS — ${selectedVendor.toUpperCase()}`} />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="BILL NO" /><TH label="AMOUNT" align="right" /><TH label="DATE" align="right" /><TH label="STATUS" align="right" /></tr>
            </thead>
            <tbody>
              {bills.map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.bill}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{formatCurrency(row.amt)}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.date}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><StatusBadge label={row.status} variant={row.v} /></td>
                </TR>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" mt={10}>
            Total billed this month: {formatCurrency(vendorBills[selectedVendor]?.reduce((a, r) => a + r.amt, 0) ?? 0)} across {bills.length} bills
          </Text>
        </PanelSection>
      </Box>
    );
  }

  // ── Revenue vs Expense panel ──────────────────────────────────────────────
  if (widgetId === 'w10-rev-vs-exp') {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="SUMMARY" />
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Revenue',     value: '₹45L',  delta: '↑ 7.1%',  up: true  },
              { label: 'Expense',     value: '₹33L',  delta: '↑ 3.8%',  up: false },
              { label: 'Net Surplus', value: '₹12L',  delta: '↑ 26.7%', up: true  },
            ].map((k) => (
              <Box key={k.label}>
                <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" mb={4}>{k.label}</Text>
                <Text ff="Albert Sans" fw={700} size="22px" c={k.label === 'Net Surplus' ? 'var(--color-positive)' : 'var(--color-text-primary)'} className="num">{k.value}</Text>
                <Text ff="Space Grotesk" size="12px" fw={600} c={k.up ? 'var(--color-positive)' : 'var(--color-critical)'} mt={2}>{k.delta}</Text>
              </Box>
            ))}
          </Box>
        </PanelSection>
        <PanelSection>
          <SectionLabel label="MONTHLY BREAKDOWN" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="MONTH" />
                <TH label="REVENUE" align="right" />
                <TH label="EXPENSE" align="right" />
                <TH label="NET SURPLUS" align="right" />
                <TH label="MARGIN" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { month: 'Jan 2024', rev: '₹30L',   exp: '₹25L',   net: '₹5L',   margin: '16.7%' },
                { month: 'Feb 2024', rev: '₹31.5L', exp: '₹26L',   net: '₹5.5L', margin: '17.5%' },
                { month: 'Mar 2024', rev: '₹32L',   exp: '₹26.5L', net: '₹5.5L', margin: '17.2%' },
                { month: 'Apr 2024', rev: '₹34L',   exp: '₹27L',   net: '₹7L',   margin: '20.6%' },
                { month: 'May 2024', rev: '₹38L',   exp: '₹28L',   net: '₹10L',  margin: '26.3%' },
                { month: 'Jun 2024', rev: '₹45L',   exp: '₹33L',   net: '₹12L',  margin: '26.7%' },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">{row.month}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{row.rev}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" c="var(--color-text-primary)" className="num">{row.exp}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" c="var(--color-positive)" className="num">{row.net}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.margin}</Text></td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="EXPENSE BY CATEGORY" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="CATEGORY" /><TH label="AMOUNT" align="right" /><TH label="% OF EXPENSE" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { cat: 'COGS',      amt: '₹26.5L',  pct: '80%' },
                { cat: 'Salaries',  amt: '₹3.2L',   pct: '10%' },
                { cat: 'Rent',      amt: '₹1.2L',   pct: '4%'  },
                { cat: 'Marketing', amt: '₹95,000',  pct: '3%'  },
                { cat: 'Other',     amt: '₹1.15L',  pct: '3%'  },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.cat}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{row.amt}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.pct}</Text></td>
                </TR>
              ))}
              <tr style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">Total</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={700} size="13px" className="num" c="var(--color-text-primary)">₹33L</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" fw={600} size="12px" c="var(--color-text-primary)">100%</Text></td>
              </tr>
            </tbody>
          </table>
        </PanelSection>
      </Box>
    );
  }

  // ── Expense Breakdown panel ────────────────────────────────────────────────
  if (widgetId === 'w11-exp-breakdown') {
    const [selectedCat, setSelectedCat] = useState('COGS');
    const catDetail: Record<string, { label: string; amt: string; pct: string }[]> = {
      'COGS': [
        { label: 'Purchase Accounts', amt: '₹22L',   pct: '83%' },
        { label: 'Direct Expenses',   amt: '₹4.5L',  pct: '17%' },
      ],
      'Salaries': [],
      'Rent': [],
      'Marketing': [],
      'Other': [],
    };
    const detail = catDetail[selectedCat] ?? [];

    return (
      <Box>
        <PanelSection>
          <SectionLabel label="BY CATEGORY" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TH label="CATEGORY" />
                <TH label="AMOUNT" align="right" />
                <TH label="% OF TOTAL" align="right" />
                <TH label="VS LAST MONTH" align="right" />
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'COGS',      amt: '₹26.5L',  pct: '80%', change: '↑ 6.9%', up: true   },
                { cat: 'Salaries',  amt: '₹3.2L',   pct: '10%', change: '↑ 1.3%', up: false  },
                { cat: 'Rent',      amt: '₹1.2L',   pct: '4%',  change: '→ 0%',   up: null   },
                { cat: 'Marketing', amt: '₹95,000',  pct: '3%',  change: '↑ 2.1%', up: false  },
                { cat: 'Other',     amt: '₹1.15L',  pct: '3%',  change: '↓ 0.9%', up: null   },
              ].map((row, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer', backgroundColor: selectedCat === row.cat ? 'var(--color-bg-hover)' : 'transparent' }}
                  onClick={() => setSelectedCat(row.cat)}
                >
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)" fw={selectedCat === row.cat ? 600 : 400}>{row.cat}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{row.amt}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.pct}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>
                    <Text ff="Space Grotesk" size="12px" c={row.up === true ? 'var(--color-critical)' : row.up === false ? 'var(--color-positive)' : 'var(--color-text-muted)'}>{row.change}</Text>
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">Total</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={700} size="13px" className="num" c="var(--color-text-primary)">₹33L</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" fw={600} size="12px" c="var(--color-text-primary)">100%</Text></td>
                <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" fw={500} c="var(--color-critical)">↑ 3.8%</Text></td>
              </tr>
            </tbody>
          </table>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label={`${selectedCat.toUpperCase()} DETAIL`} />
          {detail.length > 0 ? (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr><TH label="LEDGER" /><TH label="AMOUNT" align="right" /><TH label={`% OF ${selectedCat.toUpperCase()}`} align="right" /></tr>
                </thead>
                <tbody>
                  {detail.map((row, i) => (
                    <TR key={i}>
                      <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.label}</Text></td>
                      <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{row.amt}</Text></td>
                      <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.pct}</Text></td>
                    </TR>
                  ))}
                </tbody>
              </table>
              {selectedCat === 'COGS' && (
                <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" mt={10} style={{ fontStyle: 'italic' }}>
                  Direct Expenses classified under COGS only. They do not appear in Operating Expense.
                </Text>
              )}
            </>
          ) : (
            <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" style={{ fontStyle: 'italic' }}>
              No sub-ledger detail available for this category.
            </Text>
          )}
        </PanelSection>
      </Box>
    );
  }

  // ── Cash Inflow vs Outflow panel ───────────────────────────────────────────
  if (widgetId === 'w12-cash-flow') {
    return (
      <Box>
        <PanelSection>
          <SectionLabel label="SUMMARY" />
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Cash In',  value: '₹48.2L', color: 'var(--color-text-primary)' },
              { label: 'Cash Out', value: '₹35.8L', color: 'var(--color-text-primary)' },
              { label: 'Net Flow', value: '+₹12.4L', color: 'var(--color-positive)' },
            ].map((k) => (
              <Box key={k.label}>
                <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" mb={4}>{k.label}</Text>
                <Text ff="Albert Sans" fw={700} size="22px" c={k.color} className="num">{k.value}</Text>
              </Box>
            ))}
          </Box>
        </PanelSection>
        <PanelSection>
          <SectionLabel label="WEEKLY BREAKDOWN" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="WEEK" /><TH label="CASH IN" align="right" /><TH label="CASH OUT" align="right" /><TH label="NET" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { week: 'W1 (1–7 Nov)',    inflow: '₹10.2L', outflow: '₹8.8L',  net: '+₹1.4L',  positive: true  },
                { week: 'W2 (8–14 Nov)',   inflow: '₹9.8L',  outflow: '₹10.1L', net: '−₹0.3L',  positive: false },
                { week: 'W3 (15–21 Nov)',  inflow: '₹16.5L', outflow: '₹9.4L',  net: '+₹7.1L',  positive: true  },
                { week: 'W4 (22–30 Nov)',  inflow: '₹11.7L', outflow: '₹7.5L',  net: '+₹4.2L',  positive: true  },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">{row.week}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{row.inflow}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{row.outflow}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c={row.positive ? 'var(--color-positive)' : 'var(--color-critical)'}>{row.net}</Text></td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
        <PanelSection>
          <SectionLabel label="INFLOW SOURCES" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="SOURCE" /><TH label="AMOUNT" align="right" /><TH label="% OF INFLOW" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { source: 'Customer payments', amt: '₹42.5L', pct: '88%' },
                { source: 'Advance receipts',  amt: '₹3.8L',  pct: '8%'  },
                { source: 'Other inflows',      amt: '₹1.9L',  pct: '4%'  },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.source}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{row.amt}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.pct}</Text></td>
                </TR>
              ))}
            </tbody>
          </table>
        </PanelSection>
        <PanelSection last>
          <SectionLabel label="OUTFLOW CATEGORIES" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><TH label="CATEGORY" /><TH label="AMOUNT" align="right" /><TH label="% OF OUTFLOW" align="right" /></tr>
            </thead>
            <tbody>
              {[
                { cat: 'Vendor payments', amt: '₹18.5L', pct: '52%' },
                { cat: 'Salaries',        amt: '₹8.2L',  pct: '23%' },
                { cat: 'Rent',            amt: '₹3.5L',  pct: '10%' },
                { cat: 'Tax payments',    amt: '₹2.8L',  pct: '8%'  },
                { cat: 'Other',           amt: '₹2.8L',  pct: '7%'  },
              ].map((row, i) => (
                <TR key={i}>
                  <td style={{ padding: '9px 0' }}><Text ff="Space Grotesk" size="13px" c="var(--color-text-primary)">{row.cat}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Albert Sans" fw={600} size="13px" className="num" c="var(--color-text-primary)">{row.amt}</Text></td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}><Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)">{row.pct}</Text></td>
                </TR>
              ))}
            </tbody>
          </table>
          <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)" mt={12} style={{ fontStyle: 'italic' }}>
            Internal transfers excluded from both inflow and outflow.
          </Text>
        </PanelSection>
      </Box>
    );
  }

  return (
    <Box py={40} style={{ textAlign: 'center' }}>
      <Text ff="Space Grotesk" size="sm" c="var(--color-text-ghost)">
        No additional detail available for this widget.
      </Text>
    </Box>
  );
};

// ─── Main Panel Component ────────────────────────────────────────────────────

export const SidePanel = () => {
  const { isPanelOpen, closePanel, activeWidgetId, dateRange } = useDashboard();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePanel(); };
    if (isPanelOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPanelOpen, closePanel]);

  const title = activeWidgetId
    ? (WIDGET_DISPLAY_NAMES[activeWidgetId] ?? activeWidgetId)
    : 'Report';

  return (
    <Box
      style={{
        position: 'fixed',
        top: 56,
        right: 0,
        height: 'calc(100vh - 56px)',
        width: 420,
        backgroundColor: 'var(--color-bg-card)',
        borderLeft: '1px solid var(--color-border)',
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        transform: isPanelOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.2s ease-out',
        boxShadow: 'var(--shadow-panel)',
      }}
    >
      {/* Header */}
      <Box style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'white' }}>
        <Group justify="space-between" align="flex-start">
          <Box style={{ flex: 1 }}>
            <Text ff="Albert Sans" fw={600} size="16px" c="var(--color-text-primary)" style={{ lineHeight: 1.3 }}>
              {title}
            </Text>
            <Text ff="Space Grotesk" size="12px" c="var(--color-text-ghost)" mt={2}>
              {dateRange ?? 'This Month'}
            </Text>
          </Box>
          <UnstyledButton onClick={closePanel} style={{ color: 'var(--color-text-ghost)', padding: 4 }}>
            <IconX size={20} />
          </UnstyledButton>
        </Group>
      </Box>

      {/* Body */}
      <ScrollArea style={{ flex: 1 }} offsetScrollbars>
        <Box style={{ padding: '0 24px 24px' }}>
          {activeWidgetId && <PanelReport widgetId={activeWidgetId} />}
        </Box>
      </ScrollArea>
    </Box>
  );
};
