'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  BarChart3,
  Zap,
  Brain,
  Target,
  Rocket,
  Crown,
  Gem,
  Flame,
  Cpu,
  Database,
  Layers,
  Compass,
  Radar,
  Activity
} from 'lucide-react';

const SearchEngineSelector = ({ activeEngine, setActiveEngine }) => {
  const engines = [
    {
      id: 'data-hack',
      label: 'Data Hack',
      icon: <Database className="w-5 h-5" />,
      description: 'Market Intelligence & Arbitrage',
      features: ['Real-time Analysis', 'Price Tracking', 'Competitor Intel', 'Sentiment Analysis'],
      color: '#2dd4bf',
      gradient: 'from-[#2dd4bf]/30 to-[#2dd4bf]/5',
      badge: 'Live',
      badgeColor: 'bg-[#2dd4bf]/20 text-[#2dd4bf]'
    },
    {
      id: 'seo',
      label: 'SEO Engine',
      icon: <Brain className="w-5 h-5" />,
      description: '60-90 Day SEO Strategy',
      features: ['Keyword Strategy', 'Content Calendar', 'Backlink Plan', 'AdSense Roadmap'],
      color: '#a78bfa',
      gradient: 'from-[#a78bfa]/30 to-[#a78bfa]/5',
      badge: 'Pro',
      badgeColor: 'bg-[#a78bfa]/20 text-[#a78bfa]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {engines.map((engine, index) => {
        const isActive = activeEngine === engine.id;
        
        return (
          <motion.button
            key={engine.id}
            onClick={() => setActiveEngine(engine.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`
              relative group text-left p-6 rounded-2xl transition-all duration-500
              ${isActive 
                ? 'bg-gradient-to-br from-[#2dd4bf]/10 to-[#a78bfa]/10 border-2 border-[#2dd4bf]/40 shadow-[0_0_60px_-12px_rgba(45,212,191,0.15)]' 
                : 'bg-[#0D1117]/80 border border-white/5 hover:border-white/20 hover:bg-[#0D1117]/90'
              }
            `}
          >
            {/* Glow Effect */}
            {isActive && (
              <>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2dd4bf]/5 to-[#a78bfa]/5" />
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#2dd4bf]/20 to-[#a78bfa]/20 blur-xl opacity-30" />
              </>
            )}

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  {/* Icon Container */}
                  <div className={`
                    p-3 rounded-xl transition-all duration-500
                    ${isActive 
                      ? `bg-gradient-to-br ${engine.gradient} border border-[${engine.color}]/30 shadow-[0_0_30px_-8px_rgba(45,212,191,0.1)]` 
                      : 'bg-white/5 border border-white/10 group-hover:bg-white/10'
                    }
                  `}>
                    <div className={`
                      transition-colors duration-500
                      ${isActive ? `text-[${engine.color}]` : 'text-gray-500 group-hover:text-gray-300'}
                    `}>
                      {engine.icon}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className={`
                        text-lg font-bold transition-colors duration-500
                        ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                      `}>
                        {engine.label}
                      </h3>
                      <span className={`
                        text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider
                        ${engine.badgeColor}
                      `}>
                        {engine.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{engine.description}</p>
                  </div>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="px-3 py-1 rounded-full bg-[#2dd4bf]/20 border border-[#2dd4bf]/30"
                  >
                    <span className="text-[10px] font-medium text-[#2dd4bf] uppercase tracking-wider flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Active
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {engine.features.map((feature, i) => (
                  <span
                    key={i}
                    className={`
                      text-xs px-3 py-1 rounded-full transition-all duration-300
                      ${isActive 
                        ? 'bg-white/10 text-white/80 border border-white/10' 
                        : 'bg-white/5 text-gray-500 border border-white/5 group-hover:bg-white/10 group-hover:text-gray-300'
                      }
                    `}
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Hover Arrow */}
              {!isActive && (
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Active Border Animation */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#2dd4bf]/50 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default SearchEngineSelector;
