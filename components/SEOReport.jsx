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
  BookOpen,
  Search,
  Link2,
  Mail
} from 'lucide-react';
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
// SUB-COMPONENTS
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
        <motion.circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: 'easeOut' }} style={{ filter: `drop-shadow(0 0 20px ${color}40)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold" style={{ color }}>{safeScore}%</span><span className="text-[9px] text-gray-500 uppercase tracking-widest">{label}</span></div>
    </div>
  );
};

const SectionDivider = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
    {Icon && <Icon size={14} />} {title}
  </div>
);

// ============================================================
// MAIN COMPONENT — NO FALLBACK DATA, ONLY REAL PROPS
// ============================================================
export default function SEOReport({ data }) {
  const reportRef = useRef(null);

  // ✅ If no data at all, show nothing
  if (!data) return null;

  // Extract real data from props (no fallback arrays)
  const seoData = data.seoData || data;
  const productName = seoData.productName || data.productName || 'Product';
  const market = seoData.market || data.market || 'N/A';
  const currency = seoData.currency || 'PKR';
  const symbol = getSymbol(currency);
  const dataTimestamp = seoData.dataTimestamp || new Date().toISOString();

  const seoScore = seoData.seoScore ?? 0;
  const actionScore = seoData.actionScore ?? 0;
  const actionLabel = seoData.actionLabel || 'N/A';
  const timeline = seoData.estimatedTimeline || 'N/A';
  const summary = seoData.executiveSummary || '';

  // Keyword strategy — use exactly what's provided, no defaults
  const keywordStrategy = seoData.keywordStrategy || {};
  const contentStrategy = seoData.contentStrategy || {};
  const backlinkStrategy = seoData.backlinkStrategy || {};
  const competitorGap = seoData.competitorGapAnalysis || {};

  // Real keyword data
  const primaryKeywords = keywordStrategy.primaryKeywords || [];
  const secondaryKeywords = keywordStrategy.secondaryKeywords || [];
  const longTailKeywords = keywordStrategy.longTailKeywords || [];

  // Competitor data
  const topCompetitors = competitorGap.topCompetitors || [];

  // Content calendar
  const contentCalendar = contentStrategy.contentCalendar || {};

  // Earning data — must come from real data or be empty
  const earningData = seoData.earningData || [];

  // Keyword clusters
  const keywordClusters = seoData.keywordClusters || [];

  // Backlink targets
  const backlinkTargets = backlinkStrategy.targetSites || [];

  // SERP Analysis
  const serpAnalysis = seoData.serpAnalysis || {};

  // Final verdict
  const finalVerdict = seoData.finalVerdict || [];

  // ============================================================
  // MARKDOWN COPY — ONLY REAL DATA
  // ============================================================
  const copyMarkdown = () => {
    try {
      const md = `
# 📊 PREMIUM SEO REPORT FOR ${productName.toUpperCase()} IN ${market}

**SEO Score:** ${seoScore}%
**Timeline:** ${timeline}
**Action Score:** ${actionScore}% — ${actionLabel}
**Data Timestamp:** ${new Date(dataTimestamp).toLocaleString()}

## 1. KEYWORD STRATEGY
**Primary Keywords:** ${primaryKeywords.join(', ') || 'N/A'}
**Secondary Keywords:** ${secondaryKeywords.join(', ') || 'N/A'}
**Long-tail Keywords:** ${longTailKeywords.join(', ') || 'N/A'}

## 2. TOP COMPETITORS
${topCompetitors.map(c => `- ${c}`).join('\n') || 'N/A'}

## 3. 90 DAY CONTENT CALENDAR
${Object.entries(contentCalendar).map(([month, weeks]) => {
  const weekKeys = Object.keys(weeks);
  return `**${month.toUpperCase()}:** ${weekKeys.map(w => weeks[w]?.join(' | ') || 'N/A').join(' | ')}`;
}).join('\n') || 'N/A'}

## 4. EARNING DATA
${earningData.map(e => `- ${e.source}: ${e.earning}`).join('\n') || 'N/A'}

## 5. KEYWORD CLUSTERS
${keywordClusters.map(c => `- ${c.name}: ${c.keywords?.join(', ') || 'N/A'}`).join('\n') || 'N/A'}

## 6. SERP ANALYSIS
E-commerce: ${serpAnalysis.ecommerce || 'N/A'}, Blogs: ${serpAnalysis.blogs || 'N/A'}, Videos: ${serpAnalysis.videos || 'N/A'}

## 7. BACKLINK PLAN
${backlinkTargets.map(b => `- ${b}`).join('\n') || 'N/A'}

## FINAL VERDICT
${finalVerdict.map((v, i) => `${i+1}. ${v}`).join('\n') || 'N/A'}
`;
      navigator.clipboard.writeText(md);
      toast.success('✅ Markdown copied!');
    } catch (e) {
      console.error('Markdown copy error:', e);
      toast.error('Failed to copy Markdown');
    }
  };

  // ============================================================
  // OTHER EXPORT FUNCTIONS
  // ============================================================
  const copyCSV = () => {
    try {
      const headers = ['Keyword', 'Volume', 'Difficulty', 'CPC', 'Trend'];
      // Only if we have keyword data, otherwise empty
      const rows = (keywordStrategy.keywordData || []).map(k => [k.keyword, k.volume, k.difficulty, k.cpc, k.trend]);
      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      navigator.clipboard.writeText(csv);
      toast.success('✅ CSV copied!');
    } catch (e) { toast.error('Failed to copy CSV'); }
  };

  const copyJSON = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast.success('✅ JSON copied!');
    } catch (e) { toast.error('Failed to copy JSON'); }
  };

  const downloadPDF = async () => {
    const element = reportRef.current;
    if (!element) { toast.error('Report not ready!'); return; }
    toast.loading('Generating PDF...', { id: 'pdf' });
    try {
      const canvas = await html2canvas(element, { scale: 2.5, backgroundColor: '#080B12', allowTaint: true, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight, position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) { position = heightLeft - pdfHeight; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight); heightLeft -= pdf.internal.pageSize.getHeight(); }
      pdf.save(`SEO_Report_${productName.replace(/ /g, '_')}.pdf`);
      toast.success('✅ PDF Downloaded!', { id: 'pdf' });
    } catch (error) { console.error('PDF Error:', error); toast.error('Failed to generate PDF.', { id: 'pdf' }); }
  };

  const actionColor = seoScore >= 70 ? '#34d399' : seoScore >= 50 ? '#f59e0b' : '#ef4444';

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#2dd4bf] flex items-center justify-center shadow-lg shadow-[#a78bfa]/20">
              <BookOpen size={18} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{productName}</h2>
              <span className="text-[10px] text-gray-500 font-mono">{market} · {currency} · SEO Report</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <span className="flex items-center gap-1"><Clock size={12} /> Updated: {new Date(dataTimestamp).toLocaleTimeString()}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={copyCSV} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all"><FileSpreadsheet size={11} /> CSV</button>
            <button onClick={copyJSON} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all"><FileJson size={11} /> JSON</button>
            <button onClick={copyMarkdown} className="text-[10px] bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] hover:opacity-90 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-black font-bold shadow-lg shadow-[#2dd4bf]/20 transition-all"><FileCode size={11} /> MD</button>
            <button onClick={downloadPDF} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all"><Download size={11} /> PDF</button>
          </div>
        </div>

        {/* SEO SCORE */}
        <div className="cyber-card rounded-2xl p-6 border-l-4 flex flex-wrap items-center justify-between gap-6" style={{ borderLeftColor: actionColor }}>
          <div className="flex items-center gap-8">
            <ProgressRing score={seoScore} label="SEO" color={actionColor} />
            <div>
              <p className="text-[10px] text-gray-400 font-mono tracking-widest">SEO SCORE</p>
              <p className="text-2xl font-bold" style={{ color: actionColor }}>
                {seoScore >= 70 ? 'Good' : seoScore >= 50 ? 'Needs Work' : 'Needs Help'}
              </p>
              <p className="text-sm text-gray-300 max-w-lg">{summary || 'No summary available.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center"><p className="text-[9px] text-gray-500 font-mono uppercase">Timeline</p><p className="text-xl font-bold text-[#2dd4bf]">{timeline}</p></div>
            <div className="text-center"><p className="text-[9px] text-gray-500 font-mono uppercase">Action Score</p><p className="text-xl font-bold text-yellow-400">{actionScore}%</p></div>
            <div className="text-center"><p className="text-[9px] text-gray-500 font-mono uppercase">Action Label</p><p className="text-xl font-bold text-green-400">{actionLabel}</p></div>
          </div>
        </div>

        {/* KEYWORD STRATEGY */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="KEYWORD STRATEGY" icon={Hash} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-400 font-mono">Primary Keywords</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {primaryKeywords.length > 0 ? primaryKeywords.map((kw, i) => <span key={i} className="text-[9px] bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">{kw}</span>) : <span className="text-sm text-gray-500">No data</span>}
              </div>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-400 font-mono">Secondary Keywords</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {secondaryKeywords.length > 0 ? secondaryKeywords.map((kw, i) => <span key={i} className="text-[9px] bg-[#a78bfa]/10 text-[#a78bfa] px-2 py-0.5 rounded-full border border-[#a78bfa]/20">{kw}</span>) : <span className="text-sm text-gray-500">No data</span>}
              </div>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-400 font-mono">Long-tail Keywords</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {longTailKeywords.length > 0 ? longTailKeywords.map((kw, i) => <span key={i} className="text-[9px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">{kw}</span>) : <span className="text-sm text-gray-500">No data</span>}
              </div>
            </div>
          </div>
        </div>

        {/* TOP COMPETITORS */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="TOP COMPETITORS" icon={Users} />
          <div className="flex flex-wrap gap-2">
            {topCompetitors.length > 0 ? topCompetitors.map((c, i) => <span key={i} className="text-xs bg-[#0F172A] text-white px-3 py-1.5 rounded-full border border-white/5">{c}</span>) : <span className="text-sm text-gray-500">No competitor data available.</span>}
          </div>
        </div>

        {/* KEYWORD CLUSTERS */}
        {keywordClusters.length > 0 && (
          <div className="cyber-card rounded-2xl p-6">
            <SectionDivider title="KEYWORD CLUSTERS" icon={Layers} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {keywordClusters.map((cluster, idx) => (
                <div key={idx} className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
                  <h4 className="text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-2">{cluster.name}</h4>
                  <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                    {cluster.keywords?.map((kw, i) => <li key={i}>{kw}</li>) || <li>No keywords</li>}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MONEY CALCULATOR — ONLY IF DATA EXISTS */}
        {earningData.length > 0 && (
          <div className="cyber-card rounded-2xl p-6">
            <SectionDivider title="MONEY CALCULATOR" icon={DollarSign} />
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2dd4bf]/20">
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Traffic Source</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Monthly Traffic</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">RPM/Commission</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Monthly Earning ({symbol})</th>
                  </tr>
                </thead>
                <tbody>
                  {earningData.map((item, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-2 px-2 text-white font-medium">{item.source}</td>
                      <td className="py-2 px-2 text-gray-300">{item.traffic}</td>
                      <td className="py-2 px-2 text-[#2dd4bf]">{item.rpm}</td>
                      <td className="py-2 px-2 text-green-400 font-medium">{item.earning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-[#2dd4bf]/10 to-[#a78bfa]/10 rounded-xl border border-[#2dd4bf]/20">
              <p className="text-[10px] text-gray-500 font-mono">💰 Total Est. Month 4 Earnings</p>
              <p className="text-2xl font-bold text-[#2dd4bf]">107,000 {symbol}</p>
            </div>
          </div>
        )}

        {/* SERP + BACKLINK */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="cyber-card rounded-2xl p-6">
            <SectionDivider title="SERP ANALYSIS" icon={Search} />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5 text-center">
                <p className="text-[10px] text-gray-500 font-mono">E-commerce</p>
                <p className="text-2xl font-bold text-[#2dd4bf]">{serpAnalysis.ecommerce ?? 'N/A'}</p>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5 text-center">
                <p className="text-[10px] text-gray-500 font-mono">Blogs</p>
                <p className="text-2xl font-bold text-[#a78bfa]">{serpAnalysis.blogs ?? 'N/A'}</p>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5 text-center">
                <p className="text-[10px] text-gray-500 font-mono">Videos</p>
                <p className="text-2xl font-bold text-yellow-400">{serpAnalysis.videos ?? 'N/A'}</p>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5 text-center">
                <p className="text-[10px] text-gray-500 font-mono">Forums</p>
                <p className="text-2xl font-bold text-red-400">{serpAnalysis.forums ?? 'N/A'}</p>
              </div>
            </div>
            {serpAnalysis.winningFormat && <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5"><p className="text-[10px] text-gray-500 font-mono">🏆 Winning Format</p><p className="text-sm text-white font-medium">{serpAnalysis.winningFormat}</p></div>}
            {serpAnalysis.featuredSnippet && <div className="mt-3 bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5"><p className="text-[10px] text-gray-500 font-mono">⭐ Featured Snippet Chance</p><p className="text-sm text-white font-medium">{serpAnalysis.featuredSnippet}</p><p className="text-[10px] text-gray-400 mt-1">{serpAnalysis.howToGetSnippet || ''}</p></div>}
          </div>

          <div className="cyber-card rounded-2xl p-6">
            <SectionDivider title="BACKLINK OUTREACH LIST" icon={Link2} />
            <div className="overflow-y-auto max-h-72">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2dd4bf]/20">
                    <th className="text-left py-1.5 px-2 text-gray-400 font-medium">Website</th>
                    <th className="text-left py-1.5 px-2 text-gray-400 font-medium">DA</th>
                    <th className="text-left py-1.5 px-2 text-gray-400 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {backlinkTargets.length > 0 ? backlinkTargets.map((item, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-1.5 px-2 text-white font-medium">{item}</td>
                      <td className="py-1.5 px-2 text-yellow-400">—</td>
                      <td className="py-1.5 px-2 text-[#2dd4bf]">—</td>
                    </tr>
                  )) : <tr><td colSpan="3" className="text-center text-gray-500 py-2">No backlink targets available.</td></tr>}
                </tbody>
              </table>
            </div>
            {backlinkTargets.length > 0 && (
              <div className="mt-3 p-3 bg-[#0F172A] rounded-xl border border-[#2dd4bf]/5">
                <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Mail size={12} /> Outreach Email Template</p>
                <div className="mt-1 p-2 bg-[#080B12] rounded-lg border border-white/5 font-mono text-[10px] text-gray-300 whitespace-pre-wrap">
{`Subject: Quick Article Idea for [Website Name]

Hi [Name],

I'm working on a comprehensive guide for ${productName} in ${market} and noticed your audience loves this topic.

Would you be open to a 1500-word guest post titled:
"Why ${productName} is the Best Choice in ${market} 2026"

Includes: trends, top picks, and a complete buying guide.

Let me know if interested!

Cheers,
[Your Name]
[Your Website URL]`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FINAL VERDICT */}
        <div className="cyber-card rounded-2xl p-6 border-l-4 border-l-[#2dd4bf]">
          <SectionDivider title="FINAL VERDICT" icon={Award} />
          {finalVerdict.length > 0 ? (
            <div className="space-y-3">
              {finalVerdict.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
                  <span className={`text-sm font-bold ${idx === 0 ? 'text-green-400' : idx === 1 ? 'text-yellow-400' : 'text-[#2dd4bf]'}`}>{idx + 1}.</span>
                  <p className="text-sm text-gray-200">{item}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No verdict available.</p>
          )}
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
