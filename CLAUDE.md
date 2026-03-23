# AIA Financial Dashboard — Claude Code Context

## Stack
React + TypeScript + Mantine UI

## Design Tokens (never invent colors — only use these)
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

## Typography
KPI numbers:   Albert Sans 700
All other text: Space Grotesk
Never use: Inter, Arial, Roboto, system-ui

## Number Formatting (apply everywhere without exception)
Under ₹1,00,000:     full number with commas    e.g. ₹85,000
₹1,00,000 and above: L shorthand               e.g. ₹8.5L
₹1,00,00,000 above:  Cr shorthand              e.g. ₹1.2Cr
Chart Y-axes:         always ₹L notation, never raw integers
Deltas:               always 1 decimal place    e.g. 8.5%

## Card Rules
- background: white, border: 1px #E5E7EB, border-radius: 12px
- padding: 20px 24px
- box-shadow: 0 1px 3px rgba(0,0,0,0.06)

## Table Rules
- Headers: Space Grotesk 10px 600 #9CA3AF UPPERCASE letter-spacing 0.5px
- Body: Space Grotesk 13px 400 #111827
- Amount columns: right-aligned, Albert Sans 600
- Row divider: 1px solid #E5E7EB opacity 0.5
- Row hover: background #F9FAFB

## Status Badge Rules
- Overdue:  bg #FEF2F2 text #DC2626 border 1px #FECACA
- Pending:  bg #FFFBEB text #D97706 border 1px #FDE68A
- Positive: bg #F0FDF4 text #16A34A border 1px #BBF7D0
- All: border-radius 4px padding 2px 6px font-size 11px 500

## Panel Rules
- Width: 420px, right side
- No Summary/Detail tab toggle — single scrollable view
- Header: sticky, 20px 24px padding, border-bottom 1px #E5E7EB
- Body: padding 0 24px, overflow-y auto
- No CTAs — panel is read-only

## Widget Display Names (NEVER render widget IDs in UI)
"w1-cash":           "Cash Balance"
"w2-pnl-compressed": "P&L Summary"
"w3-rev-spark":      "Revenue Trend"
"w6-upcoming":       "Upcoming Payments"
"w7-gross-profit":   "Gross Profit"
"w7-pnl-full":       "P&L Statement"
"w8-rev-full":       "Revenue Trend"
"w9-top-customers":  "Top Customers"
"w10-cash-full":     "Cash Balance"
"w10-rev-vs-exp":    "Revenue vs Expense"
"w11-exp-breakdown": "Expense Breakdown"
"w12-cash-flow":     "Cash Inflow vs Outflow"
"w13-upcoming-cash": "Upcoming Payments"
"w14-ar-out":        "AR Outstanding"
"w15-dso":           "Days Sales Outstanding"
"w16-ar-aging":      "AR Aging"
"w17-top-ar":        "Top Customers — Overdue AR"
"w18-ap-out":        "AP Outstanding"
"w19-dpo":           "Days Payable Outstanding"
"w20-ap-aging":      "AP Aging"
"w21-vendor-spend":  "Vendor Spend Concentration"
"w22-upcoming-ap":   "Upcoming Payments"

## Canonical Data (enforce everywhere — correct any mismatch)
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

## What done means
- Every widget state handled
- Every panel has real content — zero placeholder text anywhere
- Every interactive element works
- Every number formatted correctly
- Data consistent across all tabs
