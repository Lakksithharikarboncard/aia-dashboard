# AIA Financial Dashboard — Complete User Journey Report

## Overview

This document describes the complete user journey through the AIA Financial Dashboard, including all tabs, charts, widgets, their purposes, data displayed, and user interactions.

---

## Table of Contents

1. [Navigation Structure](#navigation-structure)
2. [Overview Tab](#overview-tab)
3. [Cash Tab](#cash-tab)
4. [Payables & Receivables Tab](#payables--receivables-tab)
5. [Side Panel System](#side-panel-system)
6. [Data Consistency Reference](#data-consistency-reference)

---

## Navigation Structure

The dashboard has three main tabs accessible via the top navigation bar:

| Tab | Icon | Purpose |
|-----|------|---------|
| **Overview** | Dashboard | High-level financial health at a glance |
| **Cash** | Bank | Cash position, movements, and upcoming payments |
| **Payables & Receivables** | Receipt | AR/AP aging, DSO/DPO metrics, customer/vendor analysis |

---

## Overview Tab

### Purpose
Provides executives with a quick snapshot of financial health — cash position, profitability, revenue trends, and AI-powered insights.

### Zone A: Key Metrics (Top Section)

#### Row 1: Cash Balance | Gross Profit

**Cash Balance (6 columns)**
- **Widget ID:** `w1-cash`
- **Displays:**
  - Total cash balance across all accounts: **₹12.45L**
  - Trend badge: **+8.5% vs last month** (green, positive)
- **Panel on click:** Opens side panel showing:
  - Account-wise breakdown (HDFC Current: ₹8.2L, SBI Savings: ₹4.25L)
  - Recent cash movements (last 5 transactions)
- **Data source:** Bank account balances aggregated

**Gross Profit (6 columns)**
- **Widget ID:** `w7-gross-profit`
- **Displays:**
  - Gross profit amount: **₹18.5L**
  - Gross margin: **41%** (blue badge)
  - Trend badge: **+7.6% vs last month** (green, positive)
  - Revenue: ₹45L
  - COGS: ₹26.5L
- **Panel on click:** Opens side panel showing:
  - This period summary (Revenue, COGS, Gross Profit, Margin)
  - Comparison table: This Month vs Last Month
- **Data source:** P&L statement, calculated as Revenue − COGS

#### Row 2: AI Insights Accordion

**AI Insights Strip (12 columns, full width)**
- **Component:** `AIInsightsAccordion`
- **Purpose:** Machine-learning generated insights about financial anomalies and trends
- **Displays 3 insights:**

| Severity | Title | Summary | Source |
|----------|-------|---------|--------|
| 🔴 Critical | Overdue receivables up 34% vs last month | ₹4,20,000 overdue across 8 invoices — up from ₹3,12,000 | Receivables |
| 🟡 Watch | DSO increased 12% — Acme Corp contributing 14 days | 45 days vs 40 days target — Acme Corp is the primary driver | Overview |
| 🟢 Positive | Operating margin improved to 26.7% | +5.2pp vs prior period — driven by stable COGS and lower indirect expense | Overview |

**Interactions:**
- Click chevron (right side) to expand/collapse each insight
- Expanding one row automatically collapses others (accordion behavior)
- Chevron rotates 180° on expand (150ms ease animation)
- Expanded view shows 4 sections:
  1. **WHAT WE FOUND:** Detailed explanation of the insight
  2. **WHY IT MATTERS:** Business impact and risk assessment
  3. **SUGGESTED REVIEW:** Recommended action items
  4. **BASED ON:** Pill badges showing data sources
- Feedback buttons (👍 Helpful / 👎 Not helpful) at bottom of expanded content

---

### Zone B: Detailed Analysis (Bottom Section)

#### Row 1: Revenue vs Expense (Full Width)

**Revenue vs Expense Chart (12 columns)**
- **Widget ID:** `w10-rev-vs-exp`
- **Chart type:** ComposedChart (Bars + Line)
- **Displays:**
  - 6-month trend (Jan–Jun 2024)
  - Blue bars: Revenue (left Y-axis, ₹L notation)
  - Grey bars: Expense (left Y-axis, ₹L notation)
  - Blue line: Net Surplus (right Y-axis, ₹L notation)
  - Current month net surplus: **₹12L** with **+26.7%** badge
- **Data points:**

| Month | Revenue | Expense | Net Surplus |
|-------|---------|---------|-------------|
| Jan | ₹30L | ₹25L | ₹5L |
| Feb | ₹31.5L | ₹26L | ₹5.5L |
| Mar | ₹32L | ₹26.5L | ₹5.5L |
| Apr | ₹34L | ₹27L | ₹7L |
| May | ₹38L | ₹28L | ₹10L |
| Jun | ₹45L | ₹33L | ₹12L |

**Interactions:**
- Hover on bars/line: Tooltip shows exact values
- Legend: Click to toggle visibility of Revenue/Expense/Net Surplus
- Panel on click: Opens side panel showing:
  - Summary KPIs (Revenue, Expense, Net Surplus with deltas)
  - Monthly breakdown table (6 months)
  - Expense by category table (COGS, Salaries, Rent, Marketing, Other)

---

#### Row 2: Expense Breakdown (Full Width)

**Expense Breakdown (12 columns)**
- **Widget ID:** `w11-exp-breakdown`
- **Displays:**
  - Total expense: **₹33L**
  - Trend badge: **+3.8% vs last month**
  - 5 category cards with progress bars:

| Category | Amount | % of Expense | Color |
|----------|--------|--------------|-------|
| COGS | ₹26.5L | 80% | Blue (#2563EB) |
| Salaries | ₹3.2L | 10% | Indigo (#6366F1) |
| Rent | ₹1.2L | 4% | Sky (#0EA5E9) |
| Marketing | ₹95,000 | 3% | Purple (#8B5CF6) |
| Other | ₹1.15L | 3% | Slate (#94A3B8) |

**Interactions:**
- Panel on click: Opens side panel with:
  - Category table (Amount, % of Total, vs Last Month)
  - Interactive category selection (click row to select)
  - Sub-ledger detail section showing breakdown of selected category
  - COGS detail: Purchase Accounts (₹22L, 83%), Direct Expenses (₹4.5L, 17%)
  - Note: "Direct Expenses classified under COGS only. They do not appear in Operating Expense."
  - Other categories show: "No sub-ledger detail available for this category."

---

#### Row 3: P&L Statement | Revenue Trend

**P&L Statement (6 columns)**
- **Widget ID:** `w7-pnl-full`
- **Displays:**
  - Revenue: ₹45L
  - COGS: ₹26.5L
  - Gross Profit: ₹18.5L (41% margin badge)
  - Operating Expense: ₹6.5L
  - Operating Profit: **₹12L** (with tooltip explaining "Revenue minus cost of goods and operating expenses, before tax")
- **Panel on click:** Opens side panel showing:
  - Full income statement with sub-ledger details
    - Revenue breakdown: Sales Accounts (₹38.5L), Direct Incomes (₹6.5L)
    - COGS breakdown: Purchase Accounts (₹22L), Direct Expenses (₹4.5L)
  - Comparison table: This Month vs Last Month (Revenue, Gross Profit, Operating Expense, Operating Profit)

**Revenue Trend (6 columns)**
- **Widget ID:** `w8-rev-full`
- **Chart type:** AreaChart with gradient fill
- **Displays:**
  - Grain toggle: Day | Week | Month (default: Month)
  - Current period value with trend badge
  - 6 data points based on selected grain

| Grain | Current | Previous | Change |
|-------|---------|----------|--------|
| Day | ₹2,00,000 (Today) | ₹1,90,000 | +5.3% |
| Week | ₹10,20,000 (This week) | ₹9,80,000 | +4.1% |
| Month | ₹45L (This month) | ₹42L | +7.1% |

**Interactions:**
- Grain toggle: Switches chart data granularity
- Hover on chart: Tooltip shows exact value for date
- Panel on click: Opens side panel showing:
  - Current period summary
  - Monthly breakdown table (Jan–Jun 2024 with MoM change)
  - Top customers this month (Acme Corp, Globex Inc, Soylent Corp)

---

#### Row 4: Top Customers by Revenue (Full Width)

**Top Customers (12 columns)**
- **Widget ID:** `w9-top-customers`
- **Displays 4 customer cards:**

| Customer | Revenue | Share | Trend | Progress Bar |
|----------|---------|-------|-------|--------------|
| Acme Corp | ₹12L | 26.7% | +8.2% | 65% filled (blue gradient) |
| Globex Inc | ₹8.5L | 18.9% | +3.1% | 48% filled |
| Soylent Corp | ₹4.2L | 9.3% | −2.4% | 28% filled |
| Initech | ₹1.8L | 4.0% | +0.9% | 12% filled |

**Interactions:**
- Panel on click: Opens side panel showing:
  - Rankings table (Rank, Customer, Revenue, Share, vs Last Month)
  - Click customer row to select
  - Open invoices table for selected customer (Invoice #, Amount, Due Date, Status badge)
  - Status badges: Overdue (red), Due (grey)

---

## Cash Tab

### Purpose
Provides detailed view of cash position, bank account balances, cash flow movements, and upcoming payment obligations.

### Zone A: Cash Position

#### Row 1: Cash Balance | Cash Inflow vs Outflow

**Cash Balance (6 columns)**
- **Widget ID:** `w1-cash` (same as Overview)
- **Displays:**
  - Total cash: **₹12.45L**
  - Trend: **+8.5% vs last month**
  - Account breakdown cards:
    - HDFC Current A/c: ₹8.2L (+₹45,000)
    - SBI Savings A/c: ₹4.25L (−₹12,000)
- **Panel on click:** Same as Overview tab

**Cash Inflow vs Outflow (6 columns)**
- **Widget ID:** `w12-cash-flow`
- **Chart type:** ComposedChart or BarChart
- **Displays:**
  - Cash In: ₹48.2L
  - Cash Out: ₹35.8L
  - Net Flow: **+₹12.4L** (green, positive)
  - Weekly breakdown (4 weeks)
- **Panel on click:** Opens side panel showing:
  - Summary KPIs (Cash In, Cash Out, Net Flow)
  - Weekly breakdown table (W1–W4 with Net column, red for negative weeks)
  - Inflow sources (Customer payments 88%, Advance receipts 8%, Other 4%)
  - Outflow categories (Vendor payments 52%, Salaries 23%, Rent 10%, Tax 8%, Other 7%)
  - Note: "Internal transfers excluded from both inflow and outflow."

---

### Zone B: Upcoming Payments

**Upcoming Payments (Full Width)**
- **Widget ID:** `w13-upcoming-cash`
- **Displays 3 bucket sections with vertical dividers:**

| Bucket | Amount | Bill Count | Styling |
|--------|--------|------------|---------|
| OVERDUE | ₹3.45L | 12 bills | Red background (#FEF2F2), red text |
| DUE IN 0–7 DAYS | ₹1.8L | 5 bills | White background |
| DUE IN 8–15 DAYS | ₹4.2L | 8 bills | White background |

**Interactions:**
- Panel on click: Opens side panel showing:
  - Overdue section: Vendor/bill table with amount and days overdue
  - 0–7 days section: Vendor/bill table with due dates
  - 8–15 days section: Vendor/bill table with due dates
  - Each section shows top 3–4 bills with "+ X more bills" note

---

## Payables & Receivables Tab

### Purpose
Provides detailed analysis of accounts receivable (AR) and accounts payable (AP), including aging buckets, DSO/DPO metrics, and customer/vendor concentration.

### Zone A: Key Metrics

#### Row 1: AR Outstanding | DSO | AP Outstanding | DPO

**AR Outstanding (3 columns)**
- **Widget ID:** `w14-ar-out`
- **Displays:**
  - Total AR: **₹18.5L**
  - Overdue: **₹4.2L** (8 invoices, red badge)
  - Average age: 42 days
- **Panel on click:** Opens side panel showing:
  - Summary grid (Total AR, Overdue, Avg Age)
  - Open invoices table (Customer, Invoice, Amount, Due Date, Status)

**DSO — Days Sales Outstanding (3 columns)**
- **Widget ID:** `w15-dso`
- **Displays:**
  - DSO: **45 days**
  - Trend: **+12% vs last month** (red, negative — higher DSO is bad)
  - Target: 40 days
  - Variance badge: "15 days above target" (red)
- **Panel on click:** Opens side panel showing:
  - Metric summary with target comparison
  - Customer contribution table (Customer, Contribution days, %, Avg days, Outstanding)
  - 3-month trend table (Apr: 38d, May: 41d, Jun: 45d)
  - Warning note: "DSO has risen 3 consecutive months."

**AP Outstanding (3 columns)**
- **Widget ID:** `w18-ap-out`
- **Displays:**
  - Total AP: **₹9.45L**
  - Overdue: **₹3.45L** (12 bills, red badge)
  - Largest vendor: Vendor X (₹4L)
- **Panel on click:** Opens side panel showing:
  - Summary grid (Total AP, Overdue, Largest Vendor)
  - Open bills table (Vendor, Bill No, Amount, Due Date, Status)

**DPO — Days Payable Outstanding (3 columns)**
- **Widget ID:** `w19-dpo`
- **Displays:**
  - DPO: **38 days**
  - Trend: **−5% vs last month** (neutral — lower DPO is mixed)
  - Target range: 30–45 days
  - Status badge: "Within target range" (green)
- **Panel on click:** Opens side panel showing:
  - Metric summary with target range
  - Vendor contribution table
  - 3-month trend table (Apr: 42d, May: 40d, Jun: 38d)
  - Note: "DPO is declining but remains within target floor (30 days)."

---

### Zone B: Aging Analysis

#### Row 1: AR Aging | AP Aging

**AR Aging (6 columns)**
- **Widget ID:** `w16-ar-aging`
- **Displays:**
  - Bucket summary table:

| Bucket | Invoices | Amount | % Total AR |
|--------|----------|--------|------------|
| Current | 22 | ₹14.3L | 77.3% |
| 1–30 days | 3 | ₹2.1L | 11.4% |
| 31–60 days | 2 | ₹1.2L | 6.5% |
| 61–90 days | 1 | ₹65,000 | 3.5% |
| 90+ days | 1 | ₹25,000 | 1.4% |

- **Panel on click:** Opens side panel showing:
  - Bucket summary table
  - All overdue invoices table (Customer, Invoice, Amount, Days overdue)

**AP Aging (6 columns)**
- **Widget ID:** `w20-ap-aging`
- **Displays:**
  - Bucket summary table:

| Bucket | Bills | Amount | % Total AP |
|--------|-------|--------|------------|
| Current | 18 | ₹6.1L | 64.6% |
| 1–30 days | 6 | ₹1.6L | 16.9% |
| 31–60 days | 4 | ₹1.05L | 11.1% |
| 61–90 days | 3 | ₹52,000 | 5.5% |
| 90+ days | 1 | ₹18,000 | 1.9% |

- **Panel on click:** Opens side panel showing:
  - Bucket summary table
  - All overdue bills table (Vendor, Bill No, Amount, Due Date, Days overdue)

---

#### Row 2: Top Customers — Overdue AR | Vendor Spend Concentration

**Top Customers — Overdue AR (6 columns)**
- **Widget ID:** `w17-top-ar`
- **Displays:**
  - Rankings table for customers with overdue AR:

| Rank | Customer | Overdue AR | % Total | Oldest |
|------|----------|------------|---------|--------|
| 1 | Acme Corp | ₹2.1L | 50.0% | 30d (INV-2241) |
| 2 | Soylent Corp | ₹1.2L | 28.6% | 23d (INV-2198) |
| 3 | Globex Inc | ₹90,000 | 21.4% | 17d (INV-2187) |

- **Interactions:**
  - Click customer row to select
  - Bottom section updates to show invoices for selected customer
- **Panel on click:** Opens side panel showing:
  - Overdue rankings table
  - Invoices for selected customer (Invoice, Amount, Due Date, Overdue days)
  - Last payment note for selected customer

**Vendor Spend Concentration (6 columns)**
- **Widget ID:** `w21-vendor-spend`
- **Displays:**
  - Top vendors table:

| Rank | Vendor | Billed | Share | vs Last Month |
|------|--------|--------|-------|---------------|
| 1 | Vendor X | ₹4L | 42.3% | +5.2% |
| 2 | Supplier Y | ₹2.5L | 26.5% | −1.8% |
| 3 | Agency Z | ₹1.5L | 15.9% | +0.4% |
| 4 | Others | ₹1.45L | 15.3% | — |

- **Warning note:** "Vendor X accounts for 42.3% of total billed spend this month." (amber text — high concentration risk)
- **Interactions:**
  - Click vendor row to select
  - Bottom section updates to show bills for selected vendor
- **Panel on click:** Opens side panel showing:
  - Top vendors rankings table
  - Bills for selected vendor (Bill No, Amount, Date, Status)
  - Total billed this month summary

---

## Side Panel System

### Architecture

**Panel Container:**
- Width: 420px
- Position: Fixed overlay on right side
- Header: Sticky with title, period, close button (X)
- Body: Scrollable with vertical sections
- Trigger: Click any widget card
- Close: Click X button, click outside, or press Escape

### Panel Components

**SectionLabel:**
- Font: Space Grotesk 10px 600
- Color: #9CA3AF (text-ghost)
- Text transform: UPPERCASE
- Letter spacing: 0.8px

**Tables:**
- Headers: Space Grotesk 10px 600 #9CA3AF UPPERCASE
- Body: Space Grotesk 13px #111827
- Amount columns: Albert Sans 600, right-aligned
- Row divider: 1px solid rgba(0,0,0,0.04)
- Row hover: Background #F9FAFB

**Status Badges:**
- Overdue: Background #FEF2F2, Text #DC2626, Border #FECACA
- Due: Background #F9FAFB, Text #374151, Border #E5E7EB
- Positive: Background #F0FDF4, Text #16A34A, Border #BBF7D0
- Warning: Background #FFFBEB, Text #D97706, Border #FDE68A
- All: Border-radius 4px, Padding 2px 6px, Font-size 11px 500

### Widget Display Names

Panels never show widget IDs. Mapping:

| Widget ID | Display Name |
|-----------|--------------|
| w1-cash | Cash Balance |
| w2-pnl-compressed | P&L Summary |
| w3-rev-spark | Revenue Trend |
| w6-upcoming | Upcoming Payments |
| w7-gross-profit | Gross Profit |
| w7-pnl-full | P&L Statement |
| w8-rev-full | Revenue Trend |
| w9-top-customers | Top Customers |
| w10-rev-vs-exp | Revenue vs Expense |
| w11-exp-breakdown | Expense Breakdown |
| w12-cash-flow | Cash Inflow vs Outflow |
| w13-upcoming-cash | Upcoming Payments |
| w14-ar-out | AR Outstanding |
| w15-dso | Days Sales Outstanding |
| w16-ar-aging | AR Aging |
| w17-top-ar | Top Customers — Overdue AR |
| w18-ap-out | AP Outstanding |
| w19-dpo | Days Payable Outstanding |
| w20-ap-aging | AP Aging |
| w21-vendor-spend | Vendor Spend Concentration |

---

## Data Consistency Reference

### Canonical Values (Single Source of Truth)

All widgets and panels must display these exact values:

| Entity | Metric | Canonical Value |
|--------|--------|-----------------|
| **Revenue** | This month | ₹45L |
| **COGS** | This month | ₹26.5L |
| **Gross Profit** | This month | ₹18.5L (41% margin) |
| **Operating Expense** | This month | ₹6.5L |
| **Operating Profit** | This month | ₹12L |
| **Cash Balance** | Now | ₹12.45L |
| **HDFC Current A/c** | Balance | ₹8.2L |
| **SBI Savings A/c** | Balance | ₹4.25L |
| **AR Outstanding** | Total | ₹18.5L |
| **AR Overdue** | Amount | ₹4.2L (8 invoices) |
| **AP Outstanding** | Total | ₹9.45L |
| **AP Overdue** | Amount | ₹3.45L (12 bills) |
| **Upcoming Payments** | Overdue | ₹3.45L · 12 bills |
| **Upcoming Payments** | 0–7 days | ₹1.8L · 5 bills |
| **Upcoming Payments** | 8–15 days | ₹4.2L · 8 bills |
| **Acme Corp** | Overdue AR | ₹2.1L |
| **Vendor X** | AP Outstanding | ₹4L (billed this month) |
| **DSO** | This month | 45 days |
| **DPO** | This month | 38 days |

### Number Formatting Rules

| Value Range | Format | Example |
|-------------|--------|---------|
| < ₹1,00,000 | Full number with commas | ₹85,000 |
| ₹1,00,000 – ₹99,99,999 | L shorthand | ₹8.5L |
| ₹1,00,00,000+ | Cr shorthand | ₹1.2Cr |
| Chart Y-axes | Always ₹L notation | ₹30L, ₹35L |
| Deltas | Always 1 decimal place | 8.5% |

---

## Interaction Summary

### Click Interactions

| Element | Action | Result |
|---------|--------|--------|
| Widget card | Click anywhere | Opens side panel with detailed view |
| Widget card | Hover | Card lifts (translateY -2px), shadow increases |
| AI Insights chevron | Click | Expands/collapses insight (accordion behavior) |
| Panel table row (customer/vendor) | Click | Selects row, updates detail section |
| Panel close button (X) | Click | Closes panel |
| Panel body | Scroll | Vertical scroll for long content |
| Grain toggle (Day/Week/Month) | Click | Switches chart data granularity |
| Expense category row | Click | Updates sub-ledger detail section |
| Chart legend item | Click | Toggles series visibility |
| Chart bar/line | Hover | Shows tooltip with exact values |

### Keyboard Interactions

| Key | Action |
|-----|--------|
| Escape | Close side panel |

---

## Visual Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| --color-bg-page | #F0F2F5 | Page background |
| --color-bg-card | #FFFFFF | Card background |
| --color-bg-hover | #F9FAFB | Row hover, selected state |
| --color-border | #E5E7EB | Card borders, dividers |
| --color-text-primary | #0F1117 | Primary text |
| --color-text-secondary | #374151 | Secondary text |
| --color-text-muted | #6B7280 | Muted text |
| --color-text-ghost | #9CA3AF | Labels, placeholders |
| --color-accent-blue | #2563EB | Revenue, primary actions |
| --color-positive | #16A34A | Positive trends, profit |
| --color-positive-bg | #F0FDF4 | Positive backgrounds |
| --color-warning | #D97706 | Watch insights, caution |
| --color-warning-bg | #FFFBEB | Warning backgrounds |
| --color-critical | #DC2626 | Overdue, negative trends |
| --color-critical-bg | #FEF2F2 | Critical backgrounds |
| --color-live-badge | #0D9488 | LIVE badge (removed from Overview) |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| KPI numbers | Albert Sans | 24–32px | 700 |
| Amounts in tables | Albert Sans | 13px | 600 |
| All other text | Space Grotesk | 10–14px | 400–600 |
| Section labels | Space Grotesk | 10px | 600 |
| Table headers | Space Grotesk | 10px | 600 |

### Card Styling

- Background: White (#FFFFFF)
- Border: 1px solid #E5E7EB
- Border-radius: 12px
- Padding: 20px 24px
- Box-shadow: 0 1px 3px rgba(0,0,0,0.06)
- Hover: translateY(-2px), shadow 0 4px 12px rgba(0,0,0,0.08)

---

## End of Report

This document describes the complete user journey through the AIA Financial Dashboard as of the current implementation. All data values, interactions, and visual specifications are based on the canonical data table and design tokens defined in `CLAUDE.md`.
