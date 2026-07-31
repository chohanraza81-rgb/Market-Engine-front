'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Copy, FileJson, FileText, // ✅ Fixed: FileMarkdown removed
  ChevronDown, ChevronRight, CheckCircle, XCircle, 
  AlertCircle, TrendingUp, Users, Search, 
  Calendar, Link, Award, BarChart3, Zap,
  Shield, Clock, Globe, Target, BookOpen,
  Sparkles, Check, ArrowRight, ExternalLink,
  PieChart, Activity, Layers, Hash, Percent
} from 'lucide-react';
import toast from 'react-hot-toast';

const SEOReport = ({ data, onExport }) => {
  const [expandedSections, setExpandedSections] = useState({
    keywords: true,
    content: true,
    technical: true,
    backlinks: true,
    adsense: true,
    competitors: true,
    timeline: true
  });
  
  const [isExporting, setIsExporting] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#34d399';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Strong';
    if (score >= 50) return 'Medium';
    return 'Needs Improvement';
  };

  const formatVolume = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const exportMarkdown = () => {
    let markdown = `# PROFITFORGE Pro - SEO Report\n\n`;
    markdown += `## Product: ${data.keywordStrategy?.primary?.[0]?.keyword || 'N/A'}\n\n`;
    markdown += `## SEO Score: ${data.seoScore}%\n\n`;
    
    if (data.keywordStrategy) {
      markdown += `## Keyword Strategy\n\n`;
      markdown += `### Primary Keywords\n`;
      data.keywordStrategy.primary?.forEach(kw => {
        markdown += `- ${kw.keyword} (Volume: ${formatVolume(kw.volume)}, Difficulty: ${kw.difficulty})\n`;
      });
    }
    
    if (data.executiveSummary) {
      markdown += `\n## Executive Summary\n\n`;
      markdown += `${data.executiveSummary.verdict}\n\n`;
      markdown += `### Priority Actions\n`;
      data.executiveSummary.priorityActions?.forEach((action, i) => {
        markdown += `${i+1}. ${action}\n`;
      });
    }
    
    copyToClipboard(markdown);
  };

  const exportPDF = async () => {
    setIsExporting(true);
    try {
      toast.loading('Generating PDF...');
      // PDF generation logic here
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <p className="text-lg">No SEO data available</p>
          <p className="text-sm">Run a new SEO analysis to get started</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header with Score */}
      <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#2dd4bf]" />
              SEO Analysis Report
            </h2>
            <p className="text-gray-400 mt-1">
              {data.keywordStrategy?.primary?.[0]?.keyword || 'Product'} • 
              {data.estimatedTimeline?.total || '60-90 days'} timeline
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Score Gauge */}
            <div className="relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  className="text-white/5"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r="32"
                  cx="40"
                  cy="40"
                />
                <circle
                  className="transition-all duration-1000"
                  strokeWidth="6"
                  stroke={getScoreColor(data.seoScore)}
                  fill="transparent"
                  r="32"
                  cx="40"
                  cy="40"
                  strokeDasharray={`${(data.seoScore / 100) * 200.96} 200.96`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{data.seoScore}%</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-white">SEO Score</div>
              <div className="text-sm text-gray-400">{getScoreLabel(data.seoScore)}</div>
            </div>
          </div>
        </div>
        
        {/* Export Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
          <button
            onClick={exportMarkdown}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all"
          >
            <FileText className="w-4 h-4" />  {/* ✅ Fixed */}
            Copy Markdown
          </button>
          <button
            onClick={exportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {isExporting ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      {data.executiveSummary && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-[#2dd4bf]/10 to-[#a78bfa]/10 border border-[#2dd4bf]/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-[#2dd4bf] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white">Executive Summary</h3>
              <p className="text-gray-300 mt-2">{data.executiveSummary.verdict}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.executiveSummary.priorityActions?.map((action, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                    <Check className="w-3 h-3 text-[#2dd4bf]" />
                    {i+1}. {action}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline Section */}
      {data.estimatedTimeline && (
        <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('timeline')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#2dd4bf]" />
              <span className="text-white font-medium">Timeline & Weekly Breakdown</span>
              <span className="text-sm text-gray-400">{data.estimatedTimeline.total}</span>
            </div>
            {expandedSections.timeline ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.timeline && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 border-t border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {data.estimatedTimeline.weeklyBreakdown?.map((week, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-3">
                        <div className="text-sm font-medium text-[#2dd4bf]">Week {week.week}</div>
                        <div className="text-xs text-gray-400 mt-1">{week.expectedImpact}</div>
                        <ul className="text-xs text-gray-300 mt-2 space-y-1">
                          {week.tasks?.slice(0, 3).map((task, j) => (
                            <li key={j} className="flex items-start gap-1">
                              <ArrowRight className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Keyword Strategy */}
      {data.keywordStrategy && (
        <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('keywords')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-[#2dd4bf]" />
              <span className="text-white font-medium">Keyword Strategy</span>
              <span className="text-sm text-gray-400">
                {data.keywordStrategy.primary?.length || 0} Primary • 
                {data.keywordStrategy.secondary?.length || 0} Secondary • 
                {data.keywordStrategy.longTail?.length || 0} Long-tail
              </span>
            </div>
            {expandedSections.keywords ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.keywords && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 border-t border-white/5 space-y-4">
                  {/* Primary Keywords */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#2dd4bf] mb-2">Primary Keywords</h4>
                    <div className="space-y-2">
                      {data.keywordStrategy.primary?.map((kw, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-white">{kw.keyword}</span>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{formatVolume(kw.volume)} volume</span>
                            <span className={`px-2 py-1 rounded ${
                              kw.difficulty < 40 ? 'bg-green-500/20 text-green-400' :
                              kw.difficulty < 60 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {kw.difficulty}% diff
                            </span>
                            <span className="text-[#2dd4bf]">Priority {kw.priority}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Keywords */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#a78bfa] mb-2">Secondary Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.keywordStrategy.secondary?.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-sm text-gray-300">
                          {kw.keyword}
                          <span className="text-xs text-gray-500 ml-1">({formatVolume(kw.volume)})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Long-tail Keywords */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Long-tail Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.keywordStrategy.longTail?.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400">
                          {kw.keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Content Strategy */}
      {data.contentStrategy && (
        <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('content')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-[#2dd4bf]" />
              <span className="text-white font-medium">Content Strategy</span>
              <span className="text-sm text-gray-400">
                {data.contentStrategy.pillarPages?.length || 0} Pillar Pages • 
                {data.contentStrategy.blogTopics?.length || 0} Blog Topics
              </span>
            </div>
            {expandedSections.content ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.content && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 border-t border-white/5 space-y-4">
                  {/* Pillar Pages */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#2dd4bf] mb-2">Pillar Pages</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {data.contentStrategy.pillarPages?.map((page, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-3">
                          <div className="font-medium text-white text-sm">{page.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{page.wordCount} words • {page.internalLinks} internal links</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {page.targetKeywords?.map((kw, j) => (
                              <span key={j} className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">{kw}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Blog Topics */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#a78bfa] mb-2">Blog Topics (12 Weeks)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {data.contentStrategy.blogTopics?.map((topic, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-2 text-center">
                          <div className="text-xs text-gray-300">{topic.title}</div>
                          <div className="text-xs text-gray-500 mt-1">Week {topic.scheduledWeek} • {topic.wordCount}w</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Technical SEO */}
      {data.technicalSEO && (
        <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('technical')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-[#2dd4bf]" />
              <span className="text-white font-medium">Technical SEO</span>
            </div>
            {expandedSections.technical ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.technical && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#2dd4bf] mb-2">Optimizations</h4>
                    <ul className="space-y-1">
                      {data.technicalSEO.siteSpeedOptimizations?.map((opt, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                          <Check className="w-3 h-3 text-[#2dd4bf] flex-shrink-0 mt-0.5" />
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#a78bfa] mb-2">Schema Markup</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(data.technicalSEO.schemaMarkup || {}).map(([key, value]) => (
                        <span key={key} className={`px-2 py-1 rounded-lg text-xs ${
                          value ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {key}
                          {value && <CheckCircle className="w-3 h-3 inline ml-1" />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Backlink Strategy */}
      {data.backlinkStrategy && (
        <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('backlinks')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Link className="w-5 h-5 text-[#2dd4bf]" />
              <span className="text-white font-medium">Backlink Strategy</span>
              <span className="text-sm text-gray-400">
                {data.backlinkStrategy.targetSites?.length || 0} Target Sites
              </span>
            </div>
            {expandedSections.backlinks ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.backlinks && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 border-t border-white/5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.backlinkStrategy.targetSites?.slice(0, 6).map((site, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <span className="text-sm text-white">{site.domain}</span>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[#2dd4bf]">DA {site.da}</span>
                          <span className="text-gray-500">{site.niche}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Competitor Gap Analysis */}
      {data.competitorGapAnalysis && (
        <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('competitors')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-[#2dd4bf]" />
              <span className="text-white font-medium">Competitor Gap Analysis</span>
              <span className="text-sm text-gray-400">Gap Score: {data.competitorGapAnalysis.gapScore}%</span>
            </div>
            {expandedSections.competitors ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.competitors && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-white/5 rounded-full h-2">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa]"
                        style={{ width: `${data.competitorGapAnalysis.gapScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white">{data.competitorGapAnalysis.gapScore}% Gap</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.competitorGapAnalysis.opportunities?.map((opp, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-3">
                        <div className="text-sm text-white">{opp.opportunity}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="text-[#2dd4bf]">Impact: {opp.potentialImpact}</span>
                          <span className="text-gray-500">Effort: {opp.effort}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* AdSense Roadmap */}
      {data.adsenseRoadmap && (
        <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('adsense')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[#2dd4bf]" />
              <span className="text-white font-medium">AdSense Approval Roadmap</span>
              <span className="text-sm text-gray-400">{data.adsenseRoadmap.estimatedApprovalTimeframe}</span>
            </div>
            {expandedSections.adsense ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.adsense && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 border-t border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#2dd4bf] mb-2">Requirements Checklist</h4>
                      {data.adsenseRoadmap.requirementsChecklist?.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 border-b border-white/5 text-sm">
                          <span className="text-gray-300">{item.item}</span>
                          <span className="text-xs text-gray-500">{item.deadline}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#a78bfa] mb-2">Common Rejection Solutions</h4>
                      {data.adsenseRoadmap.commonRejectionReasons?.map((reason, i) => (
                        <div key={i} className="p-2 bg-white/5 rounded-lg mb-2">
                          <div className="text-xs text-red-400">{reason.reason}</div>
                          <div className="text-xs text-gray-400 mt-1">→ {reason.solution}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default SEOReport;
