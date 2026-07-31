'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Zap } from 'lucide-react';

export default function SearchEngineSelector({ activeEngine, onEngineChange }) {
  const engines = [
    { id: 'datahack', label: 'Data Hack', icon: Database, description: 'Market Analysis' },
    { id: 'seo', label: 'SEO Engine', icon: Search, description: 'SEO Strategy' }
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-[#0F172A] rounded-xl border border-[#2dd4bf]/10 max-w-md mx-auto">
      {engines.map((engine) => {
        const isActive = activeEngine === engine.id;
        const Icon = engine.icon;
        return (
          <button
            key={engine.id}
            onClick={() => onEngineChange(engine.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] text-black shadow-lg shadow-[#2dd4bf]/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={16} />
            <span>{engine.label}</span>
            {isActive && <Zap size={12} className="text-black" />}
          </button>
        );
      })}
    </div>
  );
}
