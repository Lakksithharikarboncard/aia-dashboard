import ExcelJS from 'exceljs';

const wb = new ExcelJS.Workbook();
wb.creator = 'AIA Dashboard Audit';
wb.created = new Date();

// ─── Color palette ─────────────────────────────────────────────────────────────
const BLUE   = 'FF2563EB';
const WHITE  = 'FFFFFFFF';
const GRAY_BG = 'FFF9FAFB';
const HEADER_BG = 'FF1E293B';
const SECTION_BG = 'FFEFF6FF';
const BORDER_COLOR = 'FFE5E7EB';

const headerFont = { bold: true, color: { argb: WHITE }, name: 'Calibri', size: 11 };
const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
const sectionFont = { bold: true, color: { argb: BLUE }, name: 'Calibri', size: 11 };
const sectionFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SECTION_BG } };
const bodyFont = { name: 'Calibri', size: 10 };
const wrapAlign = { vertical: 'top', wrapText: true };
const thinBorder = {
  top: { style: 'thin', color: { argb: BORDER_COLOR } },
  bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
  left: { style: 'thin', color: { argb: BORDER_COLOR } },
  right: { style: 'thin', color: { argb: BORDER_COLOR } },
};

function styleHeaders(ws, colCount) {
  const row = ws.getRow(1);
  row.height = 28;
  for (let i = 1; i <= colCount; i++) {
    const cell = row.getCell(i);
    cell.font = headerFont;
    cell.fill = headerFill;
    cell.alignment = { vertical: 'middle', wrapText: true };
    cell.border = thinBorder;
  }
}

function addSectionRow(ws, text, colCount) {
  const row = ws.addRow([text, ...Array(colCount - 1).fill('')]);
  ws.mergeCells(row.number, 1, row.number, colCount);
  const cell = row.getCell(1);
  cell.font = sectionFont;
  cell.fill = sectionFill;
  cell.alignment = { vertical: 'middle' };
  cell.border = thinBorder;
  row.height = 24;
}

function addDataRow(ws, data, colCount) {
  const row = ws.addRow(data);
  row.height = 60;
  for (let i = 1; i <= colCount; i++) {
    const cell = row.getCell(i);
    cell.font = bodyFont;
    cell.alignment = wrapAlign;
    cell.border = thinBorder;
    if (row.number % 2 === 0) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRAY_BG } };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHEET 1: WIDGET AUDIT (master sheet)
// ═══════════════════════════════════════════════════════════════════════════════
const ws1 = wb.addWorksheet('Widget Audit', { views: [{ state: 'frozen', ySplit: 1 }] });

const cols1 = [
  { header: '#', width: 4 },
  { header: 'Widget ID', width: 16 },
  { header: 'Display Name', width: 24 },
  { header: 'Tab', width: 14 },
  { header: 'Grid Position', width: 16 },
  { header: 'Chart Type', width: 18 },
  { header: 'JTBD Mapped', width: 30 },
  { header: 'Primary KPI', width: 20 },
  { header: 'Secondary Info', width: 30 },
  { header: 'Primary Interaction', width: 24 },
  { header: 'Panel Opens?', width: 10 },
  { header: 'Panel ID', width: 16 },
  { header: 'Has Grain Toggle?', width: 12 },
  { header: 'Has Today vs Yesterday?', width: 14 },
  { header: 'Has Daily Pulse Badge?', width: 14 },
  { header: 'Has LIVE Badge?', width: 10 },
  { header: 'isCurrentPeriod Behavior', width: 34 },
];
ws1.columns = cols1;
styleHeaders(ws1, cols1.length);

// ── Overview Tab Widgets ──
addSectionRow(ws1, 'OVERVIEW TAB — ROW 1', cols1.length);

addDataRow(ws1, [
  1, 'w7-gross-profit', 'Gross Profit', 'Overview', 'Row 1 · 3 col',
  'Area sparkline (Mantine AreaChart)',
  'Know gross profit this month',
  '₹18.5L · +7.6% vs last month',
  '41% Gross Margin · 6-month sparkline (Oct–Mar) · Today vs Yesterday strip (₹18.5L vs ₹17.2L · ↑₹1.3L)',
  'Click card → opens side panel',
  'Yes', 'w7-gross-profit',
  'No', 'Yes', 'No', 'No',
  'When isCurrentPeriod=true: Shows TodayVsYesterday strip (Today ₹18.5L | Yesterday ₹17.2L | ↑₹1.3L). When false: strip hidden, only sparkline + KPI visible.',
], cols1.length);

addDataRow(ws1, [
  2, 'w10-cash-full', 'Cash Balance', 'Overview', 'Row 1 · 3 col',
  'Two-zone card (no chart)',
  'See current cash and bank balance',
  '₹12.45L',
  'Across 2 accounts · Account Breakdown: HDFC ₹8.2L, SBI ₹4.25L · Green gradient header',
  'Click card → opens side panel',
  'Yes', 'w10-cash-full',
  'No', 'Yes', 'No', 'No',
  'When isCurrentPeriod=true: Shows Today vs Yesterday grid (Today ₹12.45L | Yesterday ₹12.0L | ↑₹45K) in green-tinted strip on gradient header. When false: shows simple pill "↑ 8.5% vs last month".',
], cols1.length);

addDataRow(ws1, [
  3, 'w10-rev-vs-exp', 'Revenue vs Expense', 'Overview', 'Row 1 · 6 col',
  'Composed chart (Bar + Line, Recharts)',
  'Track revenue vs expense over time',
  '₹12L net income',
  '↑10.1% vs last month · 6-month bars (Revenue blue, Expense grey) + Net Income green line · Custom tooltip with all 3 series · Custom legend',
  'Click card → opens side panel',
  'Yes', 'w10-rev-vs-exp',
  'No', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Chart data is static 6-month range (Oct–Mar).',
], cols1.length);

addSectionRow(ws1, 'OVERVIEW TAB — ROW 2', cols1.length);

addDataRow(ws1, [
  4, 'w2-pnl-compressed', 'P&L Summary', 'Overview', 'Row 2 · 4 col',
  'Waterfall bar chart (Recharts ComposedChart with stacked Bar + Cell)',
  'Read the key P&L lines quickly',
  'Revenue ₹45L → COGS ₹26.5L → GP ₹18.5L → OpEx ₹6.5L → Net Profit ₹12L',
  'Waterfall bridge (5 bars: Revenue blue, COGS red, GP green, OpEx red, Net Profit dark green with stroke) · Custom WaterfallTooltip',
  'Click card → opens side panel',
  'Yes', 'w2-pnl-compressed',
  'No', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Waterfall shows full-period P&L bridge.',
], cols1.length);

addDataRow(ws1, [
  5, 'w12-cash-flow', 'Cash Inflow vs Outflow', 'Overview', 'Row 2 · 5 col',
  'Stacked area chart (Recharts AreaChart with gradients)',
  'Track cash coming in vs going out',
  'Net +₹12K today (DailyPulseBadge)',
  'Smooth natural curves · Inflow (blue gradient) + Outflow (grey gradient) · CashFlowTooltip with net calculation · Day/Week/Month grain toggle · Today vs Yesterday NET strip in legend row',
  'Click card → opens side panel · GrainToggle switches data resolution',
  'Yes', 'w12-cash-flow',
  'Yes (Day/Week/Month)', 'Yes (legend strip)', 'Yes', 'No',
  'When isCurrentPeriod=true: (1) DailyPulseBadge "Net +₹12K today" in title bar, (2) Today vs Yesterday NET strip (Today NET +₹12K | Yesterday NET +₹8K) beside legend. When false: both hidden. Grain toggle works regardless.',
], cols1.length);

addDataRow(ws1, [
  6, 'w11-exp-breakdown', 'Expense Breakdown', 'Overview', 'Row 2 · 3 col',
  'Horizontal progress bars (no chart library)',
  'Understand expense breakdown',
  '₹6.5L total',
  'TrendBadge +3.2% vs last month · 5 categories: Salaries 55% ₹3.58L, Marketing 20% ₹1.3L, Infra 15% ₹97.5K, Travel 5% ₹32.5K, Other 5% ₹32.5K · Color-coded progress bars',
  'Click card → opens side panel',
  'Yes', 'w11-exp-breakdown',
  'No', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Static category breakdown.',
], cols1.length);

addSectionRow(ws1, 'OVERVIEW TAB — ROW 3', cols1.length);

addDataRow(ws1, [
  7, 'w-ai-insights', 'AI Insights', 'Overview', 'Row 3 · 12 col',
  'Accordion (Mantine Collapse, no chart)',
  'Know which reports are ready',
  '3 insights: 1 critical, 1 watch, 1 positive',
  'Expandable accordion rows · Each insight has: severity dot, source tag, title, summary · Expanded view: What we found, Why it matters, Suggested review, Based on · Sparkles icon header',
  'Click row → expands/collapses accordion item',
  'No (disablePanel)', 'N/A',
  'No', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Insights are static AI-generated content.',
], cols1.length);

addSectionRow(ws1, 'OVERVIEW TAB — ROW 4', cols1.length);

addDataRow(ws1, [
  8, 'w8-rev-full', 'Revenue Trend', 'Overview', 'Row 4 · 6 col',
  'Area chart (Mantine AreaChart with dots)',
  'See sales trend over time',
  'Dynamic per grain: Day ₹2.3L, Week ₹10.2L, Month ₹45L',
  'Percentage change badge (dynamic) · Day/Week/Month grain toggle · Day: 6 daily points, Week: 4 weekly points, Month: 6 monthly points · Blue area + dots',
  'Click card → opens side panel · GrainToggle switches resolution',
  'Yes', 'w8-rev-full',
  'Yes (Day/Week/Month)', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Data changes per grain but not per isCurrentPeriod.',
], cols1.length);

addDataRow(ws1, [
  9, 'w9-top-customers', 'Top Customers by Revenue', 'Overview', 'Row 4 · 6 col',
  'Horizontal progress bars (no chart library)',
  'Know top customers by revenue',
  '4 customers ranked by revenue',
  'Acme Corp ₹12L (+8.2%), Globex Inc ₹8.5L (+3.1%), Soylent Corp ₹4.2L (−2.4%), Initech ₹1.8L (+0.9%) · Blue gradient progress bars · Trend badges per customer',
  'Click row → opens side panel with customer detail',
  'Yes', 'w9-top-customers',
  'No', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Rankings are period-level.',
], cols1.length);

addSectionRow(ws1, 'PAYABLES & RECEIVABLES TAB — ROW 1', cols1.length);

addDataRow(ws1, [
  10, 'w14-ar-out (in w-ar-ap-row)', 'AR Outstanding', 'Payables & Receivables', 'Row 1 · ~3 col (left group)',
  'KPI card (no chart)',
  'See total outstanding receivables',
  '₹18.5L',
  'OverdueBadge: ₹4.2L overdue · 8 invoices · TrendBadge ↓3.2% (positive = AR is reducing) · DailyPulseBadge: ↓₹2.1L collected',
  'Click card → opens side panel',
  'Yes', 'w14-ar-out',
  'No', 'No', 'Yes (conditional)', 'No',
  'When isCurrentPeriod=true: Shows DailyPulseBadge "↓ ₹2.1L collected" (green border). When false: badge hidden.',
], cols1.length);

addDataRow(ws1, [
  11, 'w15-dso (in w-ar-ap-row)', 'Days Sales Outstanding', 'Payables & Receivables', 'Row 1 · ~3 col (left group)',
  'KPI card (no chart)',
  'Know DSO and what is driving it',
  '45 days',
  'TargetPill: "Target: 30 days" · TrendBadge ↑12% vs last month (negative = DSO increasing is bad)',
  'Click card → opens side panel',
  'Yes', 'w15-dso',
  'No', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Target and trend always visible.',
], cols1.length);

addDataRow(ws1, [
  12, 'w18-ap-out (in w-ar-ap-row)', 'AP Outstanding', 'Payables & Receivables', 'Row 1 · ~3 col (right group)',
  'KPI card (no chart)',
  'See total outstanding payables',
  '₹9.45L',
  'OverdueBadge: ₹3.45L overdue · 12 bills · TrendBadge ↓8.1% (positive = AP overdue reducing) · DailyPulseBadge: ↓₹50K paid',
  'Click card → opens side panel',
  'Yes', 'w18-ap-out',
  'No', 'No', 'Yes (conditional)', 'No',
  'When isCurrentPeriod=true: Shows DailyPulseBadge "↓ ₹50K paid" (neutral grey border). When false: badge hidden.',
], cols1.length);

addDataRow(ws1, [
  13, 'w19-dpo (in w-ar-ap-row)', 'Days Payable Outstanding', 'Payables & Receivables', 'Row 1 · ~3 col (right group)',
  'KPI card (no chart)',
  'Know DPO and what is driving it',
  '38 days',
  'WithinTargetPill: "Within target" (green) · TrendBadge ↓5% vs last month (neutral)',
  'Click card → opens side panel',
  'Yes', 'w19-dpo',
  'No', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Target status and trend always visible.',
], cols1.length);

addSectionRow(ws1, 'PAYABLES & RECEIVABLES TAB — ROW 2', cols1.length);

addDataRow(ws1, [
  14, 'w16-ar-aging', 'AR Aging', 'Payables & Receivables', 'Row 2 · 6 col',
  'Horizontal stacked bar (Recharts layout="vertical")',
  'See which customers are overdue and for how long',
  'Total ₹18.5L across 5 buckets · 23% overdue badge',
  'Current 77% ₹14.3L (green) · 1–30d 11% ₹2.1L (yellow) · 31–60d 8% ₹1.5L (orange) · 61–90d 2% ₹0.4L (light red) · 90+ 2% ₹0.2L (dark red) · Percentage labels inside bar when ≥8% · Grid legend with amounts',
  'Click card → opens side panel · Hover bar → AgingTooltip with bucket + amount + %',
  'Yes', 'w16-ar-aging',
  'No', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Aging snapshot is period-level.',
], cols1.length);

addDataRow(ws1, [
  15, 'w20-ap-aging', 'AP Aging', 'Payables & Receivables', 'Row 2 · 6 col',
  'Horizontal stacked bar (Recharts layout="vertical")',
  'See supplier payments overdue or due soon',
  'Total ₹9.45L across 5 buckets · 36% overdue badge',
  'Current 64% ₹6.0L (blue) · 1–30d 17% ₹1.6L (light blue) · 31–60d 11% ₹1.05L (yellow) · 61–90d 5% ₹0.52L (light red) · 90+ 3% ₹0.18L (dark red) · Same legend pattern as AR Aging',
  'Click card → opens side panel · Hover bar → AgingTooltip',
  'Yes', 'w20-ap-aging',
  'No', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Aging snapshot is period-level.',
], cols1.length);

addSectionRow(ws1, 'PAYABLES & RECEIVABLES TAB — ROW 3', cols1.length);

addDataRow(ws1, [
  16, 'w22-upcoming-ap', 'Upcoming Payments', 'Payables & Receivables', 'Row 3 · 4 col',
  'Stacked KPI list (no chart)',
  'Know payments due soon',
  'Overdue ₹3.45L · Due 0–7d ₹1.8L · Due 8–15d ₹4.2L',
  '3 vertically stacked sections (flex:1 each) with bucket label, large amount (26px), bill count · Overdue section in red, others in default text · LIVE badge in title',
  'Click card → opens side panel with bill-level detail per bucket',
  'Yes', 'w22-upcoming-ap',
  'No', 'No', 'No', 'Yes (LIVE)',
  'No isCurrentPeriod-specific behavior. LIVE badge always shown (not conditional).',
], cols1.length);

addDataRow(ws1, [
  17, 'w21-vendor-spend', 'Vendor Spend Concentration', 'Payables & Receivables', 'Row 3 · 8 col',
  'Ranked list with progress bars (no chart library)',
  'Know top vendors by spend',
  '4 vendors ranked · Total ₹9.5L',
  'Vendor X ₹4L 42% (blue gradient) · Supplier Y ₹2.5L 26% (purple gradient) · Agency Z ₹1.5L 16% (teal gradient) · Others ₹1.5L 16% (grey) · Rank numbers 01–04 · Progress bars with gradient fills',
  'Click vendor row → opens side panel with vendor bills detail',
  'Yes', 'w21-vendor-spend',
  'No', 'No', 'No', 'No',
  'No isCurrentPeriod-specific behavior. Vendor ranking is period-level.',
], cols1.length);


// ═══════════════════════════════════════════════════════════════════════════════
// SHEET 2: SIDE PANEL DRAWERS
// ═══════════════════════════════════════════════════════════════════════════════
const ws2 = wb.addWorksheet('Panel Drawers', { views: [{ state: 'frozen', ySplit: 1 }] });

const cols2 = [
  { header: '#', width: 4 },
  { header: 'Panel ID(s)', width: 22 },
  { header: 'Panel Title', width: 24 },
  { header: 'Triggered From', width: 24 },
  { header: 'Section 1', width: 40 },
  { header: 'Section 2', width: 40 },
  { header: 'Section 3', width: 40 },
  { header: 'Interactive Elements', width: 30 },
  { header: 'isCurrentPeriod Content', width: 30 },
];
ws2.columns = cols2;
styleHeaders(ws2, cols2.length);

addDataRow(ws2, [
  1, 'w7-gross-profit', 'Gross Profit', 'Gross Profit card (Overview)',
  'GROSS PROFIT DEEP DIVE: ₹18.5L (+7.6%) · Revenue→COGS→GP waterfall chart (160px ComposedChart) · "Revenue → COGS deduction → Gross Profit bridge" label',
  'TOP PRODUCTS CONTRIBUTING TO PROFIT: Table with Product | Profit | Change columns · Product A ₹8.2L +12.3%, Product B ₹5.8L +8.1%, Service X ₹4.5L −3.2%',
  '—', 'None — read-only', 'None',
], cols2.length);

addDataRow(ws2, [
  2, 'w1-cash, w10-cash-full', 'Cash Balance', 'Cash Balance card (Overview)',
  'ACCOUNTS: Grey card with HDFC ₹8.2L + SBI ₹4.25L table',
  "TODAY'S MOVEMENTS (conditional): Table with time | description | amount · 10:42a NEFT from Acme Corp +₹2.5L, 09:15a Vendor X Payment −₹1.4L · Net Flow Today: +₹1.10L",
  'RECENT ACTIVITY: Timeline grouped by date · Mar 23: Salary Disbursement −₹4.2L, NEFT from Globex +₹85K · Mar 22: Electricity Bill −₹12K',
  'None — read-only',
  "TODAY'S MOVEMENTS section only appears when isCurrentPeriod=true. Shows timestamped transactions and net flow.",
], cols2.length);

addDataRow(ws2, [
  3, 'w2-pnl-compressed', 'P&L Summary', 'P&L Summary card (Overview)',
  'THIS PERIOD: Revenue ₹45L → COGS ₹26.5L → Gross Profit ₹18.5L (41% badge) → OpEx ₹6.5L → Operating Profit ₹12L',
  'VS LAST MONTH: Table with metric | This Month | Last Month | Change · Revenue ₹45L vs ₹42L (+7.1%), GP ₹18.5L vs ₹17.2L (+7.6%), OpEx ₹6.5L vs ₹6.3L (+3.2%), Op Profit ₹12L vs ₹10.9L (+10.1%)',
  '—', 'None — read-only', 'None',
], cols2.length);

addDataRow(ws2, [
  4, 'w3-rev-spark, w8-rev-full', 'Revenue Trend', 'Revenue Trend card (Overview)',
  'CURRENT PERIOD: ₹45L this month · ↑ 7.1% vs last month pill',
  'MONTHLY BREAKDOWN: Table with Month | Revenue | MoM Change · 6 months (Jan–Jun 2024)',
  'TOP CUSTOMERS THIS MONTH: Acme Corp ₹12L 26.7%, Globex Inc ₹8.5L 18.9%, Soylent Corp ₹4.2L 9.3%',
  'None — read-only', 'None',
], cols2.length);

addDataRow(ws2, [
  5, 'w10-rev-vs-exp', 'Revenue vs Expense', 'Rev vs Exp card (Overview)',
  'SUMMARY: 3-col grid: Revenue ₹45L ↑7.1%, Expense ₹33L ↑3.8%, Net Surplus ₹12L ↑26.7%',
  'MONTHLY BREAKDOWN: Table with Month | Revenue | Expense | Net Surplus | Margin · 6 months',
  'EXPENSE BY CATEGORY: Table with Category | Amount | % of Expense · COGS ₹26.5L 80%, Salaries ₹3.2L 10%, Rent ₹1.2L 4%, Marketing ₹95K 3%, Other ₹1.15L 3% · Total ₹33L',
  'None — read-only', 'None',
], cols2.length);

addDataRow(ws2, [
  6, 'w11-exp-breakdown', 'Expense Breakdown', 'Expense Breakdown card (Overview)',
  'BY CATEGORY: Table with Category | Amount | % | VS LM · COGS ₹26.5L 81.5% +2.1%, Salaries ₹3.58L 11% +1.5%, Infra ₹97.5K 3% flat, Marketing ₹1.3L 4% +8.3%, Other ₹32.5K 1% flat. Clickable rows.',
  'SUB-BREAKDOWN — [selected category]: Sub-items table. E.g. COGS → Purchase Accounts ₹22L 83%, Direct Expenses ₹4.5L 17%',
  '—',
  'Category rows are clickable — selecting a category updates the sub-breakdown section below. Default: COGS.',
  'None',
], cols2.length);

addDataRow(ws2, [
  7, 'w12-cash-flow', 'Cash Inflow vs Outflow', 'Cash Inflow card (Overview)',
  '(Not a dedicated panel — opens generic panel content for w12-cash-flow)',
  '—', '—', '—', '—',
], cols2.length);

addDataRow(ws2, [
  8, 'w4-dso, w15-dso, w15-dso-full', 'Days Sales Outstanding', 'DSO card (Payables tab)',
  'METRIC: 45 days · ↑12% vs last month (red pill) · Target: 40 days · "15 days above target" overdue badge',
  'CUSTOMER CONTRIBUTION: Table with Customer | Contrib | Avg Days | Outstanding · Acme Corp 14d/31%/67d/₹2.1L, Soylent 8d/18%/43d/₹1.2L, Globex 6d/13%/38d/₹90K, Others 17d/38%/—/₹4.3L · Total 45d/100%/—/₹8.6L',
  'TREND — LAST 3 MONTHS: Table Apr 38d, May 41d (+7.9%), Jun 45d (+9.8%) · Warning: "DSO has risen 3 consecutive months."',
  'None — read-only',
  'None',
], cols2.length);

addDataRow(ws2, [
  9, 'w5-dpo, w19-dpo, w19-dpo-full', 'Days Payable Outstanding', 'DPO card (Payables tab)',
  'METRIC: 38 days · ↓5% vs last month (grey pill) · Target range: 30–45 days · "Within target range" positive badge',
  'VENDOR CONTRIBUTION: Table with Vendor | Contrib | Avg Days | Outstanding · Vendor X 12d/32%/45d/₹2.1L, Supplier Y 8d/21%/38d/₹1.4L, Agency Z 5d/13%/32d/₹80K, Others 13d/34%/—/₹2.95L · Total 38d/100%/—/₹7.25L',
  'TREND — LAST 3 MONTHS: Table Apr 42d, May 40d (↓4.8%), Jun 38d (↓5.0%) · Warning: "DPO is declining but remains within target floor (30 days)."',
  'None — read-only',
  'None',
], cols2.length);

addDataRow(ws2, [
  10, 'w6-upcoming, w13-upcoming-cash, w22-upcoming-ap', 'Upcoming Payments', 'Upcoming Payments card (Payables tab)',
  'OVERDUE: ₹3.45L · 12 bills · Table: Vendor X #1042 ₹1.4L 14d overdue, Supplier Y #892 ₹90K 11d, Agency Z #331 ₹72K 9d, Petty Cash #112 ₹43K 6d · "+ 8 more bills — ₹2L total"',
  'DUE IN 0–7 DAYS: ₹1.8L · 5 bills · Table: Vendor A #205 ₹60K Due 2 Nov, Vendor B #301 ₹75K Due 4 Nov, Vendor C #144 ₹45K Due 6 Nov · "+ 2 more bills"',
  'DUE IN 8–15 DAYS: ₹4.2L · 8 bills · Table: Vendor D #408 ₹1.2L Due 9 Nov, Vendor E #519 ₹90K Due 12 Nov, Vendor F #312 ₹60K Due 15 Nov · "+ 5 more bills"',
  'None — read-only',
  'None',
], cols2.length);

addDataRow(ws2, [
  11, 'w9-top-customers', 'Top Customers', 'Top Customers card (Overview)',
  'RANKINGS — BY REVENUE: Table # | Customer | Revenue | Share | VS LM · Acme ₹12L 26.7% ↑8.2%, Globex ₹8.5L 18.9% ↑3.1%, Soylent ₹4.2L 9.3% ↓2.4%, Initech ₹1.8L 4.0% ↑0.9%, Others ₹18.5L 41.1% · Clickable rows with highlight',
  'OPEN INVOICES — [SELECTED CUSTOMER]: Table with Invoice | Amount | Due Date | Status · E.g. Acme Corp: INV-2241 ₹2.1L 15 Oct Overdue 30d, INV-2318 ₹3.2L 12 Nov Due in 12d, INV-2401 ₹6.7L 30 Nov Due in 30d',
  '—',
  'Customer rows are interactive — clicking a customer row highlights it and updates the OPEN INVOICES section below. Default selection: Acme Corp.',
  'None',
], cols2.length);

addDataRow(ws2, [
  12, 'w14-ar-out', 'AR Outstanding', 'AR Outstanding card (Payables tab)',
  "TODAY'S ACTIVITY (conditional): 3-col grid: Collected ₹2.1L (green), New Invoices ₹80K (grey), Net Change ↓₹1.3L (green)",
  'SUMMARY: 3-col grid: Total AR ₹18.5L, Overdue ₹4.2L (8 invoices, red), Avg Age 42 days',
  'OPEN INVOICES: Table Customer | Invoice | Amount | Due Date | Status · 7 rows: 3 overdue (Acme, Soylent, Globex), 4 due (Initech, Umbrella, Acme, Soylent) · "Advance payments received: ₹0"',
  'None — read-only',
  "TODAY'S ACTIVITY section only shows when isCurrentPeriod=true. Shows collected, new invoices, and net change for today.",
], cols2.length);

addDataRow(ws2, [
  13, 'w16-ar-aging', 'AR Aging', 'AR Aging card (Payables tab)',
  'BUCKET SUMMARY: Table Bucket | Invoices | Amount | % Total AR · Current 22/₹14.3L/77.3%, 1–30d 3/₹2.1L/11.4%, 31–60d 2/₹1.2L/6.5%, 61–90d 1/₹65K/3.5%, 90+ 1/₹25K/1.4% · Total 29/₹18.5L/100%',
  'ALL OVERDUE INVOICES: Table Customer | Invoice | Amount | Days Overdue · Acme INV-2241 ₹2.1L 30d, Soylent INV-2198 ₹1.2L 23d, Globex INV-2187 ₹90K 17d, Acme INV-2089 ₹65K 68d, Soylent INV-1998 ₹25K 94d',
  '—', 'None — read-only', 'None',
], cols2.length);

addDataRow(ws2, [
  14, 'w18-ap-out', 'AP Outstanding', 'AP Outstanding card (Payables tab)',
  'SUMMARY: 3-col grid: Total AP ₹9.45L, Overdue ₹3.45L (12 bills, red), Largest Vendor: Vendor X ₹4L',
  'OPEN BILLS: Table Vendor | Bill No | Amount | Due Date | Status · 7 rows: 4 overdue (Vendor X, Supplier Y, Agency Z, Petty Cash), 3 due · "Vendor advances paid: ₹0"',
  '—', 'None — read-only', 'None',
], cols2.length);

addDataRow(ws2, [
  15, 'w20-ap-aging', 'AP Aging', 'AP Aging card (Payables tab)',
  'BUCKET SUMMARY: Table Bucket | Bills | Amount | % Total AP · Current 18/₹6.1L/64.6%, 1–30d 6/₹1.6L/16.9%, 31–60d 4/₹1.05L/11.1%, 61–90d 3/₹52K/5.5%, 90+ 1/₹18K/1.9% · Total 32/₹9.45L/100%',
  'ALL OVERDUE BILLS: Table Vendor | Bill No | Amount | Due Date | Days Overdue · 7 rows from Vendor X, Supplier Y, Agency Z, Petty Cash · Oldest: Vendor X BL-198 77d',
  '—', 'None — read-only', 'None',
], cols2.length);

addDataRow(ws2, [
  16, 'w21-vendor-spend', 'Vendor Spend Concentration', 'Vendor Spend card (Payables tab)',
  'TOP VENDORS: Table # | Vendor | Billed | Share | VS LM · Vendor X ₹4L 42.3% ↑5.2%, Supplier Y ₹2.5L 26.5% ↓1.8%, Agency Z ₹1.5L 15.9% ↑0.4%, Others ₹1.45L 15.3% · Clickable rows · "Vendor X accounts for 42.3% of total billed spend" warning',
  'BILLS — [SELECTED VENDOR]: Table Bill No | Amount | Date | Status · E.g. Vendor X: BL-441 ₹1.4L Overdue 14d, BL-519 ₹2.6L Due 8d · "Total billed this month: ₹4L across 2 bills"',
  '—',
  'Vendor rows are interactive — clicking a vendor row highlights it and updates the BILLS section. Default: Vendor X. Concentration warning appears for Vendor X (42.3%).',
  'None',
], cols2.length);


// ═══════════════════════════════════════════════════════════════════════════════
// SHEET 3: DATE FILTER IMPACT
// ═══════════════════════════════════════════════════════════════════════════════
const ws3 = wb.addWorksheet('Date Filter Impact', { views: [{ state: 'frozen', ySplit: 1 }] });

const cols3 = [
  { header: '#', width: 4 },
  { header: 'Widget', width: 24 },
  { header: 'Tab', width: 14 },
  { header: 'isCurrentPeriod Check?', width: 14 },
  { header: 'When dateTo ≥ 2026-03-24 (Current Period)', width: 44 },
  { header: 'When dateTo < 2026-03-24 (Past Period)', width: 44 },
  { header: 'Does Data Change with dateFrom/dateTo?', width: 36 },
  { header: 'Notes', width: 36 },
];
ws3.columns = cols3;
styleHeaders(ws3, cols3.length);

addSectionRow(ws3, 'OVERVIEW TAB', cols3.length);

addDataRow(ws3, [
  1, 'Gross Profit', 'Overview', 'Yes',
  'Shows TodayVsYesterday strip: Today ₹18.5L | Yesterday ₹17.2L | ↑₹1.3L. Strip appears below KPI header divider.',
  'TodayVsYesterday strip hidden. Only sparkline + KPI header visible.',
  'No — data is hardcoded. In production: revenue/COGS would be filtered by dateFrom–dateTo, sparkline would show months in range.',
  'isCurrentPeriod = dateTo >= "2026-03-24". The today vs yesterday data is hardcoded demo data.',
], cols3.length);

addDataRow(ws3, [
  2, 'Cash Balance', 'Overview', 'Yes',
  'Header shows 3-cell comparison strip: TODAY ₹12.45L | YESTERDAY ₹12.0L | ↑₹45K on green-tinted background.',
  'Header shows simple pill: "↑ 8.5% vs last month" (rounded green pill).',
  'No — account balances hardcoded. In production: would show closing balance as-of dateTo.',
  'Two completely different rendering paths for current vs past period in the header zone.',
], cols3.length);

addDataRow(ws3, [
  3, 'Revenue vs Expense', 'Overview', 'No',
  'Same 6-month bar chart + net income line. No conditional elements.',
  'Same as current period.',
  'No — 6-month data (Oct–Mar) is hardcoded. In production: bars would filter to dateFrom–dateTo range.',
  'This widget has no isCurrentPeriod behavior at all.',
], cols3.length);

addDataRow(ws3, [
  4, 'P&L Summary', 'Overview', 'No',
  'Same waterfall: Revenue → COGS → GP → OpEx → Net Profit.',
  'Same as current period.',
  'No — waterfall data hardcoded. In production: P&L would aggregate the dateFrom–dateTo period.',
  'No isCurrentPeriod-specific elements.',
], cols3.length);

addDataRow(ws3, [
  5, 'Cash Inflow vs Outflow', 'Overview', 'Yes',
  '(1) DailyPulseBadge "Net +₹12K today" appears in title bar. (2) Today vs Yesterday NET strip appears right-aligned in legend row: TODAY NET +₹12K | YESTERDAY NET +₹8K.',
  'Both DailyPulseBadge and Today vs Yesterday strip hidden. Only chart + legend dots visible.',
  'No — area chart data is static per grain. In production: data would filter to dateFrom–dateTo range for each grain.',
  'Two conditional elements both gated on isCurrentPeriod. Grain toggle (Day/Week/Month) works in both modes.',
], cols3.length);

addDataRow(ws3, [
  6, 'Expense Breakdown', 'Overview', 'No',
  'Same category list with progress bars.',
  'Same as current period.',
  'No — category data hardcoded. In production: expenses would aggregate dateFrom–dateTo.',
  'No isCurrentPeriod-specific elements.',
], cols3.length);

addDataRow(ws3, [
  7, 'AI Insights', 'Overview', 'No',
  'Same 3 accordion items (critical, watch, positive).',
  'Same as current period.',
  'No — insights are static. In production: AI would regenerate insights based on the selected date range.',
  'Non-clickable card (disablePanel). No date-aware behavior.',
], cols3.length);

addDataRow(ws3, [
  8, 'Revenue Trend', 'Overview', 'No',
  'Same AreaChart data per grain. No conditional elements.',
  'Same as current period.',
  'No — data hardcoded per grain. In production: grain data would respect dateFrom–dateTo window.',
  'Grain toggle (Day/Week/Month) works in all periods. KPI amount changes per grain selection.',
], cols3.length);

addDataRow(ws3, [
  9, 'Top Customers', 'Overview', 'No',
  'Same 4 customer bars with trend badges.',
  'Same as current period.',
  'No — customer data hardcoded. In production: customer revenue would aggregate dateFrom–dateTo.',
  'No isCurrentPeriod-specific elements.',
], cols3.length);

addSectionRow(ws3, 'PAYABLES & RECEIVABLES TAB', cols3.length);

addDataRow(ws3, [
  10, 'AR Outstanding', 'P&R', 'Yes',
  'Shows DailyPulseBadge "↓ ₹2.1L collected" (green border) below OverdueBadge.',
  'DailyPulseBadge hidden. Only KPI + OverdueBadge + TrendBadge visible.',
  'No — hardcoded. In production: AR balance as-of dateTo, overdue calculated from due dates.',
  'DailyPulseBadge is the only conditional element.',
], cols3.length);

addDataRow(ws3, [
  11, 'DSO', 'P&R', 'No',
  'Same: 45 days + TargetPill "Target: 30 days" + TrendBadge ↑12%.',
  'Same as current period.',
  'No — hardcoded. In production: DSO calculated from AR and revenue for the dateFrom–dateTo period.',
  'No isCurrentPeriod behavior.',
], cols3.length);

addDataRow(ws3, [
  12, 'AP Outstanding', 'P&R', 'Yes',
  'Shows DailyPulseBadge "↓ ₹50K paid" (grey/neutral border) below OverdueBadge.',
  'DailyPulseBadge hidden. Only KPI + OverdueBadge + TrendBadge visible.',
  'No — hardcoded. In production: AP balance as-of dateTo.',
  'DailyPulseBadge is the only conditional element.',
], cols3.length);

addDataRow(ws3, [
  13, 'DPO', 'P&R', 'No',
  'Same: 38 days + WithinTargetPill + TrendBadge ↓5%.',
  'Same as current period.',
  'No — hardcoded. In production: DPO calculated from AP and COGS for the period.',
  'No isCurrentPeriod behavior.',
], cols3.length);

addDataRow(ws3, [
  14, 'AR Aging', 'P&R', 'No',
  'Same horizontal stacked bar. 23% overdue badge.',
  'Same as current period.',
  'No — aging bucket data hardcoded. In production: buckets calculated based on invoice due dates as-of dateTo.',
  'No isCurrentPeriod behavior.',
], cols3.length);

addDataRow(ws3, [
  15, 'AP Aging', 'P&R', 'No',
  'Same horizontal stacked bar. 36% overdue badge.',
  'Same as current period.',
  'No — aging bucket data hardcoded. In production: same logic as AR Aging but for bills.',
  'No isCurrentPeriod behavior.',
], cols3.length);

addDataRow(ws3, [
  16, 'Upcoming Payments', 'P&R', 'No',
  'Same 3 buckets (Overdue, 0–7d, 8–15d). LIVE badge always shown.',
  'Same as current period.',
  'No — hardcoded. In production: overdue threshold relative to dateTo, upcoming windows relative to dateTo.',
  'LIVE badge is not conditional on isCurrentPeriod — always visible.',
], cols3.length);

addDataRow(ws3, [
  17, 'Vendor Spend', 'P&R', 'No',
  'Same 4 vendor rows with progress bars.',
  'Same as current period.',
  'No — hardcoded. In production: vendor spend aggregated for dateFrom–dateTo.',
  'No isCurrentPeriod behavior.',
], cols3.length);


// ═══════════════════════════════════════════════════════════════════════════════
// SHEET 4: JTBD MAPPING
// ═══════════════════════════════════════════════════════════════════════════════
const ws4 = wb.addWorksheet('JTBD Mapping', { views: [{ state: 'frozen', ySplit: 1 }] });

const cols4 = [
  { header: '#', width: 4 },
  { header: 'Job to Be Done', width: 40 },
  { header: 'Primary Widget', width: 24 },
  { header: 'Primary Tab', width: 16 },
  { header: 'Supporting Widgets', width: 36 },
  { header: 'Panel Drill-Down', width: 40 },
  { header: 'How User Completes the Job', width: 50 },
];
ws4.columns = cols4;
styleHeaders(ws4, cols4.length);

const jtbds = [
  [1, 'Know gross profit this month',
    'Gross Profit (w7-gross-profit)', 'Overview',
    'P&L Summary (w2-pnl-compressed) — shows GP as waterfall step',
    'Gross Profit panel: Deep dive with Revenue→COGS→GP waterfall, top products contributing to profit',
    'User sees ₹18.5L + 41% margin + +7.6% trend on card. Clicks → panel shows waterfall breakdown and product-level profit drivers. Today vs Yesterday strip gives intra-day context.'],
  [2, 'Track revenue vs expense over time',
    'Revenue vs Expense (w10-rev-vs-exp)', 'Overview',
    'Revenue Trend (w8-rev-full) — revenue-only trend with grain toggle',
    'Revenue vs Expense panel: Summary (Revenue/Expense/Net Surplus), Monthly Breakdown table (6 months), Expense by Category table',
    'User sees 6-month bar chart (blue=Revenue, grey=Expense) + green net income line. ₹12L net income highlighted. Clicks → panel shows monthly table and expense category split.'],
  [3, 'Understand expense breakdown',
    'Expense Breakdown (w11-exp-breakdown)', 'Overview',
    'Revenue vs Expense (w10-rev-vs-exp) — shows expense as bar series · P&L Summary (w2-pnl-compressed) — shows OpEx in waterfall',
    'Expense Breakdown panel: Category table (COGS, Salaries, Infra, Marketing, Other) with % and VS LM columns. Click category → sub-breakdown.',
    'User sees ₹6.5L total + 5 color-coded category bars. Clicks → panel shows full table. Clicks "COGS" row → sub-items expand (Purchase Accounts, Direct Expenses).'],
  [4, 'Read the key P&L lines quickly',
    'P&L Summary (w2-pnl-compressed)', 'Overview',
    'Gross Profit (w7-gross-profit) — shows GP line · Expense Breakdown (w11-exp-breakdown) — shows OpEx detail',
    'P&L Summary panel: Full period P&L (Revenue→COGS→GP→OpEx→Operating Profit) with sub-lines + VS LAST MONTH comparison table',
    'User sees waterfall chart: Revenue ₹45L → COGS ₹26.5L → GP ₹18.5L → OpEx ₹6.5L → Net Profit ₹12L. Clicks → panel shows line-by-line P&L with sub-items and month-over-month comparison.'],
  [5, 'See sales trend over time',
    'Revenue Trend (w8-rev-full)', 'Overview',
    'Revenue vs Expense (w10-rev-vs-exp) — 6-month revenue bars',
    'Revenue Trend panel: Current period KPI + monthly breakdown table + top customers this month',
    'User selects Day/Week/Month grain. Sees area chart with dots. KPI updates dynamically (₹2.3L/₹10.2L/₹45L). Clicks → panel shows month-by-month revenue with MoM % change.'],
  [6, 'Know top customers by revenue',
    'Top Customers (w9-top-customers)', 'Overview',
    'Revenue Trend panel has "Top Customers This Month" section',
    'Top Customers panel: Rankings table (5 customers) with interactive row selection → Open Invoices table shows invoices for selected customer with status badges',
    'User sees 4 customer bars with trend badges. Clicks → panel shows ranking table with share %. Clicks a customer row → invoice list appears below with overdue/due status per invoice.'],
  [7, 'See the cash flow statement quickly',
    'Cash Inflow vs Outflow (w12-cash-flow)', 'Overview',
    'Cash Balance (w10-cash-full) — current position',
    '(Generic panel content for w12-cash-flow)',
    'User sees stacked area chart (blue inflow, grey outflow) with Day/Week/Month toggle. Daily Pulse badge shows "Net +₹12K today". Hover any point → tooltip shows Inflow + Outflow + Net. Today vs Yesterday strip in legend.'],
  [8, 'Know which reports are ready',
    'AI Insights (w-ai-insights)', 'Overview',
    'All other widgets — insights reference data from multiple widgets',
    'No panel — non-clickable card. Insights expand/collapse in-place.',
    'User sees 3 insights with severity dots (red/amber/green). Clicks row → expands to show: What we found, Why it matters, Suggested review, Based on. Each insight cross-references specific widget data.'],
  [9, 'See current cash and bank balance',
    'Cash Balance (w10-cash-full)', 'Overview',
    'Cash Inflow vs Outflow (w12-cash-flow) — shows flow that affects balance',
    "Cash Balance panel: Accounts table (HDFC ₹8.2L, SBI ₹4.25L), Today's Movements (conditional: timestamped transactions + net flow), Recent Activity (timeline by date)",
    "User sees ₹12.45L on green gradient card with account breakdown below. Today vs Yesterday strip shows daily movement. Clicks → panel shows account details, today's transaction log with timestamps, and recent activity timeline."],
  [10, 'Track cash coming in vs going out',
    'Cash Inflow vs Outflow (w12-cash-flow)', 'Overview',
    'Cash Balance (w10-cash-full) — net position · Upcoming Payments (w22-upcoming-ap) — outflows pending',
    '(Generic panel content)',
    'User toggles Day/Week/Month. Area chart shows inflow (blue) vs outflow (grey) curves. Tooltip shows per-point breakdown. DailyPulseBadge + Today vs Yesterday NET strip provide real-time context.'],
  [11, 'Know payments due soon',
    'Upcoming Payments (w22-upcoming-ap)', 'Payables & Receivables',
    'AP Outstanding (w18-ap-out) — total payables · AP Aging (w20-ap-aging) — aging buckets',
    'Upcoming Payments panel: 3 sections (Overdue, 0–7d, 8–15d) each with vendor/bill table, amounts, due dates, and "+ N more bills" overflow',
    'User sees 3 stacked buckets with LIVE badge: Overdue ₹3.45L (12 bills), Due 0–7d ₹1.8L (5 bills), Due 8–15d ₹4.2L (8 bills). Clicks → panel shows detailed bill-level tables per bucket.'],
  [12, 'See total outstanding receivables',
    'AR Outstanding (w14-ar-out)', 'Payables & Receivables',
    'AR Aging (w16-ar-aging) — aging buckets · DSO (w15-dso) — collection efficiency',
    "AR Outstanding panel: Today's Activity (conditional: Collected/New Invoices/Net Change), Summary (Total AR/Overdue/Avg Age), Open Invoices table (7 invoices with customer, amount, due date, status)",
    'User sees ₹18.5L with overdue badge (₹4.2L · 8 invoices). DailyPulseBadge shows collection activity. Clicks → panel shows today\'s activity grid, summary KPIs, and full invoice list with status badges.'],
  [13, 'Know DSO and what is driving it',
    'DSO (w15-dso)', 'Payables & Receivables',
    'AR Outstanding (w14-ar-out) — underlying AR balance · AR Aging (w16-ar-aging) — distribution',
    'DSO panel: Metric (45 days, target, "15 days above target" badge), Customer Contribution table (who drives DSO), 3-month trend table with warning',
    'User sees 45 days + Target: 30 days pill + ↑12% trend (red). Clicks → panel shows customer-level DSO contribution (Acme 14d/31%, Soylent 8d/18%, etc.) and 3-month trend with "DSO has risen 3 consecutive months" warning.'],
  [14, 'See which customers are overdue and for how long',
    'AR Aging (w16-ar-aging)', 'Payables & Receivables',
    'AR Outstanding (w14-ar-out) — total + invoice list · DSO (w15-dso) — aggregate metric',
    'AR Aging panel: Bucket Summary table (5 buckets with invoice count, amount, % total), All Overdue Invoices table (5 invoices sorted by days overdue)',
    'User sees horizontal stacked bar: green (77% current) → yellow → orange → red (90+ days). 23% overdue badge. Hover → tooltip per bucket. Clicks → panel shows bucket table and full list of overdue invoices sorted by severity.'],
  [15, 'See total outstanding payables',
    'AP Outstanding (w18-ap-out)', 'Payables & Receivables',
    'AP Aging (w20-ap-aging) — aging buckets · DPO (w19-dpo) — payment efficiency · Upcoming Payments (w22-upcoming-ap) — due dates',
    'AP Outstanding panel: Summary (Total AP/Overdue/Largest Vendor), Open Bills table (7 bills with vendor, bill no, amount, due date, status)',
    'User sees ₹9.45L with overdue badge (₹3.45L · 12 bills). DailyPulseBadge shows payment activity (conditional). Clicks → panel shows summary grid and full bill list with overdue/due badges.'],
  [16, 'Know DPO and what is driving it',
    'DPO (w19-dpo)', 'Payables & Receivables',
    'AP Outstanding (w18-ap-out) — underlying AP balance · AP Aging (w20-ap-aging) — distribution',
    'DPO panel: Metric (38 days, target range 30–45, "Within target" badge), Vendor Contribution table, 3-month trend with "DPO declining but within target" warning',
    'User sees 38 days + "Within target" green pill + ↓5% trend. Clicks → panel shows vendor-level DPO contribution (Vendor X 12d/32%, Supplier Y 8d/21%, etc.) and 3-month trend.'],
  [17, 'See supplier payments overdue or due soon',
    'AP Aging (w20-ap-aging)', 'Payables & Receivables',
    'Upcoming Payments (w22-upcoming-ap) — timeline view · AP Outstanding (w18-ap-out) — total view',
    'AP Aging panel: Bucket Summary table (5 buckets with bill count, amount, % total), All Overdue Bills table (7 bills sorted by days overdue, oldest: 77d)',
    'User sees horizontal stacked bar: blue (64% current) → light blue → yellow → red. 36% overdue badge. Hover → tooltip. Clicks → panel shows bucket table and full overdue bills list.'],
  [18, 'Know top vendors by spend',
    'Vendor Spend (w21-vendor-spend)', 'Payables & Receivables',
    'AP Outstanding (w18-ap-out) — total AP context',
    'Vendor Spend panel: Top Vendors table (interactive rows, 4 vendors with share % and VS LM), Bills for selected vendor with status badges, concentration warning for top vendor',
    'User sees 4 ranked vendors with gradient progress bars. Clicks a row → panel shows vendor ranking with spend share. Clicks vendor row → bill list updates. Concentration warning for Vendor X (42.3%).'],
];

jtbds.forEach(row => addDataRow(ws4, row, cols4.length));


// ═══════════════════════════════════════════════════════════════════════════════
// SHEET 5: COMPONENT INVENTORY
// ═══════════════════════════════════════════════════════════════════════════════
const ws5 = wb.addWorksheet('Component Inventory', { views: [{ state: 'frozen', ySplit: 1 }] });

const cols5 = [
  { header: '#', width: 4 },
  { header: 'Component', width: 24 },
  { header: 'File', width: 42 },
  { header: 'Type', width: 16 },
  { header: 'Used In', width: 30 },
  { header: 'Purpose', width: 40 },
];
ws5.columns = cols5;
styleHeaders(ws5, cols5.length);

addSectionRow(ws5, 'LAYOUT COMPONENTS', cols5.length);

const components = [
  [1, 'DashboardLayout', 'src/components/layout/DashboardLayout.tsx', 'Layout shell', 'App.tsx', 'AppShell with header (wordmark, org, nav tabs, date picker), main content area, and SidePanel overlay. Controls paddingRight transition when panel opens.'],
  [2, 'SidePanel', 'src/components/layout/SidePanel.tsx', 'Overlay panel', 'DashboardLayout', 'Fixed 420px right panel. Renders PanelReport per activeWidgetId. Header (title, close), ScrollArea body. Slide-in/out with CSS transform.'],
  [3, 'WidgetCard', 'src/components/widgets/WidgetCard.tsx', 'Card container', 'OverviewTab, PayablesTab', 'Grid-spanning card wrapper. Props: id, title, colSpan, status, titleExtra, disablePanel, summaryData. Handles hover shadow/lift, click→openPanel.'],
  [4, 'KPIGrid', 'src/components/widgets/KPIGrid.tsx', 'Grid layout', 'OverviewTab, PayablesTab', 'CSS Grid container: 12 columns, auto rows, 20px gap. All WidgetCards are direct children.'],
  [5, 'KpiCard', 'src/tabs/PayablesTab.tsx (inline)', 'Sub-card', 'PayablesTab Row 1', 'Compact KPI card with label, value, children slots. Used inside the transparent AR/AP wrapper WidgetCard.'],
];
components.forEach(row => addDataRow(ws5, row, cols5.length));

addSectionRow(ws5, 'SHARED UI COMPONENTS', cols5.length);

const shared = [
  [6, 'TrendBadge', 'src/components/shared/TrendBadge.tsx', 'Badge', 'OverviewTab, PayablesTab', 'Delta badge: arrow icon + percentage + label. Auto-determines sentiment from type (revenue/cash/profit = up=positive; dso/ar_overdue/ap_overdue = up=negative).'],
  [7, 'DailyPulseBadge', 'src/tabs/OverviewTab.tsx (inline)', 'Badge', 'OverviewTab, PayablesTab', 'Border-only pill showing real-time daily activity. 3 sentiments: positive (green), negative (red), neutral (grey). Only shown when isCurrentPeriod.'],
  [8, 'TodayVsYesterday', 'src/tabs/OverviewTab.tsx (inline)', 'Comparison strip', 'OverviewTab (3 widgets)', '3-cell grid: TODAY value | YESTERDAY value | delta badge. Used in Gross Profit, Cash Balance, Cash Inflow. Only shown when isCurrentPeriod.'],
  [9, 'GrainToggle', 'src/components/shared/GrainToggle.tsx', 'Toggle', 'OverviewTab', 'Day/Week/Month segmented control. Used in Revenue Trend and Cash Inflow widgets.'],
  [10, 'AIInsightsAccordion', 'src/components/shared/AIInsightsAccordion.tsx', 'Accordion', 'OverviewTab', 'Expandable insights with severity dots (critical/watch/positive), source tags, and 4-section expanded detail.'],
  [11, 'OverdueBadge', 'src/tabs/PayablesTab.tsx (inline)', 'Badge', 'PayablesTab', 'Red background badge showing overdue amount + count. E.g. "₹4.2L overdue · 8 invoices".'],
  [12, 'TargetPill', 'src/tabs/PayablesTab.tsx (inline)', 'Badge', 'PayablesTab', 'Grey pill showing target metric. E.g. "Target: 30 days".'],
  [13, 'WithinTargetPill', 'src/tabs/PayablesTab.tsx (inline)', 'Badge', 'PayablesTab', 'Green pill showing "Within target" status.'],
  [14, 'AgingHorizontalBar', 'src/tabs/PayablesTab.tsx (inline)', 'Chart', 'PayablesTab', 'Recharts layout="vertical" horizontal stacked bar with 5 aging buckets. barSize=44. LabelList for ≥8% inside labels. Grid legend below.'],
  [15, 'AgingTooltip', 'src/tabs/PayablesTab.tsx (inline)', 'Tooltip', 'PayablesTab', 'Custom Recharts tooltip for aging bars: color dot + bucket label + amount + percentage.'],
  [16, 'StateOverlays', 'src/components/shared/StateOverlays.tsx', 'Overlays', 'WidgetCard', 'LoadingState, EmptyState, ErrorState overlays rendered by WidgetCard based on status prop.'],
];
shared.forEach(row => addDataRow(ws5, row, cols5.length));

addSectionRow(ws5, 'CONTEXT & UTILITIES', cols5.length);

const utils = [
  [17, 'DashboardContext', 'src/context/DashboardContext.tsx', 'React Context', 'All components', 'Global state: activeTab, dateFrom/dateTo, isCurrentPeriod, isPanelOpen, activeWidgetId, panelView, panelData, openPanel/closePanel.'],
  [18, 'formatCurrency', 'src/utils/formatters.ts', 'Utility', 'All data display', 'Indian number formatting: <₹1L → full number with commas, ≥₹1L → ₹XL, ≥₹1Cr → ₹XCr.'],
];
utils.forEach(row => addDataRow(ws5, row, cols5.length));


// ═══════════════════════════════════════════════════════════════════════════════
// Write file
// ═══════════════════════════════════════════════════════════════════════════════
const outPath = '/workspaces/aia-dashboard/AIA_Dashboard_Widget_Audit.xlsx';
await wb.xlsx.writeFile(outPath);
console.log(`✅ Written to ${outPath}`);
console.log(`   Sheets: ${wb.worksheets.map(s => s.name).join(', ')}`);
