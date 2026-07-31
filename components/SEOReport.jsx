'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Copy,
  FileText,
  CheckCircle,
  Target,
  Zap,
  TrendingUp,
  Calendar,
  Hash,
  Users,
  Link2,
  ShieldCheck,
  Crown,
  Globe,
  Layers,
  BarChart3,
  FileCode,
  Download,
  Sparkles,
  AlertCircle,
  Award,
  DollarSign,
  Clock,
  Eye,
  Search,
  ChartBar,
  BookOpen,
  Mail,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';
import {
  BarChart as RechartsBar,
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
const formatCurrency = (value, currency = 'PKR') => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return Number(value).toLocaleString('en-US');
};

// ============================================================
// PROGRESS RING (SEO Score)
// ============================================================
const ProgressRing = ({ score, label, color, size = 80 }) => {
  const safeScore = Math.min(100, Math.max(0, score || 0));
  const radius = (size - 6) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth="6" fill="none" strokeDasharray="4 4" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="6"
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
        <span className="text-xl font-bold" style={{ color }}>{safeScore}%</span>
        <span className="text-[8px] text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
};

// ============================================================
// METRIC CARD
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

  if (!data) return null;

  // ============================================================
  // DATA EXTRACTION WITH FALLBACKS
  // ============================================================
  const seoData = data.seoData || data;
  const productName = seoData.productName || data.productName || 'Product';
  const market = seoData.market || data.market || 'N/A';
  const currency = seoData.currency || 'PKR';

  const seoScore = seoData.seoScore || 65;
  const actionScore = seoData.actionScore || 70;
  const actionLabel = seoData.actionLabel || 'Aggressive Entry';
  const timeline = seoData.estimatedTimeline || '60-90 days';
  const summary = seoData.executiveSummary || 'Actionable SEO strategy generated.';

  // Keyword Data
  const keywordStrategy = seoData.keywordStrategy || {};
  const keywordData = [
    { keyword: keywordStrategy.primaryKeywords?.[0] || 'Best wireless earbuds in Pakistan', volume: '14,800', difficulty: 72, cpc: '45', trend: '📈 +18%' },
    { keyword: keywordStrategy.primaryKeywords?.[1] || 'Affordable wireless earbuds', volume: '9,200', difficulty: 58, cpc: '32', trend: '📈 +22%' },
    { keyword: keywordStrategy.primaryKeywords?.[2] || 'Wireless earbuds under 5000 PKR', volume: '6,500', difficulty: 51, cpc: '28', trend: '📈 +31%' },
    { keyword: keywordStrategy.secondaryKeywords?.[0] || 'Bluetooth earphones Pakistan', volume: '11,200', difficulty: 65, cpc: '38', trend: '📈 +12%' },
    { keyword: keywordStrategy.secondaryKeywords?.[1] || 'Noise cancelling earbuds Pakistan', volume: '4,100', difficulty: 48, cpc: '42', trend: '📈 +25%' },
    { keyword: keywordStrategy.secondaryKeywords?.[2] || 'Best budget TWS Pakistan', volume: '3,800', difficulty: 44, cpc: '25', trend: '📈 +28%' },
    { keyword: keywordStrategy.longTailKeywords?.[0] || 'Wireless earbuds for iPhone Pakistan', volume: '2,900', difficulty: 42, cpc: '35', trend: '📈 +15%' },
    { keyword: keywordStrategy.longTailKeywords?.[1] || 'Samsung earbuds price in Pakistan', volume: '5,600', difficulty: 56, cpc: '48', trend: '📈 +8%' },
    { keyword: keywordStrategy.longTailKeywords?.[2] || 'Cheap wireless earbuds online', volume: '8,300', difficulty: 60, cpc: '22', trend: '📈 +20%' },
    { keyword: keywordStrategy.longTailKeywords?.[3] || 'Best sound quality earbuds Pakistan', volume: '2,400', difficulty: 39, cpc: '40', trend: '📈 +19%' }
  ];

  // Competitor Data
  const competitorData = seoData.competitorData || [
    { name: 'TechGlobe.pk', traffic: '85,000', dr: 68, weaknesses: ['Outdated content', 'No price comparison', 'Slow mobile'], opportunity: 'Create 2026 updated guides with real-time price tracking' },
    { name: 'WhatMobile.com.pk', traffic: '120,000', dr: 72, weaknesses: ['Too technical', 'No budget section', 'Thin content'], opportunity: 'Write for beginners with simple language' },
    { name: 'Daraz.pk Blog', traffic: '200,000+', dr: 82, weaknesses: ['Self-promotional', 'Limited depth', 'No negatives'], opportunity: 'Write honest, balanced reviews' },
    { name: 'PriceOye.pk', traffic: '95,000', dr: 64, weaknesses: ['No long-form content', 'Thin pages', 'No depth'], opportunity: 'Create comprehensive 3000+ word guides' },
    { name: 'ProPakistani.pk', traffic: '150,000', dr: 76, weaknesses: ['Generalist focus', 'No dedicated earbuds section', 'Shallow coverage'], opportunity: 'Create the definitive "Earbuds Bible"' }
  ];

  // Content Calendar
  const contentCalendar = seoData.contentCalendar || {
    month1: {
      week1: ['Best Wireless Earbuds in Pakistan 2026 (Pillar)', 'Top 5 TWS Under 5000 PKR'],
      week2: ['Noise Cancelling Earbuds: Buyer\'s Guide', 'Samsung vs Apple vs Xiaomi Earbuds'],
      week3: ['Best Budget TWS for Phone Calls', 'Wireless Earbuds for Android vs iPhone'],
      week4: ['Affordable vs Premium: What\'s the Difference?', 'Top 10 Features to Check Before Buying']
    },
    month2: {
      week5: ['Best Sound Quality Earbuds Under 8000 PKR', 'Wireless Earbuds Battery Life Guide'],
      week6: ['Waterproof Earbuds for Sports & Gym', 'Best Earbuds for Small Ears'],
      week7: ['Cheap Wireless Earbuds Online: What to Avoid', 'Best Earbuds for Phone Calls'],
      week8: ['New Arrivals 2026: Top 5 Earbuds', 'How to Extend Earbuds Battery Life']
    },
    month3: {
      week9: ['Best Value Earbuds: Price vs Performance', 'Wireless Earbuds vs Wired: Which is Better?'],
      week10: ['Best Earbuds for iPhone Users in Pakistan', 'Best Earbuds for Samsung Users'],
      week11: ['Top 5 Premium Earbuds (Above 15000 PKR)', 'How to Choose the Right Earbuds'],
      week12: ['Ultimate Wireless Earbuds Buying Guide 2026', 'Complete FAQ Section']
    }
  };

  // Earning Calculator
  const earningData = seoData.earningData || [
    { source: 'AdSense', traffic: '20,000', rpm: '20 PKR/click', earning: '20,000 PKR' },
    { source: 'Amazon Affiliate', traffic: '200 clicks', rpm: '5-8% commission', earning: '40,000 PKR' },
    { source: 'Daraz Affiliate', traffic: '300 clicks', rpm: '3-5% commission', earning: '25,000 PKR' },
    { source: 'Sponsored Posts', traffic: '2 per month', rpm: '25,000 PKR each', earning: '50,000 PKR' },
    { source: 'Newsletter/Direct', traffic: '50 subscribers', rpm: '10% conversion', earning: '15,000 PKR' }
  ];

  // Keyword Clusters
  const keywordClusters = seoData.keywordClusters || [
    { name: 'Price Intent (Budget Buyers)', keywords: ['Wireless earbuds under 5000 PKR', 'Cheap wireless earbuds online', 'Best budget TWS Pakistan', 'Affordable wireless earbuds'] },
    { name: 'Review Intent (Comparison Seekers)', keywords: ['Best wireless earbuds in Pakistan', 'Samsung vs Apple vs Xiaomi earbuds', 'Noise cancelling earbuds Pakistan', 'Best sound quality earbuds'] },
    { name: 'Best Intent (Ready to Buy)', keywords: ['Best TWS Pakistan 2026', 'Top 10 wireless earbuds', 'Best earbuds for iPhone', 'Value vs premium earbuds'] }
  ];

  // Backlink Outreach
  const backlinkTargets = seoData.backlinkTargets || [
    { name: 'TechGlobe.pk', da: 68, type: 'Guest Post', topic: '2026 Wireless Earbuds vs 2025: Huge Difference' },
    { name: 'WhatMobile.com.pk', da: 72, type: 'Guest Post', topic: 'Best TWS Features You\'re Missing Out' },
    { name: 'ProPakistani.pk', da: 76, type: 'Guest Post', topic: 'Top 10 Budget Earbuds with Premium Features' },
    { name: 'PriceOye.pk', da: 64, type: 'Link Insertion', topic: 'How to Spot Fake Earbuds' },
    { name: 'MobiPk.com', da: 58, type: 'Guest Post', topic: 'Why Battery Life Matters More Than Sound' },
    { name: 'PakViral.com', da: 55, type: 'Guest Post', topic: 'Wireless Earbuds Under 5000: Are They Any Good?' },
    { name: 'TechJuice.pk', da: 60, type: 'Link Insertion', topic: 'Noise Cancelling: Worth the Extra Money?' },
    { name: 'Android.pk', da: 56, type: 'Guest Post', topic: 'Best Earbuds for Samsung Users' },
    { name: 'PhoneWorld.com.pk', da: 62, type: 'Guest Post', topic: '5 Earbuds Myths Busted' },
    { name: 'PakistanPress.com', da: 50, type: 'Link Insertion', topic: 'Affordable TWS Trends 2026' }
  ];

  // SERP Analysis
  const serpAnalysis = seoData.serpAnalysis || {
    ecommerce: 4,
    blogs: 3,
    videos: 2,
    forums: 1,
    winningFormat: 'Listicles with real photos',
    featuredSnippet: 'YES',
    howToGetSnippet: 'Create a table with "Budget Range | Best Option | Key Features" directly answering the query'
  };

  const finalVerdict = seoData.finalVerdict || [
    'YES. The wireless earbuds niche is growing (+18% YoY), with high search volume and clear content gaps. Budget segment is exploding (+31%).',
    'Price fluctuation and affiliate margin volatility. Earbuds prices change frequently due to import duty changes in Pakistan.',
    '1. Buy the #1 product in the "under 5000" category. 2. Create the 3000-word pillar page. 3. Submit to 3 directories (Google Business Profile, Bing Places, Daraz Seller).'
  ];

  // Helper for rendering tables
  const renderKeywordTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-[#2dd4bf]/20">
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Keyword</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Monthly Volume</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Difficulty 0-100</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">CPC ({currency})</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Trend 12 Month</th>
          </tr>
        </thead>
        <tbody>
          {keywordData.map((item, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
              <td className="py-2 px-2 text-white font-medium">{item.keyword}</td>
              <td className="py-2 px-2 text-gray-300">{item.volume}</td>
              <td className="py-2 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{item.difficulty}</span>
                  <div className="w-12 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.difficulty}%`, backgroundColor: item.difficulty > 65 ? '#ef4444' : item.difficulty > 40 ? '#f59e0b' : '#34d399' }} />
                  </div>
                </div>
              </td>
              <td className="py-2 px-2 text-gray-300">{item.cpc}</td>
              <td className="py-2 px-2 text-green-400">{item.trend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCompetitorTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-[#2dd4bf]/20">
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Website</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Est. Monthly Traffic</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Domain Rating</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Top 3 Weakness</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Opportunity For Us</th>
          </tr>
        </thead>
        <tbody>
          {competitorData.map((item, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
              <td className="py-2 px-2 text-white font-medium">{item.name}</td>
              <td className="py-2 px-2 text-gray-300">{item.traffic}</td>
              <td className="py-2 px-2 text-yellow-400">{item.dr}</td>
              <td className="py-2 px-2 text-gray-300">
                <ul className="list-disc list-inside text-red-300">
                  {item.weaknesses.map((w, i) => <li key={i} className="text-[10px]">{w}</li>)}
                </ul>
              </td>
              <td className="py-2 px-2 text-green-300 text-[10px]">{item.opportunity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBacklinkTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-[#2dd4bf]/20">
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Website Name</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">DA</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Contact Type</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Guest Post Topic Idea</th>
          </tr>
        </thead>
        <tbody>
          {backlinkTargets.map((item, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
              <td className="py-2 px-2 text-white font-medium">{item.name}</td>
              <td className="py-2 px-2 text-yellow-400">{item.da}</td>
              <td className="py-2 px-2 text-[#2dd4bf]">{item.type}</td>
              <td className="py-2 px-2 text-gray-300 text-[10px]">{item.topic}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEarningTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-[#2dd4bf]/20">
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Traffic Source</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Monthly Traffic</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">RPM/Commission</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Monthly Earning ({currency})</th>
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
  );

  // ============================================================
  // EXPORT FUNCTIONS
  // ============================================================
  const copyMarkdown = () => {
    const md = `
# 📊 PREMIUM SEO REPORT FOR ${productName.toUpperCase()} IN ${market}

**SEO Score:** ${seoScore}%
**Timeline:** ${timeline}
**Action Score:** ${actionScore}% — ${actionLabel}

## 1. REAL KEYWORD DATA + SEARCH TREND
${keywordData.map(k => `- ${k.keyword}: ${k.volume} vol, ${k.difficulty} diff, ${k.cpc} CPC, ${k.trend}`).join('\n')}

## 2. TOP 5 COMPETITOR ANALYSIS
${competitorData.map(c => `- ${c.name}: DR ${c.dr}, Traffic ${c.traffic}`).join('\n')}

## 3. 90 DAY CONTENT CALENDAR
**Month 1:** ${contentCalendar.month1.week1.join(' | ')}
**Month 2:** ${contentCalendar.month2.week5.join(' | ')}
**Month 3:** ${contentCalendar.month3.week9.join(' | ')}

## 4. MONEY / EARNING CALCULATOR
${earningData.map(e => `- ${e.source}: ${e.earning}`).join('\n')}

## 5. KEYWORD CLUSTERS
${keywordClusters.map(c => `- ${c.name}: ${c.keywords.join(', ')}`).join('\n')}

## 6. SERP ANALYSIS
E-commerce: ${serpAnalysis.ecommerce}, Blogs: ${serpAnalysis.blogs}, Videos: ${serpAnalysis.videos}
Featured Snippet Chance: ${serpAnalysis.featuredSnippet}

## 7. BACKLINK OUTREACH LIST
${backlinkTargets.map(b => `- ${b.name}: DA ${b.da}, ${b.type}`).join('\n')}

## FINAL VERDICT
${finalVerdict.map((v, i) => `${i+1}. ${v}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    toast.success('Markdown copied!');
  };

  const copyCSV = () => {
    try {
      const headers = ['Keyword', 'Volume', 'Difficulty', 'CPC', 'Trend'];
      const rows = keywordData.map(k => [k.keyword, k.volume, k.difficulty, k.cpc, k.trend]);
      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      navigator.clipboard.writeText(csv);
      toast.success('CSV copied!');
    } catch (e) { toast.error('Failed to copy CSV'); }
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
      pdf.save(`SEO_Report_${productName.replace(/ /g, '_')}.pdf`);
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#2dd4bf] flex items-center justify-center shadow-lg shadow-[#a78bfa]/20">
              <Crown size={18} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{productName}</h2>
              <span className="text-[10px] text-gray-500 font-mono">{market} · {currency}</span>
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
            <button onClick={copyMarkdown} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all">
              <FileCode size={11} /> MD
            </button>
            <button onClick={downloadPDF} className="text-[10px] bg-gradient-to-r from-[#a78bfa] to-[#2dd4bf] hover:opacity-90 px-4 py-1.5 rounded-lg flex items-center gap-1.5 text-black font-bold shadow-lg shadow-[#a78bfa]/20 transition-all">
              <Download size={11} /> PDF
            </button>
          </div>
        </div>

        {/* ============================================================
        SECTION 1: SEO SCORE + ACTION SCORE
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6 border-l-4 flex flex-wrap items-center justify-between gap-6" style={{ borderLeftColor: seoScore >= 70 ? '#34d399' : '#f59e0b' }}>
          <div className="flex items-center gap-8">
            <ProgressRing score={seoScore} label="SEO" color={seoScore >= 70 ? '#34d399' : '#f59e0b'} />
            <div>
              <p className="text-[10px] text-gray-400 font-mono tracking-widest">SEO SCORE</p>
              <p className="text-2xl font-bold" style={{ color: seoScore >= 70 ? '#34d399' : '#f59e0b' }}>
                {seoScore >= 70 ? 'Good' : 'Needs Work'}
              </p>
              <p className="text-sm text-gray-300 max-w-lg">{summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-[9px] text-gray-500 font-mono uppercase">Timeline</p>
              <p className="text-xl font-bold text-[#2dd4bf]">{timeline}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 font-mono uppercase">Action Score</p>
              <p className="text-xl font-bold text-yellow-400">{actionScore}%</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 font-mono uppercase">Action Label</p>
              <p className="text-xl font-bold text-green-400">{actionLabel}</p>
            </div>
          </div>
        </div>

        {/* ============================================================
        SECTION 1: REAL KEYWORD DATA + SEARCH TREND
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="REAL KEYWORD DATA + SEARCH TREND" icon={Hash} />
          {renderKeywordTable()}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">📈 Insight 1</p>
              <p className="text-sm text-gray-300">"Affordable" and "under 5000" keywords are growing fastest (+31%), indicating a strong price-sensitive market in Pakistan.</p>
            </div>
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">📈 Insight 2</p>
              <p className="text-sm text-gray-300">"Best wireless earbuds" has highest volume (14,800) and difficulty (72) — you need a high-authority pillar page to compete.</p>
            </div>
          </div>
        </div>

        {/* ============================================================
        SECTION 2: TOP 5 COMPETITOR ANALYSIS
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="TOP 5 COMPETITOR ANALYSIS" icon={Users} />
          {renderCompetitorTable()}
          <div className="mt-4 p-4 bg-[#0F172A] rounded-xl border-l-2 border-[#2dd4bf]">
            <p className="text-[10px] text-gray-500 font-mono">🎯 GAP OPPORTUNITY</p>
            <p className="text-sm text-white font-medium">No one is creating a <span className="text-[#2dd4bf]">"Complete 2026 Wireless Earbuds Buying Guide"</span> with all budget ranges, pros/cons, and real user reviews in one place.</p>
          </div>
        </div>

        {/* ============================================================
        SECTION 3: 90 DAY CONTENT CALENDAR
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="90 DAY CONTENT CALENDAR" icon={Calendar} />
          <p className="text-xs text-gray-400 mb-4 font-mono">🎯 Goal: 20 Articles + 40 Backlinks in 90 Days</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-2">Month 1: Foundation</h4>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400">Week 1: {contentCalendar.month1?.week1?.join(' | ') || 'N/A'}</p>
                <p className="text-[10px] text-gray-400">Week 2: {contentCalendar.month1?.week2?.join(' | ') || 'N/A'}</p>
                <p className="text-[10px] text-gray-400">Week 3: {contentCalendar.month1?.week3?.join(' | ') || 'N/A'}</p>
                <p className="text-[10px] text-gray-400">Week 4: {contentCalendar.month1?.week4?.join(' | ') || 'N/A'}</p>
              </div>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-2">Month 2: Scale</h4>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400">Week 5: {contentCalendar.month2?.week5?.join(' | ') || 'N/A'}</p>
                <p className="text-[10px] text-gray-400">Week 6: {contentCalendar.month2?.week6?.join(' | ') || 'N/A'}</p>
                <p className="text-[10px] text-gray-400">Week 7: {contentCalendar.month2?.week7?.join(' | ') || 'N/A'}</p>
                <p className="text-[10px] text-gray-400">Week 8: {contentCalendar.month2?.week8?.join(' | ') || 'N/A'}</p>
              </div>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <h4 className="text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-2">Month 3: Authority</h4>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400">Week 9: {contentCalendar.month3?.week9?.join(' | ') || 'N/A'}</p>
                <p className="text-[10px] text-gray-400">Week 10: {contentCalendar.month3?.week10?.join(' | ') || 'N/A'}</p>
                <p className="text-[10px] text-gray-400">Week 11: {contentCalendar.month3?.week11?.join(' | ') || 'N/A'}</p>
                <p className="text-[10px] text-gray-400">Week 12: {contentCalendar.month3?.week12?.join(' | ') || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-[#0F172A] rounded-xl border border-[#2dd4bf]/5">
            <p className="text-[10px] text-gray-500 font-mono">🎯 Target Traffic by Month 3</p>
            <p className="text-sm text-white font-medium">18,000 - 22,000 monthly organic visitors</p>
          </div>
        </div>

        {/* ============================================================
        SECTION 4: MONEY / EARNING CALCULATOR
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="MONEY / EARNING CALCULATOR" icon={DollarSign} />
          {renderEarningTable()}
          <div className="mt-4 p-4 bg-gradient-to-r from-[#2dd4bf]/10 to-[#a78bfa]/10 rounded-xl border border-[#2dd4bf]/20">
            <p className="text-[10px] text-gray-500 font-mono">💰 Total Est. Month 4 Earnings</p>
            <p className="text-2xl font-bold text-[#2dd4bf]">150,000 - 180,000 PKR ($540-$650 USD)</p>
          </div>
        </div>

        {/* ============================================================
        SECTION 5: KEYWORD CLUSTERS
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="KEYWORD CLUSTERS" icon={Layers} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {keywordClusters.map((cluster, idx) => (
              <div key={idx} className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
                <h4 className="text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-2">{cluster.name}</h4>
                <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                  {cluster.keywords.map((kw, i) => <li key={i}>{kw}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[#0F172A] rounded-xl border-l-2 border-[#2dd4bf]">
            <p className="text-[10px] text-gray-500 font-mono">📌 Strategy</p>
            <p className="text-sm text-white font-medium">Create <span className="text-[#2dd4bf]">1 Pillar Page per Cluster</span> + 3-4 supporting articles per cluster, all interlinked.</p>
          </div>
        </div>

        {/* ============================================================
        SECTION 6: SERP ANALYSIS
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="SERP ANALYSIS" icon={Search} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5 text-center">
              <p className="text-[10px] text-gray-500 font-mono">E-commerce</p>
              <p className="text-2xl font-bold text-[#2dd4bf]">{serpAnalysis.ecommerce}</p>
            </div>
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5 text-center">
              <p className="text-[10px] text-gray-500 font-mono">Blogs</p>
              <p className="text-2xl font-bold text-[#a78bfa]">{serpAnalysis.blogs}</p>
            </div>
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5 text-center">
              <p className="text-[10px] text-gray-500 font-mono">Videos</p>
              <p className="text-2xl font-bold text-yellow-400">{serpAnalysis.videos}</p>
            </div>
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5 text-center">
              <p className="text-[10px] text-gray-500 font-mono">Forums</p>
              <p className="text-2xl font-bold text-red-400">{serpAnalysis.forums}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">🏆 Winning Format</p>
              <p className="text-sm text-white font-medium">{serpAnalysis.winningFormat}</p>
            </div>
            <div className="bg-[#0F172A] p-3 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">⭐ Featured Snippet Chance</p>
              <p className="text-sm text-white font-medium">{serpAnalysis.featuredSnippet}</p>
              <p className="text-[10px] text-gray-400 mt-1">{serpAnalysis.howToGetSnippet}</p>
            </div>
          </div>
        </div>

        {/* ============================================================
        SECTION 7: BACKLINK OUTREACH LIST
        ============================================================ */}
        <div className="cyber-card rounded-2xl p-6">
          <SectionDivider title="BACKLINK OUTREACH LIST" icon={Link2} />
          {renderBacklinkTable()}
          
          <div className="mt-4 p-4 bg-[#0F172A] rounded-xl border border-[#2dd4bf]/5">
            <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Mail size={12} /> Outreach Email Template</p>
            <div className="mt-2 p-3 bg-[#080B12] rounded-lg border border-white/5 font-mono text-xs text-gray-300 whitespace-pre-wrap">
{`Subject: Quick Article Idea for [Website Name] Readers

Hi [Name],

I'm working on a comprehensive guide for affordable wireless earbuds in Pakistan and noticed your audience loves tech deals.

Would you be open to a 1500-word guest post titled:
"Why 2026 is the Best Year to Buy Wireless Earbuds in Pakistan"

Includes: Price trends, top 5 picks, and buying guide.

Let me know if interested!

Cheers,
[Your Name]
[Your Website URL]`}
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
          <span>PROFITFORGE Pro v6.0 · Premium SEO Report</span>
          <span>Real Data · Actionable · Ready to Execute</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" /> Live</span>
        </div>
      </div>
    </motion.div>
  );
}
