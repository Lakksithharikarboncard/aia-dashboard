# AIA Financial Dashboard — Product Requirements Document

**Version:** 1.0
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
    └── Per-widget detail views
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

**Panel content**
- Header: "Gross Profit" + date range subtitle
- Gross Profit breakdown (Revenue ₹45L − COGS ₹26.5L = ₹18.5L)
- Margin trend chart (monthly %, last 6 months)
- COGS composition table (materials, labour, other)

#### 5.1.2 Cash Balance (w10-cash-full) — colSpan 3

**Display**
- KPI value: ₹12.45L — Albert Sans 700, 32px, #0F1117
- Sub-label: "Across 2 accounts" — Space Grotesk 12px, #6B7280
- Account rows:
  - HDFC Current A/c · ₹8.2L
  - SBI Savings A/c · ₹4.25L
  - Each row: account name left, amount right; Space Grotesk 12px; Albert Sans 600 for amount
- Trend badge: +5.2% vs last month (positive, green)

**Panel content**
- Total with account breakdown
- 30-day cash balance area chart
- Transaction-level inflow/outflow summary

#### 5.1.3 Revenue vs Expense (w10-rev-vs-exp) — colSpan 6

**Display**
- ComposedChart (Recharts): Bar (Revenue, #2563EB) + Bar (Expense, #E5E7EB) + Line (Net, #16A34A)
- X-axis: month labels (Oct–Mar), Space Grotesk 10px, #9CA3AF
- Y-axis: ₹L notation, Space Grotesk 10px, #9CA3AF
- Chart height: 160px
- Legend: Revenue ● Expense ● Net Income, Space Grotesk 11px
- Latest data point: Revenue ₹45L, Expense ₹33L, Net ₹12L

**Panel content**
- Full-size chart with 12-month history
- Monthly table: Revenue | COGS | Gross Profit | OpEx | Net Income
- YoY comparison

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

**Panel content**
- Full P&L statement with additional line items (depreciation, interest, tax, net profit)
- Sparkline trend for each major line item

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

**Panel content**
- Detailed cash flow statement (Operating/Investing/Financing)
- Trend table by period
- Net cash change callout

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

**Panel content**
- Month-over-month delta per category
- Trend sparklines
- Anomaly callouts for categories up >10% MoM

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
- Expanded: Full explanation of DSO increase from 40→45 days, Acme Corp's ₹2.1L overdue invoices, recommended action.

*Insight 2 — Cash Positive (positive)*
- Chip: "Cash position healthy — ₹12.45L across 2 accounts"
- Expanded: 5.2% MoM growth, account breakdown, estimated runway of ~4.2 months.

*Insight 3 — AP Risk (critical)*
- Chip: "12 AP bills overdue — ₹3.45L at risk of late fees"
- Expanded: Bills past due, Vendor X ₹4.00L total outstanding, prioritisation advice.

**Expand/collapse interaction**
- Click insight chip → toggles that insight's Collapse (independent per insight)
- Other insights unaffected
- Card never opens side panel

---

### 5.4 Row 4

#### 5.4.1 Revenue Trend (w8-rev-full) — colSpan 5

**Display**
- Mantine AreaChart, single series (Revenue, #2563EB, 0.15 opacity fill)
- X-axis: Oct, Nov, Dec, Jan, Feb, Mar
- Y-axis: ₹L notation
- Chart height: 160px
- Data: 32L, 35L, 38L, 40L, 41L, 45L

**Panel content**
- 12-month area chart
- Table: Month | Revenue | MoM Δ | YoY Δ
- Top revenue sources breakdown

#### 5.4.2 Top Customers by Revenue (w9-top-customers) — colSpan 4

**Display**
- Table, 4 rows sorted by revenue descending
- Headers: CUSTOMER | REVENUE | SHARE — Space Grotesk 10px 600 #9CA3AF uppercase letter-spacing 0.5px
- Rows:
  - Acme Corp | ₹18L | 40%
  - Beta Ltd | ₹11.25L | 25%
  - Gamma Inc | ₹9L | 20%
  - Others | ₹6.75L | 15%
- Row dividers: 1px #E5E7EB opacity 0.5
- Row hover: bg #F9FAFB
- Amount column: right-aligned, Albert Sans 600

**Panel content**
- Full customer revenue table
- Revenue trend per customer (sparkline)
- Invoice history summary per customer

#### 5.4.3 Upcoming Payments (w13-upcoming-cash) — colSpan 3

**Display**
- Three summary buckets (no individual bill rows):
  - Overdue: ₹3.45L · 12 bills — critical red badge
  - Due 0–7 days: ₹1.8L · 5 bills — warning amber badge
  - Due 8–15 days: ₹4.2L · 8 bills — neutral badge
- Font: Space Grotesk 13px, #374151

**Panel content**
- Full bill list per bucket: vendor, invoice number, due date, amount, status badge
- Sorted: overdue first, then by due date ascending

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
- **Width:** 420px; fixed right-side overlay; height 100vh
- **z-index:** 300
- **Open animation:** translateX(420px → 0), 0.2s ease-out
- **Close animation:** translateX(0 → 420px), 0.2s ease-out
- **Main content:** `paddingRight` shifts to 360px when panel open (transition 0.2s ease-out)
- **Background:** white; border-left: 1px #E5E7EB

### 7.2 Panel Header
- Sticky at top; padding 20px 24px; border-bottom 1px #E5E7EB
- Widget display name — Space Grotesk 600, 16px, #0F1117
- Date subtitle — Space Grotesk 12px, #9CA3AF ("YYYY-MM-DD — YYYY-MM-DD")
- Close (×) button — top-right, 32px hit area

### 7.3 Panel Body
- Padding: 0 24px; overflow-y: auto
- Section headers: Space Grotesk 600, 11px, #9CA3AF, uppercase, letter-spacing 0.5px
- Read-only — no action buttons

### 7.4 Trigger Rules
- Any WidgetCard click → `openPanel(id, 'summary', summaryData)` unless `disablePanel=true`
- AI Insights card: `disablePanel=true` — never opens panel
- titleExtra elements: `e.stopPropagation()` — does not trigger panel

### 7.5 Closing
- Click × in panel header
- Switch nav tabs (calls `closePanel()`)
- Escape key — future v2 enhancement

### 7.6 Widget ID → Display Name Map
| Widget ID | Display Name |
|---|---|
| w1-cash | Cash Balance |
| w2-pnl-compressed | P&L Summary |
| w3-rev-spark | Revenue Trend |
| w6-upcoming | Upcoming Payments |
| w7-gross-profit | Gross Profit |
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

---

## 11. Interaction Patterns

### 11.1 Card Click → Side Panel
1. User clicks WidgetCard body
2. `handleCardClick` checks `disablePanel`
3. If enabled: `openPanel(id, 'summary', summaryData)`
4. Panel slides in, main content shifts right

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

- Side panel detail content is placeholder for most widgets; real drill-down tables not implemented
- Date range picker does not filter actual data
- AI Insights need Claude API integration
- No loading/error states wired to real data fetching
- No keyboard accessibility (Escape to close panel, tab focus management)
- Chart tooltips not styled to design system
