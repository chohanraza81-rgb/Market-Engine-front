'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Copy, FileText, CheckCircle, DollarSign, Target, Zap, TrendingUp, TrendingDown, Minus,
  Eye, Truck, Sparkles, Calendar, Hash, Users, MessageCircle, BarChart3, FileJson,
  FileSpreadsheet, FileCode, Download, ShieldCheck, Clock, Activity, Crown, Globe, Layers,
  Award, AlertCircle, BookOpen, Search, Link2, Mail
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
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 20px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{safeScore}%</span>
        <span className="text-[9px] text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
    </div>
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
export default function SEOReport({ data }) {
  const reportRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!data) return null;

  const seoData = data.seoData || data;
  const productName = seoData.productName || data.productName || 'Product';
  const market = seoData.market || data.market || 'N/A';
  const currency = seoData.currency || 'USD';
  const symbol = getSymbol(currency);
  const dataTimestamp = seoData.dataTimestamp || new Date().toISOString();

  const seoScore = seoData.seoScore || 50;
  const actionScore = seoData.actionScore || 50;
  const actionLabel = seoData.actionLabel || 'Test Waters';
  const timeline = seoData.estimatedTimeline || '60-90 days';
  const summary = seoData.executiveSummary || 'SEO strategy generated.';

  const keywordStrategy = seoData.keywordStrategy || {};
  const keywordData = keywordStrategy.keywordData || [];
  const primaryKeywords = keywordStrategy.primaryKeywords || [];
  const secondaryKeywords = keywordStrategy.secondaryKeywords || [];
  const longTailKeywords = keywordStrategy.longTailKeywords || [];

  const competitorData = seoData.competitorData || [];
  const contentCalendar = seoData.contentCalendar || {};
  const keywordClusters = seoData.keywordClusters || [];
  const serpAnalysis = seoData.serpAnalysis || {};
  const backlinkTargets = seoData.backlinkTargets || [];
  const earningCalculator = seoData.earningCalculator || [];
  const finalVerdict = seoData.finalVerdict || [];

  const actionColor = seoScore >= 70? '#34d399' : seoScore >= 50? '#f59e0b' : '#ef4444';

  // ============================================================
  // COPY FUNCTIONS
  // ============================================================
  const copyMarkdown = () => {
    try {
      const keywordTable = keywordData.length > 0
       ? keywordData.map(k => `- ${k.keyword}: ${formatPrice(k.volume)} vol, ${k.difficulty} diff, ${symbol}${k.cpc} CPC, ${k.trend}`).join('\n')
        : 'No data';

      const competitors = competitorData.length > 0
       ? competitorData.map(c => `- ${c.name}: DR ${c.dr || 'N/A'}, Traffic ${c.traffic || 'N/A'}`).join('\n')
        : 'No data';

      const calendar = Object.keys(contentCalendar).length > 0
       ? Object.entries(contentCalendar).map(([month, weeks]) => {
            const weekKeys = Object.keys(weeks);
            return `**${month.toUpperCase()}:** ${weekKeys.map(w => weeks[w]?.join(' | ') || 'N/A').join(' | ')}`;
          }).join('\n')
        : 'No data';

      const md = `# 📊 PREMIUM SEO REPORT FOR ${productName.toUpperCase()} IN ${market}
**SEO Score:** ${seoScore}% | **Timeline:** ${timeline} | **Action Score:** ${actionScore}% — ${actionLabel}

## 1. KEYWORD STRATEGY
**Primary:** ${primaryKeywords.join(', ') || 'N/A'}
**Secondary:** ${secondaryKeywords.join(', ') || 'N/A'}
**Long-tail:** ${longTailKeywords.join(', ') || 'N/A'}

### Keyword Data Table
${keywordTable}

## 2. TOP COMPETITORS
${competitors}

## 3. 90 DAY CONTENT CALENDAR
${calendar}

## 4. EARNING CALCULATOR (${symbol})
${earningCalculator.map(e => `- ${e.source}: ${e.earning}`).join('\n') || 'No data'}

## 5. KEYWORD CLUSTERS
${keywordClusters.map(c => `- ${c.name}: ${c.keywords?.join(', ') || 'N/A'}`).join('\n') || 'No data'}

## 6. SERP ANALYSIS
E-commerce: ${serpAnalysis.ecommerce || 'N/A'}, Blogs: ${serpAnalysis.blogs || 'N/A'}, Videos: ${serpAnalysis.videos || 'N/A'}

## 7. BACKLINK OUTREACH LIST
${backlinkTargets.map(b => `- ${b.name}: DA ${b.da || 'N/A'}, ${b.type || 'N/A'}`).join('\n') || 'No data'}

## 8. FINAL VERDICT
${finalVerdict.map((v, i) => `${i+1}. ${v}`).join('\n') || 'No data'}
`;
      navigator.clipboard.writeText(md).then(() => toast.success('✅ Markdown copied!')).catch(() => toast.error('Copy failed'));
    } catch (e) {
      console.error(e);
      toast.error('Failed to copy Markdown');
    }
  };

  const copyCSV = () => {
    try {
      if(keywordData.length === 0) return toast.error('No keyword data');
      const headers = ['Keyword', 'Volume', 'Difficulty', 'CPC', 'Trend'];
      const rows = keywordData.map(k => [k.keyword, k.volume, k.difficulty, k.cpc, k.trend]);
      const csv = [headers.join(','),...rows.map(row => row.join(','))].join('\n');
      navigator.clipboard.writeText(csv).then(() => toast.success('✅ CSV copied!'));
    } catch (e) { toast.error('Failed to copy CSV'); }
  };

  const copyJSON = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => toast.success('✅ JSON copied!'));
    } catch (e) { toast.error('Failed to copy JSON'); }
  };

  const downloadPDF = async () => {
    const element = reportRef.current;
    if (!element) { toast.error('Report not ready!'); return; }
    setIsGenerating(true);
    toast.loading('Generating PDF...', { id: 'pdf' });
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#080B12',
        useCORS: true,
        logging: false,
        windowHeight: element.scrollHeight // FIX FOR FULL HEIGHT
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SEO_Report_${productName.replace(/ /g, '_')}.pdf`);
      toast.success('✅ PDF Downloaded!', { id: 'pdf' });
    } catch (error) {
      console.error('PDF Error:', error);
      toast.error('Failed to generate PDF.', { id: 'pdf' });
    } finally {
      setIsGenerating(false);
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
      className="max-w-7xl mx-auto mt-10 p-4 bg-[#080B12] rounded-3xl overflow-hidden select-text"
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
              <span className="text-[10px] text-gray-500 font-mono">{market} · {currency}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(dataTimestamp).toLocaleString()}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={copyCSV} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all"><FileSpreadsheet size={11} /> CSV</button>
            <button onClick={copyJSON} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all"><FileJson size={11} /> JSON</button>
            <button onClick={copyMarkdown} className="text-[10px] bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] hover:opacity-90 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-black font-bold shadow-lg shadow-[#2dd4bf]/20 transition-all"><FileCode size={11} /> MD</button>
            <button onClick={downloadPDF} disabled={isGenerating} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all"><Download size={11} /> {isGenerating? 'PDF...' : 'PDF'}</button>
          </div>
        </div>

        {/* SEO SCORE */}
        <div className="rounded-2xl p-6 border-l-4 flex flex-wrap items-center justify-between gap-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B]" style={{ borderLeftColor: actionColor }}>
          <div className="flex items-center gap-8">
            <ProgressRing score={seoScore} label="SEO" color={actionColor} />
            <div>
              <p className="text-[10px] text-gray-400 font-mono tracking-widest">SEO SCORE</p>
              <p className="text-2xl font-bold" style={{ color: actionColor }}>
                {seoScore >= 70? 'Good' : seoScore >= 50? 'Needs Work' : 'Needs Help'}
              </p>
              <p className="text-sm text-gray-300 max-w-lg">{summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center"><p className="text-[9px] text-gray-500 font-mono uppercase">Timeline</p><p className="text-xl font-bold text-[#2dd4bf]">{timeline}</p></div>
            <div className="text-center"><p className="text-[9px] text-gray-500 font-mono uppercase">Action</p><p className="text-xl font-bold text-yellow-400">{actionScore}%</p></div>
            <div className="text-center"><p className="text-[9px] text-gray-500 font-mono uppercase">Label</p><p className="text-xl font-bold text-green-400">{actionLabel}</p></div>
          </div>
        </div>

        {/* KEYWORD TABLE */}
        {keywordData.length > 0 && (
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-[#2dd4bf]/10">
            <SectionDivider title="REAL KEYWORD DATA + SEARCH TREND" icon={Hash} />
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2dd4bf]/20">
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Keyword</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Volume</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Difficulty</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">CPC</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {keywordData.slice(0, 10).map((item, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-2 px-2 text-white font-medium">{item.keyword || 'N/A'}</td>
                      <td className="py-2 px-2 text-gray-300">{formatPrice(item.volume)}</td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300">{item.difficulty}</span>
                          <div className="w-12 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, item.difficulty || 0)}%`, backgroundColor: (item.difficulty || 0) > 65? '#ef4444' : (item.difficulty || 0) > 40? '#f59e0b' : '#34d399' }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-gray-300">{symbol}{item.cpc}</td>
                      <td className="py-2 px-2 text-green-400 flex items-center gap-1"><TrendingUp size={12}/> {item.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPETITORS */}
        {competitorData.length > 0 && (
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-[#2dd4bf]/10">
            <SectionDivider title="TOP COMPETITORS" icon={Users} />
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2dd4bf]/20">
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Website</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Traffic</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">DR</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Weakness</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Opportunity</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorData.slice(0, 5).map((item, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-2 px-2 text-white font-medium">{item.name}</td>
                      <td className="py-2 px-2 text-gray-300">{item.traffic}</td>
                      <td className="py-2 px-2 text-yellow-400">{item.dr}</td>
                      <td className="py-2 px-2 text-gray-300">{item.weaknesses}</td>
                      <td className="py-2 px-2 text-green-300 text-[10px]">{item.opportunity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTENT CALENDAR */}
        {Object.keys(contentCalendar).length > 0 && (
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#2dd4bf]/10">
            <SectionDivider title="90 DAY CONTENT CALENDAR" icon={Calendar} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(contentCalendar).map(([month, weeks]) => (
                <div key={month} className="bg-[#0F172A] p-4 rounded-xl border-[#2dd4bf]/5">
                  <h4 className="text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-2">{month.toUpperCase()}</h4>
                  <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                    {Object.entries(weeks).map(([week, titles]) => (
                      <li key={week}><span className="text-[#2dd4bf]">{week}:</span> {titles?.join(' | ')}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EARNING + SERP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {earningCalculator.length > 0 && (
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-[#2dd4bf]/10">
              <SectionDivider title="EARNING CALCULATOR" icon={DollarSign} />
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#2dd4bf]/20">
                      <th className="text-left py-2 px-2 text-gray-400 font-medium">Source</th>
                      <th className="text-left py-2 px-2 text-gray-400 font-medium">Traffic</th>
                      <th className="text-left py-2 px-2 text-gray-400 font-medium">RPM</th>
                      <th className="text-left py-2 px-2 text-gray-400 font-medium">Earning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningCalculator.map((item, idx) => (
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
            </div>
          )}

          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-[#2dd4bf]/10">
            <SectionDivider title="SERP ANALYSIS" icon={Search} />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#0F172A] p-3 rounded-xl border-[#2dd4bf]/5 text-center"><p className="text-[10px] text-gray-500 font-mono">E-commerce</p><p className="text-2xl font-bold text-[#2dd4bf]">{serpAnalysis.ecommerce || 0}</p></div>
              <div className="bg-[#0F172A] p-3 rounded-xl border-[#2dd4bf]/5 text-center"><p className="text-[10px] text-gray-500 font-mono">Blogs</p><p className="text-2xl font-bold text-[#a78bfa]">{serpAnalysis.blogs || 0}</p></div>
              <div className="bg-[#0F172A] p-3 rounded-xl border-[#2dd4bf]/5 text-center"><p className="text-[10px] text-gray-500 font-mono">Videos</p><p className="text-2xl font-bold text-yellow-400">{serpAnalysis.videos || 0}</p></div>
              <div className="bg-[#0F172A] p-3 rounded-xl border-[#2dd4bf]/5 text-center"><p className="text-[10px] text-gray-500 font-mono">Forums</p><p className="text-2xl font-bold text-red-400">{serpAnalysis.forums || 0}</p></div>
            </div>
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5"><p className="text-[10px] text-gray-500 font-mono">🏆 Winning Format</p><p className="text-sm text-white font-medium">{serpAnalysis.winningFormat || 'N/A'}</p></div>
          </div>
        </div>

        {/* BACKLINKS */}
        {backlinkTargets.length > 0 && (
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-[#2dd4bf]/10">
            <SectionDivider title="BACKLINK OUTREACH LIST" icon={Link2} />
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2dd4bf]/20">
                    <th className="text-left py-1.5 px-2 text-gray-400 font-medium">Website</th>
                    <th className="text-left py-1.5 px-2 text-gray-400 font-medium">DA</th>
                    <th className="text-left py-1.5 px-2 text-gray-400 font-medium">Type</th>
                    <th className="text-left py-1.5 px-2 text-gray-400 font-medium">Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {backlinkTargets.map((item, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-1.5 px-2 text-white font-medium">{item.name}</td>
                      <td className="py-1.5 px-2 text-yellow-400">{item.da}</td>
                      <td className="py-1.5 px-2 text-[#2dd4bf]">{item.type}</td>
                      <td className="py-1.5 px-2 text-gray-300 text-[10px]">{item.topic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FINAL VERDICT */}
        {finalVerdict.length > 0 && (
          <div className="rounded-2xl p-6 border-l-4 border-l-[#2dd4bf] bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
            <SectionDivider title="FINAL VERDICT" icon={Award} />
            <div className="space-y-3">
              {finalVerdict.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#0F172A] p-3 rounded-xl border-[#2dd4bf]/5">
                  <span className={`text-sm font-bold ${idx === 0? 'text-green-400' : idx === 1? 'text-yellow-400' : idx === 2? 'text-[#2dd4bf]' : 'text-purple-400'}`}>{idx + 1}.</span>
                  <p className="text-sm text-gray-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex items-center justify-between text-[9px] text-gray-600 font-mono border-t border-[#2dd4bf]/10 pt-4">
          <span>PROFITFORGE Pro v6.1 · Premium SEO Report</span>
          <span>Real Data · Actionable · Ready to Execute</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" /> Live</span>
        </div>
      </div>
    </motion.div>
  );
}
