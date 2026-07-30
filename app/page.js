'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SearchEngineSelector from '../components/SearchEngineSelector';
import PremiumReport from '../components/PremiumReport';
import LiveStatus from '../components/LiveStatus';
import SEOReport from '../components/SEOReport';

export default function Home() {
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
  const resultsRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://market-engine.up.railway.app';

  // Check backend status
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
        console.error('Backend health check failed:', error);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, [BACKEND_URL]);

  // Fetch search history
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

  // Handle search (Data Hack)
  const handleDataHackSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    if (backendStatus === 'offline') {
      toast.error('Backend is offline. Please try again later.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setReportData(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: searchQuery,
          country: country
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Show EXACT error - NO DUMMY DATA
        toast.error(data.message || 'Search failed');
        throw new Error(data.message || 'Search failed');
      }

      if (data.success && data.data) {
        setReportData(data.data);
        toast.success('Analysis complete!');
        
        // Scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
        
        // Refresh history
        fetchHistory();
      } else {
        toast.error(data.error || 'No data received');
      }

    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.message || 'Failed to analyze product');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle SEO analysis
  const handleSEOSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a product or service name');
      return;
    }

    if (backendStatus === 'offline') {
      toast.error('Backend is offline. Please try again later.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setReportData(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: searchQuery,
          country: country,
          websiteUrl: websiteUrl || null,
          currentStatus: currentStatus
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Show EXACT error - NO DUMMY DATA
        toast.error(data.message || 'SEO analysis failed');
        throw new Error(data.message || 'SEO analysis failed');
      }

      if (data.success && data.data) {
        setReportData(data.data);
        toast.success('SEO analysis complete!');
        
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
        
        fetchSEOHistory();
      } else {
        toast.error(data.error || 'No SEO data received');
      }

    } catch (error) {
      console.error('SEO analysis error:', error);
      toast.error(error.message || 'Failed to generate SEO report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080B12]">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-[#2dd4bf]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-[#a78bfa]/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:py-8 lg:py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
          >
            <span className="bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] bg-clip-text text-transparent">
              PROFITFORGE Pro
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-2 text-sm sm:text-base"
          >
            Market Intelligence
          </motion.p>
          
          <div className="flex items-center justify-center gap-4 mt-3">
            <LiveStatus status={backendStatus} />
          </div>
        </div>

        {/* Engine Selector */}
        <SearchEngineSelector 
          activeEngine={activeEngine}
          setActiveEngine={setActiveEngine}
        />

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 mb-6"
        >
          <form onSubmit={activeEngine === 'data-hack' ? handleDataHackSearch : handleSEOSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Product Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {activeEngine === 'data-hack' ? 'Product Name' : 'Product/Service Name'}
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeEngine === 'data-hack' ? 'e.g., e-bikes, wireless earbuds' : 'e.g., organic skincare'}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#2dd4bf] transition-colors"
                  disabled={isLoading}
                />
              </div>

              {/* Country Select */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target Market</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2dd4bf] transition-colors"
                  disabled={isLoading}
                >
                  <option value="US">🇺🇸 USA ($)</option>
                  <option value="UK">🇬🇧 UK (£)</option>
                  <option value="AE">🇦🇪 UAE (AED)</option>
                  <option value="IN">🇮🇳 India (₹)</option>
                  <option value="PK">🇵🇰 Pakistan (Rs.)</option>
                </select>
              </div>

              {/* SEO Additional Fields */}
              {activeEngine === 'seo' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Website URL (Optional)</label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#2dd4bf] transition-colors"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Current SEO Status</label>
                    <select
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2dd4bf] transition-colors"
                      disabled={isLoading}
                    >
                      <option value="New site">🆕 New Site</option>
                      <option value="Existing">📈 Existing (1-12 months)</option>
                      <option value="Established">🏆 Established (12+ months)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Search Button */}
              <div className={activeEngine === 'data-hack' ? 'md:col-span-1' : 'md:col-span-4'}>
                <button
                  type="submit"
                  disabled={isLoading || backendStatus === 'offline'}
                  className="w-full px-6 py-2.5 mt-6 bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] text-white font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    activeEngine === 'data-hack' ? 'Analyze Product' : 'Generate SEO Report'
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Results Section */}
        <div ref={resultsRef}>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#2dd4bf] border-t-transparent" />
                <p className="text-gray-400 mt-4">
                  {activeEngine === 'data-hack' ? 'Analyzing market data...' : 'Generating SEO strategy...'}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {activeEngine === 'data-hack' ? 'This may take 15-20 seconds' : 'This may take 15-20 seconds'}
                </p>
              </div>
            </motion.div>
          )}

          {!isLoading && hasSearched && reportData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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
              className="text-center py-12"
            >
              <p className="text-gray-400">No results to display</p>
              <p className="text-gray-500 text-sm mt-1">Try searching for a different product</p>
            </motion.div>
          )}
        </div>

        {/* History Section */}
        {(history.length > 0 || searchHistory.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6"
          >
            <h3 className="text-sm font-medium text-gray-400 mb-4">
              {activeEngine === 'data-hack' ? 'Recent Searches' : 'Recent SEO Reports'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(activeEngine === 'data-hack' ? history : searchHistory).slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const product = item.productName || item.seoData?.productName;
                    if (product) {
                      setSearchQuery(product);
                    }
                  }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-colors"
                >
                  {item.productName || item.seoData?.productName || 'Unknown'}
                  <span className="text-gray-500 ml-1">
                    {item.country || item.seoData?.country}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
