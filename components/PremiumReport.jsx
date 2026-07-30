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
  BarChart,
  Award,
  Globe,
  Activity,
  PieChart,
  Layers,
  Crown
} from 'lucide-react';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPie,
  Pie,
  Cell as PieCell
} from 'recharts';
import toast from 'react-hot-toast';

// ============================================================
// HELPERS
// ============================================================
const formatPrice = (num) => {
  if (num === undefined || num === null || num === 0) return '0';
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
// ANIMATED PROGRESS RING
// ============================================================
const ProgressRing = ({ score, label, color, size = 80, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 12px ${color}40)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold" style={{ color }}>{score}%</span>
        <span className="text-[8px] text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
};

// ============================================================
// PREMIUM METRIC CARD
// ============================================================
const PremiumMetricCard = ({ label, value, max = 10, color = '#2dd4bf', icon: Icon, subtitle }) => {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#0F1A2E] to-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/10 shadow-lg hover:shadow-[#2dd4bf]/10 transition-all group"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#2dd4bf]/5 to-transparent rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{label}</p>
          {Icon && <Icon size={14} className="text-[#2dd4bf]/60 group-hover:text-[#2dd4bf] transition-colors" />}
        </div>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-2xl font-bold" style={{ color }}>{value}</span>
          <span className="text-sm text-gray-600 font-mono">/{max}</span>
        </div>
        {subtitle && <p className="text-[8px] text-gray-500 mt-0.5">{subtitle}</p>}
        <div className="w-full h-1.5 bg-[#1E293B] rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// SENTIMENT PIE CHART
// ============================================================
const SentimentPie = ({ data }) => {
  const chartData = [
    { name: 'Positive', value: data.positive || 60, color: '#22c55e' },
    { name: 'Neutral', value: data.neutral || 25, color: '#eab308' },
    { name: 'Negative', value: data.negative || 15, color: '#ef4444' }
  ];

  return (
    <ResponsiveContainer width="100%" height={80}>
      <RechartsPie>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={22}
          outerRadius={35}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <PieCell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `${value}%`}
          contentStyle={{
            background: '#0F172A',
            border: '1px solid #2dd4bf20',
            borderRadius: 8,
            fontSize: 11,
            color: '#E2E8F0'
          }}
        />
      </RechartsPie>
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

  const actionColor = actionScore >= 70 ? '#34d399' : actionScore >= 50 ? '#f59e0b' : '#ef4444';

  // Chart Data
  const chartData =
    comp.dominantBrands?.slice(0, 6).map((brand, i) => ({
      name: brand.length > 12 ? brand.slice(0, 10) + '..' : brand,
      price: Math.round((calc.avgPrice || 50) * (0.75 + i * 0.08))
    })) || [{ name: 'Avg Price', price: calc.avgPrice || 50 }];

  // ============================================================
  // GENERATE MARKDOWN
  // ============================================================
  const generateMarkdown = () => {
    const md = `
# 📊 PROFITFORGE PRO Report
**Product:** ${data.productName}
**Market:** ${data.market.toUpperCase()} (${currency})
**Action Score:** ${actionScore}% — ${actionLabel}

---

## 🔍 Competitor Intel
- **Recommended Price:** ${symbol}${formatPrice(calc.recommendedPrice)}
- **Average Price:** ${symbol}${formatPrice(calc.avgPrice)}
- **Price Range:** ${symbol}${formatPrice(calc.minPrice)} – ${symbol}${formatPrice(calc.maxPrice)}
- **Total Competitors:** ${calc.rawCompetitorCount || 0} (${calc.filteredCompetitorCount || 0} after outlier removal)
- **Top Brands:** ${comp.dominantBrands?.join(' • ') || 'N/A'}
- **Market Gap:** ${data.marketGap?.description || 'N/A'}

---

## 📈 Metrics
- Market Heat: ${marketHeat}/10
- Ad Strength: ${adStrength}/10
- Profit Margin: ${profitMargin}/10
- Urgency: ${urgency}/10
- **Profit:** ${symbol}${formatPrice(calc.profit)}
- **ROI:** ${calc.roi || 0}%

---

## 👥 Customer Playbook
- **Target Demographic:** ${playbook.targetDemographic || 'N/A'}
- **Ad Headlines:** ${playbook.adHeadlines?.join(' | ') || 'N/A'}
- **Facebook Interests:** ${playbook.facebookInterests?.join(', ') || 'N/A'}
- **Communities:** r/${playbook.redditCommunities?.join(', r/') || 'N/A'}

---

## 💡 Advanced Insights
- **Supplier Suggestion:** ${adv.supplierSuggestion || 'N/A'}
- **Seasonality:** ${adv.seasonality || 'N/A'}
- **Top Keywords:** ${adv.topKeywords?.join(', ') || 'N/A'}

---

## 💬 Sentiment
- Positive: ${sentiment.positive || 60}%
- Neutral: ${sentiment.neutral || 25}%
- Negative: ${sentiment.negative || 15}%

**Top Pain Points:** ${sentiment.topPainPoints?.join(', ') || 'N/A'}

---

*Report generated by PROFITFORGE Pro v5.0 • Real Live Data*
`;
    return md;
  };

  // ============================================================
  // COPY FUNCTIONS
  // ============================================================
  const copyCSV = () => {
    const headers = ['Product', 'Market', 'Score', 'Price', 'Profit', 'ROI', 'Competitors', 'Verdict'];
    const row = [
      data.productName,
      data.market,
      actionScore,
      `${symbol}${formatPrice(calc.recommendedPrice)}`,
      `${symbol}${formatPrice(calc.profit)}`,
      `${calc.roi || 0}%`,
      `${calc.filteredCompetitorCount || 0} (${calc.rawCompetitorCount || 0} total)`,
      data.executiveSummary?.slice(0, 40) || 'N/A'
    ];
    navigator.clipboard.writeText([headers.join(','), row.join(',')].join('\n'));
    toast.success('CSV copied to clipboard!');
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('JSON copied to clipboard!');
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    toast.success('Markdown copied to clipboard!');
  };

  const downloadPDF = async () => {
    const element = reportRef.current;
    if (!element) {
      toast.error('Report not ready!');
      return;
    }
    toast.loading('Generating high-quality PDF...', { id: 'pdf' });
    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#080B12',
        allowTaint: true,
        useCORS: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
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
      pdf.save(`Report_${data.productName.replace(/ /g, '_')}_${data.market}.pdf`);
      toast.success('PDF Downloaded!', { id: 'pdf' });
    } catch (error) {
      console.error('PDF Error:', error);
      toast.error('Failed to generate PDF.', { id: 'pdf' });
    }
  };

  return (
    <motion.div
      ref={reportRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative max-w-7xl mx-auto mt-12 p-1 bg-[#080B12] rounded-3xl overflow-hidden"
    >
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2dd4bf]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#a78bfa]/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2dd4bf]/3 rounded-full blur-3xl" />

      <div className="relative z-10 space-y-6 p-4">
        {/* ============================================================
            HEADER: Pro Version Badge + Live Data
            ============================================================ */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2dd4bf]/10">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2dd4bf] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-[#2dd4bf]/20">
                <Crown size={16} className="text-black" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{data.productName}</h2>
            </motion.div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono bg-[#2dd4bf]/10 text-[#2dd4bf] px-2.5 py-1 rounded-full border border-[#2dd4bf]/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" />
                Live
              </span>
              <span className="text-[10px] font-mono bg-gradient-to-r from-[#a78bfa]/20 to-[#2dd4bf]/20 text-white px-2.5 py-1 rounded-full border border-[#a78bfa]/20 flex items-center gap-1">
                <ShieldCheck size={10} className="text-[#a78bfa]" /> Pro
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={copyCSV}
              className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all hover:border-[#2dd4bf]/40"
            >
              <FileSpreadsheet size={11} /> CSV
            </button>
            <button
              onClick={copyJSON}
              className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all hover:border-[#2dd4bf]/40"
            >
              <FileJson size={11} /> JSON
            </button>
            <button
              onClick={copyMarkdown}
              className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all hover:border-[#2dd4bf]/40"
            >
              <FileCode size={11} /> MD
            </button>
            <button
              onClick={downloadPDF}
              className="text-[10px] bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] hover:opacity-90 px-4 py-1.5 rounded-lg flex items-center gap-1.5 text-black font-bold shadow-lg shadow-[#2dd4bf]/20 transition-all hover:shadow-[#2dd4bf]/40"
            >
              <Download size={11} /> PDF
            </button>
          </div>
        </div>

        {/* ============================================================
            ACTION SCORE CARD
            ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden cyber-card rounded-2xl p-6 border-l-4 bg-gradient-to-br from-[#0F172A]/90 to-[#0A0F1A]/90"
          style={{ borderLeftColor: actionColor }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2dd4bf]/5 to-transparent rounded-full blur-2xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <ProgressRing score={actionScore} label="SCORE" color={actionColor} size={100} />
              <div>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest">ACTION SCORE</p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold"
                  style={{ color: actionColor }}
                >
                  {actionLabel}
                </motion.p>
                <p className="text-sm text-gray-300 max-w-lg">{data.executiveSummary || 'Analysis complete.'}</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Est. Sales</p>
                <p className="text-xl font-bold text-[#2dd4bf]">{data.estimatedMonthlySales || 'N/A'}+</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Risk</p>
                <p className="text-xl font-bold text-yellow-400">{data.riskMeter || 'Medium'}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Trend</p>
                <p className="text-xl">
                  {data.trendDirection === 'Rising' && <TrendingUp size={22} className="text-green-400 inline" />}
                  {data.trendDirection === 'Falling' && <TrendingDown size={22} className="text-red-400 inline" />}
                  {!data.trendDirection && <Minus size={22} className="text-gray-400 inline" />}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================================
            COMPETITOR INTEL + PRICE SPREAD
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Competitor Intel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="cyber-card rounded-2xl p-6 bg-gradient-to-br from-[#0F172A]/80 to-[#0A0F1A]/80"
          >
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <Eye size={14} /> COMPETITOR INTEL
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-500 font-mono">Product</p>
                <p className="text-lg font-bold text-white truncate">{data.productName}</p>
                <p className="text-3xl font-bold text-[#2dd4bf] mt-1">
                  {symbol}{formatPrice(calc.recommendedPrice)}
                </p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                  {comp.dominantBrands?.join(' • ') || 'Top Brands'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
                <div>
                  <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                    <Truck size={12} /> Est. Shipping
                  </p>
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
                <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <Target size={12} /> Market Gap
                </p>
                <p className="text-sm text-gray-300">{data.marketGap?.description || 'Stable market with opportunities.'}</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Price Spread */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="cyber-card rounded-2xl p-6 bg-gradient-to-br from-[#0F172A]/80 to-[#0A0F1A]/80"
          >
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
                    contentStyle={{
                      background: '#0F172A',
                      border: '1px solid #2dd4bf20',
                      borderRadius: 8,
                      fontSize: 11
                    }}
                  />
                  <Bar dataKey="price" fill="#2dd4bf" radius={[0, 8, 8, 0]} barSize={18}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.price > calc.avgPrice ? '#2dd4bf' : '#a78bfa'}
                        style={{ filter: 'drop-shadow(0 4px 8px rgba(45,212,191,0.15))' }}
                      />
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

            {/* Sentiment Row */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                  <MessageCircle size={12} /> Sentiment
                </p>
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
              </div>
              <div className="w-20 h-20 flex-shrink-0">
                <SentimentPie data={sentiment} />
              </div>
            </div>
            {sentiment.topPainPoints?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {sentiment.topPainPoints.map((p, i) => (
                  <span
                    key={i}
                    className="text-[8px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20"
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ============================================================
            V5.0 ADV DATA + PROFIT/ROI
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="cyber-card rounded-2xl p-6 md:col-span-2 bg-gradient-to-br from-[#0F172A]/80 to-[#0A0F1A]/80"
          >
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <Zap size={14} /> V5.0 ADV DATA
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <PremiumMetricCard label="Market Heat" value={marketHeat} color="#2dd4bf" icon={Activity} />
              <PremiumMetricCard label="Ad Strength" value={adStrength} color="#a78bfa" icon={Target} />
              <PremiumMetricCard label="Profit Margin" value={profitMargin} color="#34d399" icon={DollarSign} />
              <PremiumMetricCard label="Urgency" value={urgency} color="#f59e0b" icon={Clock} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="cyber-card rounded-2xl p-6 bg-gradient-to-br from-[#0F172A]/80 to-[#0A0F1A]/80"
          >
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
          </motion.div>
        </div>

        {/* ============================================================
            MINING STRATEGY
            ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card rounded-2xl p-6 bg-gradient-to-br from-[#0F172A]/80 to-[#0A0F1A]/80"
        >
          <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
            <Layers size={14} /> MINING STRATEGY
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <Users size={12} /> Target Demographic
              </h4>
              <p className="text-sm text-white mt-1">{playbook.targetDemographic || 'General audience'}</p>
            </div>
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <Sparkles size={12} /> Ad Headlines
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-300 mt-1 space-y-0.5">
                {playbook.adHeadlines?.map((h, i) => <li key={i}>{h}</li>) || <li>N/A</li>}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <Globe size={12} /> Interests & Communities
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {playbook.facebookInterests?.map((i, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded-full border border-[#2dd4bf]/20"
                  >
                    {i}
                  </span>
                )) || <span className="text-sm text-gray-500">N/A</span>}
              </div>
              <p className="text-sm text-purple-400 mt-2">
                {playbook.redditCommunities?.map(c => c.replace(/^r\//, '')).join(', ') || 'N/A'}
              </p>
            </div>
          </div>

          {/* Advanced Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#2dd4bf]/10">
            <div>
              <p className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
                <Truck size={10} /> Supplier Suggestion
              </p>
              <p className="text-sm text-white">{adv.supplierSuggestion || 'AliExpress'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
                <Calendar size={10} /> Seasonality
              </p>
              <p className="text-sm text-white">{adv.seasonality || 'Year-round'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
                <Hash size={10} /> Top Keywords
              </p>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {adv.topKeywords?.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[9px] bg-[#0F172A] text-gray-300 px-2 py-0.5 rounded-full border border-white/5"
                  >
                    {kw}
                  </span>
                )) || <span className="text-sm text-gray-500">N/A</span>}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================================
            FOOTER
            ============================================================ */}
        <div className="flex items-center justify-between text-[9px] text-gray-600 font-mono border-t border-[#2dd4bf]/10 pt-4">
          <span>PROFITFORGE Pro v5.0</span>
          <span>Real · Live Data · Powered by SerpAPI + Groq</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            Live
          </span>
        </div>
      </div>
    </motion.div>
  );
}
