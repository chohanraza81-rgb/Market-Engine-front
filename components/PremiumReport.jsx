'use client';

import { motion } from 'framer-motion';
import { Copy, Download, CheckCircle, AlertCircle, DollarSign, Target, Zap, TrendingUp, TrendingDown, Minus, Eye, ShoppingBag, Truck, Sparkles, Package, Calendar, Hash } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';

const MetricCard = ({ label, value, max = 10, color = '#2dd4bf' }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/10">
      <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-2xl font-bold" style={{ color }}>{value}</span>
        <span className="text-xs text-gray-600 font-mono">/{max}</span>
      </div>
      <div className="w-full h-1.5 bg-[#1E293B] rounded-full mt-2 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1 }} />
      </div>
    </div>
  );
};

export default function PremiumReport({ data }) {
  if (!data) return null;

  const p = data.priceIntelligence || {};
  const adv = data.advancedInsights || {};
  const currency = p.currency || 'USD';
  const symbol = currency === 'GBP' ? '£' : currency === 'AED' ? 'د.إ' : currency === 'INR' ? '₹' : currency === 'PKR' ? 'Rs.' : '$';

  const isHigh = data.profitScore >= 70;
  const actionScore = data.actionScore || 50;
  const actionLabel = data.actionLabel || 'Test Waters';

  // Derived metrics
  const marketHeat = Math.min(10, Math.round((data.profitScore / 100) * 10));
  const adStrength = Math.min(10, Math.round(((data.sentimentAnalysis?.positive || 60) / 100) * 10));
  const profitMargin = Math.min(10, Math.round((data.competitionAnalysis?.totalCompetitors > 20 ? 5 : 8) + (isHigh ? 2 : 0)));
  const urgency = Math.min(10, Math.round((data.trendDirection === 'Rising' ? 8 : data.trendDirection === 'Falling' ? 4 : 6)));

  // ROI
  const avgPrice = p.average || 50;
  const recPrice = p.recommendedPrice || 60;
  const profit = recPrice - avgPrice;
  const roi = avgPrice > 0 ? Math.round((profit / avgPrice) * 100) : 0;

  // Price Spread Chart Data
  const chartData = data.competitionAnalysis?.dominantBrands?.slice(0, 5).map((brand, i) => ({
    name: brand.length > 10 ? brand.slice(0, 8) + '..' : brand,
    price: Math.round((avgPrice * (0.8 + (i * 0.1)))),
  })) || [{ name: 'Sample', price: 45 }, { name: 'Sample2', price: 55 }];

  const copyCSV = () => {
    const headers = ['Product', 'Market', 'Score', 'Action', 'Price', 'ROI', 'Verdict'];
    const row = [data.productName, data.market, data.profitScore, actionLabel, `${symbol}${recPrice}`, `${roi}%`, data.executiveSummary?.slice(0, 30) || 'N/A'];
    navigator.clipboard.writeText([headers.join(','), row.join(',')].join('\n'));
    toast.success('CSV copied!');
  };
  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('JSON copied!');
  };

  const getActionColor = () => {
    if (actionScore >= 80) return '#34d399';
    if (actionScore >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto mt-10 space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2dd4bf]/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-mono font-bold cyber-glow-text">{data.productName}</span>
          <span className="text-xs font-mono bg-[#2dd4bf]/10 text-[#2dd4bf] px-3 py-1 rounded-full border border-[#2dd4bf]/20 flex items-center gap-1"><CheckCircle size={12} /> Real Data</span>
        </div>
        <div className="flex gap-2">
          <button onClick={copyCSV} className="text-xs bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/20 flex items-center gap-1 text-gray-300 font-mono"><Copy size={12} /> CSV</button>
          <button onClick={copyJSON} className="text-xs bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/20 flex items-center gap-1 text-gray-300 font-mono"><Copy size={12} /> JSON</button>
        </div>
      </div>

      {/* Action Score Banner */}
      <div className="cyber-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border-l-4" style={{ borderLeftColor: getActionColor() }}>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-mono font-bold" style={{ color: getActionColor() }}>{actionScore}%</div>
          <div>
            <p className="text-xs text-gray-500 font-mono">ACTION SCORE</p>
            <p className="text-sm font-bold" style={{ color: getActionColor() }}>{actionLabel}</p>
          </div>
        </div>
        <div className="text-sm text-gray-300 font-mono bg-[#0F172A] px-4 py-2 rounded-full border border-white/5">
          {data.executiveSummary?.slice(0, 60)}...
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT: Competitor Intel (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2"><Eye size={14} /> COMPETITOR INTEL</div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-mono">Product</p>
                <p className="text-lg font-bold text-white">{data.productName}</p>
                <p className="text-2xl font-bold text-[#2dd4bf] mt-1">{symbol}{recPrice}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">{data.competitionAnalysis?.dominantBrands?.join(' • ') || 'Top Brands'} • Latest</p>
              </div>
              
              {/* Price Spread Chart */}
              <div className="h-24 w-full bg-[#0F172A] p-2 rounded-xl border border-[#2dd4bf]/5">
                <p className="text-[10px] text-gray-500 font-mono mb-1">Competitor Price Spread</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip formatter={(value) => `${symbol}${value}`} contentStyle={{ background: '#0F172A', border: '1px solid #2dd4bf20' }} />
                    <Bar dataKey="price" fill="#2dd4bf" radius={4}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.price > avgPrice ? '#2dd4bf' : '#a78bfa'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
                <div>
                  <p className="text-xs text-gray-500 font-mono flex items-center gap-1"><Truck size={12} /> Hidden Cost</p>
                  <p className="text-sm font-mono text-red-400">Shipping: {symbol}10-20</p>
                  <p className="text-sm font-mono text-yellow-400">Returns: Standard</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-mono">Total Competitors</p>
                  <p className="text-2xl font-bold text-white">{data.competitionAnalysis?.totalCompetitors || 12}</p>
                  <p className="text-xs text-gray-500">Avg: {data.competitionAnalysis?.averageRating || 4.2}⭐</p>
                </div>
              </div>
              
              <div className="p-3 bg-[#0F172A] rounded-xl border-l-2 border-[#a78bfa]">
                <p className="text-xs text-gray-500 font-mono">🎯 Market Gap</p>
                <p className="text-sm text-gray-300">{data.marketGap?.description || 'Stable market.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Metrics (2/5) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2"><Zap size={14} /> V5.0 ADV DATA</div>
            
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Market Heat" value={marketHeat} color="#2dd4bf" />
              <MetricCard label="Ad Strength" value={adStrength} color="#a78bfa" />
              <MetricCard label="Profit Margin" value={profitMargin} color="#34d399" />
              <MetricCard label="Urgency" value={urgency} color="#f59e0b" />
            </div>

            {/* Profit / ROI */}
            <div className="mt-4 grid grid-cols-2 gap-3 bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/10">
              <div><p className="text-xs text-gray-500 font-mono">Profit</p><p className={`text-xl font-bold ${profit > 0 ? 'text-[#34d399]' : 'text-red-400'}`}>{symbol}{profit > 0 ? profit : 0}</p></div>
              <div><p className="text-xs text-gray-500 font-mono">ROI</p><p className={`text-xl font-bold ${roi > 50 ? 'text-[#34d399]' : roi > 20 ? 'text-yellow-400' : 'text-red-400'}`}>{roi}%</p></div>
            </div>
          </div>

          {/* Advanced Insights Cards */}
          <div className="cyber-card rounded-2xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
                <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Package size={12} /> Supplier</p>
                <p className="text-xs text-white font-medium truncate">{adv.supplierSuggestion || 'AliExpress'}</p>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
                <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Calendar size={12} /> Seasonality</p>
                <p className="text-xs text-white font-medium truncate">{adv.seasonality || 'Year-round'}</p>
              </div>
            </div>
            <div className="mt-3 bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Hash size={12} /> Top Keywords (PPC)</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {adv.topKeywords?.map((kw, i) => <span key={i} className="text-xs bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">{kw}</span>) || <span className="text-xs text-gray-500">N/A</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Customer Playbook + Verdict */}
      <div className="cyber-card rounded-2xl p-6 border border-[#2dd4bf]/10">
        <div className="flex items-center gap-2 text-xs text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2"><Target size={14} /> MINING STRATEGY</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><h4 className="text-xs text-gray-500 font-mono">👤 Demographic</h4><p className="text-sm text-gray-300">{data.customerPlaybook?.targetDemographic || 'General'}</p></div>
          <div><h4 className="text-xs text-gray-500 font-mono">🔥 Ad Headlines</h4><ul className="list-disc list-inside text-sm text-gray-300 space-y-1">{data.customerPlaybook?.adHeadlines?.map((h,i) => <li key={i}>{h}</li>) || <li>N/A</li>}</ul></div>
          <div><h4 className="text-xs text-gray-500 font-mono">🎯 FB Interests</h4><div className="flex flex-wrap gap-2">{data.customerPlaybook?.facebookInterests?.map((i,idx) => <span key={idx} className="text-xs bg-[#2dd4bf]/10 text-[#2dd4bf] px-3 py-1 rounded-full border border-[#2dd4bf]/20">{i}</span>) || <span className="text-xs text-gray-500">N/A</span>}</div></div>
          <div><h4 className="text-xs text-gray-500 font-mono">🗣️ Communities</h4><p className="text-sm text-purple-400">r/{data.customerPlaybook?.redditCommunities?.join(', r/') || 'N/A'}</p></div>
        </div>
        <div className="mt-4 p-3 bg-[#0F172A] rounded-xl border-l-2 border-[#2dd4bf]"><p className="text-xs text-gray-500 font-mono">📝 Verdict</p><p className="text-sm text-white font-medium">{data.executiveSummary}</p></div>
      </div>
    </motion.div>
  );
    }
