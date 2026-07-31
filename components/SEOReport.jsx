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
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================================
// PROGRESS RING
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
// MAIN COMPONENT
// ============================================================
export default function SEOReport({ data }) {
  const reportRef = useRef(null);

  if (!data) return null;

  // ✅ Safely extract data with fallbacks
  const seoData = data.seoData || data;
  const keywordStrategy = seoData.keywordStrategy || {};
  const contentStrategy = seoData.contentStrategy || {};
  const technicalSEO = seoData.technicalSEO || {};
  const backlinkStrategy = seoData.backlinkStrategy || {};
  const adsenseRoadmap = seoData.adsenseRoadmap || {};
  const competitorGap = seoData.competitorGapAnalysis || {};

  // ✅ FIX: Extract product name and market from data
  const productName = seoData.productName || data.productName || 'Product';
  const market = seoData.market || data.market || 'N/A';
  const seoScore = seoData.seoScore || 65;
  const timeline = seoData.estimatedTimeline || '60-90 days';
  const summary = seoData.executiveSummary || 'Actionable SEO strategy generated.';

  const actionColor = seoScore >= 70 ? '#34d399' : seoScore >= 50 ? '#f59e0b' : '#ef4444';

  // ============================================================
  // COPY FUNCTIONS
  // ============================================================
  const copyMarkdown = () => {
    try {
      const md = `
# 📊 PROFITFORGE PRO - SEO Report
**Product:** ${productName}
**Market:** ${market}
**SEO Score:** ${seoScore}%
**Timeline:** ${timeline}

## Keyword Strategy
**Primary:** ${keywordStrategy.primaryKeywords?.join(', ') || 'N/A'}
**Secondary:** ${keywordStrategy.secondaryKeywords?.join(', ') || 'N/A'}
**Long-tail:** ${keywordStrategy.longTailKeywords?.join(', ') || 'N/A'}
**Difficulty:** ${keywordStrategy.keywordDifficulty || 'N/A'}
**Search Volume:** ${keywordStrategy.searchVolume || 'N/A'}

## Content Strategy
**Pillar Pages:** ${contentStrategy.pillarPages?.join(', ') || 'N/A'}
**Blog Topics:** ${contentStrategy.blogTopics?.join(', ') || 'N/A'}
**Word Count:** ${contentStrategy.wordCountRecommendations || 'N/A'}

## Technical SEO
${technicalSEO.siteSpeedRecommendations?.map(r => `- ${r}`).join('\n') || 'N/A'}
**Mobile:** ${technicalSEO.mobileOptimization || 'N/A'}
**Schema:** ${technicalSEO.schemaMarkup || 'N/A'}

## Backlink Strategy
**Target Sites:** ${backlinkStrategy.targetSites?.join(', ') || 'N/A'}
**Guest Post Topics:** ${backlinkStrategy.guestPostTopics?.join(', ') || 'N/A'}

## AdSense Roadmap
${adsenseRoadmap.preApprovalChecklist?.map(r => `- ${r}`).join('\n') || 'N/A'}

## Competitor Gap Analysis
**Gap Score:** ${competitorGap.gapScore || 0}%
**Opportunities:** ${competitorGap.opportunities?.join(', ') || 'N/A'}

## Verdict
${summary}
---
*PROFITFORGE Pro v6.0 • Real Data*
`;
      navigator.clipboard.writeText(md);
      toast.success('Markdown copied!');
    } catch (e) {
      toast.error('Failed to copy Markdown');
    }
  };

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
      <div className="relative z-10 space-y-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2dd4bf]/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a78bfa] to-[#2dd4bf] flex items-center justify-center shadow-lg shadow-[#a78bfa]/20">
              <Target size={16} className="text-black" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{productName}</h2>
            <span className="text-[10px] font-mono bg-[#2dd4bf]/10 text-[#2dd4bf] px-2.5 py-1 rounded-full border border-[#2dd4bf]/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" /> SEO
            </span>
            <span className="text-[10px] font-mono bg-[#a78bfa]/10 text-[#a78bfa] px-2.5 py-1 rounded-full border border-[#a78bfa]/20">
              {market}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={copyMarkdown} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all">
              <FileCode size={11} /> MD
            </button>
            <button onClick={downloadPDF} className="text-[10px] bg-gradient-to-r from-[#a78bfa] to-[#2dd4bf] hover:opacity-90 px-4 py-1.5 rounded-lg flex items-center gap-1.5 text-black font-bold shadow-lg shadow-[#a78bfa]/20 transition-all">
              <Download size={11} /> PDF
            </button>
          </div>
        </div>

        {/* ACTION SCORE */}
        <div className="cyber-card rounded-2xl p-6 border-l-4 flex flex-wrap items-center justify-between gap-6" style={{ borderLeftColor: actionColor }}>
          <div className="flex items-center gap-8">
            <ProgressRing score={seoScore} label="SEO" color={actionColor} />
            <div>
              <p className="text-[10px] text-gray-400 font-mono tracking-widest">SEO SCORE</p>
              <p className="text-2xl font-bold" style={{ color: actionColor }}>
                {seoScore >= 70 ? 'Good' : seoScore >= 50 ? 'Needs Work' : 'Needs Help'}
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
              <p className="text-[9px] text-gray-500 font-mono uppercase">Market</p>
              <p className="text-xl font-bold text-yellow-400">{market}</p>
            </div>
          </div>
        </div>

        {/* KEYWORD STRATEGY */}
        <div className="cyber-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
            <Hash size={14} /> KEYWORD STRATEGY
          </div>
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
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#2dd4bf]/10">
            <div>
              <p className="text-[9px] text-gray-500 font-mono">Keyword Difficulty</p>
              <p className="text-sm text-white font-medium">{keywordStrategy.keywordDifficulty || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 font-mono">Search Volume</p>
              <p className="text-sm text-white font-medium">{keywordStrategy.searchVolume || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* CONTENT STRATEGY */}
        <div className="cyber-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
            <FileText size={14} /> CONTENT STRATEGY
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-400 font-mono">Pillar Pages</p>
              <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                {contentStrategy.pillarPages?.map((p, i) => <li key={i}>{p}</li>) || <li>N/A</li>}
              </ul>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-400 font-mono">Blog Topics</p>
              <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                {contentStrategy.blogTopics?.map((t, i) => <li key={i}>{t}</li>) || <li>N/A</li>}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#2dd4bf]/10">
            <div>
              <p className="text-[9px] text-gray-500 font-mono">Word Count</p>
              <p className="text-sm text-white font-medium">{contentStrategy.wordCountRecommendations || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 font-mono">Content Calendar</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(contentStrategy.contentCalendar || {}).map(([week, topics]) => (
                  <span key={week} className="text-[8px] bg-[#0F172A] text-gray-300 px-1.5 py-0.5 rounded border border-white/5">
                    {week}: {topics?.length || 0} topics
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TECHNICAL SEO + BACKLINK STRATEGY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <Zap size={14} /> TECHNICAL SEO
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Mobile Optimization</p>
                <p className="text-sm text-white">{technicalSEO.mobileOptimization || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Schema Markup</p>
                <p className="text-sm text-white">{technicalSEO.schemaMarkup || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Internal Linking</p>
                <p className="text-sm text-white">{technicalSEO.internalLinking || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Speed Recommendations</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                  {technicalSEO.siteSpeedRecommendations?.map((r, i) => <li key={i}>{r}</li>) || <li>N/A</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <Link2 size={14} /> BACKLINK STRATEGY
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Target Sites</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                  {backlinkStrategy.targetSites?.map((s, i) => <li key={i}>{s}</li>) || <li>N/A</li>}
                </ul>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Guest Post Topics</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                  {backlinkStrategy.guestPostTopics?.map((t, i) => <li key={i}>{t}</li>) || <li>N/A</li>}
                </ul>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Outreach Strategy</p>
                <p className="text-sm text-white">{backlinkStrategy.outreachStrategy || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ADSENSE ROADMAP + COMPETITOR GAP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <ShieldCheck size={14} /> ADSENSE ROADMAP
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Requirements</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                  {adsenseRoadmap.requirements?.map((r, i) => <li key={i}>{r}</li>) || <li>N/A</li>}
                </ul>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Estimated Approval Time</p>
                <p className="text-sm text-white font-medium">{adsenseRoadmap.estimatedApprovalTime || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Pre-Approval Checklist</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                  {adsenseRoadmap.preApprovalChecklist?.map((c, i) => <li key={i}>{c}</li>) || <li>N/A</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="cyber-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
              <AlertCircle size={14} /> COMPETITOR GAP ANALYSIS
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Gap Score</p>
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: competitorGap.gapScore >= 60 ? '#34d399' : '#f59e0b' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${competitorGap.gapScore || 0}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white">{competitorGap.gapScore || 0}%</span>
                </div>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Top Competitors</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                  {competitorGap.topCompetitors?.map((c, i) => <li key={i}>{c}</li>) || <li>N/A</li>}
                </ul>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-mono">Opportunities</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                  {competitorGap.opportunities?.map((o, i) => <li key={i}>{o}</li>) || <li>N/A</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FINAL RECOMMENDATION */}
        <div className="cyber-card rounded-2xl p-6 border-l-4 border-l-[#2dd4bf]">
          <div className="flex items-center gap-2 text-[10px] text-[#2dd4bf] font-mono uppercase tracking-wider mb-4 border-b border-[#2dd4bf]/10 pb-2">
            <Award size={14} /> FINAL RECOMMENDATION
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 font-mono">Status</p>
              <p className={`text-2xl font-bold ${seoScore >= 70 ? 'text-green-400' : seoScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {seoScore >= 70 ? 'Strong SEO' : seoScore >= 50 ? 'Needs Work' : 'Needs Help'}
              </p>
              <p className="text-sm text-gray-300 mt-1">{summary}</p>
            </div>
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2dd4bf]/5">
              <p className="text-[10px] text-gray-500 font-mono">Top 3 Priorities</p>
              <ul className="list-decimal list-inside text-sm text-gray-300 mt-1 space-y-1">
                <li>Optimize for mobile devices</li>
                <li>Create high-quality content</li>
                <li>Build strong backlink profile</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between text-[9px] text-gray-600 font-mono border-t border-[#2dd4bf]/10 pt-4">
          <span>PROFITFORGE Pro v6.0 · SEO Engine</span>
          <span>Real · Live Data · Powered by Groq</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" /> Live</span>
        </div>
      </div>
    </motion.div>
  );
}
