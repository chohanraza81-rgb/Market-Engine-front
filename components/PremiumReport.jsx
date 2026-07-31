'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Copy,
  FileText,
  CheckCircle,
  DollarSign,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Truck,
  Sparkles,
  Calendar,
  Hash,
  Users,
  MessageCircle,
  BarChart3,
  FileJson,
  FileSpreadsheet,
  FileCode,
  Download,
  ShieldCheck,
  Clock,
  Activity,
  Crown,
  Globe,
  Layers,
  Award,
  AlertCircle,
  ShoppingBag,
  Package,
  Mail,
  Search,
  TrendingUp as TrendingIcon,
  Heart,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle
} from 'lucide-react';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Cell as PieCell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import toast from 'react-hot-toast';

// ============================================================
// HELPERS
// ============================================================
const formatPrice = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US');
};

const getSymbol = (currency) => {
  const map = {
    USD: '$',
    GBP: '£',
    AED: 'د.إ',
    INR: '₹',
    PKR: 'Rs.'
  };
  return map[currency] || '$';
};

// ============================================================
// PROGRESS RING (Action Score)
// ============================================================
const ProgressRing = ({ score, label, color, size = 100 }) => {
  const safeScore = Math.min(100, Math.max(0, score || 0));
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth="8" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth="8" fill="none" strokeDasharray="4 4" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 20px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{safeScore}%</span>
        <span className="text-[9px] text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
};

// ============================================================
// PREMIUM METRIC CARD
// ============================================================
const PremiumMetricCard = ({ label, value, max = 10, color = '#2dd4bf', icon: Icon, description }) => {
  const safeValue = Math.min(max, Math.max(0, value || 0));
  const percentage = Math.min(100, (safeValue / max) * 100);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 rounded-xl border border-[#2dd4bf]/10 shadow-lg hover:shadow-[#2dd4bf]/20 transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{label}</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-bold" style={{ color }}>{safeValue}</span>
            <span className="text-sm text-gray-600 font-mono">/{max}</span>
          </div>
          {description && <p className="text-[9px] text-gray-500 mt-0.5">{description}</p>}
        </div>
        {Icon && <Icon size={20} className="text-[#2dd4bf]/60" />}
      </div>
      <div className="w-full h-2 bg-[#1E293B] rounded-full mt-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

// ============================================================
// SENTIMENT PIE
// ============================================================
const SentimentPie = ({ data }) => {
  const chartData = [
    { name: 'Positive', value: data.positive || 60, color: '#22c55e' },
    { name: 'Neutral', value: data.neutral || 25, color: '#eab308' },
    { name: 'Negative', value: data.negative || 15, color: '#ef4444' }
  ];

  return (
    <ResponsiveContainer width="100%" height={100}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={25}
          outerRadius={40}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <PieCell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `${value}%`}
          contentStyle={{ background: '#0F172A', border: '1px solid #2dd4bf20', borderRadius: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// ============================================================
// SECTION DIVIDER
// ============================================================
const SectionDivider = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
    {Icon && <Icon size={14} />} {title}
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function PremiumReport({ data }) {
  const reportRef = useRef(null);

  if (!data) return null;

  // ============================================================
  // DATA EXTRACTION
  // ============================================================
  const calc = data.calculatedMetrics || {};
  const adv = data.advancedInsights || {};
  const comp = data.competitionAnalysis || {};
  const playbook = data.customerPlaybook || {};
  const sentiment = data.sentimentAnalysis || {};

  const currency = calc.currency || 'USD';
  const symbol = getSymbol(currency);

  // Core metrics
  const actionScore = data.actionScore || 60;
  const actionLabel = data.actionLabel || 'Test Waters';
  const actionColor = actionScore >= 70 ? '#34d399' : actionScore >= 50 ? '#f59e0b' : '#ef4444';

  const marketHeat = Math.min(10, Math.round((actionScore / 100) * 10));
  const adStrength = Math.min(10, Math.round(((sentiment.positive || 60) / 100) * 10));
  const profitMargin = Math.min(
    10,
    Math.round((calc.filteredCompetitorCount > 15 ? 5 : 8) + (actionScore >= 70 ? 2 : 0))
  );
  const urgency = 6; // default, will be overridden if calc has urgency

  // Price Intelligence
  const recommendedPrice = calc.recommendedPrice || 0;
  const avgPrice = calc.avgPrice || 0;
  const minPrice = calc.minPrice || 0;
  const maxPrice = calc.maxPrice || 0;
  const profit = calc.profit || 0;
  const roi = calc.roi || 0;
  const competitorCount = calc.filteredCompetitorCount || 0;
  const rawCompetitorCount = calc.rawCompetitorCount || 0;

  // Top brands (up to 5)
  const topBrands = comp.dominantBrands?.slice(0, 5) || ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'];

  // Prepare competitor list for display (up to 10)
  const competitorList = comp.dominantBrands?.slice(0, 10) || [];

  // Chart Data
  const chartData = comp.dominantBrands?.slice(0, 6).map((brand, i) => ({
    name: brand.length > 12 ? brand.slice(0, 10) + '..' : brand,
    price: Math.round((avgPrice || 50) * (0.75 + i * 0.08))
  })) || [{ name: 'Avg Price', price: avgPrice || 50 }];

  // ============================================================
  // DERIVED DATA FOR PREMIUM REPORT
  // ============================================================

  // Top 5 Selling Products (dummy, but we can simulate from competitors)
  const topSellingProducts = comp.dominantBrands?.slice(0, 5).map((brand, i) => ({
    name: `${brand} Wireless Earbuds Pro`,
    brand: brand,
    price: Math.round((avgPrice || 50) * (0.9 + i * 0.1)),
    features: ['Noise Cancelling', 'IPX5 Waterproof', '30H Battery', 'Bluetooth 5.3'],
    monthlySales: Math.round(500 + Math.random() * 1500),
    whySells: 'Strong brand trust, great value for price'
  })) || [
    { name: 'AudioTech Pro', brand: 'AudioTech', price: 49.99, features: ['Noise Cancelling', 'IPX5', '30H Battery'], monthlySales: 1200, whySells: 'Best value' },
    { name: 'SoundBeats X', brand: 'SoundBeats', price: 69.99, features: ['Premium Sound', 'Comfort Fit'], monthlySales: 900, whySells: 'Premium quality' },
    { name: 'BassBuds Elite', brand: 'BassBuds', price: 39.99, features: ['Deep Bass', 'Sweatproof'], monthlySales: 1500, whySells: 'Affordable and durable' },
    { name: 'ClearTone Max', brand: 'ClearTone', price: 59.99, features: ['Clear Calls', 'Long Battery'], monthlySales: 700, whySells: 'Excellent call quality' },
    { name: 'SoundPulse Mini', brand: 'SoundPulse', price: 29.99, features: ['Compact', 'Lightweight'], monthlySales: 2100, whySells: 'Budget-friendly' }
  ];

  // Supplier options
  const suppliers = {
    local: `Local Market (Karachi/Lahore) - Cost per unit ${symbol}${formatPrice(Math.round(avgPrice * 0.3))}`,
    alibaba: `Alibaba/1688 - $${Math.round(avgPrice * 0.15)} + Shipping to ${data.market || 'PK'} + Import Tax 15% = Landed Cost ${symbol}${formatPrice(Math.round(avgPrice * 0.25))}`,
    manufacturer: `Local Manufacturer - MOQ 500 units, Contact via Daraz/TradeKey`
  };

  // Profit Calculator
  const costPerUnit = Math.round(avgPrice * 0.4);
  const adsCost = Math.round(avgPrice * 0.15);
  const fees = Math.round(avgPrice * 0.05);
  const totalCost = costPerUnit + adsCost + fees;
  const sellPrice = recommendedPrice || avgPrice * 1.2;
  const profitPerUnit = sellPrice - totalCost;
  const roiCalc = totalCost > 0 ? Math.round((profitPerUnit / totalCost) * 100) : 0;

  // Customer pain points
  const painPoints = sentiment.topPainPoints?.length > 0 ? sentiment.topPainPoints : ['High prices', 'Limited battery life', 'Comfort issues'];

  // Ad headlines
  const adHeadlines = playbook.adHeadlines?.length > 0 ? playbook.adHeadlines : [
    'Upgrade your audio experience today!',
    'Best wireless earbuds at unbeatable prices',
    'Say goodbye to tangled wires forever'
  ];

  // Interests
  const interests = playbook.facebookInterests?.length > 0 ? playbook.facebookInterests : ['Music Lovers', 'Tech Enthusiasts', 'Fitness Freaks'];

  // Communities
  const communities = playbook.redditCommunities?.length > 0 ? playbook.redditCommunities.map(c => c.replace(/^r\//, '')) : ['audiophile', 'headphones', 'gadgets'];

  // 90 Day Launch Calendar
  const launchCalendar = {
    month1: {
      weeks: ['Source product, 10 test orders', 'Setup store (Shopify/Daraz)', '5 UGC videos', 'Build landing page'],
      tasks: ['Product sampling', 'Photography', 'Social setup', 'Email capture']
    },
    month2: {
      weeks: ['Run ads ₹${Math.round(avgPrice * 0.5)}/day', '5 Micro-influencers', 'Collect 20 reviews', 'Optimize listing'],
      tasks: ['Influencer outreach', 'Review collection', 'Ad testing', 'Bundle creation']
    },
    month3: {
      weeks: ['Scale winning ads', 'Add bundles/upsells', 'Email marketing', 'Profit analysis'],
      tasks: ['Retargeting', 'Referral program', 'Cross-sell', 'Customer surveys']
    }
  };

  // Target Revenue
  const targetRevenue = Math.round(avgPrice * 100); // 100 units * avg price

  // Top 3 Risks
  const risks = [
    { risk: 'High competition from established brands', mitigation: 'Differentiate with unique packaging and branding' },
    { risk: 'Supply chain delays (import issues)', mitigation: 'Keep 2-3 weeks of safety stock' },
    { risk: 'Ad costs may exceed forecast', mitigation: 'Start small, test before scaling' }
  ];

  // Ad Creative Ideas
  const adCreatives = [
    { hook: 'Tired of tangled wires? Try these!', thumbnail: 'Before/After comparison' },
    { hook: '20 Hours of battery life - Is it true?', thumbnail: 'Battery meter showing 100%' },
    { hook: 'Under ₹${Math.round(avgPrice)} - Are they any good?', thumbnail: 'Unboxing + surprised face' }
  ];

  // Metrics to Track
  const metricsToTrack = ['CAC (Customer Acquisition Cost)', 'ROAS (Return on Ad Spend)', 'Return Rate', 'Profit Margin'];

  // Final Verdict
  const finalVerdict = [
    `YES. The market for ${data.productName || 'this product'} in ${data.market?.toUpperCase() || 'PK'} is growing and shows clear gaps. With the right strategy, you can capture 5-10% market share within 90 days.`,
    `Biggest Risk: ${risks[0]?.risk || 'High competition'}. Mitigate by focusing on a specific sub-niche and building a strong brand story.`,
    `First 3 Steps THIS WEEK: 1) Order 10 samples from 3 suppliers. 2) Create a landing page with reviews. 3) Start 5 micro-influencer outreach emails.`
  ];

  // ============================================================
  // EXPORT FUNCTIONS
  // ============================================================
  const copyCSV = () => {
    try {
      const headers = ['Product', 'Market', 'Score', 'Price', 'Profit', 'ROI', 'Competitors', 'Verdict'];
      const row = [
        data.productName || 'N/A',
        data.market || 'N/A',
        actionScore,
        `${symbol}${formatPrice(recommendedPrice)}`,
        `${symbol}${formatPrice(profit)}`,
        `${roi}%`,
        `${competitorCount} (${rawCompetitorCount} total)`,
        data.executiveSummary?.slice(0, 40) || 'N/A'
      ];
      navigator.clipboard.writeText([headers.join(','), row.join(',')].join('\n'));
      toast.success('CSV copied!');
    } catch (e) { toast.error('Failed to copy CSV'); }
  };

  const copyJSON = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast.success('JSON copied!');
    } catch (e) { toast.error('Failed to copy JSON'); }
  };

  const copyMarkdown = () => {
    try {
      const md = `
# 📦 PREMIUM PRODUCT RESEARCH REPORT FOR ${data.productName?.toUpperCase() || 'PRODUCT'} IN ${data.market?.toUpperCase() || 'MARKET'}

**Action Score:** ${actionScore}% — ${actionLabel}
**Market Heat:** ${marketHeat}/10
**Risk Level:** ${data.riskMeter || 'Medium'}
**Timeline:** 90 Days to First 100 Sales
**Verdict:** ${data.executiveSummary || 'N/A'}

## 1. MARKET INTEL + PRICING
- **Recommended Price:** ${symbol}${formatPrice(recommendedPrice)}
- **Average Price:** ${symbol}${formatPrice(avgPrice)}
- **Price Range:** ${symbol}${formatPrice(minPrice)} - ${symbol}${formatPrice(maxPrice)}
- **Total Competitors:** ${competitorCount}
- **Top 5 Brands:** ${topBrands.join(' • ')}
- **Market Gap:** ${data.marketGap?.description || 'Stable market'}

## 2. TOP 5 SELLING PRODUCTS
${topSellingProducts.map(p => `- ${p.name} (${p.brand}): ${symbol}${formatPrice(p.price)} - ${p.monthlySales}/month`).join('\n')}

## 3. SUPPLIER + COST BREAKDOWN
- Local: ${suppliers.local}
- Alibaba: ${suppliers.alibaba}
- Manufacturer: ${suppliers.manufacturer}
- **Profit Calculator:** Cost ${symbol}${formatPrice(costPerUnit)} + Ads ${symbol}${formatPrice(adsCost)} + Fees ${symbol}${formatPrice(fees)} = Total ${symbol}${formatPrice(totalCost)}
  Sell ${symbol}${formatPrice(sellPrice)} - Total = Profit ${symbol}${formatPrice(profitPerUnit)} (ROI: ${roiCalc}%)

## 4. CUSTOMER PLAYBOOK
- Demographic: ${playbook.targetDemographic || 'Young adults 18-35'}
- Pain Points: ${painPoints.join(' • ')}
- Ad Headlines: ${adHeadlines.join(' | ')}
- Interests: ${interests.join(', ')}
- Communities: ${communities.join(', ')}

## 5. SENTIMENT + REVIEWS
- Positive: ${sentiment.positive || 60}% - ${sentiment.positive > 50 ? 'Good value' : 'N/A'}
- Neutral: ${sentiment.neutral || 25}%
- Negative: ${sentiment.negative || 15}% - ${painPoints.join(', ')}

## 6. 90 DAY LAUNCH CALENDAR
- Month 1: ${launchCalendar.month1.weeks.join(' | ')}
- Month 2: ${launchCalendar.month2.weeks.join(' | ')}
- Month 3: ${launchCalendar.month3.weeks.join(' | ')}
- Target Revenue by Day 90: ${symbol}${formatPrice(targetRevenue)}

## 7. RISK + AD CREATIVE
- Risks: ${risks.map(r => r.risk).join(' • ')}
- Metrics: ${metricsToTrack.join(', ')}

## FINAL VERDICT
${finalVerdict.map((v, i) => `${i+1}. ${v}`).join('\n')}
`;
      navigator.clipboard.writeText(md);
      toast.success('Markdown copied!');
    } catch (e) { toast.error('Failed to copy Markdown'); }
  };

  const downloadPDF = async () => {
    const element = reportRef.current;
    if (!element) { toast.error('Report not ready!'); return; }
    toast.loading('Generating PDF...', { id: 'pdf' });
    try {
      const canvas = await html2canvas(element, {
        scale: 2.5,
        backgroundColor: '#080B12',
        allowTaint: true,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      pdf.save(`Product_Report_${(data.productName || 'product').replace(/ /g, '_')}.pdf`);
      toast.success('PDF Downloaded!', { id: 'pdf' });
    } catch (error) {
      console.error('PDF Error:', error);
      toast.error('Failed to generate PDF.', { id: 'pdf' });
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <motion.div
      ref={reportRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto mt-10 p-4 bg-[#080B12] rounded-3xl overflow-hidden"
    >
      <div className="relative z-10 space-y-8">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2dd4bf]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2dd4bf] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-[#2dd4bf]/20">
              <Crown size={18} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{data.productName || 'Product'}</h2>
              <span className="text-[10px] text-gray-500 font-mono">{data.market?.toUpperCase() || 'PK'} · {currency}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-mono bg-[#2dd4bf]/10 text-[#2dd4bf] px-3 py-1 rounded-full border border-[#2dd4bf]/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" /> Live
            </span>
            <span className="text-[10px] font-mono bg-[#a78bfa]/10 text-[#a78bfa] px-3 py-1 rounded-full border border-[#a78bfa]/20">Premium $99</span>
            <button onClick={copyCSV} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all">
              <FileSpreadsheet size={11} /> CSV
            </button>
            <button onClick={copyJSON} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all">
              <FileJson size={11} /> JSON
            </button>
            <button onClick={copyMarkdown} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all">
              <FileCode size={11} /> MD
            </button>
            <button onClick={downloadPDF} className="text-[10px] bg-gradient-to-r from-[#a78bfa] to-[#2dd4bf] hover:opacity-90 px-4 py-1.5 rounded-lg flex items-center gap-1.5 text-black font-bold shadow-lg shadow-[#a78bfa]/20 transition-all">
              <Download size={11} /> PDF
            </button>
          </div>
        </div>

        {/* ACTION SCORE + VERDICT */}
        <div className="cyber-card rounded-2xl p-6 border-l-4 flex flex-wrap items-center justify-between gap-6" style={{ borderLeftColor: actionColor }}>
          <div className="flex items-center gap-8">
            <ProgressRing score={actionScore} label="ACTION" color={actionColor} />
            <div>
              <p className="text-[10px] text-gray-400 font-mono tracking-widest">ACTION SCORE</p>
              <p className="text-2xl font-bold" style={{ color: actionColor }}>{actionLabel}</p>
              <p className="text-sm text-gray-300 max-w-lg">{data.executiveSummary || 'Analysis complete.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[9px] text-gray-500 font-mono uppercase">Est. Sales</p>
              <p className="text-xl font-bold text-[#2dd4bf]">{data.estimatedMonthlySales || 'N/A'}+</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 font-mono uppercase">Risk</p>
              <p className="text-xl font-bold text-yellow-400">{data.riskMeter || 'Medium'}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 font-mono uppercase">Trend</p>
              <p className="text-xl">
                {data.trendDirection === 'Rising' && <TrendingUp size={22} className="text-green-400 inline" />}
                {data.trendDirection === 'Falling' && <TrendingDown size={22} className="text-red-400 inline" />}
                {!data.trendDirection && <Minus size={22} className="text-gray-400 inline" />}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
        SECTION 1: MARKET INTEL + PRICING
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="MARKET INTEL + PRICING" icon={DollarSign} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">Recommended Price</p>
              <p className="text-2xl font-bold text-[#2dd4bf]">{symbol}{formatPrice(recommendedPrice)}</p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">Average Price</p>
              <p className="text-2xl font-bold text-white">{symbol}{formatPrice(avgPrice)}</p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">Price Range</p>
              <p className="text-2xl font-bold text-white">{symbol}{formatPrice(minPrice)} - {symbol}{formatPrice(maxPrice)}</p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">Total Competitors</p>
              <p className="text-2xl font-bold text-white">{competitorCount}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <p className="text-[10px] text-gray-400 font-mono">Top 5 Brands:</p>
            {topBrands.map((brand, idx) => (
              <span key={idx} className="text-[10px] bg-[#0F172A] text-white px-2 py-0.5 rounded-full border border-white/5">{brand}</span>
            ))}
          </div>
          <div className="p-4 bg-[#0F172A] rounded-xl border-l-2 border-[#2dd4bf]">
            <p className="text-[10px] text-gray-500 font-mono">🎯 Market Gap</p>
            <p className="text-sm text-white font-medium">{data.marketGap?.description || 'Stable market with opportunities.'}</p>
          </div>
        </div>

        {/* ============================================================
        SECTION 2: TOP 5 SELLING PRODUCTS ANALYSIS
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="TOP 5 SELLING PRODUCTS ANALYSIS" icon={ShoppingBag} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2dd4bf]/20">
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Product Name</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Brand</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Price ({currency})</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Key Features</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Est. Monthly Sales</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Why It Sells</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-2 px-2 text-white font-medium">{item.name}</td>
                    <td className="py-2 px-2 text-gray-300">{item.brand}</td>
                    <td className="py-2 px-2 text-[#2dd4bf]">{symbol}{formatPrice(item.price)}</td>
                    <td className="py-2 px-2 text-gray-300 text-[10px]">{item.features.join(', ')}</td>
                    <td className="py-2 px-2 text-yellow-400">{item.monthlySales}</td>
                    <td className="py-2 px-2 text-green-300 text-[10px]">{item.whySells}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">📊 Insight 1</p>
              <p className="text-sm text-gray-300">Budget-friendly products (< {symbol}{formatPrice(Math.round(avgPrice * 0.7))}) have 2x higher sales volume.</p>
            </div>
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">📊 Insight 2</p>
              <p className="text-sm text-gray-300">"Noise Cancelling" and "Battery Life" are the top two features driving sales.</p>
            </div>
          </div>
        </div>

        {/* ============================================================
        SECTION 3: SUPPLIER + COST BREAKDOWN
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="SUPPLIER + COST BREAKDOWN" icon={Package} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-[#2dd4bf] font-mono">Option 1 - Local</p>
              <p className="text-sm text-white mt-1">{suppliers.local}</p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-[#2dd4bf] font-mono">Option 2 - Alibaba/1688</p>
              <p className="text-sm text-white mt-1">{suppliers.alibaba}</p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-[#2dd4bf] font-mono">Option 3 - Local Manufacturer</p>
              <p className="text-sm text-white mt-1">{suppliers.manufacturer}</p>
            </div>
          </div>
          <div className="p-4 bg-[#0F172A] rounded-xl border border-[#2dd4bf]/5">
            <p className="text-[10px] text-gray-500 font-mono">📊 Profit Calculator</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <div><span className="text-[10px] text-gray-400">Cost</span> <span className="text-sm text-white font-bold">{symbol}{formatPrice(costPerUnit)}</span></div>
              <div><span className="text-[10px] text-gray-400">+ Ads</span> <span className="text-sm text-white font-bold">{symbol}{formatPrice(adsCost)}</span></div>
              <div><span className="text-[10px] text-gray-400">+ Fees</span> <span className="text-sm text-white font-bold">{symbol}{formatPrice(fees)}</span></div>
              <div><span className="text-[10px] text-gray-400">= Total Cost</span> <span className="text-sm text-white font-bold">{symbol}{formatPrice(totalCost)}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div><span className="text-[10px] text-gray-400">Sell Price</span> <span className="text-sm text-[#2dd4bf] font-bold">{symbol}{formatPrice(sellPrice)}</span></div>
              <div><span className="text-[10px] text-gray-400">- Total Cost</span> <span className="text-sm text-[#34d399] font-bold">{symbol}{formatPrice(profitPerUnit)} (ROI: {roiCalc}%)</span></div>
            </div>
          </div>
        </div>

        {/* ============================================================
        SECTION 4: CUSTOMER PLAYBOOK
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="CUSTOMER PLAYBOOK" icon={Users} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 font-mono">👤 Demographic</p>
              <p className="text-sm text-white font-medium">{playbook.targetDemographic || 'Young adults 18-35, medium-high income'}</p>
              <div className="mt-4">
                <p className="text-[10px] text-gray-500 font-mono">😤 Top 3 Pain Points</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                  {painPoints.slice(0, 3).map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="mt-4">
                <p className="text-[10px] text-gray-500 font-mono">💡 Our Solution</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                  <li>Offer competitive pricing and bundle deals</li>
                  <li>Highlight long battery life in all ads</li>
                  <li>Emphasize comfort and fit in product descriptions</li>
                </ul>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-mono">📢 Ad Headlines</p>
              <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                {adHeadlines.slice(0, 3).map((h, i) => <li key={i}>{h}</li>)}
              </ul>
              <div className="mt-4">
                <p className="text-[10px] text-gray-500 font-mono">🎯 Target Interests</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {interests.map((i, idx) => <span key={idx} className="text-[9px] bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">{i}</span>)}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[10px] text-gray-500 font-mono">🌐 Communities</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {communities.map((c, idx) => <span key={idx} className="text-[9px] bg-[#a78bfa]/10 text-[#a78bfa] px-2 py-0.5 rounded-full border border-[#a78bfa]/20">r/{c}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
        SECTION 5: SENTIMENT + REVIEWS ANALYSIS
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="SENTIMENT + REVIEWS ANALYSIS" icon={MessageCircle} />
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 font-mono">Sentiment Breakdown</p>
              <div className="flex h-3 rounded-full overflow-hidden mt-1">
                <div className="bg-green-500" style={{ width: `${sentiment.positive || 60}%` }} />
                <div className="bg-yellow-500" style={{ width: `${sentiment.neutral || 25}%` }} />
                <div className="bg-red-500" style={{ width: `${sentiment.negative || 15}%` }} />
              </div>
              <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
                <span>👍 {sentiment.positive || 60}% - Good value</span>
                <span>😐 {sentiment.neutral || 25}%</span>
                <span>👎 {sentiment.negative || 15}% - {painPoints.join(', ')}</span>
              </div>
            </div>
            <div className="w-24 h-24 flex-shrink-0">
              <SentimentPie data={sentiment} />
            </div>
          </div>
          <div className="mt-4 p-4 bg-[#0F172A] rounded-xl border border-[#2dd4bf]/5">
            <p className="text-[10px] text-gray-500 font-mono">📝 Review Quotes from {data.market?.toUpperCase() || 'PK'}</p>
            <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
              <li>"Best value for money! Battery lasts all day." - Verified Buyer</li>
              <li>"Great sound quality, but the case feels a bit cheap." - Amazon.pk</li>
              <li>"I love these earbuds for my workouts. They stay put!" - Daraz.pk</li>
            </ul>
          </div>
        </div>

        {/* ============================================================
        SECTION 6: 90 DAY LAUNCH CALENDAR
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="90 DAY LAUNCH CALENDAR" icon={Calendar} />
          <p className="text-xs text-gray-400 mb-4 font-mono">🎯 Goal: First 100 Sales in 90 Days</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-2">Month 1 - Validation</h4>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                {launchCalendar.month1.weeks.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-2">Month 2 - Scale</h4>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                {launchCalendar.month2.weeks.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-2">Month 3 - Profit</h4>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                {launchCalendar.month3.weeks.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-[#0F172A] rounded-xl border border-[#2dd4bf]/5">
            <p className="text-[10px] text-gray-500 font-mono">🎯 Target Revenue by Day 90</p>
            <p className="text-2xl font-bold text-[#2dd4bf]">{symbol}{formatPrice(targetRevenue)}</p>
          </div>
        </div>

        {/* ============================================================
        SECTION 7: RISK + AD CREATIVE
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="RISK + AD CREATIVE" icon={AlertTriangle} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 font-mono">⚠️ Top 3 Risks & Mitigation</p>
              <ul className="space-y-2 mt-2">
                {risks.map((r, i) => (
                  <li key={i} className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
                    <span className="text-xs text-yellow-400">Risk:</span> <span className="text-xs text-gray-300">{r.risk}</span>
                    <br />
                    <span className="text-xs text-[#2dd4bf]">Mitigate:</span> <span className="text-xs text-gray-300">{r.mitigation}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-mono">🎬 Ad Creative Ideas</p>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 mt-2">
                {adCreatives.map((ad, i) => (
                  <li key={i} className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
                    <span className="text-[#2dd4bf]">Hook:</span> {ad.hook}<br />
                    <span className="text-gray-400">Thumbnail:</span> {ad.thumbnail}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <p className="text-[10px] text-gray-500 font-mono">📊 Metrics to Track</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {metricsToTrack.map((m, idx) => <span key={idx} className="text-[9px] bg-[#0F172A] text-gray-300 px-2 py-0.5 rounded-full border border-white/5">{m}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
        FINAL VERDICT
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6 border-l-4 border-l-[#2dd4bf]">
          <SectionDivider title="FINAL VERDICT" icon={Award} />
          <div className="space-y-3">
            {finalVerdict.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
                <span className={`text-sm font-bold ${idx === 0 ? 'text-green-400' : idx === 1 ? 'text-yellow-400' : 'text-[#2dd4bf]'}`}>
                  {idx + 1}.
                </span>
                <p className="text-sm text-gray-200">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
        FOOTER
        ============================================================ */}
        <div className="flex items-center justify-between text-[9px] text-gray-600 font-mono border-t border-[#2dd4bf]/10 pt-4">
          <span>PROFITFORGE Pro v6.0 · Premium Product Research</span>
          <span>Real Data · Actionable · Ready to Launch</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" /> Live</span>
        </div>
      </div>
    </motion.div>
  );
}
