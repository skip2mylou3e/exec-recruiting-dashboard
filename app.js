// Thomson Reuters Executive Search Firm Report Card Dashboard

const { useState, useMemo, useEffect } = React;
const {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, ComposedChart
} = Recharts;

// ==================== THOMSON REUTERS MOCK DATA ====================

// Thomson Reuters Business Context
const TR_BUSINESS_LINES = [
    'Legal Professionals',
    'Corporates',
    'Tax & Accounting',
    'Reuters News',
    'Risk & Compliance',
    'Global Print'
];

const TR_REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM'];

const TR_FUNCTIONS = [
    'Technology & Engineering',
    'Finance & Accounting',
    'Legal & Compliance',
    'Sales & Commercial',
    'Product Management',
    'Marketing & Communications',
    'Human Resources',
    'Operations',
    'Risk & Regulatory',
    'Strategy & Corporate Development',
    'Data & Analytics'
];

const TR_LEVELS = ['C-Suite', 'SVP', 'VP', 'Director', 'Senior Manager'];

const SEARCH_FIRMS = [
    { id: 'rra', name: 'Russell Reynolds Associates', specialty: 'C-Suite & Board' },
    { id: 'ss', name: 'Spencer Stuart', specialty: 'Premium Executive Search' },
    { id: 'hs', name: 'Heidrick & Struggles', specialty: 'Leadership Advisory' },
    { id: 'kf', name: 'Korn Ferry', specialty: 'Full-spectrum Talent' },
    { id: 'ez', name: 'Egon Zehnder', specialty: 'Board & CEO Advisory' },
    { id: 'cp', name: 'Caldwell Partners', specialty: 'Technology & Digital' }
];

const STATUSES = ['Active', 'Voluntarily Left', 'Terminated', 'Role Eliminated'];
const PERFORMANCE_RATINGS = ['Exceeds', 'Meets', 'Below', 'Too Early to Assess'];
const RHR_RECOMMENDATIONS = ['Strong Hire', 'Hire', 'Hire with Caution', 'Do Not Hire', 'N/A'];

// Executive Names (realistic for Thomson Reuters context)
const EXEC_NAMES = [
    'Michael Chen', 'Sarah Thompson', 'James Rodriguez', 'Emily Watson', 'David Kim',
    'Jennifer Martinez', 'Robert Johnson', 'Lisa Anderson', 'Christopher Lee', 'Amanda Davis',
    'Matthew Wilson', 'Rebecca Taylor', 'Andrew Brown', 'Katherine Miller', 'Daniel Garcia',
    'Michelle Thomas', 'Steven Moore', 'Laura Jackson', 'Kevin White', 'Rachel Harris',
    'Brian Martin', 'Nicole Robinson', 'Eric Clark', 'Samantha Lewis', 'Jason Walker',
    'Christina Hall', 'Mark Allen', 'Ashley Young', 'Timothy King', 'Melissa Wright',
    'Ryan Scott', 'Stephanie Green', 'Brandon Adams', 'Angela Baker', 'Patrick Nelson',
    'Heather Hill', 'Justin Campbell', 'Megan Mitchell', 'Gregory Roberts', 'Kimberly Carter',
    'Priya Patel', 'Raj Sharma', 'Wei Zhang', 'Yuki Tanaka', 'Hans Mueller',
    'Sophie Bernard', 'Carlos Fernandez', 'Ana Santos', 'Pierre Dubois', 'Marie Laurent'
];

// Role Titles by Level and Function
const ROLE_TITLES = {
    'C-Suite': {
        'Technology & Engineering': ['Chief Technology Officer', 'Chief Information Officer', 'Chief Digital Officer'],
        'Finance & Accounting': ['Chief Financial Officer', 'Chief Accounting Officer'],
        'Legal & Compliance': ['Chief Legal Officer', 'General Counsel', 'Chief Compliance Officer'],
        'Sales & Commercial': ['Chief Commercial Officer', 'Chief Revenue Officer'],
        'Product Management': ['Chief Product Officer'],
        'Marketing & Communications': ['Chief Marketing Officer', 'Chief Communications Officer'],
        'Human Resources': ['Chief Human Resources Officer', 'Chief People Officer'],
        'Operations': ['Chief Operating Officer'],
        'Risk & Regulatory': ['Chief Risk Officer'],
        'Strategy & Corporate Development': ['Chief Strategy Officer'],
        'Data & Analytics': ['Chief Data Officer', 'Chief Analytics Officer']
    },
    'SVP': {
        'Technology & Engineering': ['SVP Engineering', 'SVP Technology Platforms', 'SVP Infrastructure'],
        'Finance & Accounting': ['SVP Finance', 'SVP Financial Planning', 'SVP Corporate Controller'],
        'Legal & Compliance': ['SVP Legal Affairs', 'SVP Regulatory Compliance'],
        'Sales & Commercial': ['SVP Global Sales', 'SVP Enterprise Sales', 'SVP Commercial Strategy'],
        'Product Management': ['SVP Product Strategy', 'SVP Product Development'],
        'Marketing & Communications': ['SVP Global Marketing', 'SVP Brand Strategy'],
        'Human Resources': ['SVP Talent Acquisition', 'SVP Total Rewards'],
        'Operations': ['SVP Global Operations', 'SVP Business Operations'],
        'Risk & Regulatory': ['SVP Risk Management', 'SVP Regulatory Affairs'],
        'Strategy & Corporate Development': ['SVP Corporate Development', 'SVP Strategic Partnerships'],
        'Data & Analytics': ['SVP Data Science', 'SVP Business Intelligence']
    },
    'VP': {
        'Technology & Engineering': ['VP Software Engineering', 'VP Cloud Architecture', 'VP DevOps', 'VP Security'],
        'Finance & Accounting': ['VP Finance', 'VP FP&A', 'VP Tax', 'VP Treasury'],
        'Legal & Compliance': ['VP Legal', 'VP Contracts', 'VP Privacy'],
        'Sales & Commercial': ['VP Sales', 'VP Business Development', 'VP Customer Success'],
        'Product Management': ['VP Product', 'VP Product Design', 'VP UX'],
        'Marketing & Communications': ['VP Marketing', 'VP Digital Marketing', 'VP Content'],
        'Human Resources': ['VP HR', 'VP Compensation', 'VP Learning & Development'],
        'Operations': ['VP Operations', 'VP Process Excellence'],
        'Risk & Regulatory': ['VP Risk', 'VP Compliance'],
        'Strategy & Corporate Development': ['VP Strategy', 'VP M&A'],
        'Data & Analytics': ['VP Analytics', 'VP Data Engineering']
    },
    'Director': {
        'Technology & Engineering': ['Director Engineering', 'Director Platform', 'Director QA'],
        'Finance & Accounting': ['Director Finance', 'Director Accounting', 'Director Audit'],
        'Legal & Compliance': ['Director Legal Operations', 'Director Compliance'],
        'Sales & Commercial': ['Director Sales', 'Director Partnerships'],
        'Product Management': ['Director Product', 'Director Product Operations'],
        'Marketing & Communications': ['Director Marketing', 'Director Communications'],
        'Human Resources': ['Director HR', 'Director Talent'],
        'Operations': ['Director Operations', 'Director PMO'],
        'Risk & Regulatory': ['Director Risk', 'Director Regulatory'],
        'Strategy & Corporate Development': ['Director Strategy', 'Director Corp Dev'],
        'Data & Analytics': ['Director Data Science', 'Director Analytics']
    },
    'Senior Manager': {
        'Technology & Engineering': ['Sr. Manager Engineering', 'Sr. Manager DevOps'],
        'Finance & Accounting': ['Sr. Manager Finance', 'Sr. Manager Accounting'],
        'Legal & Compliance': ['Sr. Manager Legal', 'Sr. Manager Compliance'],
        'Sales & Commercial': ['Sr. Manager Sales', 'Sr. Manager BD'],
        'Product Management': ['Sr. Manager Product', 'Sr. Product Manager'],
        'Marketing & Communications': ['Sr. Manager Marketing', 'Sr. Manager Comms'],
        'Human Resources': ['Sr. Manager HR', 'Sr. Manager Recruiting'],
        'Operations': ['Sr. Manager Operations', 'Sr. Manager Projects'],
        'Risk & Regulatory': ['Sr. Manager Risk', 'Sr. Manager Regulatory'],
        'Strategy & Corporate Development': ['Sr. Manager Strategy'],
        'Data & Analytics': ['Sr. Data Scientist', 'Sr. Manager Analytics']
    }
};

// Fee ranges by level (in USD)
const FEE_RANGES = {
    'C-Suite': [280000, 450000],
    'SVP': [180000, 280000],
    'VP': [120000, 200000],
    'Director': [80000, 140000],
    'Senior Manager': [50000, 90000]
};

// Generate realistic placement data
function generatePlacements() {
    const placements = [];
    let id = 1;

    // Firm-specific characteristics (affects outcomes)
    const firmProfiles = {
        'Russell Reynolds Associates': { volume: 42, successBias: 0.72, retentionBias: 0.68, premiumFee: 1.15 },
        'Spencer Stuart': { volume: 28, successBias: 0.88, retentionBias: 0.85, premiumFee: 1.35 },
        'Heidrick & Struggles': { volume: 35, successBias: 0.75, retentionBias: 0.72, premiumFee: 1.10 },
        'Korn Ferry': { volume: 48, successBias: 0.68, retentionBias: 0.65, premiumFee: 1.0 },
        'Egon Zehnder': { volume: 18, successBias: 0.85, retentionBias: 0.82, premiumFee: 1.40 },
        'Caldwell Partners': { volume: 22, successBias: 0.78, retentionBias: 0.75, premiumFee: 0.95 }
    };

    const startDate = new Date('2022-01-01');
    const endDate = new Date('2024-12-31');

    for (const firm of SEARCH_FIRMS) {
        const profile = firmProfiles[firm.name];

        for (let i = 0; i < profile.volume; i++) {
            const placementDate = new Date(
                startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
            );

            const level = weightedRandom(TR_LEVELS, [0.08, 0.15, 0.28, 0.30, 0.19]);
            const func = TR_FUNCTIONS[Math.floor(Math.random() * TR_FUNCTIONS.length)];
            const region = weightedRandom(TR_REGIONS, [0.45, 0.30, 0.18, 0.07]);

            const titleOptions = ROLE_TITLES[level]?.[func] || ['Executive'];
            const roleTitle = titleOptions[Math.floor(Math.random() * titleOptions.length)];

            const baseFee = FEE_RANGES[level];
            const fee = Math.round(
                (baseFee[0] + Math.random() * (baseFee[1] - baseFee[0])) * profile.premiumFee
            );

            // Determine status based on firm profile and time
            const monthsSincePlacement = Math.floor(
                (new Date().getTime() - placementDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
            );

            let status, departureDate, tenureMonths, performanceRating;

            const random = Math.random();
            const adjustedRetention = profile.retentionBias + (monthsSincePlacement > 12 ? -0.05 : 0.05);

            if (random < adjustedRetention) {
                status = 'Active';
                departureDate = null;
                tenureMonths = monthsSincePlacement;
                performanceRating = weightedRandomWithBias(
                    PERFORMANCE_RATINGS.slice(0, 3),
                    [0.25, 0.55, 0.20],
                    profile.successBias
                );
                if (monthsSincePlacement < 6) performanceRating = 'Too Early to Assess';
            } else if (random < adjustedRetention + 0.15) {
                status = 'Voluntarily Left';
                tenureMonths = Math.min(monthsSincePlacement, Math.floor(6 + Math.random() * 18));
                departureDate = new Date(placementDate.getTime() + tenureMonths * 30 * 24 * 60 * 60 * 1000);
                performanceRating = weightedRandom(PERFORMANCE_RATINGS.slice(0, 3), [0.30, 0.50, 0.20]);
            } else if (random < adjustedRetention + 0.25) {
                status = 'Terminated';
                tenureMonths = Math.min(monthsSincePlacement, Math.floor(3 + Math.random() * 12));
                departureDate = new Date(placementDate.getTime() + tenureMonths * 30 * 24 * 60 * 60 * 1000);
                performanceRating = 'Below';
            } else {
                status = 'Role Eliminated';
                tenureMonths = Math.min(monthsSincePlacement, Math.floor(6 + Math.random() * 12));
                departureDate = new Date(placementDate.getTime() + tenureMonths * 30 * 24 * 60 * 60 * 1000);
                performanceRating = weightedRandom(PERFORMANCE_RATINGS.slice(0, 3), [0.20, 0.60, 0.20]);
            }

            // RHR Assessment
            const hasRhrAssessment = Math.random() < 0.65;
            let rhrRecommendation = 'N/A';
            if (hasRhrAssessment) {
                if (performanceRating === 'Exceeds') {
                    rhrRecommendation = weightedRandom(['Strong Hire', 'Hire', 'Hire with Caution'], [0.60, 0.35, 0.05]);
                } else if (performanceRating === 'Meets') {
                    rhrRecommendation = weightedRandom(['Strong Hire', 'Hire', 'Hire with Caution'], [0.25, 0.60, 0.15]);
                } else if (performanceRating === 'Below') {
                    rhrRecommendation = weightedRandom(['Hire', 'Hire with Caution', 'Do Not Hire'], [0.20, 0.50, 0.30]);
                } else {
                    rhrRecommendation = weightedRandom(['Strong Hire', 'Hire', 'Hire with Caution'], [0.30, 0.50, 0.20]);
                }
            }

            placements.push({
                id: `PL-${String(id++).padStart(4, '0')}`,
                search_firm: firm.name,
                candidate_name: EXEC_NAMES[Math.floor(Math.random() * EXEC_NAMES.length)],
                role_title: roleTitle,
                level,
                function: func,
                geography: region,
                placement_date: placementDate.toISOString().split('T')[0],
                fee_paid: fee,
                current_status: status,
                departure_date: departureDate ? departureDate.toISOString().split('T')[0] : null,
                tenure_months: tenureMonths,
                performance_rating: performanceRating,
                rhr_assessment: hasRhrAssessment,
                rhr_recommendation: rhrRecommendation,
                notes: ''
            });
        }
    }

    return placements.sort((a, b) => new Date(b.placement_date) - new Date(a.placement_date));
}

function weightedRandom(items, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
        random -= weights[i];
        if (random <= 0) return items[i];
    }
    return items[items.length - 1];
}

function weightedRandomWithBias(items, weights, bias) {
    const adjustedWeights = weights.map((w, i) => i === 0 ? w * bias * 1.5 : w);
    return weightedRandom(items, adjustedWeights);
}

// Generate placement data
const PLACEMENTS = generatePlacements();

// ==================== UTILITY FUNCTIONS ====================

function calculateFirmMetrics(placements) {
    if (placements.length === 0) {
        return {
            totalPlacements: 0,
            activePlacements: 0,
            successRate: 0,
            retentionRate12: 0,
            retentionRate24: 0,
            earlyDepartureRate: 0,
            terminationRate: 0,
            totalFees: 0,
            avgFee: 0,
            costPerSuccess: 0,
            avgTenure: 0,
            grade: 'N/A',
            gradeScore: 0,
            byLevel: {},
            byFunction: {},
            byGeography: {}
        };
    }

    const total = placements.length;
    const active = placements.filter(p => p.current_status === 'Active').length;
    const successful = placements.filter(p =>
        ['Exceeds', 'Meets'].includes(p.performance_rating)
    ).length;
    const ratable = placements.filter(p => p.performance_rating !== 'Too Early to Assess').length;

    const eligible12 = placements.filter(p => {
        const months = Math.floor((new Date() - new Date(p.placement_date)) / (1000 * 60 * 60 * 24 * 30));
        return months >= 12;
    });
    const retained12 = eligible12.filter(p =>
        p.current_status === 'Active' || p.tenure_months >= 12
    ).length;

    const eligible24 = placements.filter(p => {
        const months = Math.floor((new Date() - new Date(p.placement_date)) / (1000 * 60 * 60 * 24 * 30));
        return months >= 24;
    });
    const retained24 = eligible24.filter(p =>
        p.current_status === 'Active' || p.tenure_months >= 24
    ).length;

    const earlyDepartures = placements.filter(p =>
        p.current_status !== 'Active' && p.tenure_months < 12
    ).length;

    const terminated = placements.filter(p => p.current_status === 'Terminated').length;
    const totalFees = placements.reduce((sum, p) => sum + p.fee_paid, 0);
    const avgTenure = placements.reduce((sum, p) => sum + p.tenure_months, 0) / total;

    const successRate = ratable > 0 ? (successful / ratable) * 100 : 0;
    const retentionRate12 = eligible12.length > 0 ? (retained12 / eligible12.length) * 100 : 100;
    const retentionRate24 = eligible24.length > 0 ? (retained24 / eligible24.length) * 100 : 100;
    const earlyDepartureRate = (earlyDepartures / total) * 100;
    const terminationRate = (terminated / total) * 100;
    const costPerSuccess = successful > 0 ? totalFees / successful : totalFees;

    // Calculate grade
    const retentionScore = Math.min(retentionRate12 / 100, 1) * 30;
    const successScore = Math.min(successRate / 100, 1) * 30;
    const costScore = Math.max(0, (1 - (costPerSuccess - 100000) / 400000)) * 20;
    const earlyDepartScore = Math.max(0, (1 - earlyDepartureRate / 50)) * 20;
    const gradeScore = retentionScore + successScore + costScore + earlyDepartScore;

    let grade;
    if (gradeScore >= 85) grade = 'A';
    else if (gradeScore >= 70) grade = 'B';
    else if (gradeScore >= 55) grade = 'C';
    else if (gradeScore >= 40) grade = 'D';
    else grade = 'F';

    // Distributions
    const byLevel = TR_LEVELS.reduce((acc, level) => {
        acc[level] = placements.filter(p => p.level === level).length;
        return acc;
    }, {});

    const byFunction = TR_FUNCTIONS.reduce((acc, func) => {
        const count = placements.filter(p => p.function === func).length;
        if (count > 0) acc[func] = count;
        return acc;
    }, {});

    const byGeography = TR_REGIONS.reduce((acc, geo) => {
        acc[geo] = placements.filter(p => p.geography === geo).length;
        return acc;
    }, {});

    return {
        totalPlacements: total,
        activePlacements: active,
        successRate,
        retentionRate12,
        retentionRate24,
        earlyDepartureRate,
        terminationRate,
        totalFees,
        avgFee: totalFees / total,
        costPerSuccess,
        avgTenure,
        grade,
        gradeScore,
        byLevel,
        byFunction,
        byGeography,
        retentionScore,
        successScore,
        costScore,
        earlyDepartScore
    };
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatPercent(value) {
    return `${value.toFixed(1)}%`;
}

function getGradeColor(grade) {
    const colors = {
        'A': '#22C55E',
        'B': '#84CC16',
        'C': '#EAB308',
        'D': '#F97316',
        'F': '#EF4444'
    };
    return colors[grade] || '#9CA3AF';
}

function getTrendDirection(current, previous) {
    if (current > previous * 1.02) return 'up';
    if (current < previous * 0.98) return 'down';
    return 'stable';
}

// ==================== COMPONENTS ====================

// Header Component
function Header() {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="header">
            <div className="header-brand">
                <span className="header-logo">THOMSON REUTERS</span>
                <span className="header-divider"></span>
                <span className="header-title">Executive Search Firm Report Card</span>
            </div>
            <div className="header-meta">
                <span className="header-date">{today}</span>
                <div className="header-user">
                    <div className="avatar">TR</div>
                    <span>Talent Acquisition</span>
                </div>
            </div>
        </header>
    );
}

// Navigation Component
function Navigation({ activeView, setActiveView }) {
    const views = [
        { id: 'scorecard', label: 'Executive Summary' },
        { id: 'comparison', label: 'Comparison' },
        { id: 'placements', label: 'Placement Explorer' },
        { id: 'rhr', label: 'RHR Analysis' },
        { id: 'trends', label: 'Trends' }
    ];

    return (
        <nav className="nav">
            {views.map(view => (
                <div
                    key={view.id}
                    className={`nav-item ${activeView === view.id ? 'active' : ''}`}
                    onClick={() => setActiveView(view.id)}
                >
                    {view.label}
                </div>
            ))}
        </nav>
    );
}

// Filters Component
function Filters({ filters, setFilters }) {
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            timePeriod: 'all',
            geography: 'all',
            level: 'all',
            function: 'all',
            firm: 'all'
        });
    };

    return (
        <div className="filters-bar">
            <div className="filter-group">
                <label className="filter-label">Time Period</label>
                <select
                    className="filter-select"
                    value={filters.timePeriod}
                    onChange={e => handleFilterChange('timePeriod', e.target.value)}
                >
                    <option value="all">All Time</option>
                    <option value="12">Last 12 Months</option>
                    <option value="24">Last 24 Months</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">Geography</label>
                <select
                    className="filter-select"
                    value={filters.geography}
                    onChange={e => handleFilterChange('geography', e.target.value)}
                >
                    <option value="all">All Regions</option>
                    {TR_REGIONS.map(geo => (
                        <option key={geo} value={geo}>{geo}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">Level</label>
                <select
                    className="filter-select"
                    value={filters.level}
                    onChange={e => handleFilterChange('level', e.target.value)}
                >
                    <option value="all">All Levels</option>
                    {TR_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">Function</label>
                <select
                    className="filter-select"
                    value={filters.function}
                    onChange={e => handleFilterChange('function', e.target.value)}
                >
                    <option value="all">All Functions</option>
                    {TR_FUNCTIONS.map(func => (
                        <option key={func} value={func}>{func}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">Search Firm</label>
                <select
                    className="filter-select"
                    value={filters.firm}
                    onChange={e => handleFilterChange('firm', e.target.value)}
                >
                    <option value="all">All Firms</option>
                    {SEARCH_FIRMS.map(firm => (
                        <option key={firm.id} value={firm.name}>{firm.name}</option>
                    ))}
                </select>
            </div>

            <button className="filter-reset" onClick={resetFilters}>
                Reset Filters
            </button>
        </div>
    );
}

// KPI Cards Component
function KPICards({ placements }) {
    const metrics = calculateFirmMetrics(placements);

    // Calculate previous period for trends
    const prevMetrics = useMemo(() => {
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - 12);
        const prevPlacements = placements.filter(p => new Date(p.placement_date) < cutoff);
        return calculateFirmMetrics(prevPlacements);
    }, [placements]);

    const kpis = [
        {
            label: 'Total Placements',
            value: metrics.totalPlacements,
            change: metrics.totalPlacements - prevMetrics.totalPlacements,
            format: 'number'
        },
        {
            label: 'Success Rate',
            value: metrics.successRate,
            change: metrics.successRate - prevMetrics.successRate,
            format: 'percent'
        },
        {
            label: '12-Month Retention',
            value: metrics.retentionRate12,
            change: metrics.retentionRate12 - prevMetrics.retentionRate12,
            format: 'percent'
        },
        {
            label: 'Total Fees Paid',
            value: metrics.totalFees,
            change: ((metrics.totalFees - prevMetrics.totalFees) / prevMetrics.totalFees * 100) || 0,
            format: 'currency'
        }
    ];

    return (
        <div className="kpi-grid">
            {kpis.map((kpi, i) => (
                <div key={i} className="kpi-card">
                    <div className="kpi-label">{kpi.label}</div>
                    <div className="kpi-value">
                        {kpi.format === 'currency' ? formatCurrency(kpi.value) :
                         kpi.format === 'percent' ? formatPercent(kpi.value) :
                         kpi.value.toLocaleString()}
                    </div>
                    {kpi.change !== 0 && (
                        <div className={`kpi-change ${kpi.change > 0 ? 'positive' : 'negative'}`}>
                            {kpi.change > 0 ? '↑' : '↓'} {Math.abs(kpi.change).toFixed(1)}
                            {kpi.format === 'percent' ? ' pts' : kpi.format === 'currency' ? '%' : ''} vs prior
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// Firm Scorecard Component
function FirmScorecard({ firm, placements, onClick, selected }) {
    const metrics = calculateFirmMetrics(placements);

    // Generate sparkline data
    const sparkData = useMemo(() => {
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStr = date.toISOString().slice(0, 7);
            const monthPlacements = placements.filter(p => p.placement_date.startsWith(monthStr));
            const successful = monthPlacements.filter(p =>
                ['Exceeds', 'Meets'].includes(p.performance_rating)
            ).length;
            months.push({
                month: monthStr,
                success: monthPlacements.length > 0 ? (successful / monthPlacements.length * 100) : null
            });
        }
        return months.filter(m => m.success !== null);
    }, [placements]);

    const trend = sparkData.length >= 2 ?
        getTrendDirection(sparkData[sparkData.length - 1]?.success || 0, sparkData[0]?.success || 0) :
        'stable';

    return (
        <div className={`scorecard ${selected ? 'selected' : ''}`} onClick={onClick}>
            <div className="scorecard-header">
                <div className={`grade-badge grade-${metrics.grade.toLowerCase()}`}>
                    {metrics.grade}
                </div>
                <div className="scorecard-info">
                    <div className="scorecard-firm">{firm.name}</div>
                    <div className="scorecard-meta">{firm.specialty}</div>
                </div>
                <div className={`scorecard-trend ${trend}`}>
                    {trend === 'up' ? '↑ Improving' : trend === 'down' ? '↓ Declining' : '→ Stable'}
                </div>
            </div>

            <div className="scorecard-body">
                <div className="scorecard-stats">
                    <div className="scorecard-stat">
                        <span className="stat-label">Placements</span>
                        <span className="stat-value">{metrics.totalPlacements}</span>
                    </div>
                    <div className="scorecard-stat">
                        <span className="stat-label">Success Rate</span>
                        <span className={`stat-value ${metrics.successRate >= 75 ? 'success' : metrics.successRate >= 60 ? 'warning' : 'danger'}`}>
                            {formatPercent(metrics.successRate)}
                        </span>
                    </div>
                    <div className="scorecard-stat">
                        <span className="stat-label">Avg Tenure</span>
                        <span className="stat-value">{metrics.avgTenure.toFixed(1)} mo</span>
                    </div>
                    <div className="scorecard-stat">
                        <span className="stat-label">Total Fees</span>
                        <span className="stat-value">{formatCurrency(metrics.totalFees)}</span>
                    </div>
                </div>
            </div>

            <div className="scorecard-footer">
                <div className="mini-chart">
                    <ResponsiveContainer width="100%" height={40}>
                        <AreaChart data={sparkData}>
                            <Area
                                type="monotone"
                                dataKey="success"
                                stroke={getGradeColor(metrics.grade)}
                                fill={getGradeColor(metrics.grade)}
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <span className="view-details">View Details →</span>
            </div>
        </div>
    );
}

// Executive Summary View
function ExecutiveSummaryView({ placements, onFirmSelect }) {
    const firmData = useMemo(() => {
        return SEARCH_FIRMS.map(firm => ({
            firm,
            placements: placements.filter(p => p.search_firm === firm.name),
            metrics: calculateFirmMetrics(placements.filter(p => p.search_firm === firm.name))
        })).sort((a, b) => {
            const gradeOrder = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'F': 4 };
            return gradeOrder[a.metrics.grade] - gradeOrder[b.metrics.grade];
        });
    }, [placements]);

    return (
        <div>
            <KPICards placements={placements} />
            <div className="scorecard-grid">
                {firmData.map(({ firm, placements: firmPlacements }) => (
                    <FirmScorecard
                        key={firm.id}
                        firm={firm}
                        placements={firmPlacements}
                        onClick={() => onFirmSelect(firm)}
                    />
                ))}
            </div>
        </div>
    );
}

// Firm Deep Dive View
function FirmDeepDive({ firm, placements, onBack }) {
    const metrics = calculateFirmMetrics(placements);

    const performanceData = [
        { name: 'Exceeds', value: placements.filter(p => p.performance_rating === 'Exceeds').length, color: '#22C55E' },
        { name: 'Meets', value: placements.filter(p => p.performance_rating === 'Meets').length, color: '#3B82F6' },
        { name: 'Below', value: placements.filter(p => p.performance_rating === 'Below').length, color: '#EF4444' },
        { name: 'Too Early', value: placements.filter(p => p.performance_rating === 'Too Early to Assess').length, color: '#9CA3AF' }
    ].filter(d => d.value > 0);

    const levelData = Object.entries(metrics.byLevel).map(([level, count]) => ({
        level,
        count,
        successRate: (() => {
            const levelPlacements = placements.filter(p => p.level === level);
            const successful = levelPlacements.filter(p => ['Exceeds', 'Meets'].includes(p.performance_rating)).length;
            const ratable = levelPlacements.filter(p => p.performance_rating !== 'Too Early to Assess').length;
            return ratable > 0 ? (successful / ratable * 100) : 0;
        })()
    }));

    const tenureData = useMemo(() => {
        const buckets = [
            { range: '0-6', min: 0, max: 6 },
            { range: '6-12', min: 6, max: 12 },
            { range: '12-18', min: 12, max: 18 },
            { range: '18-24', min: 18, max: 24 },
            { range: '24+', min: 24, max: Infinity }
        ];
        return buckets.map(b => ({
            range: b.range,
            count: placements.filter(p => p.tenure_months >= b.min && p.tenure_months < b.max).length
        }));
    }, [placements]);

    const timelineData = useMemo(() => {
        const quarters = {};
        placements.forEach(p => {
            const date = new Date(p.placement_date);
            const q = `${date.getFullYear()} Q${Math.floor(date.getMonth() / 3) + 1}`;
            if (!quarters[q]) quarters[q] = { quarter: q, placements: 0, successful: 0, terminated: 0 };
            quarters[q].placements++;
            if (['Exceeds', 'Meets'].includes(p.performance_rating)) quarters[q].successful++;
            if (p.current_status === 'Terminated') quarters[q].terminated++;
        });
        return Object.values(quarters).sort((a, b) => a.quarter.localeCompare(b.quarter));
    }, [placements]);

    return (
        <div>
            <div className="deep-dive-header">
                <div className={`deep-dive-grade grade-badge grade-${metrics.grade.toLowerCase()}`} style={{ width: 120, height: 120, fontSize: 64, borderRadius: 16 }}>
                    {metrics.grade}
                </div>
                <div className="deep-dive-info">
                    <button className="back-button" onClick={onBack}>
                        ← Back to Summary
                    </button>
                    <div className="deep-dive-firm" style={{ marginTop: 12 }}>{firm.name}</div>
                    <div className="deep-dive-summary">
                        {metrics.totalPlacements} total placements with {formatPercent(metrics.successRate)} success rate
                        and {formatPercent(metrics.retentionRate12)} 12-month retention. Total fees: {formatCurrency(metrics.totalFees)}.
                    </div>
                    <div className="grade-breakdown">
                        <div className="grade-component">
                            <span className="component-label">Retention (30%)</span>
                            <span className="component-score" style={{ color: getGradeColor(metrics.retentionScore >= 25 ? 'A' : metrics.retentionScore >= 20 ? 'B' : 'C') }}>
                                {metrics.retentionScore.toFixed(1)}/30
                            </span>
                        </div>
                        <div className="grade-component">
                            <span className="component-label">Success (30%)</span>
                            <span className="component-score" style={{ color: getGradeColor(metrics.successScore >= 25 ? 'A' : metrics.successScore >= 20 ? 'B' : 'C') }}>
                                {metrics.successScore.toFixed(1)}/30
                            </span>
                        </div>
                        <div className="grade-component">
                            <span className="component-label">Cost Eff. (20%)</span>
                            <span className="component-score" style={{ color: getGradeColor(metrics.costScore >= 15 ? 'A' : metrics.costScore >= 10 ? 'B' : 'C') }}>
                                {metrics.costScore.toFixed(1)}/20
                            </span>
                        </div>
                        <div className="grade-component">
                            <span className="component-label">Early Dep. (20%)</span>
                            <span className="component-score" style={{ color: getGradeColor(metrics.earlyDepartScore >= 15 ? 'A' : metrics.earlyDepartScore >= 10 ? 'B' : 'C') }}>
                                {metrics.earlyDepartScore.toFixed(1)}/20
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <div className="chart-title">Performance Distribution</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={performanceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {performanceData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <div className="chart-title">Success Rate by Level</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <ComposedChart data={levelData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                            <XAxis dataKey="level" tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[0, 100]} />
                            <Tooltip />
                            <Bar yAxisId="left" dataKey="count" fill="#FF6B00" name="Placements" />
                            <Line yAxisId="right" type="monotone" dataKey="successRate" stroke="#22C55E" strokeWidth={2} name="Success Rate %" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <div className="chart-title">Tenure Distribution (Months)</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={tenureData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                            <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3B82F6" name="Placements" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <div className="chart-title">Placement Timeline</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={timelineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                            <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="placements" stackId="1" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.6} name="Total" />
                            <Area type="monotone" dataKey="successful" stackId="2" stroke="#22C55E" fill="#22C55E" fillOpacity={0.6} name="Successful" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">All Placements</div>
                        <div className="card-subtitle">{placements.length} records</div>
                    </div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <PlacementTable placements={placements} compact />
                </div>
            </div>
        </div>
    );
}

// Comparison View
function ComparisonView({ placements }) {
    const [selectedFirms, setSelectedFirms] = useState(['Spencer Stuart', 'Russell Reynolds Associates', 'Korn Ferry']);

    const firmMetrics = useMemo(() => {
        return selectedFirms.map(firmName => {
            const firmPlacements = placements.filter(p => p.search_firm === firmName);
            return {
                name: firmName,
                metrics: calculateFirmMetrics(firmPlacements)
            };
        });
    }, [placements, selectedFirms]);

    const toggleFirm = (firmName) => {
        setSelectedFirms(prev => {
            if (prev.includes(firmName)) {
                return prev.filter(f => f !== firmName);
            } else if (prev.length < 3) {
                return [...prev, firmName];
            }
            return prev;
        });
    };

    const metrics = [
        { key: 'totalPlacements', label: 'Total Placements', format: 'number', max: 60 },
        { key: 'successRate', label: 'Success Rate', format: 'percent', max: 100 },
        { key: 'retentionRate12', label: '12-Month Retention', format: 'percent', max: 100 },
        { key: 'earlyDepartureRate', label: 'Early Departure Rate', format: 'percent', max: 50, inverse: true },
        { key: 'terminationRate', label: 'Termination Rate', format: 'percent', max: 30, inverse: true },
        { key: 'avgFee', label: 'Average Fee', format: 'currency', max: 300000 },
        { key: 'costPerSuccess', label: 'Cost per Successful Hire', format: 'currency', max: 400000, inverse: true },
        { key: 'avgTenure', label: 'Average Tenure (months)', format: 'number', max: 30 }
    ];

    const colors = ['#FF6B00', '#3B82F6', '#22C55E'];

    // Find the best firm for current filters
    const recommendation = useMemo(() => {
        if (firmMetrics.length === 0) return null;
        const best = firmMetrics.reduce((a, b) => a.metrics.gradeScore > b.metrics.gradeScore ? a : b);
        return best;
    }, [firmMetrics]);

    return (
        <div>
            <div className="comparison-selector">
                {SEARCH_FIRMS.map(firm => (
                    <label
                        key={firm.id}
                        className={`firm-checkbox ${selectedFirms.includes(firm.name) ? 'selected' : ''}`}
                    >
                        <input
                            type="checkbox"
                            checked={selectedFirms.includes(firm.name)}
                            onChange={() => toggleFirm(firm.name)}
                        />
                        {firm.name}
                    </label>
                ))}
            </div>

            {selectedFirms.length > 0 && (
                <>
                    <div className="comparison-grid" style={{ marginBottom: 24 }}>
                        {firmMetrics.map((fm, i) => (
                            <div key={fm.name} className="card">
                                <div className="card-header" style={{ background: colors[i], color: 'white' }}>
                                    <div className="card-title" style={{ color: 'white' }}>{fm.name}</div>
                                </div>
                                <div className="card-body" style={{ textAlign: 'center', padding: 24 }}>
                                    <div className={`grade-badge grade-${fm.metrics.grade.toLowerCase()}`} style={{ margin: '0 auto 16px', width: 80, height: 80, fontSize: 40 }}>
                                        {fm.metrics.grade}
                                    </div>
                                    <div style={{ fontSize: 14, color: '#5D5D5D' }}>
                                        Score: {fm.metrics.gradeScore.toFixed(1)}/100
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Head-to-Head Comparison</div>
                        </div>
                        <div className="card-body">
                            <div className="comparison-metrics">
                                {metrics.map(metric => (
                                    <div key={metric.key} className="metric-row">
                                        <div className="metric-name">{metric.label}</div>
                                        <div className="metric-bars">
                                            {firmMetrics.map((fm, i) => {
                                                const value = fm.metrics[metric.key];
                                                const width = Math.min((value / metric.max) * 100, 100);
                                                const displayValue = metric.format === 'currency'
                                                    ? formatCurrency(value)
                                                    : metric.format === 'percent'
                                                    ? formatPercent(value)
                                                    : value.toFixed(1);

                                                const isBest = firmMetrics.every(other =>
                                                    metric.inverse
                                                        ? fm.metrics[metric.key] <= other.metrics[metric.key]
                                                        : fm.metrics[metric.key] >= other.metrics[metric.key]
                                                );

                                                return (
                                                    <div key={fm.name} className="metric-bar-container">
                                                        <div className="metric-bar-label">{fm.name.split(' ')[0]}</div>
                                                        <div
                                                            className="metric-bar"
                                                            style={{
                                                                width: `${Math.max(width, 15)}%`,
                                                                background: isBest ? colors[i] : `${colors[i]}88`
                                                            }}
                                                        >
                                                            {displayValue}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {recommendation && (
                        <div className="recommendation-box">
                            <div className="recommendation-header">
                                <span>💡</span> Recommendation
                            </div>
                            <div className="recommendation-text">
                                Based on current filters, <strong>{recommendation.name}</strong> shows the strongest overall performance
                                with a grade score of {recommendation.metrics.gradeScore.toFixed(1)}/100,
                                featuring a {formatPercent(recommendation.metrics.successRate)} success rate
                                and {formatPercent(recommendation.metrics.retentionRate12)} 12-month retention.
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// Placement Table Component
function PlacementTable({ placements, compact = false }) {
    const [sortKey, setSortKey] = useState('placement_date');
    const [sortDir, setSortDir] = useState('desc');
    const [page, setPage] = useState(1);
    const pageSize = compact ? 10 : 15;

    const sortedPlacements = useMemo(() => {
        return [...placements].sort((a, b) => {
            let aVal = a[sortKey];
            let bVal = b[sortKey];
            if (sortKey === 'fee_paid' || sortKey === 'tenure_months') {
                aVal = Number(aVal);
                bVal = Number(bVal);
            }
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [placements, sortKey, sortDir]);

    const paginatedPlacements = sortedPlacements.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(placements.length / pageSize);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    const getStatusClass = (status) => {
        if (status === 'Active') return 'active';
        if (status === 'Voluntarily Left') return 'left';
        if (status === 'Terminated') return 'terminated';
        return 'eliminated';
    };

    const getPerfClass = (rating) => {
        if (rating === 'Exceeds') return 'exceeds';
        if (rating === 'Meets') return 'meets';
        if (rating === 'Below') return 'below';
        return 'early';
    };

    const getLevelClass = (level) => {
        return level.toLowerCase().replace(/[\s-]+/g, '-');
    };

    return (
        <div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('candidate_name')}>
                            Candidate {sortKey === 'candidate_name' && <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                        <th onClick={() => handleSort('role_title')}>
                            Role {sortKey === 'role_title' && <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                        {!compact && (
                            <th onClick={() => handleSort('search_firm')}>
                                Firm {sortKey === 'search_firm' && <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                        )}
                        <th onClick={() => handleSort('level')}>
                            Level {sortKey === 'level' && <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                        <th onClick={() => handleSort('placement_date')}>
                            Date {sortKey === 'placement_date' && <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                        <th onClick={() => handleSort('current_status')}>
                            Status {sortKey === 'current_status' && <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                        <th onClick={() => handleSort('performance_rating')}>
                            Performance {sortKey === 'performance_rating' && <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                        <th onClick={() => handleSort('tenure_months')}>
                            Tenure {sortKey === 'tenure_months' && <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                        <th onClick={() => handleSort('fee_paid')}>
                            Fee {sortKey === 'fee_paid' && <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedPlacements.map(p => (
                        <tr key={p.id}>
                            <td><strong>{p.candidate_name}</strong></td>
                            <td>{p.role_title}</td>
                            {!compact && <td>{p.search_firm}</td>}
                            <td><span className={`level-badge ${getLevelClass(p.level)}`}>{p.level}</span></td>
                            <td>{new Date(p.placement_date).toLocaleDateString()}</td>
                            <td>
                                <span className={`status-badge ${getStatusClass(p.current_status)}`}>
                                    <span className="status-dot"></span>
                                    {p.current_status}
                                </span>
                            </td>
                            <td><span className={`perf-badge ${getPerfClass(p.performance_rating)}`}>{p.performance_rating}</span></td>
                            <td>{p.tenure_months} mo</td>
                            <td>{formatCurrency(p.fee_paid)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="page-btn"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        ←
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = page <= 3 ? i + 1 : page + i - 2;
                        if (pageNum > totalPages || pageNum < 1) return null;
                        return (
                            <button
                                key={pageNum}
                                className={`page-btn ${page === pageNum ? 'active' : ''}`}
                                onClick={() => setPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        className="page-btn"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}

// Placement Explorer View
function PlacementExplorerView({ placements }) {
    const [search, setSearch] = useState('');

    const filteredPlacements = useMemo(() => {
        if (!search) return placements;
        const term = search.toLowerCase();
        return placements.filter(p =>
            p.candidate_name.toLowerCase().includes(term) ||
            p.role_title.toLowerCase().includes(term) ||
            p.search_firm.toLowerCase().includes(term) ||
            p.function.toLowerCase().includes(term)
        );
    }, [placements, search]);

    const exportCSV = () => {
        const headers = ['ID', 'Candidate', 'Role', 'Firm', 'Level', 'Function', 'Geography', 'Date', 'Status', 'Performance', 'Tenure', 'Fee'];
        const rows = filteredPlacements.map(p => [
            p.id, p.candidate_name, p.role_title, p.search_firm, p.level, p.function,
            p.geography, p.placement_date, p.current_status, p.performance_rating,
            p.tenure_months, p.fee_paid
        ]);

        const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'thomson-reuters-placements.csv';
        a.click();
    };

    return (
        <div className="card">
            <div className="card-header">
                <div>
                    <div className="card-title">Placement Explorer</div>
                    <div className="card-subtitle">{filteredPlacements.length} of {placements.length} records</div>
                </div>
            </div>
            <div className="card-body">
                <div className="table-controls">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search placements..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button className="export-btn" onClick={exportCSV}>
                        Export CSV
                    </button>
                </div>
                <PlacementTable placements={filteredPlacements} />
            </div>
        </div>
    );
}

// RHR Analysis View
function RHRAnalysisView({ placements }) {
    const assessedPlacements = placements.filter(p => p.rhr_assessment);
    const nonAssessedPlacements = placements.filter(p => !p.rhr_assessment);

    const assessedMetrics = calculateFirmMetrics(assessedPlacements);
    const nonAssessedMetrics = calculateFirmMetrics(nonAssessedPlacements);

    const recommendationCorrelation = useMemo(() => {
        const buckets = ['Strong Hire', 'Hire', 'Hire with Caution', 'Do Not Hire'];
        return buckets.map(rec => {
            const recPlacements = assessedPlacements.filter(p => p.rhr_recommendation === rec);
            const successful = recPlacements.filter(p => ['Exceeds', 'Meets'].includes(p.performance_rating)).length;
            const ratable = recPlacements.filter(p => p.performance_rating !== 'Too Early to Assess').length;
            return {
                recommendation: rec,
                count: recPlacements.length,
                successRate: ratable > 0 ? (successful / ratable * 100) : 0,
                avgTenure: recPlacements.length > 0
                    ? recPlacements.reduce((sum, p) => sum + p.tenure_months, 0) / recPlacements.length
                    : 0
            };
        }).filter(r => r.count > 0);
    }, [assessedPlacements]);

    return (
        <div>
            <div className="rhr-comparison">
                <div className="rhr-group">
                    <div className="rhr-group-header">
                        <span>RHR Assessed Placements</span>
                        <span className="rhr-group-count">{assessedPlacements.length} placements</span>
                    </div>
                    <div className="rhr-metrics">
                        <div className="rhr-metric">
                            <div className="rhr-metric-value" style={{ color: '#22C55E' }}>
                                {formatPercent(assessedMetrics.successRate)}
                            </div>
                            <div className="rhr-metric-label">Success Rate</div>
                        </div>
                        <div className="rhr-metric">
                            <div className="rhr-metric-value" style={{ color: '#3B82F6' }}>
                                {formatPercent(assessedMetrics.retentionRate12)}
                            </div>
                            <div className="rhr-metric-label">12-Mo Retention</div>
                        </div>
                        <div className="rhr-metric">
                            <div className="rhr-metric-value" style={{ color: '#FF6B00' }}>
                                {assessedMetrics.avgTenure.toFixed(1)} mo
                            </div>
                            <div className="rhr-metric-label">Avg Tenure</div>
                        </div>
                        <div className="rhr-metric">
                            <div className="rhr-metric-value" style={{ color: '#EF4444' }}>
                                {formatPercent(assessedMetrics.terminationRate)}
                            </div>
                            <div className="rhr-metric-label">Termination Rate</div>
                        </div>
                    </div>
                </div>

                <div className="rhr-group">
                    <div className="rhr-group-header">
                        <span>Non-Assessed Placements</span>
                        <span className="rhr-group-count">{nonAssessedPlacements.length} placements</span>
                    </div>
                    <div className="rhr-metrics">
                        <div className="rhr-metric">
                            <div className="rhr-metric-value" style={{ color: '#22C55E' }}>
                                {formatPercent(nonAssessedMetrics.successRate)}
                            </div>
                            <div className="rhr-metric-label">Success Rate</div>
                        </div>
                        <div className="rhr-metric">
                            <div className="rhr-metric-value" style={{ color: '#3B82F6' }}>
                                {formatPercent(nonAssessedMetrics.retentionRate12)}
                            </div>
                            <div className="rhr-metric-label">12-Mo Retention</div>
                        </div>
                        <div className="rhr-metric">
                            <div className="rhr-metric-value" style={{ color: '#FF6B00' }}>
                                {nonAssessedMetrics.avgTenure.toFixed(1)} mo
                            </div>
                            <div className="rhr-metric-label">Avg Tenure</div>
                        </div>
                        <div className="rhr-metric">
                            <div className="rhr-metric-value" style={{ color: '#EF4444' }}>
                                {formatPercent(nonAssessedMetrics.terminationRate)}
                            </div>
                            <div className="rhr-metric-label">Termination Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <div className="chart-title">Success Rate: Assessed vs Non-Assessed</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[
                            { group: 'Success Rate', assessed: assessedMetrics.successRate, nonAssessed: nonAssessedMetrics.successRate },
                            { group: 'Retention Rate', assessed: assessedMetrics.retentionRate12, nonAssessed: nonAssessedMetrics.retentionRate12 },
                            { group: 'Termination Rate', assessed: assessedMetrics.terminationRate, nonAssessed: nonAssessedMetrics.terminationRate }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                            <XAxis dataKey="group" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                            <Tooltip formatter={(v) => formatPercent(v)} />
                            <Legend />
                            <Bar dataKey="assessed" name="RHR Assessed" fill="#FF6B00" />
                            <Bar dataKey="nonAssessed" name="Non-Assessed" fill="#9CA3AF" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <div className="chart-title">Outcomes by RHR Recommendation</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <ComposedChart data={recommendationCorrelation}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                            <XAxis dataKey="recommendation" tick={{ fontSize: 11 }} />
                            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="count" name="Placements" fill="#3B82F6" />
                            <Line yAxisId="right" type="monotone" dataKey="successRate" name="Success Rate %" stroke="#22C55E" strokeWidth={2} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="recommendation-box">
                <div className="recommendation-header">
                    <span>📊</span> Analysis Insight
                </div>
                <div className="recommendation-text">
                    {assessedMetrics.successRate > nonAssessedMetrics.successRate ? (
                        <>
                            RHR-assessed placements show a <strong>{(assessedMetrics.successRate - nonAssessedMetrics.successRate).toFixed(1)} percentage point higher</strong> success rate
                            compared to non-assessed placements ({formatPercent(assessedMetrics.successRate)} vs {formatPercent(nonAssessedMetrics.successRate)}).
                            This data supports continuing RHR assessments for executive hires, particularly for C-Suite and SVP roles.
                        </>
                    ) : (
                        <>
                            Non-assessed placements currently show comparable or better outcomes than RHR-assessed placements.
                            Consider reviewing the assessment criteria or targeting assessments to specific role types where value is demonstrated.
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Trends View
function TrendsView({ placements }) {
    const quarterlyData = useMemo(() => {
        const quarters = {};
        placements.forEach(p => {
            const date = new Date(p.placement_date);
            const q = `${date.getFullYear()} Q${Math.floor(date.getMonth() / 3) + 1}`;
            if (!quarters[q]) {
                quarters[q] = { quarter: q, placements: 0, successful: 0, active: 0, totalFees: 0, totalTenure: 0 };
            }
            quarters[q].placements++;
            if (['Exceeds', 'Meets'].includes(p.performance_rating)) quarters[q].successful++;
            if (p.current_status === 'Active') quarters[q].active++;
            quarters[q].totalFees += p.fee_paid;
            quarters[q].totalTenure += p.tenure_months;
        });

        return Object.values(quarters)
            .map(q => ({
                ...q,
                successRate: q.placements > 0 ? (q.successful / q.placements * 100) : 0,
                avgFee: q.placements > 0 ? q.totalFees / q.placements : 0,
                avgTenure: q.placements > 0 ? q.totalTenure / q.placements : 0
            }))
            .sort((a, b) => a.quarter.localeCompare(b.quarter));
    }, [placements]);

    const firmTrends = useMemo(() => {
        return SEARCH_FIRMS.map(firm => {
            const firmPlacements = placements.filter(p => p.search_firm === firm.name);
            const quarters = {};
            firmPlacements.forEach(p => {
                const date = new Date(p.placement_date);
                const q = `${date.getFullYear()} Q${Math.floor(date.getMonth() / 3) + 1}`;
                if (!quarters[q]) quarters[q] = { successful: 0, total: 0 };
                quarters[q].total++;
                if (['Exceeds', 'Meets'].includes(p.performance_rating)) quarters[q].successful++;
            });
            return {
                name: firm.name.split(' ')[0],
                data: Object.entries(quarters)
                    .map(([q, d]) => ({ quarter: q, successRate: d.total > 0 ? (d.successful / d.total * 100) : 0 }))
                    .sort((a, b) => a.quarter.localeCompare(b.quarter))
            };
        });
    }, [placements]);

    const cohortData = useMemo(() => {
        const years = ['2022', '2023', '2024'];
        return years.map(year => {
            const yearPlacements = placements.filter(p => p.placement_date.startsWith(year));
            const metrics = calculateFirmMetrics(yearPlacements);
            return {
                year,
                placements: metrics.totalPlacements,
                successRate: metrics.successRate,
                retentionRate: metrics.retentionRate12,
                avgFee: metrics.avgFee
            };
        });
    }, [placements]);

    return (
        <div>
            <div className="charts-grid">
                <div className="chart-container">
                    <div className="chart-title">Quarterly Placement Volume</div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={quarterlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                            <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="placements" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.3} name="Placements" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <div className="chart-title">Success Rate Trend</div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={quarterlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                            <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                            <Tooltip formatter={(v) => formatPercent(v)} />
                            <Line type="monotone" dataKey="successRate" stroke="#22C55E" strokeWidth={2} name="Success Rate %" dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <div className="chart-title">Average Fee per Placement</div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={quarterlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                            <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(v) => formatCurrency(v)} />
                            <Bar dataKey="avgFee" fill="#3B82F6" name="Avg Fee" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <div className="chart-title">Cohort Analysis by Year</div>
                    <ResponsiveContainer width="100%" height={280}>
                        <ComposedChart data={cohortData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="placements" name="Placements" fill="#FF6B00" />
                            <Line yAxisId="right" type="monotone" dataKey="successRate" name="Success %" stroke="#22C55E" strokeWidth={2} />
                            <Line yAxisId="right" type="monotone" dataKey="retentionRate" name="Retention %" stroke="#3B82F6" strokeWidth={2} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">Firm Performance Trends</div>
                </div>
                <div className="card-body">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                            <XAxis
                                dataKey="quarter"
                                tick={{ fontSize: 11 }}
                                type="category"
                                allowDuplicatedCategory={false}
                            />
                            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                            <Tooltip formatter={(v) => formatPercent(v)} />
                            <Legend />
                            {firmTrends.map((firm, i) => {
                                const colors = ['#FF6B00', '#3B82F6', '#22C55E', '#EAB308', '#8B5CF6', '#EC4899'];
                                return (
                                    <Line
                                        key={firm.name}
                                        data={firm.data}
                                        type="monotone"
                                        dataKey="successRate"
                                        name={firm.name}
                                        stroke={colors[i % colors.length]}
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                );
                            })}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// Main App Component
function App() {
    const [activeView, setActiveView] = useState('scorecard');
    const [selectedFirm, setSelectedFirm] = useState(null);
    const [filters, setFilters] = useState({
        timePeriod: 'all',
        geography: 'all',
        level: 'all',
        function: 'all',
        firm: 'all'
    });

    const filteredPlacements = useMemo(() => {
        return PLACEMENTS.filter(p => {
            // Time period filter
            if (filters.timePeriod !== 'all') {
                const placementDate = new Date(p.placement_date);
                if (['12', '24'].includes(filters.timePeriod)) {
                    const cutoff = new Date();
                    cutoff.setMonth(cutoff.getMonth() - parseInt(filters.timePeriod));
                    if (placementDate < cutoff) return false;
                } else {
                    if (!p.placement_date.startsWith(filters.timePeriod)) return false;
                }
            }

            // Geography filter
            if (filters.geography !== 'all' && p.geography !== filters.geography) return false;

            // Level filter
            if (filters.level !== 'all' && p.level !== filters.level) return false;

            // Function filter
            if (filters.function !== 'all' && p.function !== filters.function) return false;

            // Firm filter
            if (filters.firm !== 'all' && p.search_firm !== filters.firm) return false;

            return true;
        });
    }, [filters]);

    const handleFirmSelect = (firm) => {
        setSelectedFirm(firm);
        setActiveView('deepdive');
    };

    const handleBackToSummary = () => {
        setSelectedFirm(null);
        setActiveView('scorecard');
    };

    const renderView = () => {
        if (activeView === 'deepdive' && selectedFirm) {
            const firmPlacements = filteredPlacements.filter(p => p.search_firm === selectedFirm.name);
            return <FirmDeepDive firm={selectedFirm} placements={firmPlacements} onBack={handleBackToSummary} />;
        }

        switch (activeView) {
            case 'scorecard':
                return <ExecutiveSummaryView placements={filteredPlacements} onFirmSelect={handleFirmSelect} />;
            case 'comparison':
                return <ComparisonView placements={filteredPlacements} />;
            case 'placements':
                return <PlacementExplorerView placements={filteredPlacements} />;
            case 'rhr':
                return <RHRAnalysisView placements={filteredPlacements} />;
            case 'trends':
                return <TrendsView placements={filteredPlacements} />;
            default:
                return <ExecutiveSummaryView placements={filteredPlacements} onFirmSelect={handleFirmSelect} />;
        }
    };

    return (
        <div>
            <Header />
            <Navigation activeView={selectedFirm ? 'scorecard' : activeView} setActiveView={(view) => {
                setSelectedFirm(null);
                setActiveView(view);
            }} />
            <main className="main-container">
                <Filters filters={filters} setFilters={setFilters} />
                {renderView()}
            </main>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
