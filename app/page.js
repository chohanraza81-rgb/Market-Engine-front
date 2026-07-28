'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Globe, Loader2, Zap, Terminal } from 'lucide-react';
import PremiumReport from '../components/PremiumReport';
import LiveStatus from '../components/LiveStatus';
import toast from 'react-hot-toast';

export default function Home() {
  const [product, setProduct] = useState('');
  const [country, setCountry] = useState('us');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!product.trim()) return;
    setLoading(true); setError(''); setReport(null); setLogs([]);
    
    addLog(`Initiating deep scan for "${product}"...`, 'start');
    await new Promise(r => setTimeout(r, 400));
    addLog(`Connecting to SerpAPI (${country.toUpperCase()} market)...`, 'info');
    await new Promise(r => setTimeout(r, 600));
    addLog('Scraping competitor pages & prices...', 'scrape');
    await new Promise(r => setTimeout(r, 800));

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search`, { product: product.trim(), country });
      if (res.data.success) {
        addLog('AI Calculating Arbitrage & Market Gaps...', 'ai');
        await new Promise(r => setTimeout(r, 500));
        addLog('Generating Advanced Data-Rich Report...', 'generate');
        await new Promise(r => setTimeout(r, 400));
        addLog('✅ Analysis Completed! Strong Data Ready.', 'success');
        setReport(res.data.data);
        toast.success('Analysis complete! Real data loaded.');
      } else throw new Error(res.data.error);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Network error.';
      setError(msg); addLog(`❌ Error: ${msg}`, 'error'); toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-[#2dd4bf]/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf]/10 flex items-center justify-center border border-[#2dd4bf]/30">
            <Zap size={18} className="text-[#2dd4bf]" />
          </div>
          <h1 className="text-2xl font-bold cyber-glow-text tracking-tight">PROFITFORGE</h1>
          <span className="text-[10px] font-mono bg-[#2dd4bf]/10 text-[#2dd4bf] px-2 py-0.5 rounded border border-[#2dd4bf]/20">V5.0-ADV</span>
        </div>
        <LiveStatus />
      </div>

      {/* Hero */}
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
          <span className="cyber-glow-text">Real-Time Arbitrage Engine</span>
        </h2>
        <p className="text-gray-400 mt-2 font-mono text-sm">Advanced Data Model — IN, PK, AE, UK, US Markets</p>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto cyber-card rounded-2xl p-6 border border-[#2dd4bf]/10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g., Best Quality shoes in India" className="flex-1 bg-[#0F172A] border border-[#2dd4bf]/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/50 font-mono text-sm" disabled={loading} />
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="md:w-48 bg-[#0F172A] border border-[#2dd4bf]/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/50 font-mono text-sm" disabled={loading}>
            <option value="us">🇺🇸 USA (USD)</option>
            <option value="uk">🇬🇧 UK (GBP)</option>
            <option value="ae">🇦🇪 UAE (AED)</option>
            <option value="in">🇮🇳 India (INR)</option>
            <option value="pk">🇵🇰 Pakistan (PKR)</option>
          </select>
          <button type="submit" disabled={loading || !product} className="bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] hover:from-[#14b8a6] hover:to-[#8b5cf6] text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 min-w-[160px] transition font-mono">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} /> HACK DATA</>}
          </button>
        </form>
        
        {logs.length > 0 && (
          <div className="mt-6 bg-[#0F172A] rounded-xl p-4 border border-[#2dd4bf]/5 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[70px]">[{log.time}]</span>
                <span className={`${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-[#34d399]' : log.type === 'start' ? 'text-[#2dd4bf]' : log.type === 'scrape' ? 'text-yellow-400' : log.type === 'ai' ? 'text-[#a78bfa]' : 'text-gray-400'}`}>{log.msg}</span>
                {log.type === 'info' && <span className="typing-dot ml-1">...</span>}
              </div>
            ))}
          </div>
        )}
        {error && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono">⚠️ {error}</div>}
      </div>

      {report && <PremiumReport data={report} />}
    </main>
  );
    }
