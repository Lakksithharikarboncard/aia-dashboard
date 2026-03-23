# AIA Financial Dashboard — Product Requirements Document

**Version:** 1.0  
**Last Updated:** March 23, 2026  
**Status:** Complete

---

## Problem Statement & Overview

### What is broken or missing today
- Finance teams lack real-time visibility into cash position, receivables health, and payables obligations in a single view
- Existing ERP reports require manual consolidation across 5+ screens to understand working capital status
- No proactive alerts for collection risks or payment concentration exposures
- DSO/DPO tracking requires manual calculation and spreadsheet maintenance

### What we are building
A three-tab financial dashboard providing real-time visibility into cash position, profitability trends, accounts receivable aging, and accounts payable obligations with AI-generated insights for collection and payment prioritization.

### Why now
- 34% increase in overdue receivables month-over-month indicates collections slippage requiring immediate attention
- Single customer (Acme Corp) driving 31% of DSO creates working capital concentration risk
- Operating margin improved 5.2pp — leadership needs visibility into sustainability drivers

### What high-level success looks like
- CFO reviews dashboard daily (not weekly) for cash position decisions
- Collections team prioritizes outreach using Top Customers — Overdue AR ranking
- Finance reduces monthly close analysis time from 4 hours to 30 minutes
- DSO reduces from 45 days to 40 days target within 90 days of deployment

---

## Goals & Non-Goals

### Goals
| # | Goal | Measurement |
|---|------|-------------|
| 1 | Reduce time to identify overdue receivables | From 45 minutes (manual report) to < 2 minutes (dashboard) |
| 2 | Improve DSO visibility | DSO metric visible on Overview tab, updated within 5 minutes of invoice aging |
| 3 | Enable payment prioritization | Upcoming Payments shows 100% of bills due in next 15 days, updated daily |
| 4 | Surface collection risks | AI Insights displays top 3 customers by overdue amount within 24 hours of threshold breach |
| 5 | Provide cash flow forecasting | Weekly cash inflow/outflow breakdown shows 4-week trend with net flow calculation |

### Non-Goals
| # | Non-Goal | Rationale |
|---|----------|-----------|
| 1 | Invoice creation or payment processing | Transactional workflows handled by ERP, not dashboard |
| 2 | Multi-company consolidation | Single entity (Acme Corp) scope for v1 |
| 3 | Custom date range selection | Fixed periods (This Month, Last Month) only for v1 |
| 4 | Export to PDF/Excel | Screen viewing only; export in v2 |
| 5 | User role-based permissions | Single admin user (CFO/Finance Manager) for v1 |
| 6 | Mobile responsive layout | Desktop-only (1440px minimum width) for v1 |

---

## User Personas

### Persona 1: CFO / Finance Director

| Attribute | Description |
|-----------|-------------|
| **Role** | Executive responsible for cash flow management, financial planning, board reporting |
| **Goal** | Understand cash position, working capital health, and profitability trends in < 5 minutes daily |
| **Frustration** | Current ERP requires running 6+ reports (AR Aging, AP Aging, Cash Summary, P&L, DSO calc, Revenue Trend) and consolidating in Excel |
| **Technical comfort** | High — uses Excel daily, comfortable with filters and pivot tables, expects drill-down capability |

**Primary tasks:**
- Review total cash balance and account breakdown each morning
- Monitor DSO trend and identify customers driving delays
- Approve payment priorities based on Upcoming Payments view
- Share Operating Margin trend with CEO weekly

---

### Persona 2: Collections Manager

| Attribute | Description |
|-----------|-------------|
| **Role** | Responsible for accounts receivable collections, customer payment follow-up |
| **Goal** | Prioritize collection calls based on overdue amount and aging bucket |
| **Frustration** | No ranked list of customers by overdue amount; must manually sort AR Aging report |
| **Technical comfort** | Medium — uses email and phone primarily, needs simple click-to-drill interface |

**Primary tasks:**
- View Top Customers — Overdue AR to prioritize call list
- Click customer name to see all open invoices with due dates
- Identify invoices in 61–90 day bucket approaching write-off risk
- Track collection progress week-over-week

---

### Persona 3: Accounts Payable Clerk

| Attribute | Description |
|-----------|-------------|
| **Role** | Processes vendor payments, maintains AP aging, manages bill entry |
| **Goal** | Ensure timely payment of bills while optimizing cash flow timing |
| **Frustration** | Must cross-reference vendor statements with AP Aging; no visibility into payment concentration risk |
| **Technical comfort** | Medium-High — uses accounting software daily, comfortable with table views and filters |

**Primary tasks:**
- Review Upcoming Payments to schedule payments in 0–7 day and 8–15 day buckets
- Identify overdue bills requiring immediate attention
- Monitor Vendor Spend Concentration to flag single-vendor dependency
- Verify DPO remains within 30–45 day target range

---

## UX & Interaction Architecture

### User Flow per Persona

#### CFO Flow (Overview Tab → Detail Panel)
```
1. Land on Overview tab (default)
2. Scan Zone A: Cash Balance (₹12.45L), Gross Profit (₹18.5L, 41%)
3. Read AI Insights strip — expand "Overdue receivables up 34%" insight
4. Click Revenue vs Expense chart → Side panel opens (right, 420px)
5. Review Monthly Breakdown table → Close panel (X or Escape)
6. Navigate to Payables & Receivables tab
7. Review DSO (45 days) → Click DSO card
8. Review Customer Contribution table → Note Acme Corp at 14 days (31%)
9. Close panel → Return to Overview tab
```

#### Collections Manager Flow (Payables & Receivables Tab)
```
1. Navigate to Payables & Receivables tab
2. Review AR Outstanding card (₹18.5L total, ₹4.2L overdue, 8 invoices)
3. Click Top Customers — Overdue AR card
4. View rankings: Acme Corp (₹2.1L, 50%), Soylent Corp (₹1.2L, 28.6%)
5. Click "Acme Corp" row → Bottom section updates to show invoices
6. Note INV-2241 (₹2.1L, 30d overdue) and INV-2089 (₹65K, 68d overdue)
7. Close panel → Add Acme Corp to call list
```

#### AP Clerk Flow (Cash Tab → Payables Tab)
```
1. Navigate to Cash tab
2. Review Upcoming Payments: Overdue (₹3.45L, 12 bills), 0–7 days (₹1.8L, 5 bills)
3. Click Upcoming Payments card
4. Review Overdue section → Note Vendor X #BL-441 (₹1.4L, 14d overdue)
5. Review 0–7 days section → Schedule payments for Vendor A, B, C
6. Navigate to Payables & Receivables tab
7. Review DPO (38 days) → Within target range (30–45 days)
8. Click Vendor Spend Concentration → Note Vendor X at 42.3% (high concentration)
```

---

### All States per Component

#### Widget Card
| State | Visual | Trigger |
|-------|--------|---------|
| Success | Full data rendered, white background, 1px border | Data loaded < 500ms |
| Loading | Skeleton placeholder (grey bars pulsing) | Data fetch in progress |
| Empty | "No data available" message, centered | Zero records for period |
| Error | "Failed to load" message with Retry button | API error or timeout > 5s |
| Hover | translateY(-2px), shadow 0 4px 12px rgba(0,0,0,0.08) | Mouse enter |

#### Side Panel
| State | Visual | Trigger |
|-------|--------|---------|
| Closed | Translated 100% off-screen right | Default, Escape key, X click |
| Opening | Slide-in animation, 200ms ease-out | Widget card click |
| Open | Fixed at right: 0, 420px width | Animation complete |
| Loading | Skeleton rows inside panel body | Panel data fetch |
| Error | "Failed to load details" with Retry | API error |

#### AI Insights Accordion
| State | Visual | Trigger |
|-------|--------|---------|
| Collapsed | Single row (48px height), chevron rotated 0° | Default |
| Expanded | Full content visible, chevron rotated 180° | Chevron click |
| Transitioning | 150ms ease animation | State change |
| Empty | "No insights available" | Zero insights generated |

#### Data Tables
| State | Visual | Trigger |
|-------|--------|---------|
| Success | Rows with data, 1px divider, hover background | Data loaded |
| Empty | "No records found" centered, 40px padding | Zero rows |
| Loading | 5 skeleton rows (grey bars) | Data fetch |
| Error | "Failed to load table" with Retry | API error |
| Row Selected | Background #F9FAFB, font-weight 600 | Click row |

---

### Navigation Logic

| Trigger | From | To | Transition |
|---------|------|-----|------------|
| Click "Overview" nav | Any tab | Overview tab | Instant (no animation) |
| Click "Cash" nav | Any tab | Cash tab | Instant |
| Click "Payables & Receivables" nav | Any tab | Payables & Receivables tab | Instant |
| Click widget card | Any tab | Side panel opens | Slide-in 200ms |
| Click panel X button | Panel open | Panel closed | Slide-out 200ms |
| Press Escape | Panel open | Panel closed | Slide-out 200ms |
| Click outside panel | Panel open | Panel closed | Slide-out 200ms |
| Click AI Insights chevron | Collapsed row | Expanded row | 150ms height animation |
| Click Grain toggle | Any grain | Selected grain | Chart re-renders < 100ms |

---

### Wireframes

**Overview Tab Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  AIA  Acme Corp    Overview  Cash  Payables    [This Month ▼]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │ Cash Balance │  │ Gross Profit │  (Zone A Row 1: 6col each) │
│  │   ₹12.45L    │  │   ₹18.5L 41% │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              AI Insights Accordion (12col)               │  │
│  │  🔴 Overdue receivables up 34%...             [▼]        │  │
│  │  🟡 DSO increased 12%...                      [▼]        │  │
│  │  🟢 Operating margin improved...              [▼]        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Revenue vs Expense Chart (12col)               │  │
│  │   [Bar chart: Revenue, Expense | Line: Net Surplus]      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Expense Breakdown (12col)                      │  │
│  │   [5 category cards with progress bars]                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │ P&L Statement│  │Revenue Trend │  (Zone B Row 3: 6col each) │
│  └──────────────┘  └──────────────┘                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Top Customers by Revenue (12col)               │  │
│  │   [4 customer cards with progress bars]                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Side Panel Layout:**
```
┌─────────────────────────────┐
│ Revenue vs Expense    [X]   │ ← Header (sticky)
│ This Month                  │
├─────────────────────────────┤
│ SUMMARY                     │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │Rev   │ │Exp   │ │Net   │ │
│ │₹45L  │ │₹33L  │ │₹12L  │ │
│ └──────┘ └──────┘ └──────┘ │
├─────────────────────────────┤
│ MONTHLY BREAKDOWN           │
│ Month  │ Rev  │ Exp │ Net  │
│ Jan    │ ₹30L │ ₹25L│ ₹5L  │
│ Feb    │ ₹31L │ ₹26L│ ₹5.5L│
│ ...                         │
├─────────────────────────────┤
│ EXPENSE BY CATEGORY         │
│ Category│ Amount│ %        │
│ COGS    │ ₹26.5L│ 80%      │
│ ...                         │
└─────────────────────────────┘
```

---

## Functional Requirements

### Must Have

| ID | Requirement |
|----|-------------|
| FR-1 | System shall display total cash balance aggregated from all bank accounts on Overview tab |
| FR-2 | System shall display DSO (Days Sales Outstanding) calculated as (AR / Revenue) × Days in period |
| FR-3 | System shall display DPO (Days Payable Outstanding) calculated as (AP / COGS) × Days in period |
| FR-4 | System shall display Revenue vs Expense trend for 6 monthly periods with Net Surplus line |
| FR-5 | System shall display Expense Breakdown by category with percentage of total |
| FR-6 | System shall display Upcoming Payments in 3 buckets: Overdue, 0–7 days, 8–15 days |
| FR-7 | System shall display AR Aging in 5 buckets: Current, 1–30 days, 31–60 days, 61–90 days, 90+ days |
| FR-8 | System shall display AP Aging in 5 buckets: Current, 1–30 days, 31–60 days, 61–90 days, 90+ days |
| FR-9 | System shall display Top Customers by Revenue with share percentage and trend |
| FR-10 | System shall display Top Customers — Overdue AR ranked by overdue amount |
| FR-11 | System shall display Vendor Spend Concentration with percentage of total spend |
| FR-12 | System shall open side panel on widget card click with detailed breakdown |
| FR-13 | System shall close side panel on X button click, Escape key, or click outside panel |
| FR-14 | System shall expand/collapse AI Insights rows on chevron click |
| FR-15 | System shall display AI Insights with severity levels: Critical, Watch, Positive |
| FR-16 | System shall format currency values: < ₹1L as full number, ₹1L–₹99L as XL.L, ≥₹1Cr as X.XCr |
| FR-17 | System shall display trend deltas with 1 decimal place (e.g., 8.5%) |
| FR-18 | System shall display positive deltas in green (#16A34A), negative in red (#DC2626) |
| FR-19 | System shall update all data within 5 minutes of source system change |
| FR-20 | System shall load initial dashboard view in < 2 seconds on broadband (10 Mbps) |

### Nice to Have

| ID | Requirement |
|----|-------------|
| FR-N1 | System shall allow export of panel tables to CSV |
| FR-N2 | System shall allow custom date range selection beyond preset periods |
| FR-N3 | System shall display tooltip on chart hover with exact values |
| FR-N4 | System shall highlight row on table hover with background #F9FAFB |

### Out of Scope

| ID | Requirement |
|----|-------------|
| FR-O1 | System shall not support invoice creation or payment processing |
| FR-O2 | System shall not support multi-company consolidation |
| FR-O3 | System shall not support mobile screen sizes < 1024px width |
| FR-O4 | System shall not support user role-based permissions |
| FR-O5 | System shall not support PDF export |

---

## Acceptance Criteria

### FR-1: Cash Balance Display
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-1.1 | User opens Overview tab | System loads | Cash Balance card shows total across all accounts (₹12.45L) |
| AC-1.2 | User clicks Cash Balance card | Panel opens | Panel shows account-wise breakdown (HDFC: ₹8.2L, SBI: ₹4.25L) |
| AC-1.3 | Bank balance changes in source | 5 minutes elapse | Dashboard reflects updated balance |

### FR-2: DSO Display
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-2.1 | User opens Payables & Receivables tab | System loads | DSO card shows 45 days |
| AC-2.2 | DSO > target (40 days) | System loads | Red badge shows "X days above target" |
| AC-2.3 | User clicks DSO card | Panel opens | Panel shows Customer Contribution table with Acme Corp at 14 days (31%) |

### FR-3: DPO Display
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-3.1 | User opens Payables & Receivables tab | System loads | DPO card shows 38 days |
| AC-3.2 | DPO within target range (30–45 days) | System loads | Green badge shows "Within target range" |
| AC-3.3 | User clicks DPO card | Panel opens | Panel shows Vendor Contribution table |

### FR-4: Revenue vs Expense Chart
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-4.1 | User views Overview tab | System loads | Chart shows 6 months (Jan–Jun) with Revenue bars (blue), Expense bars (grey), Net Surplus line (blue) |
| AC-4.2 | User hovers on Revenue bar | Mouse over bar | Tooltip shows exact revenue value for that month |
| AC-4.3 | User clicks chart | Panel opens | Panel shows Monthly Breakdown table with Revenue, Expense, Net Surplus, Margin columns |
| AC-4.4 | Net Surplus data missing | System loads | Chart displays "No data available" message |

### FR-5: Expense Breakdown
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-5.1 | User views Overview tab | System loads | 5 category cards displayed: COGS (80%), Salaries (10%), Rent (4%), Marketing (3%), Other (3%) |
| AC-5.2 | User clicks Expense Breakdown | Panel opens | Panel shows category table with vs Last Month column |
| AC-5.3 | User clicks COGS row | Row selected | Panel shows COGS Detail section with Purchase Accounts (₹22L, 83%), Direct Expenses (₹4.5L, 17%) |
| AC-5.4 | User clicks Salaries row | Row selected | Panel shows "No sub-ledger detail available for this category." |

### FR-6: Upcoming Payments
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-6.1 | User views Cash tab | System loads | 3 buckets displayed: Overdue (₹3.45L, 12 bills), 0–7 days (₹1.8L, 5 bills), 8–15 days (₹4.2L, 8 bills) |
| AC-6.2 | User clicks Upcoming Payments | Panel opens | Panel shows 3 sections with vendor/bill tables for each bucket |
| AC-6.3 | No bills in 0–7 days bucket | System loads | Section shows "No bills due in this period" |

### FR-7: AR Aging
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-7.1 | User views Payables & Receivables tab | System loads | AR Aging card shows bucket summary table |
| AC-7.2 | User clicks AR Aging | Panel opens | Panel shows Bucket Summary and All Overdue Invoices tables |
| AC-7.3 | Invoice moves from 31–60 to 61–90 bucket | Next day | AR Aging reflects updated bucket |

### FR-8: AP Aging
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-8.1 | User views Payables & Receivables tab | System loads | AP Aging card shows bucket summary table |
| AC-8.2 | User clicks AP Aging | Panel opens | Panel shows Bucket Summary and All Overdue Bills tables |

### FR-9: Top Customers by Revenue
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-9.1 | User views Overview tab | System loads | 4 customer cards displayed: Acme Corp (₹12L, 26.7%), Globex Inc (₹8.5L, 18.9%), Soylent Corp (₹4.2L, 9.3%), Initech (₹1.8L, 4.0%) |
| AC-9.2 | User clicks Top Customers | Panel opens | Panel shows Rankings table and Open Invoices for selected customer |
| AC-9.3 | User clicks "Globex Inc" row | Row selected | Open Invoices section updates to show Globex Inc invoices |

### FR-10: Top Customers — Overdue AR
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-10.1 | User views Payables & Receivables tab | System loads | Table shows Acme Corp (₹2.1L, 50%), Soylent Corp (₹1.2L, 28.6%), Globex Inc (₹90K, 21.4%) |
| AC-10.2 | User clicks "Acme Corp" row | Row selected | Bottom section shows Acme Corp invoices: INV-2241 (30d), INV-2089 (68d) |
| AC-10.3 | No overdue AR | System loads | Section shows "No overdue invoices" |

### FR-11: Vendor Spend Concentration
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-11.1 | User views Payables & Receivables tab | System loads | Table shows Vendor X (42.3%), Supplier Y (26.5%), Agency Z (15.9%), Others (15.3%) |
| AC-11.2 | Single vendor > 40% share | System loads | Amber warning text: "Vendor X accounts for 42.3% of total billed spend this month." |
| AC-11.3 | User clicks "Vendor X" row | Row selected | Bottom section shows Vendor X bills: BL-441, BL-519 |

### FR-12: Side Panel Open
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-12.1 | User clicks any widget card | Click registered | Side panel slides in from right (200ms animation) |
| AC-12.2 | Panel opens | Animation complete | Panel title shows widget display name (not widget ID) |
| AC-12.3 | Panel data loading | Panel opens | Panel shows skeleton rows |
| AC-12.4 | Panel data fails to load | API error > 5s | Panel shows "Failed to load details" with Retry button |

### FR-13: Side Panel Close
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-13.1 | Panel is open | User clicks X button | Panel slides out (200ms animation) |
| AC-13.2 | Panel is open | User presses Escape | Panel slides out (200ms animation) |
| AC-13.3 | Panel is open | User clicks outside panel | Panel slides out (200ms animation) |

### FR-14: AI Insights Accordion
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-14.1 | User views Overview tab | System loads | 3 insights displayed: 1 Critical, 1 Watch, 1 Positive |
| AC-14.2 | User clicks chevron on insight | Click registered | Insight expands, chevron rotates 180° (150ms) |
| AC-14.3 | One insight expanded | User clicks different insight | First insight collapses, second expands |
| AC-14.4 | No insights available | System loads | Section shows "No insights available at this time" |

### FR-15: AI Insights Severity
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-15.1 | Insight severity is Critical | System loads | Red dot, red left border on expanded content |
| AC-15.2 | Insight severity is Watch | System loads | Amber dot, amber left border on expanded content |
| AC-15.3 | Insight severity is Positive | System loads | Green dot, green left border on expanded content |
| AC-15.4 | User expands insight | Expanded view | 4 sections visible: WHAT WE FOUND, WHY IT MATTERS, SUGGESTED REVIEW, BASED ON |

### FR-16: Currency Formatting
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-16.1 | Value is ₹85,000 | Displayed | Shows "₹85,000" (full number with commas) |
| AC-16.2 | Value is ₹18,50,000 | Displayed | Shows "₹18.5L" (L shorthand) |
| AC-16.3 | Value is ₹1,20,00,000 | Displayed | Shows "₹1.2Cr" (Cr shorthand) |
| AC-16.4 | Chart Y-axis label | Displayed | Shows "₹30L", "₹35L" (never raw integers) |

### FR-17: Delta Formatting
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-17.1 | Delta is 8.5% | Displayed | Shows "8.5%" (1 decimal place) |
| AC-17.2 | Delta is 7.0% | Displayed | Shows "7.0%" (1 decimal place, not "7%") |
| AC-17.3 | Delta is positive | Displayed | Shows green color (#16A34A) with ↑ arrow |
| AC-17.4 | Delta is negative | Displayed | Shows red color (#DC2626) with ↓ arrow |

### FR-18: Trend Badge Colors
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-18.1 | Revenue increased | Displayed | Green badge with ↑ and percentage |
| AC-18.2 | DSO increased | Displayed | Red badge with ↑ and percentage (higher DSO is bad) |
| AC-18.3 | Cash Balance increased | Displayed | Green badge with ↑ and percentage |
| AC-18.4 | Expense increased | Displayed | Red badge with ↑ and percentage (higher expense is bad) |

### FR-19: Data Freshness
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-19.1 | Invoice posted in ERP | 5 minutes elapse | Dashboard AR Outstanding reflects new invoice |
| AC-19.2 | Payment received | 5 minutes elapse | Dashboard Cash Balance and AR Outstanding updated |
| AC-19.3 | Bill entered in AP | 5 minutes elapse | Dashboard AP Outstanding reflects new bill |

### FR-20: Load Performance
| AC-ID | Given | When | Then |
|-------|-------|------|------|
| AC-20.1 | User opens dashboard | Broadband connection (10 Mbps) | Initial view renders in < 2 seconds |
| AC-20.2 | User clicks widget card | Broadband connection | Panel opens in < 500ms |
| AC-20.3 | User switches tabs | Broadband connection | Tab content renders in < 500ms |

---

## Technical Architecture

### Stack
| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Language | TypeScript 5 |
| UI Library | Mantine 7 |
| Charts | Recharts (via @mantine/charts) |
| Build | Vite |
| Styling | CSS Variables + Mantine styles |

### Component Hierarchy
```
App
├── DashboardProvider (Context)
└── DashboardLayout
    ├── Header (Nav tabs, Date selector)
    └── Main Content
        ├── OverviewTab
        │   ├── KPIGrid
        │   │   └── WidgetCard (×7)
        │   │       ├── Cash Balance
        │   │       ├── Gross Profit
        │   │       ├── Revenue vs Expense
        │   │       ├── Expense Breakdown
        │   │       ├── P&L Statement
        │   │       ├── Revenue Trend
        │   │       └── Top Customers
        │   └── AIInsightsAccordion
        ├── CashTab
        │   ├── KPIGrid
        │   │   └── WidgetCard (×3)
        │   └── UpcomingPayments
        └── PayablesTab
            ├── KPIGrid
            │   └── WidgetCard (×8)
            └── SidePanel
```

### Data Flow
```
ERP System (Source)
    ↓ (API, 5-min sync)
DashboardContext (State)
    ↓ (Props)
Widget Components
    ↓ (Click)
SidePanel (Detail view)
```

### Design Tokens (CSS Variables)
```css
--color-bg-page:          #F0F2F5
--color-bg-card:          #FFFFFF
--color-bg-hover:         #F9FAFB
--color-border:           #E5E7EB
--color-text-primary:     #0F1117
--color-text-secondary:   #374151
--color-text-muted:       #6B7280
--color-text-ghost:       #9CA3AF
--color-accent-blue:      #2563EB
--color-positive:         #16A34A
--color-positive-bg:      #F0FDF4
--color-warning:          #D97706
--color-warning-bg:       #FFFBEB
--color-critical:         #DC2626
--color-critical-bg:      #FEF2F2
--radius-card:            12px
--shadow-card:            0 1px 3px rgba(0,0,0,0.06)
```

### Fonts
| Usage | Font | Weights |
|-------|------|---------|
| KPI Numbers, Amounts | Albert Sans | 400, 500, 600, 700 |
| All other text | Space Grotesk | 400, 500, 600 |

---

## Canonical Data Reference

All widgets must display these exact values for consistency:

| Entity | Metric | Value |
|--------|--------|-------|
| Total Revenue | This month | ₹45L |
| Total COGS | This month | ₹26.5L |
| Gross Profit | This month | ₹18.5L (41% margin) |
| Operating Expense | This month | ₹6.5L |
| Operating Profit | This month | ₹12L |
| Cash Balance | Now | ₹12.45L |
| HDFC Current A/c | Balance | ₹8.2L |
| SBI Savings A/c | Balance | ₹4.25L |
| AR Outstanding | Total | ₹18.5L |
| AR Overdue | Amount | ₹4.2L (8 invoices) |
| AP Outstanding | Total | ₹9.45L |
| AP Overdue | Amount | ₹3.45L (12 bills) |
| Upcoming Payments | Overdue | ₹3.45L · 12 bills |
| Upcoming Payments | 0–7 days | ₹1.8L · 5 bills |
| Upcoming Payments | 8–15 days | ₹4.2L · 8 bills |
| Acme Corp | Overdue AR | ₹2.1L |
| Vendor X | AP Outstanding | ₹4L |
| DSO | This month | 45 days |
| DPO | This month | 38 days |

---

## Definition of Done

A feature is complete when:
- [ ] All acceptance criteria for associated requirements pass
- [ ] No console errors in browser DevTools
- [ ] Panel opens/closes without animation glitches
- [ ] All numbers match Canonical Data Reference
- [ ] Currency formatting follows FR-16 rules
- [ ] Delta badges show correct color per financial context (Revenue ↑ = green, DSO ↑ = red)
- [ ] No "No data available" placeholders in production views
- [ ] Widget display names (not IDs) shown in panel titles
- [ ] Build passes with zero TypeScript errors

---

**End of PRD**
