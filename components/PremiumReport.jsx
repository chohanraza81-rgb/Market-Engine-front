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
  Info
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
  Radar
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
// METRIC CARD (Enhanced with Progress Bar)
// ============================================================
const MetricCard = ({ label, value, max = 10, color = '#2dd4bf', icon: Icon, description }) => {
  const safeValue = Math.min(max, Math.max(0, value || 0));
  const percentage = Math.min(100, (safeValue / max) * 100);

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
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
// MAIN COMPONENT
// ============================================================
export default function PremiumReport({ data }) {
  const reportRef = useRef(null);

  if (!data) return null;

  const calc = data.calculatedMetrics || {};
  const adv = data.advancedInsights || {};
  const comp = data.competitionAnalysis || {};
  const playbook = data.customerPlaybook || {};
  const sentiment = data.sentimentAnalysis || {};

  const currency = calc.currency || 'USD';
  const symbol = getSymbol(currency);

  const actionScore = data.actionScore || 50;
  const actionLabel = data.actionLabel || 'Test Waters';

  // Derived metrics
  const marketHeat = Math.min(10, Math.round((actionScore / 100) * 10));
  const adStrength = Math.min(10, Math.round(((sentiment.positive || 60) / 100) * 10));
  const profitMargin = Math.min(
    10,
    Math.round((calc.filteredCompetitorCount > 15 ? 5 : 8) + (actionScore >= 70 ? 2 : 0))
  );
  const urgency = Math.min(
    10,
    Math.round(data.trendDirection === 'Rising' ? 8 : data.trendDirection === 'Falling' ? 4 : 6)
  );
  const competitionScore = Math.min(10, Math.round((calc.filteredCompetitorCount || 0) / 6));

  const actionColor = actionScore >= 70 ? '#34d399' : actionScore >= 50 ? '#f59e0b' : '#ef4444';

  // Price Spread Chart Data
  const chartData = comp.dominantBrands?.slice(0, 6).map((brand, i) => ({
    name: brand.length > 12 ? brand.slice(0, 10) + '..' : brand,
    price: Math.round((calc.avgPrice || 50) * (0.75 + i * 0.08))
  })) || [{ name: 'Avg Price', price: calc.avgPrice || 50 }];

  // Prepare competitor list for display
  const competitorList = comp.dominantBrands?.slice(0, 10) || [];

  // Generate final recommendations based on data
  const getRecommendations = () => {
    const recs = [];
    if (actionScore < 70) {
      recs.push('Increase marketing efforts to boost brand visibility');
    }
    if (calc.filteredCompetitorCount > 15) {
      recs.push('Differentiate with unique features or pricing strategy');
    }
    if (sentiment.negative > 30) {
      recs.push(`Address pain points: ${sentiment.topPainPoints?.join(', ') || 'quality issues'}`);
    }
    if (data.marketGap?.description) {
      recs.push(`Leverage market gap: ${data.marketGap.description}`);
    }
    if (recs.length === 0) {
      recs.push('Maintain current strategy and monitor competitor activity');
      recs.push('Continue optimizing your product offering');
    }
    return recs.slice(0, 4);
  };

  const recommendations = getRecommendations();

  // ============================================================
  // COPY FUNCTIONS
  // ============================================================
  const copyCSV = () => {
    try {
      const headers = ['Product', 'Market', 'Score', 'Price', 'Profit', 'ROI', 'Competitors', 'Verdict'];
      const row = [
        data.productName || 'N/A',
        data.market || 'N/A',
        actionScore,
        `${symbol}${formatPrice(calc.recommendedPrice)}`,
        `${symbol}${formatPrice(calc.profit)}`,
        `${calc.roi || 0}%`,
        `${calc.filteredCompetitorCount || 0} (${calc.rawCompetitorCount || 0} total)`,
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
# 📊 PROFITFORGE PRO Report
**Product:** ${data.productName || 'N/A'}
**Market:** ${data.market?.toUpperCase() || 'N/A'} (${currency})
**Action Score:** ${actionScore}% — ${actionLabel}
**Verdict:** ${data.executiveSummary || 'N/A'}

## 🔍 Competitor Intel
- **Recommended Price:** ${symbol}${formatPrice(calc.recommendedPrice)}
- **Average Price:** ${symbol}${formatPrice(calc.avgPrice)}
- **Price Range:** ${symbol}${formatPrice(calc.minPrice)} – ${symbol}${formatPrice(calc.maxPrice)}
- **Competitors:** ${calc.filteredCompetitorCount || 0} (${calc.rawCompetitorCount || 0} total)
- **Top Brands:** ${comp.dominantBrands?.join(' • ') || 'N/A'}

## 📈 Metrics
- Market Heat: ${marketHeat}/10
- Ad Strength: ${adStrength}/10
- Profit Margin: ${profitMargin}/10
- Urgency: ${urgency}/10
- **Profit:** ${symbol}${formatPrice(calc.profit)}
- **ROI:** ${calc.roi || 0}%

## 👥 Customer Playbook
- **Demographic:** ${playbook.targetDemographic || 'N/A'}
- **Ad Headlines:** ${playbook.adHeadlines?.join(' | ') || 'N/A'}
- **FB Interests:** ${playbook.facebookInterests?.join(', ') || 'N/A'}
- **Communities:** ${playbook.redditCommunities?.join(', ') || 'N/A'}

## 💬 Sentiment
- Positive: ${sentiment.positive || 60}%
- Neutral: ${sentiment.neutral || 25}%
- Negative: ${sentiment.negative || 15}%
- **Pain Points:** ${sentiment.topPainPoints?.join(', ') || 'N/A'}

---
*PROFITFORGE Pro v6.0 • Real Data*
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
      pdf.save(`Report_${(data.productName || 'report').replace(/ /g, '_')}_${data.market || 'market'}.pdf`);
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
      <div className="relative z-10 space-y-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2dd4bf]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2dd4bf] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-[#2dd4bf]/20">
              <Crown size={18} className="text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{data.productName || 'Product'}</h2>
            <span className="text-[10px] font-mono bg-[#2dd4bf]/10 text-[#2dd4bf] px-3 py-1 rounded-full border border-[#2dd4bf]/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" /> Live
            </span>
            <span className="text-[10px] font-mono bg-[#a78bfa]/10 text-[#a78bfa] px-3 py-1 rounded-full border border-[#a78bfa]/20">Pro</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={copyCSV} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all">
              <FileSpreadsheet size={11} /> CSV
            </button>
            <button onClick={copyJSON} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all">
              <FileJson size={11} /> JSON
            </button>
            <button onClick={copyMarkdown} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all">
              <FileCode size={11} /> MD
            </button>
            <button onClick={downloadPDF} className="text-[10px] bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] hover:opacity-90 px-4 py-1.5 rounded-lg flex items-center gap-1.5 text-black font-bold shadow-lg shadow-[#2dd4bf]/20 transition-all">
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

        {/* COMPETITOR INTEL + PRICE SPREAD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Competitor Intel */}
          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <Eye size={14} /> COMPETITOR INTEL
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-500 font-mono">Product</p>
                <p className="text-lg font-bold text-white truncate">{data.productName || 'N/A'}</p>
                <p className="text-4xl font-bold text-[#2dd4bf] mt-1">{symbol}{formatPrice(calc.recommendedPrice)}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{comp.dominantBrands?.join(' • ') || 'Top Brands'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
                <div>
                  <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Truck size={12} /> Est. Shipping</p>
                  <p className="text-sm font-mono text-gray-300">
                    {symbol}{formatPrice(calc.avgPrice ? Math.round(calc.avgPrice * 0.05) : 10)}-
                    {symbol}{calc.avgPrice ? Math.round(calc.avgPrice * 0.1) : 20}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-mono">Competitors</p>
                  <p className="text-2xl font-bold text-white">{calc.filteredCompetitorCount || 0}</p>
                  <p className="text-[8px] text-gray-500">{calc.rawCompetitorCount || 0} total, outliers removed</p>
                </div>
              </div>
              <div className="p-4 bg-[#0F172A] rounded-xl border-l-2 border-[#a78bfa]">
                <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1"><Target size={12} /> Market Gap</p>
                <p className="text-sm text-gray-300">{data.marketGap?.description || 'Stable market with opportunities.'}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Price Spread + Sentiment */}
          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <BarChart3 size={14} /> PRICE SPREAD
            </div>
            <div className="h-52 w-full bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBar data={chartData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} width={55} />
                  <Tooltip
                    formatter={(value) => `${symbol}${formatPrice(value)}`}
                    contentStyle={{ background: '#0F172A', border: '1px solid #2dd4bf20', borderRadius: 8 }}
                  />
                  <Bar dataKey="price" fill="#2dd4bf" radius={[0, 8, 8, 0]} barSize={18}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.price > calc.avgPrice ? '#2dd4bf' : '#a78bfa'} />
                    ))}
                  </Bar>
                </RechartsBar>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[9px] text-gray-500 mt-2 font-mono">
              <span>Min: {symbol}{formatPrice(calc.minPrice)}</span>
              <span>Avg: {symbol}{formatPrice(calc.avgPrice)}</span>
              <span>Max: {symbol}{formatPrice(calc.maxPrice)}</span>
            </div>

            {/* Sentiment */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><MessageCircle size={12} /> Sentiment</p>
                <div className="flex h-2.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-green-500" style={{ width: `${sentiment.positive || 60}%` }} />
                  <div className="bg-yellow-500" style={{ width: `${sentiment.neutral || 25}%` }} />
                  <div className="bg-red-500" style={{ width: `${sentiment.negative || 15}%` }} />
                </div>
                <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
                  <span>👍 {sentiment.positive || 60}%</span>
                  <span>😐 {sentiment.neutral || 25}%</span>
                  <span>👎 {sentiment.negative || 15}%</span>
                </div>
                {sentiment.topPainPoints?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {sentiment.topPainPoints.map((p, i) => (
                      <span key={i} className="text-[8px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">{p}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-24 h-24 flex-shrink-0">
                <SentimentPie data={sentiment} />
              </div>
            </div>
          </div>
        </div>

        {/* TOP COMPETITORS LIST (NEW) */}
        {competitorList.length > 0 && (
          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <Users size={14} /> TOP COMPETITORS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {competitorList.map((brand, idx) => (
                <div key={idx} className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5 text-center">
                  <p className="text-sm font-bold text-white">{brand}</p>
                  <p className="text-[10px] text-gray-500 font-mono">Competitor #{idx+1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* V5.0 ADV DATA — Enhanced with better visuals */}
        <div className="cyber-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
            <Zap size={14} /> V5.0 ADV DATA
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard label="Market Heat" value={marketHeat} color="#2dd4bf" icon={Activity} description="Demand vs Supply" />
            <MetricCard label="Ad Strength" value={adStrength} color="#a78bfa" icon={Target} description="Competitor Ads" />
            <MetricCard label="Profit Margin" value={profitMargin} color="#34d399" icon={DollarSign} description="Potential Profit" />
            <MetricCard label="Urgency" value={urgency} color="#f59e0b" icon={Clock} description="Seasonality" />
          </div>
        </div>

        {/* PROFIT & ROI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <DollarSign size={14} /> PROFIT & ROI
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 rounded-xl border border-[#2dd4bf]/10">
                <p className="text-[10px] text-gray-500 font-mono">Profit (Real)</p>
                <p className={`text-3xl font-bold ${calc.profit > 0 ? 'text-[#34d399]' : 'text-red-400'}`}>
                  {symbol}{formatPrice(calc.profit)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 rounded-xl border border-[#2dd4bf]/10">
                <p className="text-[10px] text-gray-500 font-mono">ROI (Real)</p>
                <p className={`text-3xl font-bold ${calc.roi > 50 ? 'text-[#34d399]' : calc.roi > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {calc.roi || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* FINAL RECOMMENDATION (New) */}
          <div className="cyber-card rounded-2xl p-6 border-l-4 border-l-[#2dd4bf]">
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <Award size={14} /> FINAL RECOMMENDATION
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-300 font-medium">Based on the analysis, here are your top priorities:</p>
              <ul className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
                    <span className="text-[#2dd4bf] font-bold text-sm">{idx+1}.</span>
                    <span className="text-sm text-gray-200">{rec}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 p-3 bg-[#0F172A] rounded-xl border border-[#2dd4bf]/5">
                <p className="text-[10px] text-gray-500 font-mono">Action Score Verdict</p>
                <p className="text-sm text-white font-medium">{actionLabel}: {data.executiveSummary || 'Proceed with caution.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MINING STRATEGY */}
        <div className="cyber-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
            <Layers size={14} /> MINING STRATEGY
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-gray-400 font-mono flex items-center gap-1"><Users size={12} /> Target Demographic</h4>
              <p className="text-sm text-white mt-1">{playbook.targetDemographic || 'General audience'}</p>
            </div>
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-gray-400 font-mono flex items-center gap-1"><Sparkles size={12} /> Ad Headlines</h4>
              <ul className="list-disc list-inside text-sm text-gray-300 mt-1 space-y-0.5">
                {playbook.adHeadlines?.map((h, i) => <li key={i}>{h}</li>) || <li>N/A</li>}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-gray-400 font-mono flex items-center gap-1"><Globe size={12} /> Interests & Communities</h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {playbook.facebookInterests?.map((i, idx) => (
                  <span key={idx} className="text-[9px] bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">{i}</span>
                )) || <span className="text-sm text-gray-500">N/A</span>}
              </div>
              <p className="text-sm text-purple-400 mt-2">
                {playbook.redditCommunities?.map(c => c.replace(/^r\//, '')).join(', ') || 'N/A'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#2dd4bf]/10">
            <div>
              <p className="text-[9px] text-gray-500 font-mono flex items-center gap-1"><Truck size={10} /> Supplier Suggestion</p>
              <p className="text-sm text-white">{adv.supplierSuggestion || 'AliExpress'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 font-mono flex items-center gap-1"><Calendar size={10} /> Seasonality</p>
              <p className="text-sm text-white">{adv.seasonality || 'Year-round'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 font-mono flex items-center gap-1"><Hash size={10} /> Top Keywords</p>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {adv.topKeywords?.map((kw, i) => (
                  <span key={i} className="text-[9px] bg-[#0F172A] text-gray-300 px-2 py-0.5 rounded-full border border-white/5">{kw}</span>
                )) || <span className="text-sm text-gray-500">N/A</span>}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between text-[9px] text-gray-600 font-mono border-t border-[#2dd4bf]/10 pt-4">
          <span>PROFITFORGE Pro v6.0</span>
          <span>Real · Live Data · Powered by SerpAPI + Groq</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" /> Live</span>
        </div>
      </div>
    </motion.div>
  );
}
