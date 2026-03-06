'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, CheckCircle2 } from 'lucide-react';
import { COUNTRIES, Country } from '../lib/countries';

interface CountrySelectProps {
  value: string;            // country name
  onChange: (country: Country) => void;
  theme?: 'light' | 'dark'; // 'light' for modal, 'dark' for dashboard
}

export default function CountrySelect({ value, onChange, theme = 'light' }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = COUNTRIES.find(c => c.name === value);
  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dialCode.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isDark = theme === 'dark';

  const triggerClass = isDark
    ? 'w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-left focus:outline-none transition-all'
    : 'w-full flex items-center gap-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-left focus:outline-none transition-all';

  const dropdownClass = isDark
    ? 'absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl border border-white/10 overflow-hidden'
    : 'absolute left-0 right-0 top-[calc(100%+4px)] z-50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl';

  const dropdownBg = isDark
    ? { background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(24px)', boxShadow: '0 24px 64px -12px rgba(0,0,0,0.8)' }
    : {};

  const searchClass = isDark
    ? 'w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/40 transition-all'
    : 'w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg pl-8 pr-3 py-2 text-sm text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-all';

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch(''); }}
        className={triggerClass}
        style={open && isDark ? { borderColor: 'rgba(212,175,55,0.5)', background: 'rgba(255,255,255,0.08)' } : {}}
      >
        {selected ? (
          <>
            <span className="text-xl leading-none flex-shrink-0">{selected.flag}</span>
            <span className={`flex-1 text-sm font-medium truncate ${isDark ? 'text-white' : 'text-black dark:text-white'}`}>
              {selected.name}
            </span>
            <span className={`text-xs font-mono flex-shrink-0 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
              {selected.dialCode}
            </span>
          </>
        ) : (
          <>
            <span className="text-xl leading-none flex-shrink-0 opacity-30">🌍</span>
            <span className={`flex-1 text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              Select country…
            </span>
          </>
        )}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 ${isDark ? 'text-white/40' : 'text-gray-400'}`}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={dropdownClass}
            style={isDark ? dropdownBg : { background: 'white' }}
          >
            {/* Search */}
            <div className={`p-2.5 border-b ${isDark ? 'border-white/8' : 'border-gray-100 dark:border-gray-700'}`}>
              <div className="relative">
                <Search size={13} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search countries…"
                  className={searchClass}
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto dashboard-scroll overscroll-contain">
              {filtered.length === 0 ? (
                <div className={`px-4 py-6 text-center text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                  No countries found
                </div>
              ) : (
                filtered.map((country) => {
                  const isSelected = country.name === value;
                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => { onChange(country); setOpen(false); setSearch(''); }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                        isDark
                          ? isSelected ? 'bg-[#D4AF37]/10' : 'hover:bg-white/4'
                          : isSelected ? 'bg-gold/8 dark:bg-gold/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-lg leading-none flex-shrink-0">{country.flag}</span>
                      <span className={`flex-1 text-sm truncate ${
                        isDark
                          ? isSelected ? 'text-[#D4AF37] font-medium' : 'text-white/75'
                          : isSelected ? 'text-black dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {country.name}
                      </span>
                      <span className={`text-xs font-mono flex-shrink-0 ${
                        isDark
                          ? isSelected ? 'text-[#D4AF37]/70' : 'text-white/25'
                          : 'text-gray-400'
                      }`}>
                        {country.dialCode}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={13} className={isDark ? 'text-[#D4AF37] flex-shrink-0' : 'text-gold flex-shrink-0'} />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className={`px-3.5 py-2 border-t ${isDark ? 'border-white/5' : 'border-gray-100 dark:border-gray-700'}`}>
              <p className={`text-[10px] ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
                {COUNTRIES.length} countries
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
