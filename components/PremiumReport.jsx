'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3, 
  Download, Copy, FileJson, FileText, 
  ChevronDown, ChevronRight, CheckCircle, XCircle, 
  AlertCircle, Zap, Shield, Star, Users, Award,
  Target, Clock, Globe, ShoppingBag, PieChart,
  Sparkles, Crown, Gem, Flame, Rocket, Brain,
  Gauge, Compass, Radar, Activity, Layers,
  ArrowUp, ArrowDown, Minus, Percent, Hash,
  ExternalLink, Link, Mail, Share2, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PremiumReport = ({ data, onExport }) => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    pricing: true,
    competitors: true,
    market: true,
    sentiment: true,
    strategy: true,
    insights: true
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  // ============ TOGGLE SECTION ============
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ============ SCORE UTILITIES ============
  const getScoreColor = (score) => {
    if (score >= 70) return '#34d399';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Aggressive Entry 🚀';
    if (score >= 50) return 'Test Waters ⚡';
    return 'Avoid ⚠️';
  };

  // ============ FORMAT HELPERS ============
  const formatCurrency = (amount, currency = '₹') => {
    if (!amount) return 'N/A';
    // Indian number formatting
    const num = Number(amount);
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(num);
  };

  const formatPercent = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `${value}%`;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    const formatter = new Intl.NumberFormat('en-IN');
    return formatter.format(num);
  };

  // ============ CALCULATE ROI & PROFIT ============
  const calculateROI = (avgPrice, minPrice) => {
    if (!avgPrice || !minPrice || minPrice === 0) return 0;
    const roi = ((avgPrice - minPrice) / minPrice) * 100;
    return Math.round(roi);
  };

  const calculateProfit = (avgPrice, minPrice) => {
    if (!avgPrice || !minPrice) return 0;
    return Math.round(avgPrice - minPrice);
  };

  // ============ EXPORT MARKDOWN - COMPLETE ============
  const exportMarkdown = () => {
    try {
      const roi = calculateROI(data.avgPrice, data.minPrice);
      const profit = calculateProfit(data.avgPrice, data.minPrice);
      
      let markdown = `# 📊 PROFITFORGE Pro - Market Intelligence Report\n\n`;
      markdown += `## 🎯 Product: ${data.productName || 'N/A'}\n`;
      markdown += `## 🌍 Market: ${data.country || 'N/A'}\n`;
      markdown += `## 📅 Generated: ${new Date(data.generatedAt).toLocaleString()}\n\n`;
      
      markdown += `---\n\n`;
      
      // EXECUTIVE SUMMARY
      markdown += `## 🚀 Executive Summary\n\n`;
      markdown += `**Action Score:** ${data.actionScore || 0}% - ${getScoreLabel(data.actionScore || 0)}\n\n`;
      markdown += `**Market Heat:** ${data.marketScore || 0}%\n\n`;
      markdown += `**ROI Potential:** ${roi}%\n\n`;
      markdown += `**Estimated Profit:** ${formatCurrency(profit)}\n\n`;
      
      // PRICE ANALYSIS
      markdown += `## 💰 Price Analysis\n\n`;
      markdown += `| Metric | Value |\n`;
      markdown += `|--------|-------|\n`;
      markdown += `| Average Price | ${formatCurrency(data.avgPrice)} |\n`;
      markdown += `| Minimum Price | ${formatCurrency(data.minPrice)} |\n`;
      markdown += `| Maximum Price | ${formatCurrency(data.maxPrice)} |\n`;
      markdown += `| Price Spread | ${formatCurrency(data.priceSpread)} |\n`;
      markdown += `| Total Products | ${data.prices?.length || 0} |\n`;
      markdown += `| After Filtering | ${data.filteredCompetitors || data.prices?.length || 0} |\n`;
      markdown += `| Outliers Removed | ${data.outlierRemoved || 0} |\n\n`;
      
      // COMPETITORS
      markdown += `## 🏪 Top Competitors\n\n`;
      markdown += `| # | Competitor | Price | Rating |\n`;
      markdown += `|---|------------|-------|--------|\n`;
      if (data.competitors && data.competitors.length > 0) {
        data.competitors.slice(0, 15).forEach((c, i) => {
          const name = c.title || c.name || 'Unknown';
          const price = formatCurrency(c.price);
          const rating = c.rating || 'N/A';
          markdown += `| ${i+1} | ${name.substring(0, 50)}... | ${price} | ${rating} |\n`;
        });
      }
      markdown += `\n*${data.competitors?.length || 0} total competitors*\n\n`;
      
      // MARKET METRICS
      markdown += `## 📊 Market Metrics\n\n`;
      markdown += `| Metric | Score |\n`;
      markdown += `|--------|-------|\n`;
      markdown += `| Market Heat | ${data.marketScore || 0}% |\n`;
      markdown += `| Action Score | ${data.actionScore || 0}% |\n`;
      markdown += `| ROI Potential | ${roi}% |\n`;
      markdown += `| Profit Margin | ${data.profitMargin || 0}% |\n`;
      markdown += `| Urgency | ${data.urgencyScore || 0}% |\n\n`;
      
      // AI INSIGHTS
      if (data.aiInsights) {
        markdown += `## 🧠 AI-Powered Insights\n\n`;
        if (data.aiInsights.targetDemographic) {
          markdown += `**Target Demographic:** ${data.aiInsights.targetDemographic}\n\n`;
        }
        if (data.aiInsights.recommendedPricing) {
          markdown += `**Recommended Pricing:** ${data.aiInsights.recommendedPricing}\n\n`;
        }
        if (data.aiInsights.marketingAngles && data.aiInsights.marketingAngles.length > 0) {
          markdown += `**Ad Headlines:**\n`;
          data.aiInsights.marketingAngles.forEach(angle => {
            markdown += `- ${angle}\n`;
          });
          markdown += `\n`;
        }
        if (data.aiInsights.keyInsights && data.aiInsights.keyInsights.length > 0) {
          markdown += `**Key Insights:**\n`;
          data.aiInsights.keyInsights.forEach(insight => {
            markdown += `- ${insight}\n`;
          });
          markdown += `\n`;
        }
      }
      
      markdown += `---\n\n`;
      markdown += `*Generated by PROFITFORGE Pro v6.0 - Market Intelligence*\n`;
      markdown += `*100% Real Data - No Dummy Data*\n`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(markdown);
      toast.success('Complete Markdown copied! 📋', {
        icon: '✅',
        style: { background: '#1a1a2e', color: '#fff' }
      });
      
    } catch (error) {
      toast.error('Failed to export Markdown', {
        icon: '❌',
        style: { background: '#1a1a2e', color: '#fff' }
      });
    }
  };

  // ============ EXPORT CSV ============
  const exportCSV = () => {
    try {
      const headers = ['Product', 'Price', 'Source', 'Rating', 'Reviews'];
      const rows = data.competitors?.map(c => [
        (c.title || c.name || 'Unknown').replace(/,/g, ' '),
        c.price || 0,
        c.source && c.source !== 'N/A' ? c.source : 'Various',
        c.rating || 0,
        c.reviews || 0
      ]) || [];
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.productName || 'report'}-data.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('CSV exported successfully! 📊', {
        icon: '✅',
        style: { background: '#1a1a2e', color: '#fff' }
      });
    } catch (error) {
      toast.error('Failed to export CSV', {
        icon: '❌',
        style: { background: '#1a1a2e', color: '#fff' }
      });
    }
  };

  // ============ EXPORT PDF ============
  const exportPDF = async () => {
    if (!reportRef.current) {
      toast.error('Report not ready', {
        icon: '⚠️',
        style: { background: '#1a1a2e', color: '#fff' }
      });
      return;
    }

    setIsExporting(true);
    toast.loading('Generating PDF...', {
      id: 'pdf-export',
      style: { background: '#1a1a2e', color: '#fff' }
    });

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#080B12',
        windowHeight: 2000,
        windowWidth: 1200
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
      
      pdf.save(`${data.productName || 'report'}-analysis.pdf`);
      
      toast.success('PDF downloaded successfully! 📄', {
        id: 'pdf-export',
        icon: '✅',
        style: { background: '#1a1a2e', color: '#fff' }
      });
    } catch (error) {
      toast.error('Failed to generate PDF', {
        id: 'pdf-export',
        icon: '❌',
        style: { background: '#1a1a2e', color: '#fff' }
      });
    } finally {
      setIsExporting(false);
    }
  };

  // ============ RENDER ============
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
            <AlertCircle className="w-12 h-12 text-gray-600" />
          </div>
          <p className="text-gray-400 text-lg">No data available</p>
          <p className="text-gray-500 text-sm mt-1">Run a new analysis to get started</p>
        </div>
      </div>
    );
  }

  // Calculate ROI and Profit
  const roi = calculateROI(data.avgPrice, data.minPrice);
  const profit = calculateProfit(data.avgPrice, data.minPrice);

  return (
    <motion.div
      ref={reportRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* ============ HEADER ============ */}
      <div className="bg-gradient-to-br from-[#0D1117] via-[#0D1117]/95 to-[#080B12] rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2dd4bf]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a78bfa]/5 rounded-full blur-[80px]" />
        <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-[#2dd4bf]/50 via-[#a78bfa]/50 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Product Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#2dd4bf]/20 to-[#a78bfa]/20 border border-white/10">
                <Crown className="w-6 h-6 text-[#2dd4bf]" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                  {data.productName || 'Product Analysis'}
                  <span className="text-xs px-3 py-1 bg-white/10 rounded-full text-gray-400 font-normal">
                    {data.country || 'Global'}
                  </span>
                </h2>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(data.generatedAt).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" />
                    {data.totalCompetitors || 0} competitors
                  </span>
                  <span className="text-sm text-[#2dd4bf] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {data.filteredCompetitors || data.prices?.length || 0} after filtering
                  </span>
                </div>
              </div>
            </div>

            {/* Score Gauges */}
            <div className="flex items-center gap-6">
              {/* Action Score */}
              <div className="text-center">
                <div className="relative w-20 h-20">
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
                      stroke={getScoreColor(data.actionScore || 0)}
                      fill="transparent"
                      r="32"
                      cx="40"
                      cy="40"
                      strokeDasharray={`${((data.actionScore || 0) / 100) * 200.96} 200.96`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white">{data.actionScore || 0}%</span>
                    <span className="text-[8px] text-gray-400 uppercase tracking-wider">Action</span>
                  </div>
                </div>
                <div className="mt-1 text-[10px] font-medium text-gray-400">
                  {getScoreLabel(data.actionScore || 0)}
                </div>
              </div>

              {/* Market Heat */}
              <div className="text-center">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      className="text-white/5"
                      strokeWidth="5"
                      stroke="currentColor"
                      fill="transparent"
                      r="26"
                      cx="32"
                      cy="32"
                    />
                    <circle
                      className="transition-all duration-1000"
                      strokeWidth="5"
                      stroke={data.marketScore >= 60 ? '#34d399' : data.marketScore >= 40 ? '#f59e0b' : '#ef4444'}
                      fill="transparent"
                      r="26"
                      cx="32"
                      cy="32"
                      strokeDasharray={`${((data.marketScore || 0) / 100) * 163.36} 163.36`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-white">{data.marketScore || 0}%</span>
                    <span className="text-[7px] text-gray-400 uppercase tracking-wider">Heat</span>
                  </div>
                </div>
              </div>

              {/* ROI */}
              <div className="text-center">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      className="text-white/5"
                      strokeWidth="5"
                      stroke="currentColor"
                      fill="transparent"
                      r="26"
                      cx="32"
                      cy="32"
                    />
                    <circle
                      className="transition-all duration-1000"
                      strokeWidth="5"
                      stroke={roi >= 30 ? '#34d399' : roi >= 15 ? '#f59e0b' : '#ef4444'}
                      fill="transparent"
                      r="26"
                      cx="32"
                      cy="32"
                      strokeDasharray={`${(Math.min(roi, 100) / 100) * 163.36} 163.36`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-white">{roi}%</span>
                    <span className="text-[7px] text-gray-400 uppercase tracking-wider">ROI</span>
                  </div>
                </div>
              </div>

              {/* Profit */}
              <div className="text-center">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      className="text-white/5"
                      strokeWidth="5"
                      stroke="currentColor"
                      fill="transparent"
                      r="26"
                      cx="32"
                      cy="32"
                    />
                    <circle
                      className="transition-all duration-1000"
                      strokeWidth="5"
                      stroke={profit > 0 ? '#34d399' : '#ef4444'}
                      fill="transparent"
                      r="26"
                      cx="32"
                      cy="32"
                      strokeDasharray={`100 163.36`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-white">{formatCurrency(profit)}</span>
                    <span className="text-[7px] text-gray-400 uppercase tracking-wider">Profit</span>
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex flex-col gap-1 ml-2">
                <button
                  onClick={exportPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-all hover:scale-105 disabled:opacity-50"
                >
                  <FileText className="w-3 h-3" />
                  PDF
                </button>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-all hover:scale-105"
                >
                  <FileJson className="w-3 h-3" />
                  CSV
                </button>
                <button
                  onClick={exportMarkdown}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-all hover:scale-105"
                >
                  <FileText className="w-3 h-3" />
                  MD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ EXECUTIVE SUMMARY ============ */}
      <div className="bg-gradient-to-r from-[#2dd4bf]/10 via-[#a78bfa]/5 to-transparent border border-[#2dd4bf]/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#2dd4bf]/5 rounded-full blur-[60px]" />
        <div className="relative flex items-start gap-4">
          <div className="p-3 rounded-xl bg-[#2dd4bf]/20 border border-[#2dd4bf]/30 flex-shrink-0">
            <Zap className="w-6 h-6 text-[#2dd4bf]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Executive Summary
              <span className="text-xs text-gray-500 font-normal">AI-Powered</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              <div>
                <p className="text-xs text-gray-400">Action Score</p>
                <p className="text-xl font-bold text-[#2dd4bf]">{data.actionScore || 0}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Market Heat</p>
                <p className="text-xl font-bold text-[#a78bfa]">{data.marketScore || 0}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">ROI Potential</p>
                <p className="text-xl font-bold text-[#34d399]">{roi}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Est. Profit</p>
                <p className="text-xl font-bold text-[#f59e0b]">{formatCurrency(profit)}</p>
              </div>
            </div>
            {data.aiInsights?.keyInsights && (
              <div className="mt-3 flex flex-wrap gap-2">
                {data.aiInsights.keyInsights.slice(0, 2).map((insight, i) => (
                  <span key={i} className="text-sm text-gray-300 flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#2dd4bf]" />
                    {insight}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ PRICE SPREAD CHART ============ */}
      {data.prices && data.prices.length > 0 && (
        <div className="bg-[#0D1117]/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('pricing')}
            className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#2dd4bf]/10 border border-[#2dd4bf]/20">
                <BarChart3 className="w-5 h-5 text-[#2dd4bf]" />
              </div>
              <div className="text-left">
                <span className="text-white font-medium">Price Spread Analysis</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  {data.prices.length} products • {formatCurrency(data.avgPrice)} average
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-400">Min: <span className="text-white">{formatCurrency(data.minPrice)}</span></span>
                <span className="text-gray-400">Max: <span className="text-white">{formatCurrency(data.maxPrice)}</span></span>
                <span className="text-gray-400">Spread: <span className="text-[#2dd4bf]">{formatCurrency(data.priceSpread)}</span></span>
              </div>
              {expandedSections.pricing ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {expandedSections.pricing && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 pt-0 border-t border-white/5">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {data.prices.slice(0, 25).map((price, i) => {
                      const max = Math.max(...data.prices);
                      const percentage = (price / max) * 100;
                      return (
                        <div key={i} className="flex items-center gap-3 group">
                          <span className="text-xs text-gray-500 w-8 text-right">{i+1}.</span>
                          <div className="flex-1 relative">
                            <div className="h-8 bg-white/5 rounded-lg overflow-hidden group-hover:bg-white/10 transition-colors">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.5, delay: i * 0.02 }}
                                className="h-full rounded-lg bg-gradient-to-r from-[#2dd4bf]/60 to-[#a78bfa]/40"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-white w-32 text-right font-mono">
                            {formatCurrency(price)}
                          </span>
                        </div>
                      );
                    })}
                    {data.prices.length > 25 && (
                      <div className="text-center text-xs text-gray-500 pt-2">
                        + {data.prices.length - 25} more products
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ============ COMPETITOR INTELLIGENCE ============ */}
      {data.competitors && data.competitors.length > 0 && (
        <div className="bg-[#0D1117]/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('competitors')}
            className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#a78bfa]/10 border border-[#a78bfa]/20">
                <Users className="w-5 h-5 text-[#a78bfa]" />
              </div>
              <div className="text-left">
                <span className="text-white font-medium">Competitor Intelligence</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  {data.competitors.length} competitors • {data.filteredCompetitors || data.competitors.length} after filtering
                </p>
              </div>
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
                <div className="p-5 pt-0 border-t border-white/5">
                  <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {data.competitors.slice(0, 20).map((competitor, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group border border-white/5 hover:border-white/10"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-xs text-gray-500 w-6">{i+1}.</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-white truncate font-medium">
                              {competitor.title || competitor.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {competitor.source && competitor.source !== 'N/A' && competitor.source !== 'Unknown source' 
                                ? competitor.source 
                                : 'Various sellers'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                          {competitor.rating > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-white">{competitor.rating}</span>
                              <span className="text-gray-500">({competitor.reviews || 0})</span>
                            </div>
                          )}
                          <span className="text-sm font-bold text-white min-w-[100px] text-right font-mono">
                            {formatCurrency(competitor.price || 0)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {data.competitors.length > 20 && (
                      <div className="text-center text-xs text-gray-500 py-2">
                        + {data.competitors.length - 20} more competitors
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ============ MARKET METRICS GRID ============ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0D1117]/90 backdrop-blur-xl rounded-2xl border border-white/5 p-5 text-center">
          <div className="inline-flex p-2 rounded-xl bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 mb-2">
            <Gauge className="w-5 h-5 text-[#2dd4bf]" />
          </div>
          <p className="text-2xl font-bold text-white">{data.marketScore || 0}%</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Market Heat</p>
        </div>

        <div className="bg-[#0D1117]/90 backdrop-blur-xl rounded-2xl border border-white/5 p-5 text-center">
          <div className="inline-flex p-2 rounded-xl bg-[#a78bfa]/10 border border-[#a78bfa]/20 mb-2">
            <Target className="w-5 h-5 text-[#a78bfa]" />
          </div>
          <p className="text-2xl font-bold text-white">{data.actionScore || 0}%</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Action Score</p>
        </div>

        <div className="bg-[#0D1117]/90 backdrop-blur-xl rounded-2xl border border-white/5 p-5 text-center">
          <div className="inline-flex p-2 rounded-xl bg-[#34d399]/10 border border-[#34d399]/20 mb-2">
            <TrendingUp className="w-5 h-5 text-[#34d399]" />
          </div>
          <p className="text-2xl font-bold text-white">{roi}%</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">ROI Potential</p>
        </div>

        <div className="bg-[#0D1117]/90 backdrop-blur-xl rounded-2xl border border-white/5 p-5 text-center">
          <div className="inline-flex p-2 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 mb-2">
            <Zap className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <p className="text-2xl font-bold text-white">{data.urgencyScore || 0}%</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Urgency</p>
        </div>
      </div>

      {/* ============ AI INSIGHTS ============ */}
      {data.aiInsights && (
        <div className="bg-gradient-to-br from-[#0D1117] to-[#080B12] rounded-2xl border border-white/10 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#a78bfa]/5 rounded-full blur-[60px]" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-[#a78bfa]/10 border border-[#a78bfa]/20">
                <Brain className="w-5 h-5 text-[#a78bfa]" />
              </div>
              <div>
                <h3 className="text-white font-medium">AI-Powered Insights</h3>
                <p className="text-xs text-gray-500">Powered by Groq Llama 3.1 70B</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.aiInsights.sentiment && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Sentiment Analysis</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400">Positive</span>
                      <span className="text-white font-medium">{data.aiInsights.sentiment.positive || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: `${data.aiInsights.sentiment.positive || 0}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-yellow-400">Neutral</span>
                      <span className="text-white font-medium">{data.aiInsights.sentiment.neutral || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${data.aiInsights.sentiment.neutral || 0}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-400">Negative</span>
                      <span className="text-white font-medium">{data.aiInsights.sentiment.negative || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${data.aiInsights.sentiment.negative || 0}%` }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {data.aiInsights.targetDemographic && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Target Demographic</p>
                    <p className="text-white text-sm">{data.aiInsights.targetDemographic}</p>
                  </div>
                )}
                {data.aiInsights.recommendedPricing && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Recommended Pricing</p>
                    <p className="text-white text-sm">{data.aiInsights.recommendedPricing}</p>
                  </div>
                )}
                {data.aiInsights.supplierSuggestion && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Supplier Suggestion</p>
                    <p className="text-white text-sm">{data.aiInsights.supplierSuggestion}</p>
                  </div>
                )}
              </div>
            </div>

            {data.aiInsights.marketingAngles && data.aiInsights.marketingAngles.length > 0 && (
              <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Ad Headlines & Marketing Angles</p>
                <div className="flex flex-wrap gap-2">
                  {data.aiInsights.marketingAngles.map((angle, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/10 rounded-lg text-sm text-gray-300 border border-white/5">
                      {angle}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ FOOTER ============ */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
        <div className="flex items-center gap-4">
          <span>PROFITFORGE Pro v6.0</span>
          <span>•</span>
          <span>Market Intelligence</span>
          <span>•</span>
          <span className="text-[#2dd4bf]">100% Real Data</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Generated: {new Date(data.generatedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* ============ CUSTOM SCROLLBAR ============ */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(45,212,191,0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(45,212,191,0.5);
        }
      `}</style>
    </motion.div>
  );
};

export default PremiumReport;
