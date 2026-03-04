'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Security', href: '#security' },
  { name: 'Rewards', href: '#rewards' },
  { name: 'Cards', href: '#cards' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  return (
    <>
      {/* Navbar wrapper — floats as a pill when scrolled */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'top-3 mx-4 md:mx-8 lg:mx-16'
            : 'mx-0'
        }`}
      >
        <div
          className={`flex items-center justify-between px-5 py-3 transition-all duration-300 ${
            isScrolled
              ? 'rounded-[2rem] shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60'
              : 'rounded-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'
          }`}
        >
          {/* Logo */}
      <Link href="/" className="flex items-center group">
  <img
    src="/assets/Screenshot_2026-03-01_104801-removebg-preview.png"
    alt="FundSphere"
className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"  />
</Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-full px-2 py-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-full transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isAuthenticated ? (
              <div 
                className="flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                onClick={() => window.location.href = '/dashboard'}
              >
                <div className="w-7 h-7 rounded-full bg-black dark:bg-gold flex items-center justify-center">
                  <User size={14} className="text-white dark:text-black" />
                </div>
                <span className="text-sm font-medium text-black dark:text-white">
                  {user?.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    logout();
                  }}
                  className="ml-1 p-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-all"
                  aria-label="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-sm font-semibold rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-5 py-2 bg-black dark:bg-gold text-white dark:text-black text-sm font-semibold rounded-full hover:shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right: dark mode + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mt-2 mx-0 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                {isAuthenticated ? (
                  <>
                    <div 
                      className="flex items-center gap-3 px-5 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      onClick={() => {
                        window.location.href = '/dashboard';
                        setIsOpen(false);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-black dark:bg-gold flex items-center justify-center">
                        <User size={14} className="text-white dark:text-black" />
                      </div>
                      <span className="text-sm font-semibold text-black dark:text-white">
                        {user?.name}
                      </span>
                    </div>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-sm font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setShowAuthModal(true); setIsOpen(false); }}
                      className="w-full px-5 py-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-sm font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { setShowAuthModal(true); setIsOpen(false); }}
                      className="w-full px-5 py-3 bg-black dark:bg-gold text-white dark:text-black text-sm font-semibold rounded-2xl hover:opacity-90 transition-all"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}