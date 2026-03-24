# AIA Financial Dashboard — Product Requirements Document

**Version:** 2.0
**Date:** 2026-03-24
**Status:** Final

---

## 1. Product Overview

AIA Financial Dashboard is a single-page web application that gives accountants and business owners a real-time view of their company's financial health. The dashboard aggregates data from accounting systems (QuickBooks, Tally, etc.) and presents it as interactive KPI cards, charts, and an AI-generated insights layer.

### 1.1 Goals
- Surface the most critical financial metrics at a glance without requiring the user to run reports
- Enable drill-down from summary KPIs to invoice/bill-level detail via a side panel
- Provide AI-generated commentary that contextualises trends and flags anomalies
- Support multi-period analysis via a global date range picker

### 1.2 Non-Goals
- This dashboard does not allow editing transactions
- It does not replace the accounting system; it is read-only
- It does not support mobile or tablet breakpoints in v1

---

## 2. User Personas

| Persona | Role | Primary Goal |
|---|---|---|
| Priya | Senior Accountant | Monitor DSO/DPO, identify overdue invoices, prepare month-end reports |
| Rahul | CFO / Business Owner | Track cash position, gross margin, revenue trends at a weekly glance |
| Sneha | Accounts Payable Manager | Manage vendor bills, spot AP aging issues, ensure timely payments |

---

## 3. Information Architecture

```
App
├── Header (global shell)
│   ├── Wordmark: "AIA / Accountant"
│   ├── Org selector: "Acme Corp" (static in v1)
│   ├── Nav tabs: Overview | Payables & Receivables
│   └── Date range picker: From [date] — To [date]
├── Overview Tab
│   ├── Row 1: Gross Profit (3col) | Cash Balance (3col) | Revenue vs Expense (6col)
│   ├── Row 2: P&L Summary (3col) | Cash Inflow vs Outflow (6col) | Expense Breakdown (3col)
│   ├── Row 3: AI Insights (12col, non-clickable)
│   └── Row 4: Revenue Trend (5col) | Top Customers by Revenue (4col) | Upcoming Payments (3col)
├── Payables & Receivables Tab
│   ├── Row 1: AR Outstanding (3col) | DSO (3col) | AP Outstanding (3col) | DPO (3col)
│   ├── Row 2: AR Aging (6col) | AP Aging (6col)
│   └── Row 3: Vendor Spend Concentration (12col)
└── Side Panel (global overlay, 420px, right-anchored)
    └── Per-widget detail views (see Section 7)
```

---

## 4. Global Shell

### 4.1 Header

- **Height:** 56px
- **Background:** White (#FFFFFF)
- **Border-bottom:** 1px solid #E5E7EB
- **z-index:** 200 (above main content, below modals)
- **Layout:** Horizontal flex, space-between, no wrap

#### 4.1.1 Left Group (brand → org → nav)

**Wordmark block**
- Primary text: "AIA" — Albert Sans 800, 18px, #0F1117, letter-spacing -0.04em
- Secondary text: "Accountant" — Space Grotesk 600, 10px, #9CA3AF, uppercase, letter-spacing 0.1em
- Right padding: 20px

**Org selector (static v1)**
- Avatar: 24×24px square, #2563EB fill, border-radius 4px, white "A" text (Space Grotesk 600, 12px)
- Name: "Acme Corp" — Space Grotesk 500, 13px, #374151
- Left/right padding: 16px; right border: 1px solid #E5E7EB; full header height

**Nav tabs**
- Items: "Overview" (IconLayoutDashboard), "Payables & Receivables" (IconReceipt2)
- Tab height: full header height (56px)
- Inactive: Space Grotesk 500, 13px, #6B7280, icon 16px stroke 2
- Active: Space Grotesk 600, 13px, #0F1117
- Active indicator: 2px solid #2563EB strip at bottom edge (border-radius 2px 2px 0 0), spans full tab width
- Hover: color transitions to active state (0.15s ease)
- Click: switches active tab, closes side panel if open

#### 4.1.2 Right Group (date range picker)

- Container: flex row, gap 6px, bg #F9FAFB, border 1px #E5E7EB, border-radius 8px, padding 0 10px, height 34px
- Two native `<input type="date">` elements, Space Grotesk 500, 12px, #0F1117
- Separator: 1px wide × 14px tall, color #E5E7EB
- First input: `max` attribute set to current `to` value
- Second input: `min` attribute set to current `from` value
- Default range: 2026-03-01 → 2026-03-23
- Change: updates global date context; all widgets re-render (in v1: updates date labels only, no actual data filtering)

---

## 5. Overview Tab

### 5.1 Row 1

#### 5.1.1 Gross Profit (w7-gross-profit) — colSpan 3

**Display**
- KPI value: ₹18.5L — Albert Sans 700, 32px, #0F1117
- Sub-label: "41% gross margin" — Space Grotesk 12px, #6B7280
- Trend badge: +2.1% vs last month (positive, green)
- Divider: 1px #E5E7EB, margin 8px 0
- COGS line: "COGS: ₹26.5L" — Space Grotesk 12px, #6B7280

#### 5.1.2 Cash Balance (w10-cash-full) — colSpan 3

**Display**
- KPI value: ₹12.45L — Albert Sans 700, 32px, #0F1117
- Sub-label: "Across 2 accounts" — Space Grotesk 12px, #6B7280
- Account rows:
  - HDFC Current A/c · ₹8.2L
  - SBI Savings A/c · ₹4.25L
  - Each row: account name left, amount right; Space Grotesk 12px; Albert Sans 600 for amount
- Trend badge: +5.2% vs last month (positive, green)

#### 5.1.3 Revenue vs Expense (w10-rev-vs-exp) — colSpan 6

**Display**
- ComposedChart (Recharts): Bar (Revenue, #2563EB) + Bar (Expense, #E5E7EB) + Line (Net, #16A34A)
- X-axis: month labels (Oct–Mar), Space Grotesk 10px, #9CA3AF
- Y-axis: ₹L notation, Space Grotesk 10px, #9CA3AF
- Chart height: 160px
- Legend: Revenue ● Expense ● Net Income, Space Grotesk 11px
- Latest data point: Revenue ₹45L, Expense ₹33L, Net ₹12L

---

### 5.2 Row 2

#### 5.2.1 P&L Summary (w2-pnl-compressed) — colSpan 3

**Display**
- Layout: full card height, rows distributed space-between
- Rows (label left, value right):
  - Revenue — ₹45L
  - COGS — ₹26.5L
  - **Gross Profit — ₹18.5L** (bold, positive green)
  - Operating Expense — ₹6.5L
  - **Operating Profit — ₹12L** (bold, positive green)
- Font: Space Grotesk 13px for labels, Albert Sans 600 for values

#### 5.2.2 Cash Inflow vs Outflow (w12-cash-flow) — colSpan 6

**Display**
- Mantine BarChart, grouped bars: Inflow (#2563EB) + Outflow (#E5E7EB)
- Grain selector: "Monthly" | "Weekly" pill buttons in titleExtra (stops click propagation)
- Chart height: 160px
- Monthly data: Jan(In:38L Out:30L), Feb(In:41L Out:32L), Mar(In:45L Out:33L)
- Weekly data: W1(In:9L Out:7L), W2(In:11L Out:8L), W3(In:12L Out:9L), W4(In:13L Out:9L)

**Interaction**
- Clicking grain pills: updates chart data, does NOT open side panel
- Clicking card body: opens side panel

#### 5.2.3 Expense Breakdown (w11-exp-breakdown) — colSpan 3

**Display**
- Compact vertical list, rows distributed to fill card height
- 5 categories (label left, amount + percentage right):
  - Salaries — ₹18L · 55%
  - Marketing — ₹6.5L · 20%
  - Infrastructure — ₹4.9L · 15%
  - Travel — ₹1.6L · 5%
  - Other — ₹1.6L · 5%
- Progress bar per row: height 3px, #2563EB fill, bg #F9FAFB, border-radius 2px

---

### 5.3 Row 3

#### 5.3.1 AI Insights (full-width) — colSpan 12

**Display**
- Wrapped in WidgetCard with `disablePanel=true` — NOT clickable, no cursor pointer, no side panel
- Card title: empty (no title row rendered)
- Background: white, same card styling as all other widgets

**AIInsightsAccordion structure**
- Header: "AI Insights" label + "3 insights" badge + "Powered by Claude" tag (right-aligned)
- Three independently expandable insight chips:

*Insight 1 — DSO Alert (warning)*
- Chip: "DSO up 12% — Acme Corp contributing 14 days"
- Expanded: "Days Sales Outstanding has increased from 40 to 45 days this month, with Acme Corp accounting for 14 of those days. Their three invoices totalling ₹2.1L are now 18–32 days overdue. Recommend scheduling a follow-up call and reviewing their credit terms."

*Insight 2 — Cash Positive (positive)*
- Chip: "Cash position healthy — ₹12.45L across 2 accounts"
- Expanded: "Your cash balance has grown 5.2% month-over-month, driven by strong collections in the first three weeks of March. HDFC Current Account holds ₹8.2L and SBI Savings holds ₹4.25L. Runway at current burn rate is approximately 4.2 months."

*Insight 3 — AP Risk (critical)*
- Chip: "12 AP bills overdue — ₹3.45L at risk of late fees"
- Expanded: "Twelve vendor bills totalling ₹3.45L are past their due date. Vendor X has the largest outstanding amount at ₹4.00L total. Prioritise clearing bills older than 60 days to avoid late payment penalties, starting with the ₹1.2L Vendor X invoice due 15 days ago."

**Expand/collapse interaction**
- Click insight chip → toggles that insight's Collapse (independent per insight)
- Other insights unaffected; card never opens side panel

---

### 5.4 Row 4

#### 5.4.1 Revenue Trend (w8-rev-full) — colSpan 5

**Display**
- Mantine AreaChart, single series (Revenue, #2563EB, 0.15 opacity fill)
- X-axis: Oct, Nov, Dec, Jan, Feb, Mar
- Y-axis: ₹L notation
- Chart height: 160px
- Data: 32L, 35L, 38L, 40L, 41L, 45L

#### 5.4.2 Top Customers by Revenue (w9-top-customers) — colSpan 4

**Display**
- Table, 4 rows sorted by revenue descending
- Headers: CUSTOMER | REVENUE | SHARE — Space Grotesk 10px 600 #9CA3AF uppercase letter-spacing 0.5px
- Rows:
  - Acme Corp | ₹18L | 40%
  - Beta Ltd | ₹11.25L | 25%
  - Gamma Inc | ₹9L | 20%
  - Others | ₹6.75L | 15%
- Row dividers: 1px #E5E7EB opacity 0.5; Row hover: bg #F9FAFB
- Amount column: right-aligned, Albert Sans 600

#### 5.4.3 Upcoming Payments (w13-upcoming-cash) — colSpan 3

**Display**
- Three summary buckets (no individual bill rows):
  - Overdue: ₹3.45L · 12 bills — critical red badge
  - Due 0–7 days: ₹1.8L · 5 bills — warning amber badge
  - Due 8–15 days: ₹4.2L · 8 bills — neutral badge
- Font: Space Grotesk 13px, #374151

---

## 6. Payables & Receivables Tab

### 6.1 Row 1 — KPI Strip

#### 6.1.1 AR Outstanding (w14-ar-out) — colSpan 3
- KPI: ₹18.5L — Albert Sans 700 32px
- Overdue badge: "₹4.2L overdue · 8 invoices" (bg #FEF2F2, border #FECACA, text #DC2626)
- Trend: +3.2% vs last month (ar_overdue type → red)
- Sub-text: "Avg collection: 42 days"

#### 6.1.2 Days Sales Outstanding (w15-dso) — colSpan 3
- KPI: 45 days — Albert Sans 700 32px
- Status pill: "15 days above target" — negative (red)
- Trend: +12% vs last month (negative)
- Divider
- Sub-text: "Acme Corp contributing 14 days"

#### 6.1.3 AP Outstanding (w18-ap-out) — colSpan 3
- KPI: ₹9.45L — Albert Sans 700 32px
- Overdue badge: "₹3.45L overdue · 12 bills"
- Trend: +8.1% vs last month (ap_overdue type → red)
- Sub-text: "Vendor X — largest at ₹4.00L"

#### 6.1.4 Days Payable Outstanding (w19-dpo) — colSpan 3
- KPI: 38 days — Albert Sans 700 32px
- Status pill: "Within target range" — positive (green)
- Trend: −5% vs last month (dpo type → positive/green)
- Sub-text: "Vendor X ₹2.10L outstanding"

---

### 6.2 Row 2 — Aging Charts

#### 6.2.1 AR Aging (w16-ar-aging) — colSpan 6
- Mantine BarChart, color #2563EB
- Buckets: Current | 1–30 | 31–60 | 61–90 | 90+
- Data: 14.3L | 2.1L | 1.5L | 0.4L | 0.2L
- Chart height: 200px; gridAxis="x"; tickLine="none"

#### 6.2.2 AP Aging (w20-ap-aging) — colSpan 6
- Mantine BarChart, color #6366F1
- Buckets: Current | 1–30 | 31–60 | 61–90 | 90+
- Data: 6.0L | 2.0L | 1.0L | 0.3L | 0.15L
- Chart height: 200px

---

### 6.3 Row 3

#### 6.3.1 Vendor Spend Concentration (w21-vendor-spend) — colSpan 12
- 3-column grid layout
- Per vendor: name + amount (space-between row) → percentage sub-text → progress bar
- Progress bar: height 6px, #2563EB fill, opacity decreasing per rank (1.0, 0.8, 0.6)
- Data:
  - Vendor X — ₹4.00L — 42% of total spend
  - Supplier Y — ₹2.50L — 26% of total spend
  - Agency Z — ₹1.50L — 16% of total spend

---

## 7. Side Panel System

### 7.1 Layout
- **Width:** 420px; fixed right-side overlay; height calc(100vh − 56px); top: 56px
- **z-index:** 300
- **Open animation:** translateX(420px → 0), 0.2s ease-out
- **Close animation:** translateX(0 → 420px), 0.2s ease-out
- **Main content:** `paddingRight` shifts to 360px when panel open (transition 0.2s ease-out)
- **Background:** white; border-left: 1px #E5E7EB

### 7.2 Panel Header
- Sticky at top; padding 20px 24px; border-bottom 1px #E5E7EB
- Widget display name — Space Grotesk 600, 16px, #0F1117
- Date subtitle — Space Grotesk 12px, #9CA3AF ("YYYY-MM-DD — YYYY-MM-DD")
- Close (×) button — top-right, 32px hit area, calls `closePanel()`

### 7.3 Panel Body
- Uses Mantine ScrollArea; padding 0 24px; overflow-y: auto
- Sections separated by PanelSection wrapper (padding 18px 0; border-bottom 1px #E5E7EB; last section: no border, padding-bottom 24px)
- Section headers (SectionLabel): Space Grotesk 600, 10px, #9CA3AF, uppercase, letter-spacing 0.8px, mb 10px
- Read-only — no action buttons

### 7.4 Shared Panel Sub-Components

**StatusBadge** — inline pill
- `overdue`: bg #FEF2F2, text #DC2626, border #FECACA
- `due`: bg #F9FAFB, text #374151, border #E5E7EB
- `positive`: bg #F0FDF4, text #16A34A, border #BBF7D0
- `warning`: bg #FFFBEB, text #D97706, border #FDE68A
- All: border-radius 4px, padding 2px 6px, font-size 11px, font-weight 500

**Table headers (TH)** — Space Grotesk 10px 600 #9CA3AF uppercase letter-spacing 0.8px; align left by default, right when specified

**Table cells (TD)** — Space Grotesk 13px #0F1117; Albert Sans 600 when `bold=true`; padding 9px 0; vertical-align middle

**Table rows (TR)** — border-bottom 1px rgba(0,0,0,0.04)

**Hairline** — 1px #E5E7EB, margin 8px 0

**PLSubRow** — indented sub-item: "└─ {label}" left, amount right; Space Grotesk 12px #6B7280

### 7.5 Trigger Rules
- Any WidgetCard click → `openPanel(id, 'summary', summaryData)` unless `disablePanel=true`
- AI Insights card: `disablePanel=true` — never opens panel
- titleExtra elements: `e.stopPropagation()` — does not trigger panel

### 7.6 Closing
- Click × in panel header
- Switch nav tabs (calls `closePanel()`)
- Press Escape key (keydown listener registered while panel is open; automatically removed on close)

### 7.7 Fallback
Any widget ID not covered by a specific panel view renders:
> "No additional detail available for this widget." — Space Grotesk sm #9CA3AF, centered, py 40px

---

## 7.8 Per-Widget Panel Content

### 7.8.1 Gross Profit Panel (w7-gross-profit)

**Section 1 — THIS PERIOD**
| Row | Value |
|---|---|
| Gross Profit | ₹18.5L |
| Gross Margin | 41% (blue pill: bg #EFF6FF, text #2563EB) |
| Revenue | ₹45L |
| COGS | ₹26.5L |
| Delta | ↑ ₹1.3L vs last month (green) |

**Section 2 — COMPARISON** (last)
Table: METRIC | THIS MONTH | LAST MONTH | CHANGE
- Revenue: ₹45L | ₹42L | ↑ 7.1% (green)
- COGS: ₹26.5L | ₹24.8L | ↑ 6.9% (red — cost increase)
- Gross Profit: ₹18.5L | ₹17.2L | ↑ 7.6% (green)
- Gross Margin: 41% | 40.9% | ↑ 0.1pp (green)

---

### 7.8.2 Cash Balance Panel (w1-cash / w10-cash-full)

**Section 1 — ACCOUNT BALANCES**
Table: ACCOUNT | TYPE | BALANCE | CHANGE
- HDFC Current A/c | Current | ₹8.2L | ↑ ₹45,000 (green)
- SBI Savings A/c | Savings | ₹4.25L | ↓ ₹12,000 (red)
- Hairline separator
- Total row: **Total Balance ₹12.45L ↑ 8.5%** (bold, green delta)

**Section 2 — RECENT MOVEMENTS** (last)
Table: DATE | DESCRIPTION | AMOUNT (credit = green +, debit = red −)
- 14 Mar · NEFT from Acme Corp · +₹2.50L
- 13 Mar · Vendor X Payment · −₹1.40L
- 12 Mar · NEFT from Globex · +₹85,000
- 11 Mar · Salary disbursement · −₹4.20L
- 10 Mar · NEFT from Soylent · +₹1.20L

---

### 7.8.3 P&L Summary Panel (w2-pnl-compressed)

**Section 1 — THIS PERIOD**
P&L statement layout:
- Revenue: ₹45L
- COGS: ₹26.5L
- Hairline
- **Gross Profit** ₹18.5L + "41%" blue pill
- Operating Expense: ₹6.5L
- Hairline
- **Operating Profit: ₹12L** (bold, 14px)

**Section 2 — VS LAST MONTH** (last)
Table: (blank) | THIS MONTH | LAST MONTH | CHANGE
- Revenue: ₹45L | ₹42L | ↑ 7.1% (green)
- Gross Profit: ₹18.5L | ₹17.2L | ↑ 7.6% (green)
- Operating Expense: ₹6.5L | ₹6.3L | ↑ 3.2% (red — cost increase)
- Operating Profit: ₹12L | ₹10.9L | ↑ 10.1% (green)

---

### 7.8.4 Revenue Trend Panel (w3-rev-spark / w8-rev-full)

**Section 1 — CURRENT PERIOD**
- ₹45L this month (Albert Sans 700, 24px)
- ↑ 7.1% vs last month badge (green pill, border-radius 10px)

**Section 2 — MONTHLY BREAKDOWN**
Table: MONTH | REVENUE | MOM CHANGE
- Jan 2026: ₹30L | —
- Feb 2026: ₹31.5L | ↑ 5.0%
- Mar 2026: ₹32L | ↑ 1.6%
- Apr 2026: ₹34L | ↑ 6.3%
- May 2026: ₹38L | ↑ 11.8%
- Jun 2026: ₹45L | ↑ 18.4%

**Section 3 — TOP CUSTOMERS THIS MONTH** (last)
Rows (name left, amount + share right; border-bottom between):
- Acme Corp · ₹12L · 26.7%
- Globex Inc · ₹8.5L · 18.9%
- Soylent Corp · ₹4.2L · 9.3%

---

### 7.8.5 Days Sales Outstanding Panel (w15-dso)

**Section 1 — METRIC**
- 45 days (Albert Sans 700, 28px)
- ↑ 12% vs last month badge (red pill)
- "Target: 40 days" — Space Grotesk 12px, #6B7280
- StatusBadge: "15 days above target" (overdue variant)

**Section 2 — CUSTOMER CONTRIBUTION**
Table: CUSTOMER | CONTRIB | AVG DAYS | OUTSTANDING
- Acme Corp | 14d · 31% | 67d | ₹2.10L
- Soylent Corp | 8d · 18% | 43d | ₹1.20L
- Globex Inc | 6d · 13% | 38d | ₹90,000
- Others | 17d · 38% | — | ₹4.30L
- **Total row:** 45d · 100% | — | ₹8.60L

**Section 3 — TREND — LAST 3 MONTHS** (last)
Table: MONTH | DSO | CHANGE
- Jan 2026: 38 days | —
- Feb 2026: 41 days | ↑ 7.9% (red)
- Mar 2026: 45 days | ↑ 9.8% (red)
- Italic note: "DSO has risen 3 consecutive months." (#D97706 warning)

---

### 7.8.6 Days Payable Outstanding Panel (w19-dpo)

**Section 1 — METRIC**
- 38 days (Albert Sans 700, 28px)
- ↓ 5% vs last month badge (neutral grey pill)
- "Target range: 30–45 days" — Space Grotesk 12px, #6B7280
- StatusBadge: "Within target range" (positive variant)

**Section 2 — VENDOR CONTRIBUTION**
Table: VENDOR | CONTRIB | AVG DAYS | OUTSTANDING
- Vendor X | 12d · 32% | 45d | ₹2.10L
- Supplier Y | 8d · 21% | 38d | ₹1.40L
- Agency Z | 5d · 13% | 32d | ₹80,000
- Others | 13d · 34% | — | ₹2.95L
- **Total row:** 38d · 100% | — | ₹7.25L

**Section 3 — TREND — LAST 3 MONTHS** (last)
Table: MONTH | DPO | CHANGE
- Jan 2026: 42 days | —
- Feb 2026: 40 days | ↓ 4.8% (#6B7280 muted)
- Mar 2026: 38 days | ↓ 5.0% (#6B7280 muted)
- Italic note: "DPO is declining but remains within target floor (30 days)." (#D97706 warning)

---

### 7.8.7 Upcoming Payments Panel (w6-upcoming / w13-upcoming-cash / w22-upcoming-ap)

Three sections, each with a sub-header label and summary line before the table:

**Section 1 — OVERDUE**
- Sub-header: "OVERDUE" in #DC2626
- Summary: "₹3.45L · 12 bills"
- Table: VENDOR / BILL NO | AMOUNT | OVERDUE
  - Vendor X · #1042 | ₹1.40L | 14d overdue
  - Supplier Y · #892 | ₹90,000 | 11d overdue
  - Agency Z · #331 | ₹72,000 | 9d overdue
  - Petty Cash · #112 | ₹43,000 | 6d overdue
  - Footer: "+ 8 more bills — ₹2.00L total" (red, 11px)

**Section 2 — DUE IN 0–7 DAYS**
- Summary: "₹1.80L · 5 bills"
- Table: VENDOR / BILL NO | AMOUNT | DUE DATE
  - Vendor A · #205 | ₹60,000 | Due 26 Mar 2026
  - Vendor B · #301 | ₹75,000 | Due 28 Mar 2026
  - Vendor C · #144 | ₹45,000 | Due 30 Mar 2026
  - Footer: "+ 2 more bills" (#9CA3AF, 11px)

**Section 3 — DUE IN 8–15 DAYS** (last)
- Summary: "₹4.20L · 8 bills"
- Table: VENDOR / BILL NO | AMOUNT | DUE DATE
  - Vendor D · #408 | ₹1.20L | Due 2 Apr 2026
  - Vendor E · #519 | ₹90,000 | Due 5 Apr 2026
  - Vendor F · #312 | ₹60,000 | Due 8 Apr 2026
  - Footer: "+ 5 more bills" (#9CA3AF, 11px)

---

### 7.8.8 Top Customers Panel (w9-top-customers)

**Interactive:** clicking a customer row (except "Others") selects it and updates Section 2.
- Selected row: bg #F9FAFB, font-weight 600
- "Others" row: not clickable (cursor default)

**Section 1 — RANKINGS — BY REVENUE**
Table: # | CUSTOMER | REVENUE | SHARE | VS LM
1. Acme Corp | ₹12L | 26.7% | ↑ 8.2%
2. Globex Inc | ₹8.5L | 18.9% | ↑ 3.1%
3. Soylent Corp | ₹4.2L | 9.3% | ↓ 2.4%
4. Initech | ₹1.8L | 4.0% | ↑ 0.9%
5. Others | ₹18.5L | 41.1% | —
*(Default selected: Acme Corp)*

**Section 2 — OPEN INVOICES — {SELECTED CUSTOMER}** (last)
Table: INVOICE | AMOUNT | DUE DATE | STATUS

For Acme Corp:
- INV-2241 | ₹2.10L | 15 Feb 2026 | Overdue 30d
- INV-2318 | ₹3.20L | 12 Mar 2026 | Due in 12d
- INV-2401 | ₹6.70L | 30 Mar 2026 | Due in 30d

For Globex Inc:
- INV-2187 | ₹90,000 | 28 Feb 2026 | Overdue 17d
- INV-2302 | ₹7.60L | 20 Mar 2026 | Due in 20d

For Soylent Corp:
- INV-2198 | ₹1.20L | 22 Feb 2026 | Overdue 23d
- INV-2389 | ₹3.00L | 4 Apr 2026 | Due in 34d

---

### 7.8.9 Revenue vs Expense Panel (w10-rev-vs-exp)

**Section 1 — SUMMARY**
3-column KPI grid:
- Revenue: ₹45L · ↑ 7.1%
- Expense: ₹33L · ↑ 3.8% (red — cost increase)
- Net Surplus: ₹12L · ↑ 26.7% (green text)

**Section 2 — MONTHLY BREAKDOWN**
Table: MONTH | REVENUE | EXPENSE | NET SURPLUS | MARGIN
- Jan 2026: ₹30L | ₹25L | ₹5L | 16.7%
- Feb 2026: ₹31.5L | ₹26L | ₹5.5L | 17.5%
- Mar 2026: ₹32L | ₹26.5L | ₹5.5L | 17.2%
- Apr 2026: ₹34L | ₹27L | ₹7L | 20.6%
- May 2026: ₹38L | ₹28L | ₹10L | 26.3%
- Jun 2026: ₹45L | ₹33L | ₹12L | 26.7%

**Section 3 — EXPENSE BY CATEGORY** (last)
Table: CATEGORY | AMOUNT | % OF EXPENSE
- COGS | ₹26.5L | 80%
- Salaries | ₹3.2L | 10%
- Rent | ₹1.2L | 4%
- Marketing | ₹95,000 | 3%
- Other | ₹1.15L | 3%
- **Total: ₹33L | 100%**

---

### 7.8.10 Expense Breakdown Panel (w11-exp-breakdown)

**Interactive:** clicking a category row selects it and updates Section 2 with sub-ledger detail.
- Selected row: bg #F9FAFB, font-weight 600
*(Default selected: COGS)*

**Section 1 — BY CATEGORY**
Table: CATEGORY | AMOUNT | % OF TOTAL | VS LAST MONTH
- COGS | ₹26.5L | 80% | ↑ 6.9% (red — cost increase)
- Salaries | ₹3.2L | 10% | ↑ 1.3% (red)
- Rent | ₹1.2L | 4% | → 0% (#6B7280)
- Marketing | ₹95,000 | 3% | ↑ 2.1% (red)
- Other | ₹1.15L | 3% | ↓ 0.9% (#6B7280)
- **Total: ₹33L | 100% | ↑ 3.8% (red)**

**Section 2 — {SELECTED CATEGORY} DETAIL** (last)

For COGS (has sub-ledger):
Table: LEDGER | AMOUNT | % OF COGS
- Purchase Accounts | ₹22L | 83%
- Direct Expenses | ₹4.5L | 17%
- Italic note: "Direct Expenses classified under COGS only. They do not appear in Operating Expense."

For all other categories:
> "No sub-ledger detail available for this category." (italic, #9CA3AF)

---

### 7.8.11 Cash Inflow vs Outflow Panel (w12-cash-flow)

**Section 1 — SUMMARY**
3-column KPI grid:
- Cash In: ₹48.2L
- Cash Out: ₹35.8L
- Net Flow: +₹12.4L (green)

**Section 2 — WEEKLY BREAKDOWN**
Table: WEEK | CASH IN | CASH OUT | NET
- W1 (1–7 Mar): ₹10.2L | ₹8.8L | +₹1.4L (green)
- W2 (8–14 Mar): ₹9.8L | ₹10.1L | −₹0.3L (red)
- W3 (15–21 Mar): ₹16.5L | ₹9.4L | +₹7.1L (green)
- W4 (22–30 Mar): ₹11.7L | ₹7.5L | +₹4.2L (green)

**Section 3 — INFLOW SOURCES**
Table: SOURCE | AMOUNT | % OF INFLOW
- Customer payments | ₹42.5L | 88%
- Advance receipts | ₹3.8L | 8%
- Other inflows | ₹1.9L | 4%

**Section 4 — OUTFLOW CATEGORIES** (last)
Table: CATEGORY | AMOUNT | % OF OUTFLOW
- Vendor payments | ₹18.5L | 52%
- Salaries | ₹8.2L | 23%
- Rent | ₹3.5L | 10%
- Tax payments | ₹2.8L | 8%
- Other | ₹2.8L | 7%
- Italic note: "Internal transfers excluded from both inflow and outflow."

---

### 7.8.12 AR Outstanding Panel (w14-ar-out)

**Section 1 — SUMMARY**
3-column KPI grid:
- TOTAL AR: ₹18.5L
- OVERDUE: ₹4.2L (text #DC2626) · "8 invoices"
- AVG AGE: 42 days

**Section 2 — OPEN INVOICES** (last)
Table: CUSTOMER | INVOICE | AMOUNT | DUE DATE | STATUS
- Acme Corp | INV-2241 | ₹2.10L | 15 Feb 2026 | Overdue 30d
- Soylent Corp | INV-2198 | ₹1.20L | 22 Feb 2026 | Overdue 23d
- Globex Inc | INV-2187 | ₹90,000 | 28 Feb 2026 | Overdue 17d
- Initech | INV-2301 | ₹1.80L | 5 Mar 2026 | Due in 5d
- Umbrella Co | INV-2318 | ₹3.20L | 12 Mar 2026 | Due in 12d
- Acme Corp | INV-2402 | ₹6.70L | 30 Mar 2026 | Due in 30d
- Soylent Corp | INV-2389 | ₹2.10L | 4 Apr 2026 | Due in 34d

Footer: "Advance payments received (not yet invoiced): ₹0" (italic, #9CA3AF)

---

### 7.8.13 AR Aging Panel (w16-ar-aging)

**Section 1 — BUCKET SUMMARY**
Table: BUCKET | INVOICES | AMOUNT | % TOTAL AR
- Current | 22 | ₹14.30L | 77.3%
- 1–30 days | 3 | ₹2.10L | 11.4%
- 31–60 days | 2 | ₹1.20L | 6.5%
- 61–90 days | 1 | ₹65,000 | 3.5%
- 90+ days | 1 | ₹25,000 | 1.4%
- **Total: 29 | ₹18.50L | 100%**

**Section 2 — ALL OVERDUE INVOICES** (last)
Table: CUSTOMER | INVOICE | AMOUNT | DAYS OVERDUE
- Acme Corp | INV-2241 | ₹2.10L | 30d (red)
- Soylent Corp | INV-2198 | ₹1.20L | 23d (red)
- Globex Inc | INV-2187 | ₹90,000 | 17d (red)
- Acme Corp | INV-2089 | ₹65,000 | 68d (red)
- Soylent Corp | INV-1998 | ₹25,000 | 94d (red)

---

### 7.8.14 AP Outstanding Panel (w18-ap-out)

**Section 1 — SUMMARY**
3-column KPI grid:
- TOTAL AP: ₹9.45L
- OVERDUE: ₹3.45L (text #DC2626) · "12 bills"
- LARGEST VENDOR: Vendor X · ₹4L

**Section 2 — OPEN BILLS** (last)
Table: VENDOR | BILL NO | AMOUNT | DUE DATE | STATUS
- Vendor X | BL-441 | ₹1.40L | 18 Feb 2026 | Overdue 14d
- Supplier Y | BL-398 | ₹90,000 | 21 Feb 2026 | Overdue 11d
- Agency Z | BL-412 | ₹72,000 | 23 Feb 2026 | Overdue 9d
- Petty Cash | BL-112 | ₹43,000 | 26 Feb 2026 | Overdue 6d
- Vendor X | BL-519 | ₹2.60L | 8 Mar 2026 | Due in 8d
- Supplier Y | BL-521 | ₹90,000 | 14 Mar 2026 | Due in 14d
- Agency Z | BL-498 | ₹78,000 | 18 Mar 2026 | Due in 18d

Footer: "Vendor advances paid (not yet billed): ₹0" (italic, #9CA3AF)

---

### 7.8.15 AP Aging Panel (w20-ap-aging)

**Section 1 — BUCKET SUMMARY**
Table: BUCKET | BILLS | AMOUNT | % TOTAL AP
- Current | 18 | ₹6.10L | 64.6%
- 1–30 days | 6 | ₹1.60L | 16.9%
- 31–60 days | 4 | ₹1.05L | 11.1%
- 61–90 days | 3 | ₹52,000 | 5.5%
- 90+ days | 1 | ₹18,000 | 1.9%
- **Total: 32 | ₹9.45L | 100%**

**Section 2 — ALL OVERDUE BILLS** (last)
Table: VENDOR | BILL NO | AMOUNT | DUE DATE | DAYS OVERDUE
- Vendor X | BL-441 | ₹1.40L | 18 Feb | 14d (red)
- Supplier Y | BL-398 | ₹90,000 | 21 Feb | 11d (red)
- Agency Z | BL-412 | ₹72,000 | 23 Feb | 9d (red)
- Petty Cash | BL-112 | ₹43,000 | 26 Feb | 6d (red)
- Vendor X | BL-302 | ₹52,000 | 14 Jan | 47d (red)
- Supplier Y | BL-287 | ₹35,000 | 20 Jan | 41d (red)
- Vendor X | BL-198 | ₹18,000 | 15 Dec | 77d (red)

---

### 7.8.16 Vendor Spend Concentration Panel (w21-vendor-spend)

**Interactive:** clicking a vendor row (except "Others") selects it and updates Section 2.
- Selected row: bg #F9FAFB, font-weight 600
*(Default selected: Vendor X)*

**Section 1 — TOP VENDORS**
Table: # | VENDOR | BILLED | SHARE | VS LM
1. Vendor X | ₹4.00L | 42.3% | ↑ 5.2% (green)
2. Supplier Y | ₹2.50L | 26.5% | ↓ 1.8% (red)
3. Agency Z | ₹1.50L | 15.9% | ↑ 0.4% (green)
4. Others | ₹1.45L | 15.3% | — (not clickable)

Footer: "Vendor X accounts for 42.3% of total billed spend this month." (warning #D97706 when Vendor X selected; muted otherwise)

**Section 2 — BILLS — {SELECTED VENDOR}** (last)
Table: BILL NO | AMOUNT | DATE | STATUS

For Vendor X:
- BL-441 | ₹1.40L | 18 Feb 2026 | Overdue 14d
- BL-519 | ₹2.60L | 8 Mar 2026 | Due in 8d

For Supplier Y:
- BL-398 | ₹90,000 | 21 Feb 2026 | Overdue 11d
- BL-521 | ₹90,000 | 14 Mar 2026 | Due in 14d

For Agency Z:
- BL-412 | ₹72,000 | 23 Feb 2026 | Overdue 9d
- BL-498 | ₹78,000 | 18 Mar 2026 | Due in 18d

Footer: "Total billed this month: {sum} across {count} bills" (Space Grotesk 12px #6B7280)

---

### 7.9 Widget ID → Display Name Map
| Widget ID | Display Name |
|---|---|
| w1-cash | Cash Balance |
| w2-pnl-compressed | P&L Summary |
| w3-rev-spark | Revenue Trend |
| w6-upcoming | Upcoming Payments |
| w7-gross-profit | Gross Profit |
| w7-pnl-full | P&L Statement |
| w8-rev-full | Revenue Trend |
| w9-top-customers | Top Customers |
| w10-cash-full | Cash Balance |
| w10-rev-vs-exp | Revenue vs Expense |
| w11-exp-breakdown | Expense Breakdown |
| w12-cash-flow | Cash Inflow vs Outflow |
| w13-upcoming-cash | Upcoming Payments |
| w14-ar-out | AR Outstanding |
| w15-dso | Days Sales Outstanding |
| w16-ar-aging | AR Aging |
| w18-ap-out | AP Outstanding |
| w19-dpo | Days Payable Outstanding |
| w20-ap-aging | AP Aging |
| w21-vendor-spend | Vendor Spend Concentration |

---

## 8. Shared Components

### 8.1 WidgetCard
Props: `id`, `title`, `colSpan`, `status`, `onRetry`, `summaryData`, `titleExtra`, `children`, `style`, `disablePanel`

- White bg, 1px #E5E7EB border, 12px radius, 20px 24px padding
- Box-shadow: 0 1px 3px rgba(0,0,0,0.06)
- Hover: translateY(-2px), box-shadow 0 4px 12px rgba(0,0,0,0.08), 0.2s ease
- Title row: omitted entirely when `title` is empty string AND `titleExtra` is absent
- `cursor: disablePanel ? 'default' : 'pointer'`

### 8.2 TrendBadge
Props: `value` (number), `label` (string), `type` (optional)

- Default: positive value = green (↑), negative = red (↓)
- `ar_overdue` / `ap_overdue` / `dso`: positive value = red (bad)
- `dpo`: negative value = green (good)
- Value always 1 decimal: `Math.abs(value).toFixed(1)%`

### 8.3 KPIGrid
- 12-column CSS grid, gap 16px, `alignItems: stretch`

### 8.4 State Overlays
- **LoadingState:** animated skeleton, full card area
- **EmptyState:** "No data available" centered with muted icon
- **ErrorState:** error message + "Retry" button → calls `onRetry`

---

## 9. Design System

### 9.1 Color Tokens
```
--color-bg-page:          #F0F2F5
--color-bg-card:          #FFFFFF
--color-bg-hover:         #F9FAFB
--color-border:           #E5E7EB
--color-text-primary:     #0F1117
--color-text-secondary:   #374151
--color-text-muted:       #6B7280
--color-text-ghost:       #9CA3AF
--color-accent-blue:      #2563EB
--color-accent-blue-light:#EFF6FF
--color-positive:         #16A34A
--color-positive-bg:      #F0FDF4
--color-critical:         #DC2626
--color-critical-bg:      #FEF2F2
--color-warning:          #D97706
--color-warning-bg:       #FFFBEB
--color-live-badge:       #0D9488
--radius-card:            12px
--shadow-card:            0 1px 3px rgba(0,0,0,0.06)
```

### 9.2 Typography
- **KPI numbers:** Albert Sans 700
- **All other text:** Space Grotesk
- Never use: Inter, Arial, Roboto, system-ui

### 9.3 Number Formatting
| Range | Format | Example |
|---|---|---|
| Under ₹1,00,000 | Full with commas | ₹85,000 |
| ₹1,00,000 and above | L shorthand | ₹8.5L |
| ₹1,00,00,000 and above | Cr shorthand | ₹1.2Cr |
| Chart Y-axes | Always ₹L notation | ₹12L |
| Deltas | Always 1 decimal | 8.5% |

### 9.4 Status Badges
| State | Background | Text | Border |
|---|---|---|---|
| Overdue | #FEF2F2 | #DC2626 | 1px #FECACA |
| Pending | #FFFBEB | #D97706 | 1px #FDE68A |
| Positive | #F0FDF4 | #16A34A | 1px #BBF7D0 |

All: border-radius 4px, padding 2px 6px, font-size 11px, font-weight 500.

---

## 10. State Architecture

### 10.1 DashboardContext (global)
```typescript
interface DashboardContextType {
  activeTab: string;           // 'overview' | 'payables'
  setActiveTab: (tab: string) => void;
  dateFrom: string;            // e.g. '2026-03-01'
  dateTo: string;              // e.g. '2026-03-23'
  setDateFrom: (d: string) => void;
  setDateTo: (d: string) => void;
  isPanelOpen: boolean;
  openPanel: (id: string, mode: string, data?: any) => void;
  closePanel: () => void;
  activePanelId: string | null;
  panelMode: string | null;
  panelData: any;
}
```

### 10.2 Local Component State
- `cashGrain: 'monthly' | 'weekly'` — Cash Inflow chart (OverviewTab)
- `hovered: boolean` — WidgetCard lift effect
- `expanded: boolean` per insight — AIInsightsAccordion (independent per chip)
- `selectedCustomer: string` — Top Customers and AR panels (default: 'Acme Corp')
- `selectedVendor: string` — Vendor Spend panel (default: 'Vendor X')
- `selectedCat: string` — Expense Breakdown panel (default: 'COGS')

---

## 11. Interaction Patterns

### 11.1 Card Click → Side Panel
1. User clicks WidgetCard body
2. `handleCardClick` checks `disablePanel`
3. If enabled: `openPanel(id, 'summary', summaryData)`
4. Panel slides in (translateX), main content shifts right (paddingRight 360px)

### 11.2 Nav Tab Switch
1. User clicks nav item
2. `setActiveTab(tab)` + `closePanel()` called simultaneously
3. Panel slides out, new tab content renders

### 11.3 Date Range Change
1. User selects From or To date (native picker)
2. `setDateFrom` / `setDateTo` fires in context
3. `min`/`max` constraints prevent invalid ranges
4. All widgets re-render (v1: labels only)

### 11.4 Cash Flow Grain Toggle
1. User clicks "Monthly" / "Weekly" pill (in titleExtra)
2. `e.stopPropagation()` — panel does NOT open
3. `cashGrain` state updates → chart re-renders

### 11.5 AI Insights Expand/Collapse
1. User clicks insight chip
2. Mantine Collapse toggles for that insight
3. Other insights unaffected; card stays non-interactive re panel

### 11.6 Panel Interactive Tables
1. User clicks a selectable row (customer / vendor / expense category)
2. `selectedCustomer` / `selectedVendor` / `selectedCat` state updates
3. Section 2 of that panel re-renders immediately with new data
4. Selected row highlighted: bg #F9FAFB, font-weight 600

### 11.7 Close Panel via Escape
1. Panel is open; user presses Escape key
2. keydown listener (registered on open, removed on close) calls `closePanel()`
3. Panel slides out

---

## 12. Edge Cases

### 12.1 Date Range
- From > To: prevented by min/max constraints on inputs
- Single-day range: both set to same date — valid
- Future dates: not prevented in v1

### 12.2 Side Panel
- Click card while panel open for same card: panel stays open, data unchanged
- Click card while panel open for different card: panel updates to new widget
- Tab switch while panel open: panel always closes
- Escape key: closes panel (already implemented)

### 12.3 Number Formatting
- Zero values: display as ₹0
- Negative values (net loss): −₹2.5L
- Exactly ₹1,00,000: display as ₹1.0L

### 12.4 Widget States
- `loading`: skeleton overlay replaces all content
- `empty`: illustration + "No data for selected period"
- `error`: message + Retry; `onRetry` prop called on click
- `idle`: treated same as loading
- `success`: children rendered normally

### 12.5 AI Insights
- All collapsed: card renders as compact strip (header row only)
- One expanded: card height grows; other rows unaffected (not stretch-aligned with insights row)
- Insights hardcoded in v1; Claude API integration in v2

### 12.6 Panel Interactive Tables
- "Others" row in customer/vendor tables: not clickable; cursor default
- If selected customer/vendor has no sub-data: Section 2 shows fallback text
- Clicking a row that is already selected: no-op (remains selected, no visual change)

---

## 13. Canonical Data Reference

| Entity | Metric | Value |
|---|---|---|
| Total revenue | This month | ₹45L |
| Total COGS | This month | ₹26.5L |
| Gross Profit | This month | ₹18.5L (41% margin) |
| Operating Expense | This month | ₹6.5L |
| Operating Profit | This month | ₹12L |
| Cash Balance | Now | ₹12.45L |
| HDFC Current A/c | Balance | ₹8.2L |
| SBI Savings A/c | Balance | ₹4.25L |
| AR Outstanding | Total | ₹18.5L |
| AR Overdue | Amount | ₹4.2L · 8 invoices |
| AP Outstanding | Total | ₹9.45L |
| AP Overdue | Amount | ₹3.45L · 12 bills |
| Upcoming Payments | Overdue | ₹3.45L · 12 bills |
| Upcoming Payments | 0–7 days | ₹1.8L · 5 bills |
| Upcoming Payments | 8–15 days | ₹4.2L · 8 bills |
| Acme Corp | Overdue AR | ₹2.1L |
| DSO | This month | 45 days |
| DPO | This month | 38 days |
| Vendor X | Total outstanding | ₹4.00L |
| Vendor X | DPO contribution | ₹2.10L |
| DSO target | — | 30 days |
| DPO target range | — | 30–45 days |
| Gross margin target | — | 40%+ |

---

## 14. Out of Scope (v1)

- Real API integration (all data is hardcoded)
- Mobile / responsive layout
- Authentication / multi-user
- Data export (PDF, CSV)
- Edit / write operations of any kind
- Push notifications or alerts
- Customisable dashboard layout
- Multi-company switching
- Dark mode

---

## 15. Known Gaps — v2 Roadmap

- Date range picker does not filter actual data (labels update but underlying data is static)
- AI Insights are hardcoded strings; needs Claude API integration with real accounting data
- No loading/error states wired to real data fetching
- Chart tooltips not styled to design system (use browser/library defaults)
- Side panel transaction dates reference Nov 2024 in some widgets; should use date range context in v2
- No pagination in panel tables (bills/invoices beyond shown rows are noted as "+ N more" but not navigable)
