'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Copy,
  FileText,
  CheckCircle,
  DollarSign,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Truck,
  Sparkles,
  Calendar,
  Hash,
  Users,
  MessageCircle,
  BarChart3,
  FileJson,
  FileSpreadsheet,
  FileCode,
  Download,
  ShieldCheck,
  Clock,
  Activity,
  Crown,
  Globe,
  Layers,
  Award,
  AlertCircle,
  ShoppingBag,
  Package,
  Mail,
  Search,
  TrendingUp as TrendingIcon,
  Heart,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Cell as PieCell
} from 'recharts';
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

const getLocalBrands = (country, category = 'general') => {
  const brands = {
    in: {
      general: ['Amazon.in', 'Flipkart', 'Tata', 'Reliance Digital', 'Croma'],
      car: ['Tata', 'Maruti', 'Hyundai', 'Toyota', 'Honda'],
      laptop: ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus'],
      shoes: ['Campus', 'Bata', 'Nike', 'Adidas', 'Puma'],
      bike: ['Hero', 'Bajaj', 'TVS', 'Royal Enfield', 'Honda']
    },
    pk: {
      general: ['Daraz.pk', 'PriceOye.pk', 'Telemart.pk', 'Mega.pk', 'Symbios.pk'],
      car: ['Suzuki', 'Toyota', 'Honda', 'Kia', 'Hyundai'],
      laptop: ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus'],
      shoes: ['Service', 'Bata', 'Nike', 'Adidas', 'Campus'],
      bike: ['Unique', 'Sohrab', 'Yamaha', 'Honda', 'Suzuki']
    },
    us: {
      general: ['Amazon.com', 'Walmart', 'Best Buy', 'Target', 'Costco'],
      car: ['Ford', 'Chevrolet', 'Toyota', 'Honda', 'Tesla'],
      laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'Microsoft'],
      shoes: ['Nike', 'Adidas', 'New Balance', 'Skechers', 'Converse'],
      bike: ['Trek', 'Giant', 'Specialized', 'Cannondale', 'Schwinn']
    },
    ae: {
      general: ['Noon.com', 'Amazon.ae', 'Carrefour UAE', 'Sharaf DG', 'LuLu Hypermarket'],
      car: ['Toyota', 'Honda', 'Nissan', 'Mercedes', 'BMW'],
      laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus'],
      shoes: ['Nike', 'Adidas', 'Puma', 'Skechers', 'New Balance'],
      bike: ['Trek', 'Giant', 'Specialized', 'Cannondale']
    }
  };
  return brands[country?.toLowerCase()]?.[category] || brands[country?.toLowerCase()]?.general || brands.us.general;
};

const detectReportType = (data) => {
  if (data.seoData || data.seoScore || data.keywordStrategy) return 'seo';
  if (data.calculatedMetrics || data.analysisResult || data.priceIntelligence) return 'product';
  return 'product';
};

export default function PremiumReport({ data }) {
  const reportRef = useRef(null);
  if (!data) return null;

  const reportType = detectReportType(data);
  const isProduct = reportType === 'product';

  // Extract data from calculatedMetrics
  const calc = data.calculatedMetrics || {};
  const adv = data.advancedInsights || {};
  const comp = data.competitionAnalysis || {};
  const playbook = data.customerPlaybook || {};
  const sentiment = data.sentimentAnalysis || {};

  const productName = data.productName || 'Product';
  const market = data.market || 'PK';
  const currency = calc.currency || 'USD';
  const symbol = getSymbol(currency);
  const dataTimestamp = calc.dataTimestamp || new Date().toISOString();

  // Use converted prices
  const avgPrice = calc.avgPrice || 0;
  const recommendedPrice = calc.recommendedPrice || 0;
  const minPrice = calc.minPrice || 0;
  const maxPrice = calc.maxPrice || 0;
  const profit = calc.profit || 0;
  const roi = calc.roi || 0;
  const competitorCount = calc.filteredCompetitorCount || 0;
  const rawCompetitorCount = calc.rawCompetitorCount || 0;

  const actionScore = data.actionScore || 60;
  const actionLabel = data.actionLabel || 'Test Waters';
  const actionColor = actionScore >= 70 ? '#34d399' : actionScore >= 50 ? '#f59e0b' : '#ef4444';

  // Local brands
  const localBrands = getLocalBrands(market, 'general');
  const topBrands = comp.dominantBrands?.length > 0 ? comp.dominantBrands.slice(0, 5) : localBrands.slice(0, 5);

  const painPoints = sentiment.topPainPoints || [];

  // Generate recommendations
  const getRecommendations = () => {
    const recs = [];
    if (actionScore < 70) recs.push('Increase marketing efforts to boost brand visibility');
    if (competitorCount > 15) recs.push('Differentiate with unique features or pricing strategy');
    if (sentiment.negative > 30) recs.push(`Address pain points: ${painPoints.join(', ') || 'quality issues'}`);
    if (data.marketGap?.description) recs.push(`Leverage market gap: ${data.marketGap.description}`);
    if (recs.length === 0) recs.push('Maintain current strategy and monitor competitor activity');
    return recs.slice(0, 4);
  };
  const recommendations = getRecommendations();

  // ============================================================
  // MARKDOWN COPY (Full Product Research Report)
  // ============================================================
  const copyMarkdown = () => {
    try {
      const md = `
# 📦 PREMIUM PRODUCT RESEARCH: ${productName.toUpperCase()} IN ${market}

**Action Score:** ${actionScore}% — ${actionLabel}
**Market Heat:** ${Math.min(10, Math.round((actionScore / 100) * 10))}/10
**Risk Level:** ${data.riskMeter || 'Medium'}
**Data Timestamp:** ${new Date(dataTimestamp).toLocaleString()}

## 1. MARKET INTEL + PRICING (${currency})
- **Recommended Price:** ${symbol}${formatPrice(recommendedPrice)}
- **Average Price:** ${symbol}${formatPrice(avgPrice)}
- **Price Range:** ${symbol}${formatPrice(minPrice)} - ${symbol}${formatPrice(maxPrice)}
- **Total Competitors:** ${competitorCount} (${rawCompetitorCount} raw)
- **Top 5 Brands:** ${topBrands.join(' • ')}
- **Market Gap:** ${data.marketGap?.description || 'N/A'}

## 2. PROFIT CALCULATOR (${currency})
Cost ${symbol}${formatPrice(Math.round(avgPrice * 0.4))} + Ads ${symbol}${formatPrice(Math.round(avgPrice * 0.15))} + Fees ${symbol}${formatPrice(Math.round(avgPrice * 0.05))} = Total ${symbol}${formatPrice(Math.round(avgPrice * 0.6))}
Sell ${symbol}${formatPrice(recommendedPrice)} - Total = Profit ${symbol}${formatPrice(profit)} (ROI: ${roi}%)

## 3. CUSTOMER PLAYBOOK
- **Demographic:** ${playbook.targetDemographic || 'Young adults 18-35'}
- **Pain Points:** ${painPoints.join(' • ') || 'N/A'}
- **Ad Headlines:** ${playbook.adHeadlines?.join(' | ') || 'N/A'}
- **Interests:** ${playbook.facebookInterests?.join(', ') || 'N/A'}
- **Communities:** ${playbook.redditCommunities?.join(', ') || 'N/A'}

## 4. SENTIMENT + REVIEWS
- Positive: ${sentiment.positive || 0}%
- Neutral: ${sentiment.neutral || 0}%
- Negative: ${sentiment.negative || 0}%
- Top Complaints: ${painPoints.join(', ') || 'N/A'}

## 5. 90 DAY LAUNCH CALENDAR
Goal: First 100 Sales in 90 Days
- Month 1 (Validation): Source product, 10 test orders, Setup store, UGC videos, Landing page
- Month 2 (Scale): Run ads, 5 influencers, 20 reviews, Optimize listing
- Month 3 (Profit): Scale ads, Bundles, Email marketing, Profit analysis

## 6. RISK + METRICS
Risks: High competition, Supply chain, Ad costs
Metrics: CAC, ROAS, Return Rate, Profit Margin

## 7. FINAL VERDICT
${data.executiveSummary || 'Analysis complete.'}
`;
      navigator.clipboard.writeText(md);
      toast.success('✅ Markdown copied!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to copy Markdown');
    }
  };

  // ... other export functions (copyCSV, copyJSON, downloadPDF) remain similar

  // ============================================================
  // RENDER — PRODUCT RESEARCH
  // ============================================================
  if (isProduct) {
    return (
      <motion.div ref={reportRef} ... >
        {/* Header with Live timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2dd4bf]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2dd4bf] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-[#2dd4bf]/20">
              <Crown size={18} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{productName}</h2>
              <span className="text-[10px] text-gray-500 font-mono">{market} · {currency} · Live Data</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <span className="flex items-center gap-1"><Clock size={12} /> Updated: {new Date(dataTimestamp).toLocaleTimeString()}</span>
          </div>
          {/* export buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button onClick={copyCSV} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all"><FileSpreadsheet size={11} /> CSV</button>
            <button onClick={copyJSON} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all"><FileJson size={11} /> JSON</button>
            <button onClick={copyMarkdown} className="text-[10px] bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] hover:opacity-90 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-black font-bold shadow-lg shadow-[#2dd4bf]/20 transition-all"><FileCode size={11} /> MD</button>
            <button onClick={downloadPDF} className="text-[10px] bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#2dd4bf]/15 flex items-center gap-1.5 text-gray-300 font-mono transition-all"><Download size={11} /> PDF</button>
          </div>
        </div>

        {/* ... rest of the sections as in previous final versions, using symbol, avgPrice etc. */}
        {/* We'll include all sections: Action Score, Market Intel + Pricing, Profit Calculator, Customer Playbook, Sentiment, Final Recommendations, Final Verdict, Footer */}
        {/* (Refer to the previous final version for the full JSX; we are reusing that structure with the new data) */}

      </motion.div>
    );
  }

  // Fallback for SEO
  return <div className="p-4 text-white"><p className="text-gray-400">Loading...</p></div>;
}
