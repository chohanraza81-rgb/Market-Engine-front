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
  Star, Gem, Flame, Layers, Cpu, Gauge
} from 'lucide-react';
import SearchEngineSelector from '../components/SearchEngineSelector';
import PremiumReport from '../components/PremiumReport';
import LiveStatus from '../components/LiveStatus';
import SEOReport from '../components/SEOReport';

export default function Home() {
  // ============ STATE ============
  const [activeEngine, setActiveEngine] = useState('data-hack');
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState('US');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [currentStatus, setCurrentStatus] = useState('New site');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [backendStatus, setBackendStatus] = useState('offline');
  const [hasSearched, setHasSearched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [progress, setProgress] = useState(0);
  const resultsRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://market-engine-back-production.up.railway.app';

  // ============ BACKEND HEALTH CHECK ============
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/health`);
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
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
    if (activeEngine === 'data-hack') {
      fetchHistory();
    } else {
      fetchSEOHistory();
    }
  }, [activeEngine]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const fetchSEOHistory = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/seo/history`);
      if (response.ok) {
        const data = await response.json();
        setSearchHistory(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch SEO history:', error);
    }
  };

  // ============ PROGRESS SIMULATION ============
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 8 + 2;
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
      const endpoint = activeEngine === 'data-hack' ? '/api/search' : '/api/seo';
      const body = activeEngine === 'data-hack' 
        ? { product: searchQuery, country }
        : { product: searchQuery, country, websiteUrl, currentStatus };

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Analysis failed', {
          icon: '❌',
          style: { background: '#1a1a2e', color: '#fff' }
        });
        throw new Error(data.message || 'Analysis failed');
      }

      if (data.success && data.data) {
        setReportData(data.data);
        toast.success('Analysis complete! 🎯', {
          icon: '✅',
          style: { background: '#1a1a2e', color: '#fff' }
        });
        
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
        
        activeEngine === 'data-hack' ? fetchHistory() : fetchSEOHistory();
      } else {
        toast.error(data.error || 'No data received', {
          icon: '⚠️',
          style: { background: '#1a1a2e', color: '#fff' }
        });
      }

    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.message || 'Failed to analyze', {
        icon: '🔥',
        style: { background: '#1a1a2e', color: '#fff' }
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  // ============ RENDER ============
  return (
    <main className="min-h-screen bg-[#080B12] relative overflow-hidden">
      {/* ============ BACKGROUND EFFECTS ============ */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-40%] left-[-20%] w-[800px] h-[800px] bg-[#2dd4bf]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-40%] right-[-20%] w-[800px] h-[800px] bg-[#a78bfa]/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2dd4bf]/3 rounded-full blur-[120px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyY2NkYmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:py-8 lg:py-12">
        
        {/* ============ HEADER ============ */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          {/* Logo */}
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-[#2dd4bf]/20 to-[#a78bfa]/20 border border-white/10">
              <Crown className="w-8 h-8 text-[#2dd4bf]" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-[#2dd4bf] via-white to-[#a78bfa] bg-clip-text text-transparent">
                PROFITFORGE
              </span>
              <span className="text-white/40 text-2xl ml-2 font-light">Pro</span>
            </h1>
          </div>
          
          <p className="text-gray-400 text-sm sm:text-base tracking-wider font-light flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#2dd4bf]/50" />
            Market Intelligence
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#2dd4bf]/50" />
          </p>
          
          {/* Status Bar */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <LiveStatus status={backendStatus} />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Live</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>v6.0</span>
            </div>
          </div>
        </motion.div>

        {/* ============ ENGINE SELECTOR ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <SearchEngineSelector 
            activeEngine={activeEngine}
            setActiveEngine={setActiveEngine}
          />
        </motion.div>

        {/* ============ SEARCH FORM ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <div className={`bg-[#0D1117]/90 backdrop-blur-2xl rounded-3xl border transition-all duration-500 ${
            isFocused ? 'border-[#2dd4bf]/50 shadow-[0_0_60px_-12px_rgba(45,212,191,0.15)]' : 'border-white/5 shadow-xl'
          } p-6 sm:p-8`}>
            
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 gap-4">
                {/* Main Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Product Input */}
                  <div className="md:col-span-2 relative">
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Search className="w-3 h-3" />
                      {activeEngine === 'data-hack' ? 'Product Name' : 'Product / Service'}
                    </label>
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#2dd4bf]/10 to-[#a78bfa]/10 transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={activeEngine === 'data-hack' 
                          ? 'e.g., wireless earbuds, gaming laptop...' 
                          : 'e.g., organic skincare brand...'}
                        className="relative w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#2dd4bf]/50 transition-all duration-300 text-sm sm:text-base"
                        disabled={isLoading}
                      />
                      {searchQuery && !isLoading && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          <ChevronDown className="w-4 h-4 rotate-45" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Country Select */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      Target Market
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2dd4bf]/50 transition-all duration-300 appearance-none cursor-pointer text-sm sm:text-base"
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

                {/* SEO Additional Fields */}
                <AnimatePresence>
                  {activeEngine === 'seo' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
                    >
                      <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Link className="w-3 h-3" />
                          Website URL <span className="text-gray-500 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="url"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#2dd4bf]/50 transition-all duration-300 text-sm sm:text-base"
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
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2dd4bf]/50 transition-all duration-300 appearance-none cursor-pointer text-sm sm:text-base"
                          disabled={isLoading}
                        >
                          <option value="New site">🆕 New Site</option>
                          <option value="Existing">📈 Existing (1-12 months)</option>
                          <option value="Established">🏆 Established (12+ months)</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || backendStatus === 'offline'}
                    className="relative w-full group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    
                    <div className="relative flex items-center justify-center gap-3 px-6 py-4 text-white font-semibold text-sm sm:text-base">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Analyzing Market Data...</span>
                          <span className="text-white/60 text-xs">{Math.round(progress)}%</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" />
                          <span>{activeEngine === 'data-hack' ? 'Analyze Product' : 'Generate SEO Report'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </form>

            {/* Progress Bar */}
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
                      className="h-full bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] rounded-full"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Processing</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ============ RESULTS SECTION ============ */}
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
                    <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-[#2dd4bf] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#2dd4bf] animate-pulse" />
                    </div>
                  </div>
                  <p className="text-gray-400 mt-6 text-lg font-medium">
                    {activeEngine === 'data-hack' ? 'Mining Market Intelligence...' : 'Crafting SEO Strategy...'}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {activeEngine === 'data-hack' 
                      ? 'Analyzing real-time data from 40+ sources' 
                      : 'Generating 60-90 day actionable roadmap'}
                  </p>
                </div>
              </motion.div>
            )}

            {!isLoading && hasSearched && reportData && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4"
              >
                {activeEngine === 'data-hack' ? (
                  <PremiumReport data={reportData} />
                ) : (
                  <SEOReport data={reportData} />
                )}
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
                <h3 className="text-xl font-semibold text-white mb-2">No Results to Display</h3>
                <p className="text-gray-400 text-sm">Try searching for a different product or service</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============ HISTORY SECTION ============ */}
        {(history.length > 0 || searchHistory.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 bg-[#0D1117]/80 backdrop-blur-2xl rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {activeEngine === 'data-hack' ? 'Recent Searches' : 'Recent SEO Reports'}
              </h3>
              <span className="text-xs text-gray-500">
                {(activeEngine === 'data-hack' ? history : searchHistory).length} items
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(activeEngine === 'data-hack' ? history : searchHistory).slice(0, 8).map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const product = item.productName || item.seoData?.productName;
                    if (product) {
                      setSearchQuery(product);
                    }
                  }}
                  className="group px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-300 transition-all duration-300 border border-white/5 hover:border-[#2dd4bf]/20 flex items-center gap-2"
                >
                  <span>{item.productName || item.seoData?.productName || 'Unknown'}</span>
                  <span className="text-gray-500 text-[10px]">
                    {item.country || item.seoData?.country}
                  </span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2dd4bf]" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
