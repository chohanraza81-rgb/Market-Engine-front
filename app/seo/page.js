'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search, Sparkles, TrendingUp, BarChart3,
  Zap, Globe, Clock, Shield, Award,
  ChevronDown, ChevronRight, ExternalLink,
  ArrowRight, Check, AlertCircle, Loader2,
  Database, Brain, Target, Rocket, Crown,
  Star, Gem, Flame, Layers, Cpu, Gauge,
  FileText, Download, Copy, Link as LinkIcon,
  Calendar, BookOpen, Users, TrendingUp as TrendUp,
  Percent, Hash, FileJson, Share2, Eye,
  MessageSquare, Lightbulb, Compass, Radar
} from 'lucide-react';
import LiveStatus from '../../components/LiveStatus';
import SEOReport from '../../components/SEOReport';

export default function SEOPage() {
  // ============ STATE ============
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState('US');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [currentStatus, setCurrentStatus] = useState('New site');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [history, setHistory] = useState([]);
  const [backendStatus, setBackendStatus] = useState('offline');
  const [hasSearched, setHasSearched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const resultsRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://market-engine-back-production.up.railway.app';

  // ============ BACKEND HEALTH ============
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/health`);
        if (response.ok) setBackendStatus('online');
        else setBackendStatus('offline');
      } catch (error) {
        setBackendStatus('offline');
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, [BACKEND_URL]);

  // ============ FETCH HISTORY ============
  useEffect(() => {
    fetchSEOHistory();
  }, []);

  const fetchSEOHistory = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/seo/history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch SEO history:', error);
    }
  };

  // ============ PROGRESS ============
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) { clearInterval(interval); return 95; }
          return prev + Math.random() * 6 + 2;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  // ============ HANDLE SEARCH ============
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a product or service name', {
        icon: '⚠️',
        style: { background: '#1a1a2e', color: '#fff' }
      });
      return;
    }

    if (backendStatus === 'offline') {
      toast.error('Backend is offline. Please try again later.', {
        icon: '🔴',
        style: { background: '#1a1a2e', color: '#fff' }
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setReportData(null);
    setProgress(0);

    try {
      const response = await fetch(`${BACKEND_URL}/api/seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: searchQuery,
          country,
          websiteUrl: websiteUrl || null,
          currentStatus
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'SEO analysis failed', {
          icon: '❌',
          style: { background: '#1a1a2e', color: '#fff' }
        });
        throw new Error(data.message || 'SEO analysis failed');
      }

      if (data.success && data.data) {
        setReportData(data.data);
        toast.success('SEO strategy generated! 🎯', {
          icon: '✅',
          style: { background: '#1a1a2e', color: '#fff' }
        });
        
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
        
        fetchSEOHistory();
      } else {
        toast.error(data.error || 'No data received', {
          icon: '⚠️',
          style: { background: '#1a1a2e', color: '#fff' }
        });
      }

    } catch (error) {
      console.error('SEO search error:', error);
      toast.error(error.message || 'Failed to generate SEO report', {
        icon: '🔥',
        style: { background: '#1a1a2e', color: '#fff' }
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  // ============ EXPORT FUNCTIONS ============
  const exportMarkdown = () => {
    if (!reportData) return;
    try {
      let markdown = `# 🚀 PROFITFORGE Pro - SEO Strategy Report\n\n`;
      markdown += `## Product: ${reportData.keywordStrategy?.primary?.[0]?.keyword || searchQuery}\n`;
      markdown += `## Market: ${country}\n`;
      markdown += `## Generated: ${new Date().toLocaleString()}\n\n`;
      
      markdown += `---\n\n`;
      
      markdown += `## 📊 SEO Score: ${reportData.seoScore || 0}%\n\n`;
      
      if (reportData.keywordStrategy) {
        markdown += `## 🔑 Keyword Strategy\n\n`;
        markdown += `### Primary Keywords\n`;
        reportData.keywordStrategy.primary?.forEach(kw => {
          markdown += `- ${kw.keyword} (Volume: ${kw.volume || 0}, Difficulty: ${kw.difficulty || 0}%)\n`;
        });
        markdown += `\n### Secondary Keywords\n`;
        reportData.keywordStrategy.secondary?.forEach(kw => {
          markdown += `- ${kw.keyword} (Volume: ${kw.volume || 0})\n`;
        });
        markdown += `\n### Long-tail Keywords\n`;
        reportData.keywordStrategy.longTail?.forEach(kw => {
          markdown += `- ${kw.keyword}\n`;
        });
        markdown += `\n`;
      }
      
      if (reportData.contentStrategy) {
        markdown += `## 📝 Content Strategy\n\n`;
        markdown += `### Pillar Pages\n`;
        reportData.contentStrategy.pillarPages?.forEach(page => {
          markdown += `- ${page.title} (${page.wordCount || 2500} words)\n`;
        });
        markdown += `\n### Blog Topics (12 Weeks)\n`;
        reportData.contentStrategy.blogTopics?.forEach(topic => {
          markdown += `- Week ${topic.scheduledWeek || 0}: ${topic.title}\n`;
        });
        markdown += `\n`;
      }
      
      if (reportData.technicalSEO) {
        markdown += `## ⚙️ Technical SEO\n\n`;
        markdown += `### Optimizations\n`;
        reportData.technicalSEO.siteSpeedOptimizations?.forEach(opt => {
          markdown += `- ${opt}\n`;
        });
        markdown += `\n`;
      }
      
      if (reportData.backlinkStrategy) {
        markdown += `## 🔗 Backlink Strategy\n\n`;
        markdown += `### Target Sites\n`;
        reportData.backlinkStrategy.targetSites?.forEach(site => {
          markdown += `- ${site.domain} (DA: ${site.da || 0})\n`;
        });
        markdown += `\n`;
      }
      
      if (reportData.adsenseRoadmap) {
        markdown += `## 📢 AdSense Roadmap\n\n`;
        markdown += `### Requirements Checklist\n`;
        reportData.adsenseRoadmap.requirementsChecklist?.forEach(item => {
          markdown += `- ${item.item} - ${item.status || 'pending'}\n`;
        });
        markdown += `\n### Estimated Timeline: ${reportData.adsenseRoadmap.estimatedApprovalTimeframe || '2-4 weeks'}\n\n`;
      }
      
      if (reportData.competitorGapAnalysis) {
        markdown += `## 🏪 Competitor Gap Analysis\n\n`;
        markdown += `**Gap Score:** ${reportData.competitorGapAnalysis.gapScore || 0}%\n\n`;
        markdown += `### Top Competitors\n`;
        reportData.competitorGapAnalysis.topCompetitors?.forEach(c => {
          markdown += `- ${c.name} - ${c.url}\n`;
        });
        markdown += `\n### Opportunities\n`;
        reportData.competitorGapAnalysis.opportunities?.forEach(opp => {
          markdown += `- ${opp.opportunity} (Impact: ${opp.potentialImpact || 'Medium'})\n`;
        });
        markdown += `\n`;
      }
      
      if (reportData.executiveSummary) {
        markdown += `## 🎯 Executive Summary\n\n`;
        markdown += `${reportData.executiveSummary.verdict}\n\n`;
        markdown += `### Top 3 Priority Actions\n`;
        reportData.executiveSummary.priorityActions?.forEach((action, i) => {
          markdown += `${i+1}. ${action}\n`;
        });
        markdown += `\n`;
      }
      
      markdown += `---\n\n`;
      markdown += `*Generated by PROFITFORGE Pro SEO Engine v6.0*\n`;
      markdown += `*60-90 Day Actionable SEO Strategy*\n`;
      
      navigator.clipboard.writeText(markdown);
      toast.success('SEO Markdown copied! 📋', {
        icon: '✅',
        style: { background: '#1a1a2e', color: '#fff' }
      });
    } catch (error) {
      toast.error('Failed to export', { icon: '❌' });
    }
  };

  // ============ RENDER ============
  return (
    <main className="min-h-screen bg-[#080B12] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-40%] left-[-20%] w-[800px] h-[800px] bg-[#a78bfa]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-40%] right-[-20%] w-[800px] h-[800px] bg-[#2dd4bf]/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhNzhiZmEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:py-8 lg:py-12">
        
        {/* ============ HEADER ============ */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-[#a78bfa]/20 to-[#2dd4bf]/20 border border-white/10">
              <Brain className="w-8 h-8 text-[#a78bfa]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#a78bfa] via-white to-[#2dd4bf] bg-clip-text text-transparent">
                SEO Engine
              </span>
              <span className="text-white/40 text-2xl ml-2 font-light">Ultra</span>
            </h1>
          </div>
          
          <p className="text-gray-400 text-sm tracking-wider font-light flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#a78bfa]/50" />
            60-90 Day Actionable SEO Strategy
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#a78bfa]/50" />
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            <LiveStatus status={backendStatus} />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Groq Llama 3.1 70B</span>
            </div>
          </div>
        </motion.div>

        {/* ============ SEARCH FORM ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={`bg-[#0D1117]/90 backdrop-blur-2xl rounded-3xl border transition-all duration-500 ${
            isFocused ? 'border-[#a78bfa]/50 shadow-[0_0_60px_-12px_rgba(167,139,250,0.15)]' : 'border-white/5 shadow-xl'
          } p-6 sm:p-8`}>
            
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Search className="w-3 h-3" />
                      Product / Service Name
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="e.g., organic skincare, dropshipping..."
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]/50 transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      Target Market
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#a78bfa]/50 transition-all duration-300 appearance-none cursor-pointer"
                      disabled={isLoading}
                    >
                      <option value="US">🇺🇸 United States ($)</option>
                      <option value="UK">🇬🇧 United Kingdom (£)</option>
                      <option value="AE">🇦🇪 UAE (AED)</option>
                      <option value="IN">🇮🇳 India (₹)</option>
                      <option value="PK">🇵🇰 Pakistan (Rs.)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <LinkIcon className="w-3 h-3" />
                      Website URL <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]/50 transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Gauge className="w-3 h-3" />
                      Current SEO Status
                    </label>
                    <select
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#a78bfa]/50 transition-all duration-300 appearance-none cursor-pointer"
                      disabled={isLoading}
                    >
                      <option value="New site">🆕 New Site</option>
                      <option value="Existing">📈 Existing (1-12 months)</option>
                      <option value="Established">🏆 Established (12+ months)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || backendStatus === 'offline'}
                    className="relative w-full group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#a78bfa] to-[#2dd4bf] rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#a78bfa] to-[#2dd4bf] rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    
                    <div className="relative flex items-center justify-center gap-3 px-6 py-4 text-white font-semibold text-sm sm:text-base">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Generating SEO Strategy...</span>
                          <span className="text-white/60 text-xs">{Math.round(progress)}%</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" />
                          <span>Generate SEO Strategy</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </form>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4"
                >
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#a78bfa] to-[#2dd4bf] rounded-full"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Analyzing SEO Factors</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ============ RESULTS ============ */}
        <div ref={resultsRef} className="mt-8">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-[#a78bfa] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-[#a78bfa] animate-pulse" />
                    </div>
                  </div>
                  <p className="text-gray-400 mt-6 text-lg font-medium">Crafting Your SEO Strategy...</p>
                  <p className="text-gray-500 text-sm mt-2">Analyzing keywords, competitors, and market gaps</p>
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-[#2dd4bf]" /> Keyword Research</span>
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-[#2dd4bf]" /> Competitor Analysis</span>
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-[#2dd4bf]" /> Content Strategy</span>
                  </div>
                </div>
              </motion.div>
            )}

            {!isLoading && hasSearched && reportData && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Export Buttons */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <button
                    onClick={exportMarkdown}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-300 transition-all hover:scale-105"
                  >
                    <FileText className="w-4 h-4" />
                    Copy Markdown
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(reportData, null, 2));
                      toast.success('JSON copied!', { icon: '✅' });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-300 transition-all hover:scale-105"
                  >
                    <FileJson className="w-4 h-4" />
                    Copy JSON
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `seo-${searchQuery.replace(/\s/g, '-')}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success('JSON downloaded!', { icon: '✅' });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-300 transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    Download JSON
                  </button>
                </div>

                <SEOReport data={reportData} />
              </motion.div>
            )}

            {!isLoading && hasSearched && !reportData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
                  <AlertCircle className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No SEO Strategy Generated</h3>
                <p className="text-gray-400 text-sm">Try searching for a different product or service</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============ HISTORY ============ */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 bg-[#0D1117]/80 backdrop-blur-2xl rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent SEO Reports
              </h3>
              <span className="text-xs text-gray-500">{history.length} items</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.slice(0, 8).map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const product = item.seoData?.productName;
                    if (product) setSearchQuery(product);
                  }}
                  className="group px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-300 transition-all duration-300 border border-white/5 hover:border-[#a78bfa]/20 flex items-center gap-2"
                >
                  <span>{item.seoData?.productName || 'Unknown'}</span>
                  <span className="text-gray-500 text-[10px]">{item.seoData?.country || 'Global'}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#a78bfa]" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
