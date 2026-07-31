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
  AlertTriangle,
  BookOpen
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
  Cell as PieCell
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
// DETECT REPORT TYPE
// ============================================================
const detectReportType = (data) => {
  // If data has seoData or seoScore, it's an SEO report
  if (data.seoData || data.seoScore || data.keywordStrategy) {
    return 'seo';
  }
  // If data has calculatedMetrics and analysisResult, it's Product Research
  if (data.calculatedMetrics || data.analysisResult || data.priceIntelligence) {
    return 'product';
  }
  // Check for actionScore and competitors (common in both)
  if (data.actionScore && (data.competitionAnalysis || data.marketGap)) {
    // SEO reports usually have keywordStrategy, Product reports have priceIntelligence
    if (data.keywordStrategy) return 'seo';
    if (data.priceIntelligence) return 'product';
  }
  // Default to product
  return 'product';
};

// ============================================================
// PROGRESS RING
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
  // DETECT REPORT TYPE
  // ============================================================
  const reportType = detectReportType(data);
  const isSEO = reportType === 'seo';
  const isProduct = reportType === 'product';

  // ============================================================
  // EXTRACT DATA (Product Research)
  // ============================================================
  const calc = data.calculatedMetrics || {};
  const adv = data.advancedInsights || {};
  const comp = data.competitionAnalysis || {};
  const playbook = data.customerPlaybook || {};
  const sentiment = data.sentimentAnalysis || {};
  const keywordStrategy = data.keywordStrategy || {};

  const currency = calc.currency || 'USD';
  const symbol = getSymbol(currency);
  const productName = data.productName || 'Product';
  const market = data.market || 'PK';

  // Core metrics
  const actionScore = data.actionScore || 60;
  const actionLabel = data.actionLabel || 'Test Waters';
  const actionColor = actionScore >= 70 ? '#34d399' : actionScore >= 50 ? '#f59e0b' : '#ef4444';

  // Price metrics
  const avgPrice = calc.avgPrice || 0;
  const recommendedPrice = calc.recommendedPrice || 0;
  const minPrice = calc.minPrice || 0;
  const maxPrice = calc.maxPrice || 0;
  const profit = calc.profit || 0;
  const roi = calc.roi || 0;
  const competitorCount = calc.filteredCompetitorCount || 0;
  const rawCompetitorCount = calc.rawCompetitorCount || 0;

  // Brands
  const topBrands = comp.dominantBrands?.slice(0, 5) || [];

  // Pain points
  const painPoints = sentiment.topPainPoints || [];

  // ============================================================
  // GENERATE RECOMMENDATIONS (Data-driven)
  // ============================================================
  const getRecommendations = () => {
    const recs = [];
    if (actionScore < 70) recs.push('Increase marketing efforts to boost brand visibility');
    if (competitorCount > 15) recs.push('Differentiate with unique features or pricing strategy');
    if (sentiment.negative > 30) recs.push(`Address pain points: ${painPoints.join(', ') || 'quality issues'}`);
    if (data.marketGap?.description) recs.push(`Leverage market gap: ${data.marketGap.description}`);
    if (recs.length === 0) recs.push('Maintain current strategy and monitor competitor activity');
    return recs.slice(0, 4);
  };
  const recommendations = getRecommendations();

  // ============================================================
  // EXPORT FUNCTIONS
  // ============================================================
  const copyCSV = () => {
    try {
      const headers = ['Product', 'Market', 'Score', 'Price', 'Profit', 'ROI', 'Competitors', 'Verdict'];
      const row = [
        productName,
        market,
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
      let md = '';
      if (isSEO) {
        md = `
# 📊 PREMIUM SEO REPORT FOR ${productName.toUpperCase()} IN ${market}

**SEO Score:** ${actionScore}%
**Timeline:** 60-90 Days
**Action Score:** ${actionScore}% — ${actionLabel}

## 1. REAL KEYWORD DATA
${keywordStrategy.primaryKeywords?.map(k => `- ${k}`).join('\n') || 'N/A'}

## 2. TOP 5 COMPETITORS
${comp.dominantBrands?.map(b => `- ${b}`).join('\n') || 'N/A'}

## 3. FINAL VERDICT
${data.executiveSummary || 'N/A'}
`;
      } else {
        md = `
# 📦 PREMIUM PRODUCT RESEARCH REPORT FOR ${productName.toUpperCase()} IN ${market}

**Action Score:** ${actionScore}% — ${actionLabel}
**Market Heat:** ${Math.min(10, Math.round((actionScore / 100) * 10))}/10
**Risk Level:** ${data.riskMeter || 'Medium'}

## 1. MARKET INTEL + PRICING
- **Recommended Price:** ${symbol}${formatPrice(recommendedPrice)}
- **Average Price:** ${symbol}${formatPrice(avgPrice)}
- **Price Range:** ${symbol}${formatPrice(minPrice)} - ${symbol}${formatPrice(maxPrice)}
- **Total Competitors:** ${competitorCount}
- **Top 5 Brands:** ${topBrands.join(' • ') || 'N/A'}
- **Market Gap:** ${data.marketGap?.description || 'N/A'}

## 2. PROFIT CALCULATOR
Cost ${symbol}${formatPrice(Math.round(avgPrice * 0.4))} + Ads ${symbol}${formatPrice(Math.round(avgPrice * 0.15))} + Fees ${symbol}${formatPrice(Math.round(avgPrice * 0.05))} = Total ${symbol}${formatPrice(Math.round(avgPrice * 0.6))}
Sell ${symbol}${formatPrice(recommendedPrice)} - Total = Profit ${symbol}${formatPrice(profit)} (ROI: ${roi}%)

## 3. CUSTOMER PLAYBOOK
- **Demographic:** ${playbook.targetDemographic || 'N/A'}
- **Pain Points:** ${painPoints.join(' • ') || 'N/A'}

## FINAL VERDICT
${data.executiveSummary || 'N/A'}
`;
      }
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
      pdf.save(`${isSEO ? 'SEO' : 'Product'}_Report_${productName.replace(/ /g, '_')}.pdf`);
      toast.success('PDF Downloaded!', { id: 'pdf' });
    } catch (error) {
      console.error('PDF Error:', error);
      toast.error('Failed to generate PDF.', { id: 'pdf' });
    }
  };

  // ============================================================
  // RENDER — SEO REPORT
  // ============================================================
  if (isSEO) {
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#2dd4bf] flex items-center justify-center shadow-lg shadow-[#a78bfa]/20">
                <BookOpen size={18} className="text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">{productName}</h2>
                <span className="text-[10px] text-gray-500 font-mono">{market} · {currency} · SEO Report</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono bg-[#2dd4bf]/10 text-[#2dd4bf] px-3 py-1 rounded-full border border-[#2dd4bf]/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" /> Live
              </span>
              <span className="text-[10px] font-mono bg-[#a78bfa]/10 text-[#a78bfa] px-3 py-1 rounded-full border border-[#a78bfa]/20">Premium SEO</span>
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

          {/* SEO SCORE */}
          <div className="cyber-card rounded-2xl p-6 border-l-4 flex flex-wrap items-center justify-between gap-6" style={{ borderLeftColor: actionColor }}>
            <div className="flex items-center gap-8">
              <ProgressRing score={actionScore} label="SEO" color={actionColor} />
              <div>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest">SEO SCORE</p>
                <p className="text-2xl font-bold" style={{ color: actionColor }}>
                  {actionScore >= 70 ? 'Good' : actionScore >= 50 ? 'Needs Work' : 'Needs Help'}
                </p>
                <p className="text-sm text-gray-300 max-w-lg">{data.executiveSummary || 'Analysis complete.'}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[9px] text-gray-500 font-mono uppercase">Timeline</p>
                <p className="text-xl font-bold text-[#2dd4bf]">60-90 Days</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-gray-500 font-mono uppercase">Action</p>
                <p className="text-xl font-bold text-yellow-400">{actionLabel}</p>
              </div>
            </div>
          </div>

          {/* KEYWORD STRATEGY */}
          <div className="cyber-card rounded-2xl p-6">
            <SectionDivider title="REAL KEYWORD DATA + SEARCH TREND" icon={Hash} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
                <p className="text-[10px] text-gray-400 font-mono">Primary Keywords</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {keywordStrategy.primaryKeywords?.map((kw, i) => (
                    <span key={i} className="text-[9px] bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">{kw}</span>
                  )) || <span className="text-sm text-gray-500">N/A</span>}
                </div>
              </div>
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
                <p className="text-[10px] text-gray-400 font-mono">Secondary Keywords</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {keywordStrategy.secondaryKeywords?.map((kw, i) => (
                    <span key={i} className="text-[9px] bg-[#a78bfa]/10 text-[#a78bfa] px-2 py-0.5 rounded-full border border-[#a78bfa]/20">{kw}</span>
                  )) || <span className="text-sm text-gray-500">N/A</span>}
                </div>
              </div>
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
                <p className="text-[10px] text-gray-400 font-mono">Long-tail Keywords</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {keywordStrategy.longTailKeywords?.map((kw, i) => (
                    <span key={i} className="text-[9px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">{kw}</span>
                  )) || <span className="text-sm text-gray-500">N/A</span>}
                </div>
              </div>
            </div>
          </div>

          {/* TOP COMPETITORS */}
          <div className="cyber-card rounded-2xl p-6">
            <SectionDivider title="TOP 5 COMPETITORS" icon={Users} />
            <div className="flex flex-wrap gap-2">
              {comp.dominantBrands?.map((brand, idx) => (
                <span key={idx} className="text-xs bg-[#0F172A] text-white px-3 py-1.5 rounded-full border border-white/5">{brand}</span>
              )) || <span className="text-sm text-gray-500">N/A</span>}
            </div>
          </div>

          {/* FINAL VERDICT */}
          <div className="cyber-card rounded-2xl p-6 border-l-4 border-l-[#2dd4bf]">
            <SectionDivider title="FINAL VERDICT" icon={Award} />
            <p className="text-sm text-gray-300">{data.executiveSummary || 'Analysis complete.'}</p>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between text-[9px] text-gray-600 font-mono border-t border-[#2dd4bf]/10 pt-4">
            <span>PROFITFORGE Pro v6.0 · Premium SEO Report</span>
            <span>Real Data · Actionable · Ready to Execute</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" /> Live</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================================
  // RENDER — PRODUCT RESEARCH REPORT
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
              <h2 className="text-xl font-bold text-white tracking-tight">{productName}</h2>
              <span className="text-[10px] text-gray-500 font-mono">{market} · {currency} · Product Research</span>
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

        {/* MARKET INTEL + PRICING */}
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
          {topBrands.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <p className="text-[10px] text-gray-400 font-mono">Top 5 Brands:</p>
              {topBrands.map((brand, idx) => (
                <span key={idx} className="text-[10px] bg-[#0F172A] text-white px-2 py-0.5 rounded-full border border-white/5">{brand}</span>
              ))}
            </div>
          )}
          <div className="p-4 bg-[#0F172A] rounded-xl border-l-2 border-[#2dd4bf]">
            <p className="text-[10px] text-gray-500 font-mono">🎯 Market Gap</p>
            <p className="text-sm text-white font-medium">{data.marketGap?.description || 'Stable market with opportunities.'}</p>
          </div>
        </div>

        {/* CUSTOMER PLAYBOOK */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="CUSTOMER PLAYBOOK" icon={Users} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 font-mono">👤 Demographic</p>
              <p className="text-sm text-white font-medium">{playbook.targetDemographic || 'Data not available'}</p>
              <div className="mt-4">
                <p className="text-[10px] text-gray-500 font-mono">😤 Top Pain Points</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                  {painPoints.length > 0 ? painPoints.slice(0, 3).map((p, i) => <li key={i}>{p}</li>) : <li>No pain points data available</li>}
                </ul>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-mono">📢 Ad Headlines</p>
              <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                {playbook.adHeadlines?.length > 0 ? playbook.adHeadlines.slice(0, 3).map((h, i) => <li key={i}>{h}</li>) : <li>No ad headlines available</li>}
              </ul>
              <div className="mt-4">
                <p className="text-[10px] text-gray-500 font-mono">🎯 Target Interests</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {playbook.facebookInterests?.map((i, idx) => <span key={idx} className="text-[9px] bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">{i}</span>) || <span className="text-xs text-gray-500">N/A</span>}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[10px] text-gray-500 font-mono">🌐 Communities</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {playbook.redditCommunities?.map((c, idx) => <span key={idx} className="text-[9px] bg-[#a78bfa]/10 text-[#a78bfa] px-2 py-0.5 rounded-full border border-[#a78bfa]/20">r/{c}</span>) || <span className="text-xs text-gray-500">N/A</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROFIT CALCULATOR */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="PROFIT CALCULATOR" icon={DollarSign} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">Cost</p>
              <p className="text-xl font-bold text-white">{symbol}{formatPrice(Math.round(avgPrice * 0.4))}</p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">+ Ads</p>
              <p className="text-xl font-bold text-white">{symbol}{formatPrice(Math.round(avgPrice * 0.15))}</p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">+ Fees</p>
              <p className="text-xl font-bold text-white">{symbol}{formatPrice(Math.round(avgPrice * 0.05))}</p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">= Total Cost</p>
              <p className="text-xl font-bold text-[#2dd4bf]">{symbol}{formatPrice(Math.round(avgPrice * 0.6))}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">Sell Price</p>
              <p className="text-2xl font-bold text-[#2dd4bf]">{symbol}{formatPrice(recommendedPrice)}</p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">- Total Cost</p>
              <p className={`text-2xl font-bold ${profit > 0 ? 'text-[#34d399]' : 'text-red-400'}`}>
                {symbol}{formatPrice(profit)} (ROI: {roi}%)
              </p>
            </div>
          </div>
        </div>

        {/* SENTIMENT + REVIEWS */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="SENTIMENT + REVIEWS ANALYSIS" icon={MessageCircle} />
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 font-mono">Sentiment Breakdown</p>
              <div className="flex h-3 rounded-full overflow-hidden mt-1">
                <div className="bg-green-500" style={{ width: `${sentiment.positive || 0}%` }} />
                <div className="bg-yellow-500" style={{ width: `${sentiment.neutral || 0}%` }} />
                <div className="bg-red-500" style={{ width: `${sentiment.negative || 0}%` }} />
              </div>
              <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
                <span>👍 {sentiment.positive || 0}%</span>
                <span>😐 {sentiment.neutral || 0}%</span>
                <span>👎 {sentiment.negative || 0}%</span>
              </div>
            </div>
            <div className="w-24 h-24 flex-shrink-0">
              <SentimentPie data={sentiment} />
            </div>
          </div>
          {painPoints.length > 0 && (
            <div className="mt-4 p-4 bg-[#0F172A] rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">📝 Complaints from {market}</p>
              <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                {painPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* FINAL RECOMMENDATIONS */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="FINAL RECOMMENDATIONS" icon={Award} />
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
                <span className="text-[#2dd4bf] font-bold text-sm">{idx+1}.</span>
                <span className="text-sm text-gray-200">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FINAL VERDICT */}
        <div className="cyber-card rounded-2xl p-6 border-l-4 border-l-[#2dd4bf]">
          <SectionDivider title="FINAL VERDICT" icon={Award} />
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <span className="text-sm font-bold text-green-400">1.</span>
              <p className="text-sm text-gray-200">
                {actionScore >= 70 ? 'YES. The market shows strong potential with clear gaps.' : 'CONSIDER. The market has moderate potential but requires differentiation.'}
              </p>
            </div>
            <div className="flex items-start gap-3 bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <span className="text-sm font-bold text-yellow-400">2.</span>
              <p className="text-sm text-gray-200">
                Biggest Risk: High competition and price sensitivity. Mitigate by focusing on quality and unique value proposition.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <span className="text-sm font-bold text-[#2dd4bf]">3.</span>
              <p className="text-sm text-gray-200">
                First 3 Steps THIS WEEK: 1) Order samples from 3 suppliers. 2) Create a landing page with real reviews. 3) Start micro-influencer outreach.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between text-[9px] text-gray-600 font-mono border-t border-[#2dd4bf]/10 pt-4">
          <span>PROFITFORGE Pro v6.0 · Premium Product Research</span>
          <span>Real Data · Actionable · Ready to Launch</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" /> Live</span>
        </div>
      </div>
    </motion.div>
  );
}
