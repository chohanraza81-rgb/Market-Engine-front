'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';

const SearchEngineSelector = ({ activeEngine, setActiveEngine }) => {
  const engines = [
    {
      id: 'data-hack',
      label: 'Data Hack',
      icon: <Search className="w-4 h-4" />,
      description: 'Market Intelligence & Arbitrage'
    },
    {
      id: 'seo',
      label: 'SEO Engine',
      icon: <Sparkles className="w-4 h-4" />,
      description: '60-90 Day SEO Strategy'
    }
  ];

  return (
    <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-2 mb-6">
      <div className="grid grid-cols-2 gap-2">
        {engines.map((engine) => {
          const isActive = activeEngine === engine.id;
          
          return (
            <motion.button
              key={engine.id}
              onClick={() => setActiveEngine(engine.id)}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-[#2dd4bf]/20 to-[#a78bfa]/20 border border-[#2dd4bf]/30' 
                  : 'hover:bg-white/5 border border-transparent'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2dd4bf]/10 to-[#a78bfa]/10"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              
              {/* Icon */}
              <div className={`
                relative z-10 p-2 rounded-lg
                ${isActive 
                  ? 'bg-[#2dd4bf]/20 text-[#2dd4bf]' 
                  : 'bg-white/5 text-gray-400'
                }
              `}>
                {engine.icon}
              </div>
              
              {/* Text */}
              <div className="relative z-10 text-left">
                <div className={`
                  text-sm font-medium
                  ${isActive ? 'text-white' : 'text-gray-400'}
                `}>
                  {engine.label}
                </div>
                <div className="text-xs text-gray-500">
                  {engine.description}
                </div>
              </div>
              
              {/* Active Border Glow */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl border border-[#2dd4bf]/20"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(45, 212, 191, 0.05)',
                      '0 0 40px rgba(45, 212, 191, 0.1)',
                      '0 0 20px rgba(45, 212, 191, 0.05)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchEngineSelector;
