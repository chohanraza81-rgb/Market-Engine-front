'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Crown, Brain, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Data Hack', icon: <BarChart3 className="w-4 h-4" /> },
    { path: '/seo', label: 'SEO Engine', icon: <Brain className="w-4 h-4" /> }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080B12]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-[#2dd4bf]" />
            <span className="text-white font-bold text-lg">PROFITFORGE</span>
            <span className="text-gray-500 text-sm font-light">Pro</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#2dd4bf]/20 to-[#a78bfa]/20 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-xl border border-[#2dd4bf]/30"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full">v6.0</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
