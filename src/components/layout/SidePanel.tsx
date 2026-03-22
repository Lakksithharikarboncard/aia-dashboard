import { useEffect } from 'react';
import { Box, Group, Text, UnstyledButton, ScrollArea, Button } from '@mantine/core';
import { IconX, IconExternalLink } from '@tabler/icons-react';
import { useDashboard } from '../../context/DashboardContext';

// ─── Widget metadata ──────────────────────────────────────────────────────────

const WIDGET_TITLES: Record<string, string> = {
  'w1-cash': 'Cash Balance',
  'w2-pnl-compressed': 'P&L Summary',
  'w3-rev-spark': 'Revenue Trend',
  'w4-dso': 'Days Sales Outstanding',
  'w5-dpo': 'Days Payable Outstanding',
  'w6-upcoming': 'Upcoming Payments',
  'w7-pnl-full': 'P&L Statement',
  'w8-rev-full': 'Revenue Trend',
  'w9-top-customers': 'Top Customers by Revenue',
  'w10-cash-full': 'Cash Balance',
  'w11-cash-runway': 'Cash Runway',
  'w12-cash-flow': 'Cash Inflow vs Outflow',
  'w13-upcoming-cash': 'Upcoming Payments',
  'w14-ar-out': 'AR Outstanding',
  'w15-dso-full': 'Days Sales Outstanding',
  'w16-ar-aging': 'AR Aging',
  'w17-top-ar': 'Top Customers — Overdue AR',
  'w18-ap-out': 'AP Outstanding',
  'w19-dpo-full': 'Days Payable Outstanding',
  'w20-ap-aging': 'AP Aging',
  'w21-vendor-spend': 'Vendor Spend Concentration',
  'w22-upcoming-ap': 'Upcoming Payments (AP)',
};

// Zone A widgets — Overview only, no Detail View available
const ZONE_A_WIDGETS = new Set([
  'w1-cash', 'w2-pnl-compressed', 'w3-rev-spark',
  'w4-dso', 'w5-dpo', 'w6-upcoming',
]);

// Per-widget CTA config
const WIDGET_CTAS: Record<string, { label: string; tab?: string }> = {
  'w1-cash':            { label: 'Go to Cash Tab', tab: 'cash' },
  'w2-pnl-compressed':  { label: 'See Full P&L Below' },
  'w3-rev-spark':       { label: 'See Full Trend Below' },
  'w4-dso':             { label: 'Go to Payables & Receivables', tab: 'payables' },
  'w5-dpo':             { label: 'Go to Payables & Receivables', tab: 'payables' },
  'w6-upcoming':        { label: 'Go to Cash Tab', tab: 'cash' },
  'w7-pnl-full':        { label: 'View P&L Report' },
  'w8-rev-full':        { label: 'View P&L Report' },
  'w9-top-customers':   { label: 'View Customer Ledger' },
  'w10-cash-full':      { label: 'View All Bank Accounts' },
  'w11-cash-runway':    { label: 'View Cash Flow Statement' },
  'w12-cash-flow':      { label: 'View Cash Flow Statement' },
  'w13-upcoming-cash':  { label: 'View Bill Due Calendar' },
  'w14-ar-out':         { label: 'View All Invoices' },
  'w15-dso-full':       { label: 'View Overdue Customers' },
  'w16-ar-aging':       { label: 'View Overdue Customers' },
  'w17-top-ar':         { label: 'View Overdue Customers' },
  'w18-ap-out':         { label: 'View All Bills' },
  'w19-dpo-full':       { label: 'View Overdue Bills' },
  'w20-ap-aging':       { label: 'View Overdue Bills' },
  'w21-vendor-spend':   { label: 'View Vendor Bills' },
  'w22-upcoming-ap':    { label: 'View Bill Due Calendar' },
};

// ─── Shared panel row ─────────────────────────────────────────────────────────

const PanelRow = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <Group
    justify="space-between"
    py={9}
    style={{ borderBottom: '1px solid rgba(18,19,26,0.06)' }}
  >
    <Text ff="Space Grotesk" size="sm" c={highlight ? '#12131A' : '#88898C'} fw={highlight ? 500 : 400}>
      {label}
    </Text>
    <Text ff="Albert Sans" fw={highlight ? 600 : 500} size="sm" c="#12131A">
      {value}
    </Text>
  </Group>
);

const PanelSection = ({ title, first = false }: { title: string; first?: boolean }) => (
  <Text
    ff="Space Grotesk"
    size="xs"
    c="dimmed"
    mt={first ? 4 : 'md'}
    mb={6}
    style={{ textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}
  >
    {title}
  </Text>
);

// ─── Summary content per widget ───────────────────────────────────────────────

function SummaryContent({ widgetId }: { widgetId: string }) {
  switch (widgetId) {
    case 'w1-cash':
      return (
        <Box>
          <PanelSection title="Account Balances" />
          <PanelRow label="HDFC Current A/c" value="₹8,20,000" />
          <PanelRow label="SBI Savings A/c" value="₹4,25,000" />
          <PanelRow label="Total Cash" value="₹12,45,000" highlight />
          <PanelRow label="Change vs Period Start" value="+₹98,000" />
          <Box mt="md" style={{ backgroundColor: '#FEF3C7', padding: '6px 10px', borderRadius: 0 }}>
            <Text ff="Space Grotesk" size="xs" c="#D97706" fw={500}>
              HDFC A/c: Reconciliation pending for 3 transactions
            </Text>
          </Box>
        </Box>
      );
    case 'w2-pnl-compressed':
      return (
        <Box>
          <PanelSection title="This Month vs Last Month" />
          <PanelRow label="Revenue" value="₹45,00,000" />
          <PanelRow label="vs Last Month" value="₹40,00,000" />
          <PanelRow label="Gross Profit" value="₹18,50,000" />
          <PanelRow label="Operating Profit" value="₹12,00,000" highlight />
          <PanelRow label="Prior Period Op. Profit" value="₹9,50,000" />
        </Box>
      );
    case 'w3-rev-spark':
      return (
        <Box>
          <PanelSection title="Monthly Revenue" />
          {[['Jan', '₹30,00,000'], ['Feb', '₹35,00,000'], ['Mar', '₹32,00,000'],
            ['Apr', '₹40,00,000'], ['May', '₹42,00,000'], ['Jun', '₹45,00,000']].map(([m, v]) => (
            <PanelRow key={m} label={m} value={v} highlight={m === 'Jun'} />
          ))}
        </Box>
      );
    case 'w4-dso':
      return (
        <Box>
          <PanelSection title="DSO Summary" />
          <PanelRow label="Current DSO" value="45 days" highlight />
          <PanelRow label="Prior Period DSO" value="40 days" />
          <PanelRow label="Target" value="30 days" />
          <PanelSection title="Top Contributors" />
          <PanelRow label="Acme Corp" value="14 days" />
          <PanelRow label="Globex Inc" value="8 days" />
          <PanelRow label="Soylent Corp" value="5 days" />
        </Box>
      );
    case 'w5-dpo':
      return (
        <Box>
          <PanelSection title="DPO Summary" />
          <PanelRow label="Current DPO" value="38 days" highlight />
          <PanelRow label="Prior Period DPO" value="40 days" />
          <PanelRow label="Target Range" value="30 – 45 days" />
          <PanelSection title="Top Contributors" />
          <PanelRow label="Vendor X" value="₹2,10,000 outstanding" />
          <PanelRow label="Supplier Y" value="₹98,000 outstanding" />
        </Box>
      );
    case 'w6-upcoming':
      return (
        <Box>
          <PanelSection title="Overdue Bills" />
          <PanelRow label="Vendor X — Bill #1042" value="₹1,40,000" highlight />
          <PanelRow label="Supplier Y — Bill #892" value="₹90,000" />
          <PanelRow label="Agency Z — Bill #331" value="₹72,000" />
          <PanelRow label="9 more bills" value="₹43,000" />
          <Box mt="md" style={{ backgroundColor: 'rgba(248,43,43,0.07)', padding: '6px 10px', borderRadius: 0 }}>
            <Text ff="Space Grotesk" size="xs" c="#F82B2B" fw={500}>
              12 bills · Total overdue: ₹3,45,000
            </Text>
          </Box>
        </Box>
      );
    case 'w7-pnl-full':
      return (
        <Box>
          <PanelSection title="Current vs Prior Period" />
          <PanelRow label="Revenue" value="₹45,00,000" />
          <PanelRow label="COGS" value="₹26,50,000" />
          <PanelRow label="Gross Profit (41%)" value="₹18,50,000" highlight />
          <PanelRow label="Operating Expense" value="₹6,50,000" />
          <PanelRow label="Operating Profit" value="₹12,00,000" highlight />
          <PanelSection title="Prior Period" />
          <PanelRow label="Revenue" value="₹40,00,000" />
          <PanelRow label="Operating Profit" value="₹9,50,000" />
        </Box>
      );
    case 'w8-rev-full':
      return (
        <Box>
          <PanelSection title="Monthly Revenue Breakdown" />
          {[['Jan', '₹30,00,000'], ['Feb', '₹35,00,000'], ['Mar', '₹32,00,000'],
            ['Apr', '₹40,00,000'], ['May', '₹42,00,000'], ['Jun', '₹45,00,000']].map(([m, v]) => (
            <PanelRow key={m} label={m} value={v} highlight={m === 'Jun'} />
          ))}
          <PanelRow label="Total (6M)" value="₹2,24,00,000" highlight />
        </Box>
      );
    case 'w9-top-customers':
      return (
        <Box>
          <PanelSection title="Ranked by Revenue" />
          <PanelRow label="Acme Corp" value="₹12,00,000 · 65%" highlight />
          <PanelRow label="Globex Inc" value="₹8,50,000 · 46%" />
          <PanelRow label="Soylent Corp" value="₹4,20,000 · 23%" />
          <PanelRow label="Initech" value="₹1,80,000 · 10%" />
          <PanelRow label="Unattributed" value="₹50,000 · 3%" />
        </Box>
      );
    case 'w10-cash-full':
      return (
        <Box>
          <PanelSection title="Account Balances" />
          <PanelRow label="HDFC Current A/c" value="₹8,20,000" />
          <PanelRow label="SBI Savings A/c" value="₹4,25,000" />
          <PanelRow label="Total Cash" value="₹12,45,000" highlight />
          <PanelRow label="Change vs Period Start" value="+₹98,000" />
          <Box mt="md" style={{ backgroundColor: '#FEF3C7', padding: '6px 10px', borderRadius: 0 }}>
            <Text ff="Space Grotesk" size="xs" c="#D97706" fw={500}>
              HDFC A/c: Reconciliation pending for 3 transactions
            </Text>
          </Box>
        </Box>
      );
    case 'w11-cash-runway':
      return (
        <Box>
          <PanelSection title="Runway Calculation" />
          <PanelRow label="Total Cash (numerator)" value="₹12,45,000" />
          <PanelRow label="Avg Daily Outflow (30d)" value="₹29,643" />
          <PanelRow label="Days Runway" value="~42 days" highlight />
          <PanelSection title="30-Day Window" />
          <PanelRow label="Start" value="20 May 2024" />
          <PanelRow label="End" value="19 Jun 2024" />
          <PanelRow label="Total Outflow" value="₹8,89,286" />
        </Box>
      );
    case 'w12-cash-flow':
      return (
        <Box>
          <PanelSection title="Period Summary" />
          <PanelRow label="Total Inflow (This Month)" value="₹47,00,000" />
          <PanelRow label="Total Outflow (This Month)" value="₹38,50,000" />
          <PanelRow label="Net Cash Flow" value="+₹8,50,000" highlight />
          <PanelRow label="Prior Month Net" value="+₹5,20,000" />
        </Box>
      );
    case 'w13-upcoming-cash':
      return (
        <Box>
          <PanelSection title="Overdue Bills (12 total)" />
          <PanelRow label="Vendor X — Bill #1042" value="₹1,40,000" highlight />
          <PanelRow label="Supplier Y — Bill #892" value="₹90,000" />
          <PanelRow label="Agency Z — Bill #331" value="₹72,000" />
          <PanelRow label="9 more bills" value="₹43,000" />
        </Box>
      );
    case 'w14-ar-out':
      return (
        <Box>
          <PanelSection title="AR Summary" />
          <PanelRow label="Total AR Outstanding" value="₹18,50,000" />
          <PanelRow label="Overdue Amount" value="₹4,20,000" highlight />
          <PanelRow label="Overdue Invoice Count" value="8 invoices" />
          <PanelRow label="Advance Received (unlinked)" value="₹80,000" />
        </Box>
      );
    case 'w15-dso-full':
      return (
        <Box>
          <PanelSection title="DSO Summary" />
          <PanelRow label="Current DSO" value="45 days" highlight />
          <PanelRow label="Prior Period DSO" value="40 days" />
          <PanelRow label="Target" value="30 days" />
          <PanelSection title="Top Contributors" />
          <PanelRow label="Acme Corp" value="14 days · 31%" highlight />
          <PanelRow label="Globex Inc" value="12 days · 27%" />
          <PanelRow label="Soylent Corp" value="10 days · 22%" />
        </Box>
      );
    case 'w16-ar-aging':
      return (
        <Box>
          <PanelSection title="AR Aging Buckets" />
          <PanelRow label="Current" value="₹14,30,000 · 77%" />
          <PanelRow label="1–30 days" value="₹2,10,000 · 11%" />
          <PanelRow label="31–60 days" value="₹1,50,000 · 8%" />
          <PanelRow label="61–90 days" value="₹40,000 · 2%" />
          <PanelRow label="90+ days" value="₹20,000 · 1%" highlight />
          <PanelSection title="Top Overdue Customers" />
          <PanelRow label="Globex Inc" value="₹90,000" />
          <PanelRow label="Acme Corp" value="₹60,000" />
        </Box>
      );
    case 'w17-top-ar':
      return (
        <Box>
          <PanelSection title="Ranked by Overdue AR" />
          <PanelRow label="Acme Corp" value="₹2,10,000 · 50%" highlight />
          <PanelRow label="Soylent Corp" value="₹1,20,000 · 29%" />
          <PanelRow label="Globex Inc" value="₹90,000 · 21%" />
        </Box>
      );
    case 'w18-ap-out':
      return (
        <Box>
          <PanelSection title="AP Summary" />
          <PanelRow label="Total AP Outstanding" value="₹9,45,000" />
          <PanelRow label="Overdue Amount" value="₹3,45,000" highlight />
          <PanelRow label="Overdue Bill Count" value="12 bills" />
          <PanelRow label="Vendor Advances Paid (unlinked)" value="₹50,000" />
        </Box>
      );
    case 'w19-dpo-full':
      return (
        <Box>
          <PanelSection title="DPO Summary" />
          <PanelRow label="Current DPO" value="38 days" highlight />
          <PanelRow label="Prior Period DPO" value="40 days" />
          <PanelRow label="Target Range" value="30 – 45 days" />
          <PanelSection title="Top Contributors" />
          <PanelRow label="Vendor X" value="₹2,10,000 outstanding" highlight />
          <PanelRow label="Supplier Y" value="₹1,40,000 outstanding" />
          <PanelRow label="Agency Z" value="₹80,000 outstanding" />
        </Box>
      );
    case 'w20-ap-aging':
      return (
        <Box>
          <PanelSection title="AP Aging Buckets" />
          <PanelRow label="Current" value="₹6,00,000 · 63%" />
          <PanelRow label="1–30 days" value="₹2,00,000 · 21%" />
          <PanelRow label="31–60 days" value="₹1,00,000 · 11%" />
          <PanelRow label="61–90 days" value="₹30,000 · 3%" />
          <PanelRow label="90+ days" value="₹15,000 · 2%" highlight />
          <PanelSection title="Top Overdue Vendors" />
          <PanelRow label="Vendor X" value="₹70,000" />
          <PanelRow label="Supplier Y" value="₹30,000" />
        </Box>
      );
    case 'w21-vendor-spend':
      return (
        <Box>
          <PanelSection title="Vendor Spend (This Period)" />
          <PanelRow label="Vendor X" value="₹4,00,000 · 42%" highlight />
          <PanelRow label="Supplier Y" value="₹2,50,000 · 26%" />
          <PanelRow label="Agency Z" value="₹1,50,000 · 16%" />
          <PanelRow label="Others" value="₹1,50,000 · 16%" />
          <PanelRow label="Total" value="₹9,50,000" />
        </Box>
      );
    case 'w22-upcoming-ap':
      return (
        <Box>
          <PanelSection title="Overdue Bills (12 total)" />
          <PanelRow label="Vendor X — Bill #1042" value="₹1,40,000" highlight />
          <PanelRow label="Supplier Y — Bill #892" value="₹90,000" />
          <PanelRow label="Agency Z — Bill #331" value="₹72,000" />
          <PanelRow label="9 more bills" value="₹43,000" />
        </Box>
      );
    default:
      return <Text ff="Space Grotesk" size="sm" c="dimmed">No data available.</Text>;
  }
}

// ─── Detail content per widget ────────────────────────────────────────────────

function DetailContent({ widgetId }: { widgetId: string }) {
  switch (widgetId) {
    case 'w7-pnl-full':
      return (
        <Box>
          <PanelSection title="Revenue Breakdown" />
          <PanelRow label="Sales — Domestic" value="₹38,00,000" />
          <PanelRow label="Sales — Export" value="₹7,00,000" />
          <PanelSection title="Expense Breakdown" />
          <PanelRow label="Raw Material" value="₹18,00,000" />
          <PanelRow label="Direct Labour" value="₹8,50,000" />
          <PanelRow label="Selling Expenses" value="₹3,20,000" highlight />
          <PanelRow label="Admin Expenses" value="₹3,30,000" />
        </Box>
      );
    case 'w8-rev-full':
      return (
        <Box>
          <PanelSection title="Top Customers · Jun" />
          <PanelRow label="Acme Corp" value="₹12,00,000" highlight />
          <PanelRow label="Globex Inc" value="₹8,50,000" />
          <PanelRow label="Soylent Corp" value="₹4,20,000" />
          <PanelSection title="Largest Invoice" />
          <PanelRow label="INV-2024-0892 · Acme" value="₹4,20,000" />
          <PanelSection title="Revenue Mix" />
          <PanelRow label="Product Sales" value="72%" />
          <PanelRow label="Service Revenue" value="28%" />
        </Box>
      );
    case 'w9-top-customers':
      return (
        <Box>
          <PanelSection title="Acme Corp — Open Invoices" />
          <PanelRow label="INV-0892 · Due 15 Jul" value="₹4,20,000" highlight />
          <PanelRow label="INV-0798 · Due 30 Jul" value="₹4,00,000" />
          <PanelSection title="Collections Summary" />
          <PanelRow label="Total collected (YTD)" value="₹24,00,000" />
          <PanelRow label="Avg payment time" value="42 days" />
          <PanelRow label="Last payment" value="₹3,80,000 · 10 Jun" />
        </Box>
      );
    case 'w10-cash-full':
      return (
        <Box>
          <PanelSection title="HDFC — Recent Movements" />
          <PanelRow label="Inflow · 18 Jun" value="+₹4,20,000" highlight />
          <PanelRow label="Outflow · 17 Jun" value="−₹2,10,000" />
          <PanelRow label="Inflow · 15 Jun" value="+₹1,80,000" />
          <PanelRow label="Outflow · 12 Jun" value="−₹98,000" />
          <PanelSection title="Reconciliation" />
          <PanelRow label="Matched transactions" value="42 of 45" />
          <PanelRow label="Unmatched" value="3 · Needs review" highlight />
        </Box>
      );
    case 'w11-cash-runway':
      return (
        <Box>
          <PanelSection title="Daily Outflow Breakdown (30d)" />
          <PanelRow label="Week 1 avg" value="₹32,000/day" />
          <PanelRow label="Week 2 avg" value="₹28,000/day" />
          <PanelRow label="Week 3 avg" value="₹31,000/day" />
          <PanelRow label="Week 4 avg" value="₹27,000/day" />
          <PanelRow label="30-day average" value="₹29,643/day" highlight />
        </Box>
      );
    case 'w12-cash-flow':
      return (
        <Box>
          <PanelSection title="Inflow Sources (This Month)" />
          <PanelRow label="Customer Collections" value="₹38,00,000" highlight />
          <PanelRow label="Advance Receipts" value="₹9,00,000" />
          <PanelSection title="Outflow Categories" />
          <PanelRow label="Vendor Payments" value="₹24,00,000" />
          <PanelRow label="Salaries" value="₹8,50,000" />
          <PanelRow label="Overheads" value="₹6,00,000" />
        </Box>
      );
    case 'w13-upcoming-cash':
      return (
        <Box>
          <PanelSection title="Overdue — Bill Detail" />
          <PanelRow label="Vendor X · #1042" value="₹1,40,000 · 14d" highlight />
          <PanelRow label="Supplier Y · #892" value="₹90,000 · 11d" />
          <PanelRow label="Agency Z · #331" value="₹72,000 · 9d" />
          <PanelRow label="Petty Cash · #112" value="₹43,000 · 6d" />
        </Box>
      );
    case 'w14-ar-out':
      return (
        <Box>
          <PanelSection title="Overdue Invoice List" />
          <PanelRow label="Acme · INV-892 · 14d overdue" value="₹2,10,000" highlight />
          <PanelRow label="Soylent · INV-741 · 22d overdue" value="₹1,20,000" />
          <PanelRow label="Globex · INV-668 · 31d overdue" value="₹90,000" />
        </Box>
      );
    case 'w15-dso-full':
      return (
        <Box>
          <PanelSection title="Customer-Level DSO" />
          <PanelRow label="Acme Corp · ₹12,00,000" value="52 days" highlight />
          <PanelRow label="Globex Inc · ₹8,50,000" value="44 days" />
          <PanelRow label="Soylent Corp · ₹4,20,000" value="38 days" />
          <PanelRow label="Initech · ₹1,80,000" value="30 days" />
        </Box>
      );
    case 'w16-ar-aging':
      return (
        <Box>
          <PanelSection title="Customers · 31–60 Days Overdue" />
          <PanelRow label="Globex Inc · INV-668" value="₹90,000" highlight />
          <PanelRow label="Acme Corp · INV-712" value="₹60,000" />
          <PanelSection title="Follow-up History" />
          <PanelRow label="Email sent" value="15 Jun" />
          <PanelRow label="Call logged" value="18 Jun" />
          <PanelRow label="Reminder pending" value="25 Jun" />
        </Box>
      );
    case 'w17-top-ar':
      return (
        <Box>
          <PanelSection title="Acme Corp — Overdue Invoices" />
          <PanelRow label="INV-892 · Due 5 Jun" value="₹1,20,000 · 14d" highlight />
          <PanelRow label="INV-841 · Due 10 Jun" value="₹90,000 · 9d" />
          <PanelSection title="Payment History" />
          <PanelRow label="Last paid" value="₹3,80,000 · 10 Jun" />
          <PanelRow label="Avg payment time" value="42 days" />
        </Box>
      );
    case 'w18-ap-out':
      return (
        <Box>
          <PanelSection title="Overdue Bill List" />
          <PanelRow label="Vendor X · #1042 · 14d" value="₹1,40,000" highlight />
          <PanelRow label="Supplier Y · #892 · 11d" value="₹90,000" />
          <PanelRow label="Agency Z · #331 · 9d" value="₹72,000" />
          <PanelRow label="9 more bills" value="₹43,000" />
        </Box>
      );
    case 'w19-dpo-full':
      return (
        <Box>
          <PanelSection title="Vendor-Level AP" />
          <PanelRow label="Vendor X · 3 bills" value="₹2,10,000 · 45d avg" highlight />
          <PanelRow label="Supplier Y · 2 bills" value="₹1,40,000 · 38d avg" />
          <PanelRow label="Agency Z · 1 bill" value="₹80,000 · 32d avg" />
        </Box>
      );
    case 'w20-ap-aging':
      return (
        <Box>
          <PanelSection title="Vendors · 31–60 Days Overdue" />
          <PanelRow label="Vendor X · #1021" value="₹70,000" highlight />
          <PanelRow label="Supplier Y · #890" value="₹30,000" />
          <PanelSection title="Payment Status" />
          <PanelRow label="Vendor X #1021" value="Pending" />
          <PanelRow label="Supplier Y #890" value="Partially paid" />
        </Box>
      );
    case 'w21-vendor-spend':
      return (
        <Box>
          <PanelSection title="Vendor X — Bill Detail" />
          <PanelRow label="Inv #1042 · Raw Material" value="₹1,80,000" highlight />
          <PanelRow label="Inv #1021 · Consumables" value="₹1,40,000" />
          <PanelRow label="Inv #988 · Transport" value="₹80,000" />
          <PanelSection title="Spend Mix" />
          <PanelRow label="Raw Material" value="45%" />
          <PanelRow label="Consumables" value="35%" />
          <PanelRow label="Transport" value="20%" />
        </Box>
      );
    case 'w22-upcoming-ap':
      return (
        <Box>
          <PanelSection title="Overdue — Bill Detail" />
          <PanelRow label="Vendor X · #1042 · Due 5 Jun" value="₹1,40,000" highlight />
          <PanelRow label="Supplier Y · #892 · Due 8 Jun" value="₹90,000" />
          <PanelRow label="Agency Z · #331 · Due 10 Jun" value="₹72,000" />
          <PanelRow label="9 more bills" value="₹43,000" />
        </Box>
      );
    default:
      return <Text ff="Space Grotesk" size="sm" c="dimmed">No detail available.</Text>;
  }
}

// ─── Side Panel ───────────────────────────────────────────────────────────────

export const SidePanel = () => {
  const { isPanelOpen, closePanel, activeWidgetId, panelData, panelView, setPanelView, setActiveTab, dateRange } = useDashboard();

  const isZoneA = activeWidgetId ? ZONE_A_WIDGETS.has(activeWidgetId) : false;
  const title = activeWidgetId ? (WIDGET_TITLES[activeWidgetId] ?? activeWidgetId) : 'Details';
  const cta = activeWidgetId ? (WIDGET_CTAS[activeWidgetId] ?? { label: 'View Report' }) : null;

  // Escape key closes the panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePanel(); };
    if (isPanelOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPanelOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCTA = () => {
    if (cta?.tab) {
      setActiveTab(cta.tab);
      closePanel();
    }
    // Non-tab CTAs are prototype stubs — no action
  };

  return (
    <Box
      style={{
        position: 'fixed',
        top: 56,
        right: 0,
        height: 'calc(100vh - 56px)',
        width: 340,
        backgroundColor: '#FCFCFC',
        borderLeft: '1px solid rgba(18,19,26,0.1)',
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        transform: isPanelOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        boxShadow: isPanelOpen ? '-6px 0 24px rgba(18,19,26,0.07)' : 'none',
      }}
    >
      {/* Header */}
      <Box style={{ padding: '12px 16px 10px', borderBottom: '1px solid rgba(18,19,26,0.07)' }}>
        <Group justify="space-between" align="flex-start" mb={isZoneA ? 0 : 10}>
          <Box style={{ flex: 1, marginRight: 8 }}>
            <Text ff="Albert Sans" fw={600} size="md" c="#12131A" style={{ lineHeight: 1.3 }}>
              {title}
            </Text>
            <Text ff="Space Grotesk" size="11px" c="#AAACB5" mt={2} style={{ lineHeight: 1 }}>
              {dateRange ?? 'This Month'}
            </Text>
          </Box>
          <UnstyledButton onClick={closePanel} style={{ display: 'flex', color: '#AAACB5', padding: 4, flexShrink: 0, marginTop: 1 }}>
            <IconX size={16} />
          </UnstyledButton>
        </Group>

        {/* Summary / Detail toggle — Zone B only */}
        {!isZoneA && (
          <Group gap={2}>
            {(['summary', 'detail'] as const).map((view) => (
              <UnstyledButton
                key={view}
                onClick={() => setPanelView(view)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 0,
                  backgroundColor: panelView === view ? '#EDEEF2' : 'transparent',
                  fontFamily: 'Space Grotesk',
                  fontSize: 12,
                  fontWeight: panelView === view ? 600 : 400,
                  color: panelView === view ? '#12131A' : '#AAACB5',
                  textTransform: 'capitalize',
                  transition: 'background-color 0.12s ease, color 0.12s ease',
                }}
              >
                {view}
              </UnstyledButton>
            ))}
          </Group>
        )}
      </Box>

      {/* Body */}
      <ScrollArea style={{ flex: 1 }}>
        <Box style={{ padding: '6px 16px 16px' }}>
          {panelData?.showDataQuality && (
            <Box mb="md" style={{ backgroundColor: '#FEF3C7', padding: '8px 12px', borderRadius: 0 }}>
              <Text ff="Space Grotesk" size="sm" fw={600} c="#D97706" mb={4}>Data Quality Warning</Text>
              <Text ff="Space Grotesk" size="xs" c="#92400E">
                Some transactions contributing to this metric have incomplete mappings and require review.
              </Text>
            </Box>
          )}

          {activeWidgetId && (
            panelView === 'detail' && !isZoneA
              ? <DetailContent widgetId={activeWidgetId} />
              : <SummaryContent widgetId={activeWidgetId} />
          )}
        </Box>
      </ScrollArea>

      {/* CTA footer */}
      {cta && (
        <Box style={{ padding: '10px 16px', borderTop: '1px solid rgba(18, 19, 26, 0.1)' }}>
          <Button
            fullWidth
            variant="light"
            color="blue"
            onClick={handleCTA}
            rightSection={<IconExternalLink size={14} />}
            styles={{
              root: { fontFamily: 'Space Grotesk', fontSize: 13 },
            }}
          >
            {cta.label}
          </Button>
        </Box>
      )}
    </Box>
  );
};
