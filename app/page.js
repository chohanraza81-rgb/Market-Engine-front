'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Globe, Loader2, Zap } from 'lucide-react';
import PremiumReport from '../components/PremiumReport';
import SEOReport from '../components/SEOReport';
import LiveStatus from '../components/LiveStatus';
import SearchEngineSelector from '../components/SearchEngineSelector';
import toast from 'react-hot-toast';

export default function Home() {
  const [activeEngine, setActiveEngine] = useState('datahack');
  const [product, setProduct] = useState('');
  const [country, setCountry] = useState('us');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [currentStatus, setCurrentStatus] = useState('new');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [seoReport, setSeoReport] = useState(null);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!product.trim()) return;

    setLoading(true);
    setError('');
    setReport(null);
    setSeoReport(null);
    setLogs([]);

    if (activeEngine === 'datahack') {
      await handleDataHackSearch();
    } else {
      await handleSEOSearch();
    }
  };

  const handleDataHackSearch = async () => {
    addLog(`Initiating deep scan for "${product}"...`, 'start');
    await new Promise(r => setTimeout(r, 400));
    addLog(`Connecting to SerpAPI (${country.toUpperCase()} market)...`, 'info');
    await new Promise(r => setTimeout(r, 600));
    addLog('Scraping competitor pages & prices...', 'scrape');
    await new Promise(r => setTimeout(r, 800));

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search`, {
        product: product.trim(),
        country,
      });

      if (res.data.success) {
        addLog('AI Calculating Arbitrage & Market Gaps...', 'ai');
        await new Promise(r => setTimeout(r, 500));
        addLog('Generating Advanced Data-Rich Report...', 'generate');
        await new Promise(r => setTimeout(r, 400));
        addLog('✅ Analysis Completed! Strong Data Ready.', 'success');
        setReport(res.data.data);
        toast.success('Analysis complete! Real data loaded.');
      } else {
        throw new Error(res.data.error || 'Analysis failed');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Network error.';
      setError(msg);
      addLog(`❌ Error: ${msg}`, 'error');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSEOSearch = async () => {
    addLog(`Generating SEO strategy for "${product}"...`, 'start');
    await new Promise(r => setTimeout(r, 400));
    addLog(`Connecting to Groq AI (${country.toUpperCase()} market)...`, 'info');
    await new Promise(r => setTimeout(r, 600));

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seo`, {
        product: product.trim(),
        country,
        websiteUrl: websiteUrl || undefined,
        currentStatus: currentStatus || 'new'
      });

      if (res.data.success) {
        addLog('AI Generating SEO Strategy...', 'ai');
        await new Promise(r => setTimeout(r, 500));
        addLog('✅ SEO Strategy Generated!', 'success');
        setSeoReport(res.data.data);
        toast.success('SEO strategy generated!');
      } else {
        throw new Error(res.data.error || 'SEO analysis failed');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Network error.';
      setError(msg);
      addLog(`❌ Error: ${msg}`, 'error');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* ========== HEADER ========== */}
      <div className="flex justify-between items-center mb-6 border-b border-[#2dd4bf]/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf]/10 flex items-center justify-center border border-[#2dd4bf]/30">
            <Zap size={18} className="text-[#2dd4bf]" />
          </div>
          <h1 className="text-2xl font-bold cyber-glow-text tracking-tight">PROFITFORGE</h1>
          <span className="text-[10px] font-mono bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded border border-[#2dd4bf]/20">Pro</span>
        </div>
        <LiveStatus />
      </div>

      {/* ========== ENGINE SELECTOR (ONLY ONCE) ========== */}
      <div className="mb-6">
        <SearchEngineSelector activeEngine={activeEngine} onEngineChange={setActiveEngine} />
      </div>

      {/* ========== HERO ========== */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="cyber-glow-text">
            {activeEngine === 'datahack' ? 'Real-Time Arbitrage Engine' : 'SEO Engine Ultra'}
          </span>
        </h2>
        <p className="text-gray-400 mt-1 font-mono text-sm">
          {activeEngine === 'datahack' 
            ? 'Advanced Data Model — IN, PK, AE, UK, US Markets' 
            : '60-90 Day Actionable SEO Strategy'}
        </p>
      </div>

      {/* ========== SEARCH FORM ========== */}
      <div className="max-w-3xl mx-auto cyber-card rounded-2xl p-6 border border-[#2dd4bf]/10">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder={activeEngine === 'datahack' ? 'e.g., Best Laptops for students' : 'e.g., How to start a new business'}
              className="flex-1 bg-[#0F172A] border border-[#2dd4bf]/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/50 font-mono text-sm"
              disabled={loading}
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="md:w-44 bg-[#0F172A] border border-[#2dd4bf]/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/50 font-mono text-sm"
              disabled={loading}
            >
              <option value="us">🇺🇸 USA (USD)</option>
              <option value="uk">🇬🇧 UK (GBP)</option>
              <option value="ae">🇦🇪 UAE (AED)</option>
              <option value="in">🇮🇳 India (INR)</option>
              <option value="pk">🇵🇰 Pakistan (PKR)</option>
            </select>
          </div>

          {activeEngine === 'seo' && (
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Website URL (optional)"
                className="flex-1 bg-[#0F172A] border border-[#2dd4bf]/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/50 font-mono text-sm"
                disabled={loading}
              />
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="md:w-44 bg-[#0F172A] border border-[#2dd4bf]/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/50 font-mono text-sm"
                disabled={loading}
              >
                <option value="new">New Site</option>
                <option value="existing">Existing (Needs SEO)</option>
                <option value="established">Established (Top 50)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !product}
            className="bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] hover:from-[#14b8a6] hover:to-[#8b5cf6] text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 min-w-[160px] transition font-mono mx-auto"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} /> {activeEngine === 'datahack' ? 'HACK DATA' : 'GENERATE SEO'}</>}
          </button>
        </form>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="mt-6 bg-[#0F172A] rounded-xl p-4 border border-[#2dd4bf]/5 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[70px]">[{log.time}]</span>
                <span className={`${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-[#34d399]' :
                  log.type === 'start' ? 'text-[#2dd4bf]' :
                  log.type === 'scrape' ? 'text-yellow-400' :
                  log.type === 'ai' ? 'text-[#a78bfa]' :
                  'text-gray-400'
                }`}>
                  {log.msg}
                </span>
                {log.type === 'info' && <span className="typing-dot ml-1">...</span>}
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* ========== REPORT AREA ========== */}
      {activeEngine === 'datahack' && report && <PremiumReport data={report} />}
      {activeEngine === 'seo' && seoReport && <SEOReport data={seoReport} />}

      {/* Empty State */}
      {activeEngine === 'seo' && !seoReport && !loading && !error && (
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <div className="cyber-card rounded-2xl p-12 border border-[#2dd4bf]/10">
            <Search size={48} className="text-[#2dd4bf]/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No SEO Strategy Generated</h3>
            <p className="text-sm text-gray-500 mt-2">Enter a product or service to generate a 60-90 day SEO strategy</p>
          </div>
        </div>
      )}
    </main>
  );
}
