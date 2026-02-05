# Search Firm Report Card Dashboard

## Overview

Build a web-based analytics dashboard to evaluate and compare the performance and ROI of executive search firms. The goal is to create a "report card" system that helps leadership make data-driven decisions about which recruiting firms deliver the best long-term value.

## Business Context

Executive search firms place senior candidates, but success isn't just about filling roles—it's about whether those placements succeed long-term. Key concerns include:
- Placements leaving within a short timeframe
- Poor cultural fit ("organ rejection")
- Underperformance leading to termination
- High fees relative to outcomes

Some firms argue their numbers look worse simply due to higher placement volume. This dashboard should normalize for that and provide fair comparisons.

---

## Data Model

### Placement Record (Core Entity)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique placement identifier |
| `search_firm` | string | Name of the recruiting firm |
| `candidate_name` | string | Placed candidate (for detail views) |
| `role_title` | string | Position filled |
| `level` | enum | Seniority level (C-Suite, SVP, VP, Director, Senior Manager) |
| `function` | string | Department/function (Finance, Engineering, Marketing, Operations, HR, Legal, etc.) |
| `geography` | string | Region/location (NA, EMEA, APAC, LATAM or specific countries) |
| `placement_date` | date | Start date of the hire |
| `fee_paid` | number | Search firm fee in USD |
| `current_status` | enum | Active, Voluntarily Left, Terminated, Role Eliminated |
| `departure_date` | date | If applicable, when they left |
| `tenure_months` | number | Calculated time in role |
| `performance_rating` | enum | Exceeds, Meets, Below, Too Early to Assess |
| `rhr_assessment` | boolean | Did they complete RHR assessment? |
| `rhr_recommendation` | enum | Strong Hire, Hire, Hire with Caution, Do Not Hire, N/A |
| `notes` | string | Additional context |

---

## Calculated Metrics (Per Search Firm)

### Volume Metrics
- **Total Placements** - count of all hires
- **Active Placements** - currently employed
- **Placements by Level** - distribution across seniority
- **Placements by Function** - distribution across departments

### Success Metrics
- **Retention Rate** - % still employed after 12 months, 24 months
- **Success Rate** - % rated "Meets" or "Exceeds" expectations
- **Early Departure Rate** - % who left within first 12 months
- **Termination Rate** - % terminated for performance/fit

### Financial Metrics
- **Total Fees Paid** - sum of all fees
- **Average Fee** - mean fee per placement
- **Cost per Successful Placement** - total fees / successful hires
- **Cost per Month of Tenure** - fees / total tenure months delivered

### Overall Grade
Calculate a letter grade (A, B, C, D, F) based on weighted composite of:
- Retention Rate (30%)
- Success Rate (30%)
- Cost Efficiency (20%)
- Early Departure Rate (20%, inverse)

---

## Dashboard Views

### 1. Executive Summary / Scorecard

The primary landing page showing all search firms at a glance.

**Display Elements:**
- Firm name with large letter grade (A/B/C/D/F)
- Key stats: Total Placements, Success Rate, Avg Tenure, Total Fees
- Trend indicator (improving/declining vs prior period)
- Sparkline showing placement outcomes over time
- Sortable by any column
- Color-coded grades (A=green, B=light green, C=yellow, D=orange, F=red)

### 2. Firm Deep Dive

Detailed view when clicking into a specific firm.

**Display Elements:**
- Large grade with breakdown of component scores
- List of all placements with status indicators
- Timeline visualization of placements and outcomes
- Performance distribution chart (pie/bar)
- Comparison to overall portfolio average
- Tenure distribution histogram

### 3. Comparison View

Side-by-side comparison of 2-3 selected firms.

**Display Elements:**
- Parallel bar charts for each metric
- Head-to-head win/loss on each dimension
- Recommendation engine: "Based on your filters, Firm X outperforms for [VP-level Finance roles in NA]"

### 4. Placement Explorer

Filterable table of all individual placements.

**Display Elements:**
- Sortable, searchable data table
- Filters for: Firm, Level, Function, Geography, Status, Date Range
- Export to CSV functionality
- Click-through to placement detail

### 5. RHR Assessment Analysis

Special view analyzing whether RHR assessments correlate with better outcomes.

**Display Elements:**
- Split comparison: RHR-assessed vs non-assessed placements
- Success rate comparison
- Tenure comparison
- Correlation analysis: Did RHR "Hire with Caution" candidates actually underperform?

### 6. Trends Over Time

Time-series analysis of firm performance.

**Display Elements:**
- Line charts showing metrics over quarters/years
- Cohort analysis (placements made in 2022 vs 2023 vs 2024)
- Seasonality patterns if any

---

## Filters (Global)

All views should support filtering by:
- **Time Period** - Last 12 months, Last 24 months, All Time, Custom Range
- **Geography** - Multi-select
- **Level** - Multi-select
- **Function** - Multi-select
- **Search Firm** - Multi-select (for aggregate views)

---

## Technical Requirements

### Frontend
- Modern React-based SPA
- Responsive design (desktop-first, but mobile-friendly)
- Clean, professional aesthetic (think: executive dashboard)
- Interactive charts (hover states, click-through)
- Fast filtering without page reloads

### Data
- Start with mock/sample data for demonstration
- Generate realistic sample data for 5-6 search firms
- ~100-200 sample placements spanning 3 years
- Include varied outcomes to show differentiation between firms

### Charts/Visualizations
- Use a modern charting library (Recharts, Chart.js, or similar)
- Letter grades should be prominent and color-coded
- Trend indicators with up/down arrows
- Clean data tables with sorting/filtering

---

## Sample Search Firms (for Mock Data)

1. **Russell Reynolds Associates** - high volume, mixed results
2. **Spencer Stuart** - premium fees, strong outcomes
3. **Heidrick & Struggles** - mid-tier performance
4. **Korn Ferry** - high volume, variable by function
5. **Egon Zehnder** - lower volume, specialized
6. **Caldwell Partners** - regional specialist

---

## User Stories

1. As a **CHRO**, I want to see which search firms deliver the best retention rates so I can prioritize partnerships.

2. As a **Talent Acquisition Leader**, I want to filter by function and level to see which firms are best for specific role types.

3. As a **CFO**, I want to understand cost-per-successful-hire to evaluate recruiting spend efficiency.

4. As an **HR Analyst**, I want to export placement data to perform additional analysis.

5. As a **Hiring Manager**, I want to see if RHR assessments actually predict success so I can decide whether to require them.

---

## Success Criteria

The dashboard should enable users to quickly answer:
- Which search firm should we use for our next SVP of Engineering search?
- Are we getting good ROI from Firm X given their premium fees?
- Should we require RHR assessments for all executive hires?
- Which firms have improved or declined over the past year?
- Is our overall executive hiring success rate improving?

---

## Nice-to-Have Features (Future)

- PDF export of firm scorecards
- Email alerts when a placement outcome changes
- Benchmark data against industry averages
- Integration with HRIS for real-time tenure/status updates
- Notes and commentary on individual placements
