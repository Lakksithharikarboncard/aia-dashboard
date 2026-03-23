# AIA Dashboard: Comprehensive Technical & Functional Report

This report provides a detailed overview of the AIA Dashboard's architecture, data visualizations, and interactive capabilities.

---

## 1. Core Architecture & State Management

The dashboard is built using **React (TypeScript)** and **Mantine UI**, emphasizing a clean, "Financial OS" aesthetic.

### State Management (`DashboardContext`)
The application's behavior is orchestrated by a central `DashboardContext`:
- **`activeTab`**: Manages top-level navigation (Overview, Cash, Payables).
- **`isPanelOpen` / `activeWidgetId`**: Controls the side panel's visibility and content.
- **`panelView`**: Toggles between **Summary** and **Detail** views within the side panel.
- **`dateRange`**: A global filter (e.g., "This Month", "Last Quarter") that propagates to all widgets.

---

## 2. Dashboard Tabs & Widget Inventory

### **Tab: Overview**
*Focus: High-level financial health and trends.*

| Widget ID | Title | Component | Purpose |
| :--- | :--- | :--- | :--- |
| `w1-cash` | **Cash Balance** | KPI + Sparkline | **Zone A**: Immediate liquidity status. |
| `w2-pnl-compressed` | **P&L Summary** | KPI Grid | **Zone A**: Rev/GP/OP comparison vs last month. |
| `w3-rev-spark` | **Revenue Trend** | Sparkline | **Zone A**: Quick visual of revenue direction. |
| `w7-pnl-full` | **P&L Statement** | Table/List | Detailed breakdown of Revenue, COGS, and Expenses. |
| `w8-rev-full` | **Revenue Trend** | Line Chart | Interactive trend analysis with **Grain Toggle**. |
| `w9-top-customers` | **Top Customers** | Horizontal Bar | Ranking of top 5 customers by revenue contribution. |

---

### **Tab: Cash**
*Focus: Liquidity, runway, and cash flow dynamics.*

| Widget ID | Title | Component | Purpose |
| :--- | :--- | :--- | :--- |
| `w10-cash-full` | **Cash Balance** | KPI + Breakdown | Detailed balances for HDFC and SBI accounts. |
| `w11-cash-runway` | **Cash Runway** | KPI + Logic | Forecast of operational days remaining based on burn. |
| `w12-cash-flow` | **Inflow vs Outflow** | Grouped Bar | **Grain Toggle**: Analyze collections vs. spend. |
| `w13-upcoming-cash` | **Upcoming Payments**| List | Critical view of immediate cash requirements. |

---

### **Tab: Payables & Receivables**
*Focus: Risk assessment and working capital management.*

| Widget ID | Title | Component | Purpose |
| :--- | :--- | :--- | :--- |
| `w14-ar-out` | **AR Outstanding** | KPI + Stats | Total receivables and overdue invoice counts. |
| `w16-ar-aging` | **AR Aging** | Stacked Bar | Buckets: 1-30, 31-60, 61-90, and 90+ days. |
| `w17-top-ar` | **Top Overdue AR** | Horizontal Bar | Identification of highest-risk customers. |
| `w18-ap-out` | **AP Outstanding** | KPI + Stats | Total payables and overdue bill counts. |
| `w20-ap-aging` | **AP Aging** | Stacked Bar | Vendor aging buckets to prioritize payments. |
| `w21-vendor-spend` | **Vendor Spend** | Horizontal Bar | Concentration of spend across top suppliers. |

---

## 3. Interaction Design & User Experience

### **A. Side Panel Drill-down**
Every chart and KPI card is interactive. Clicking a card opens a context-aware side panel.
- **Summary Tab**: Provides AI-driven insights, key line items, and semantic highlights.
- **Detail Tab**: Offers granular data (e.g., individual invoice numbers, specific dates, or sub-category splits).
- **Zone A vs Zone B**: Simple widgets (`w1-w6`) are "Overview Only" (Summary), while complex widgets support the "Detail" view.

### **B. Programmatic Navigation**
The side panel often contains **Call-to-Action (CTA)** buttons that allow "Deep Linking" between tabs. For example, a "Go to Cash Tab" button in the "Cash Balance" summary updates the global state to navigate the user immediately.

### **C. Temporal Granularity (Grain Toggles)**
Main analytical charts (Revenue and Cash Flow) feature local **Grain Toggles** (Day, Week, Month). This allows users to switch from high-level strategic views to granular daily tracking without leaving the tab.

### **D. Intelligence Layers**
- **TrendBadges**: Semantic indicators (Green/Red/Neutral) showing period-over-period performance.
- **AIInsightsStrip**: Tab-specific notifications highlight anomalies like "High DSO detected" or "Duplicate invoices found."
- **Data Quality Warnings**: Certain panels display warnings if the underlying data requires reconciliation.

---

## 4. Design Language
- **Typography**: Uses `Albert Sans` for numbers/KPIs and `Space Grotesk` for labels/UI elements.
- **Visuals**: Charts use a sophisticated, muted palette with high-contrast accents for "Active" data points.
- **Responsiveness**: Layout uses a CSS Grid/Flexbox hybrid to ensure widgets reflow based on screen size.
