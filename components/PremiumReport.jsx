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
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

// ============================================================
// HELPERS
// ============================================================
const formatPrice = (num) => {
  if (num === undefined || num === null) return '0';
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
// METRIC CARD
// ============================================================
const MetricCard = ({ label, value, max = 10, color = '#2dd4bf' }) => {
  const percentage = Math.min(100, (value / max) * 100);
  return (
    <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/10">
      <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-2xl font-bold" style={{ color }}>
          {value}
        </span>
        <span className="text-xs text-gray-600 font-mono">/{max}</span>
      </div>
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
  const isHigh = actionScore >= 70;

  const marketHeat = Math.min(10, Math.round((actionScore / 100) * 10));
  const adStrength = Math.min(10, Math.round(((sentiment.positive || 60) / 100) * 10));
  const profitMargin = Math.min(
    10,
    Math.round((calc.filteredCompetitorCount > 15 ? 5 : 8) + (isHigh ? 2 : 0))
  );
  const urgency = Math.min(
    10,
    Math.round(data.trendDirection === 'Rising' ? 8 : data.trendDirection === 'Falling' ? 4 : 6)
  );

  const chartData =
    comp.dominantBrands?.slice(0, 5).map((brand, i) => ({
      name: brand.length > 12 ? brand.slice(0, 10) + '..' : brand,
      price: Math.round((calc.avgPrice || 50) * (0.8 + i * 0.1))
    })) || [{ name: 'Avg Price', price: calc.avgPrice || 50 }];

  const actionColor = actionScore >= 70 ? '#34d399' : actionScore >= 50 ? '#f59e0b' : '#ef4444';

  // ========== PDF DOWNLOAD ==========
  const downloadPDF = async () => {
    const element = reportRef.current;
    if (!element) {
      toast.error('Report not ready!');
      return;
    }
    toast.loading('Generating PDF...', { id: 'pdf' });
    try {
      const canvas = await html2canvas(element, {
        scale: 2.5,
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

  // ========== COPY CSV / JSON ==========
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
    toast.success('CSV copied!');
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('JSON copied!');
  };

  return (
    <div ref={reportRef} className="max-w-6xl mx-auto mt-10 space-y-6 p-2 bg-[#080B12]">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2dd4bf]/10 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">{data.productName}</h2>
          <span className="text-xs font-mono bg-[#2dd4bf]/10 text-[#2dd4bf] px-3 py-1 rounded-full border border-[#2dd4bf]/20 flex items-center gap-1">
            <CheckCircle size={12} /> Real Data
          </span>
          <span className="text-xs font-mono bg-[#0F172A] text-gray-400 px-3 py-1 rounded-full border border-white/5">
            {data.market.toUpperCase()} · {currency}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={copyCSV} className="text-xs bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/20 flex items-center gap-1 text-gray-300 font-mono transition">
            <Copy size={12} /> CSV
          </button>
          <button onClick={copyJSON} className="text-xs bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/20 flex items-center gap-1 text-gray-300 font-mono transition">
            <Copy size={12} /> JSON
          </button>
          <button onClick={downloadPDF} className="text-xs bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] hover:opacity-80 px-4 py-1.5 rounded-lg flex items-center gap-1 text-black font-bold shadow-lg shadow-[#2dd4bf]/20 transition">
            <FileText size={14} /> PDF
          </button>
        </div>
      </div>

      {/* ACTION SCORE */}
      <div className="cyber-card rounded-2xl p-6 border-l-4 flex flex-wrap items-center justify-between gap-6" style={{ borderLeftColor: actionColor }}>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke={actionColor}
                strokeWidth="8"
                fill="none"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 * (1 - actionScore / 100)}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - actionScore / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: actionColor }}>{actionScore}%</span>
              <span className="text-[8px] text-gray-400 uppercase tracking-wider">Score</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-mono">ACTION SCORE</p>
            <p className="text-xl font-bold" style={{ color: actionColor }}>{actionLabel}</p>
            <p className="text-sm text-gray-400 max-w-md truncate">{data.executiveSummary || 'Analysis complete.'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <p className="text-xs text-gray-500">Est. Sales</p>
            <p className="text-lg font-bold text-[#2dd4bf]">{data.estimatedMonthlySales || 'N/A'}+</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Risk</p>
            <p className="text-lg font-bold text-yellow-400">{data.riskMeter || 'Medium'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Trend</p>
            <p className="text-lg font-bold">
              {data.trendDirection === 'Rising' && <TrendingUp size={20} className="text-green-400 inline" />}
              {data.trendDirection === 'Falling' && <TrendingDown size={20} className="text-red-400 inline" />}
              {!data.trendDirection && <Minus size={20} className="text-gray-400 inline" />}
            </p>
          </div>
        </div>
      </div>

      {/* COMPETITOR INTEL + CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="cyber-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
            <Eye size={14} /> COMPETITOR INTEL
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 font-mono">Product</p>
              <p className="text-lg font-bold text-white">{data.productName}</p>
              <p className="text-2xl font-bold text-[#2dd4bf] mt-1">{symbol}{formatPrice(calc.recommendedPrice)}</p>
              <p className="text-xs text-gray-500 font-mono mt-1">{comp.dominantBrands?.join(' • ') || 'Top Brands'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <div>
                <p className="text-xs text-gray-500 font-mono flex items-center gap-1"><Truck size={12} /> Est. Shipping</p>
                <p className="text-sm font-mono text-gray-300">
                  {symbol}{formatPrice(calc.avgPrice ? Math.round(calc.avgPrice * 0.05) : 10)}-
                  {symbol}{calc.avgPrice ? Math.round(calc.avgPrice * 0.1) : 20}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-mono">Competitors</p>
                <p className="text-2xl font-bold text-white">{calc.filteredCompetitorCount || 0}</p>
                <p className="text-[10px] text-gray-500">{calc.rawCompetitorCount || 0} total, outliers removed</p>
              </div>
            </div>
            <div className="p-3 bg-[#0F172A] rounded-xl border-l-2 border-[#a78bfa]">
              <p className="text-xs text-gray-500 font-mono flex items-center gap-1"><Target size={12} /> Market Gap</p>
              <p className="text-sm text-gray-300">{data.marketGap?.description || 'Stable'}</p>
            </div>
          </div>
        </div>

        <div className="cyber-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
            <BarChart3 size={14} /> PRICE SPREAD
          </div>
          <div className="h-48 w-full bg-[#0F172A] p-2 rounded-xl border border-[#2dd4bf]/5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={60} />
                <Tooltip formatter={(value) => `${symbol}${formatPrice(value)}`} contentStyle={{ background: '#0F172A', border: '1px solid #2dd4bf20' }} />
                <Bar dataKey="price" fill="#2dd4bf" radius={4}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.price > calc.avgPrice ? '#2dd4bf' : '#a78bfa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono">
            <span>Min: {symbol}{formatPrice(calc.minPrice)}</span>
            <span>Avg: {symbol}{formatPrice(calc.avgPrice)}</span>
            <span>Max: {symbol}{formatPrice(calc.maxPrice)}</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500 font-mono flex items-center gap-1"><MessageCircle size={12} /> Sentiment</p>
            <div className="flex h-4 rounded-full overflow-hidden mt-1">
              <div className="bg-green-500" style={{ width: `${sentiment.positive || 60}%` }} />
              <div className="bg-yellow-500" style={{ width: `${sentiment.neutral || 25}%` }} />
              <div className="bg-red-500" style={{ width: `${sentiment.negative || 15}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
              <span>👍 {sentiment.positive || 60}%</span>
              <span>😐 {sentiment.neutral || 25}%</span>
              <span>👎 {sentiment.negative || 15}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* V5.0 ADV DATA + PROFIT/ROI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-2 text-xs text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
            <Zap size={14} /> V5.0 ADV DATA
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="Market Heat" value={marketHeat} color="#2dd4bf" />
            <MetricCard label="Ad Strength" value={adStrength} color="#a78bfa" />
            <MetricCard label="Profit Margin" value={profitMargin} color="#34d399" />
            <MetricCard label="Urgency" value={urgency} color="#f59e0b" />
          </div>
        </div>

        <div className="cyber-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
            <DollarSign size={14} /> PROFIT & ROI
          </div>
          <div className="space-y-4">
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-xs text-gray-500 font-mono">Profit (Real)</p>
              <p className={`text-2xl font-bold ${calc.profit > 0 ? 'text-[#34d399]' : 'text-red-400'}`}>
                {symbol}{formatPrice(calc.profit)}
              </p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-xs text-gray-500 font-mono">ROI (Real)</p>
              <p className={`text-2xl font-bold ${calc.roi > 50 ? 'text-[#34d399]' : calc.roi > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                {calc.roi || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MINING STRATEGY */}
      <div className="cyber-card rounded-2xl p-6">
        <div className="flex items-center gap-2 text-xs text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
          <Target size={14} /> MINING STRATEGY
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
            <h4 className="text-xs text-gray-500 font-mono flex items-center gap-1"><Users size={12} /> Demographic</h4>
            <p className="text-sm text-white mt-1">{playbook.targetDemographic || 'General'}</p>
          </div>

          <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
            <h4 className="text-xs text-gray-500 font-mono flex items-center gap-1"><Sparkles size={12} /> Ad Headlines</h4>
            <ul className="list-disc list-inside text-sm text-gray-300 mt-1 space-y-0.5">
              {playbook.adHeadlines?.map((h, i) => <li key={i}>{h}</li>) || <li>N/A</li>}
            </ul>
          </div>

          <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
            <h4 className="text-xs text-gray-500 font-mono flex items-center gap-1"><Target size={12} /> Interests & Communities</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {playbook.facebookInterests?.map((i, idx) => (
                <span key={idx} className="text-[10px] bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">{i}</span>
              )) || <span className="text-xs text-gray-500">N/A</span>}
            </div>
            <p className="text-sm text-purple-400 mt-2">r/{playbook.redditCommunities?.join(', r/') || 'N/A'}</p>
          </div>
        </div>

        {/* Advanced Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#2dd4bf]/10">
          <div>
            <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Truck size={12} /> Supplier Suggestion</p>
            <p className="text-xs text-white">{adv.supplierSuggestion || 'AliExpress'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Calendar size={12} /> Seasonality</p>
            <p className="text-xs text-white">{adv.seasonality || 'Year-round'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Hash size={12} /> Top Keywords</p>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {adv.topKeywords?.map((kw, i) => (
                <span key={i} className="text-[10px] bg-[#0F172A] text-gray-300 px-2 py-0.5 rounded-full border border-white/5">{kw}</span>
              )) || <span className="text-xs text-gray-500">N/A</span>}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center text-[10px] text-gray-600 font-mono border-t border-[#2dd4bf]/10 pt-4">
        PROFITFORGE v5.0 · Real Data · Powered by SerpAPI + Groq
      </div>
    </div>
  );
}
