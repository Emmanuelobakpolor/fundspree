'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Shield, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { BitcoinIcon, TetherIcon, EthereumIcon, ChipIcon } from './icons/CryptoIcons';
import { useState } from 'react';
import AuthModal from './AuthModal';

function Sparkline({ color, up }: { color: string; up: boolean }) {
  const upPath = "M2,14 L6,10 L10,12 L14,7 L18,9 L22,5 L26,7 L30,3";
  const downPath = "M2,3 L6,7 L10,5 L14,9 L18,7 L22,11 L26,9 L30,13";
  return (
    <svg width="48" height="20" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d={up ? upPath : downPath}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  return (
    <section className="relative pt-16 pb-12 md:pt-24 lg:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Softer, smaller blobs */}
      <div className="absolute top-[-5%] right-[-5%] w-[400px] md:w-[550px] h-[400px] md:h-[550px] bg-gold/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[350px] md:w-[450px] h-[350px] md:h-[450px] bg-gold/6 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 xl:gap-16">
          {/* LEFT – more compact vertical stack */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 md:space-y-8 lg:space-y-9">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold/10 text-gold font-medium text-sm mx-auto lg:mx-0"
            >
              <Zap className="w-4 h-4" />
              <span>Next-Gen Digital Finance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold leading-tight tracking-tight text-black dark:text-white"
            >
              Revolutionizing <span className="gold-gradient-text">Global Payments</span> with Crypto
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Secure, elegant wallet for BTC & USDT. Gold-tier protection. Instant global transfers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="py-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6"
            >
               <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-black dark:bg-gold text-white dark:text-black font-bold rounded-full hover:shadow-xl hover:shadow-gold/30 transition-all flex items-center justify-center gap-2 text-base"
                >
                  <span>Create Wallet</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

              <Link
                href="#learn-more"
                className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300/70 dark:border-gray-700 text-black dark:text-white font-bold rounded-full hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-all text-base"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold" />
                <span>Real-time Trading</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.65 }}
              className="pt-6 flex items-center justify-center lg:justify-start gap-4"
            >
              <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Supported</span>
              <div className="flex items-center gap-3">
                <BitcoinIcon className="w-7 h-7" />
                <TetherIcon className="w-7 h-7" />
                <EthereumIcon className="w-7 h-7" />
                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                  +12
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT – more compact dashboard */}
          <div className="w-full lg:w-1/2 relative mt-10 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="relative z-10"
            >
              <div className="relative glass rounded-3xl p-5 sm:p-6 lg:p-7 pb-24 sm:pb-28 shadow-2xl border border-white/20 dark:border-white/10 animate-float">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                  <span className="text-xs font-mono text-gray-400">Portfolio Overview</span>
                  <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="text-gold w-4 h-4" />
                  </div>
                </div>

                {/* Balance */}
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-gray-500">Total Balance</p>
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">$128,450</h3>
                  <p className="text-sm text-green-500 font-medium mt-1">▲ +$5,230 (4.24%) today</p>
                </div>

                {/* Cards */}
                <div className="space-y-4">
                  {[
                    { coin: 'Bitcoin', icon: BitcoinIcon, amount: '2.45 BTC', value: '$103,200', change: '+4.2%', color: '#22c55e', up: true },
                    { coin: 'Tether', icon: TetherIcon, amount: '25,250 USDT', value: '$25,250', change: 'Stable', color: '#9ca3af', up: false },
                    { coin: 'Ethereum', icon: EthereumIcon, amount: '0.0 ETH', value: '$0.00', change: '+2.1%', color: '#22c55e', up: true },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-9 h-9 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.coin}</p>
                          <p className="text-xs text-gray-500">{item.amount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Sparkline color={item.color} up={item.up} />
                        <div className="text-right min-w-[80px]">
                          <p className="font-semibold text-gray-900 dark:text-white">{item.value}</p>
                          <p className={`text-xs font-medium ${item.up ? 'text-green-500' : 'text-gray-400'}`}>
                            {item.change}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gold Card – flippable (click to flip) */}
                <motion.div
                  initial={{ x: 50, y: 50, rotate: 8 }}
                  animate={{ x: 20, y: 20, rotate: -4 }}
                  transition={{ duration: 1.4, delay: 0.35 }}
                  className="absolute -bottom-10 -right-6 sm:-bottom-12 sm:-right-8 w-[240px] sm:w-[260px] h-[150px] sm:h-[160px]"
                  style={{ perspective: '1200px' }}
                >
                  <motion.div
                    animate={{ rotateY: cardFlipped ? 180 : 0 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full h-full relative cursor-pointer"
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => setCardFlipped(!cardFlipped)}
                    whileHover={{ scale: 1.06 }}
                    title="Click to flip"
                  >
                    {/* FRONT */}
                    <div
                      className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden"
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-gold via-yellow-300 to-amber-400 p-4 sm:p-5 flex flex-col justify-between text-black relative">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/15 rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black/10 rounded-full" />

                        <div className="relative z-10 flex justify-between items-start">
                          <div>
                            <p className="font-black text-base tracking-tight">FundSphere</p>
                            <p className="text-[10px] opacity-80">Digital Wallet Card</p>
                          </div>
                          <svg className="w-6 h-6 opacity-70" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="8" stroke="black" strokeWidth="1.2" />
                            <path d="M7 10c0-1.66 1.34-3 3-3" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M4 10c0-3.31 2.69-6 6-6" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
                            <circle cx="10" cy="10" r="1.2" fill="black" />
                          </svg>
                        </div>

                        <div className="relative z-10">
                          <ChipIcon className="w-10 h-7" />
                        </div>

                        <div className="relative z-10 flex justify-between items-end">
                          <div>
                            <p className="font-mono text-sm font-bold tracking-widest">**** **** **** 8888</p>
                            <p className="text-[9px] opacity-80 mt-0.5">PREMIUM MEMBER</p>
                          </div>
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-black/30 border border-black/15" />
                            <div className="w-8 h-8 rounded-full bg-black/50 border border-black/15" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BACK */}
                    <div
                      className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden"
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-amber-600 via-yellow-400 to-gold flex flex-col text-black">
                        {/* Magnetic stripe */}
                        <div className="w-full h-9 bg-black/80 mt-5" />
                        {/* Signature strip */}
                        <div className="mx-3 mt-3 flex items-center gap-2">
                          <div
                            className="flex-1 h-7 rounded bg-white/90 flex items-center px-2"
                            style={{ background: 'repeating-linear-gradient(90deg, #ddd 0, #ddd 4px, #fff 4px, #fff 10px)' }}
                          />
                          <div className="bg-white/90 rounded px-2 py-1 text-[10px] font-mono font-bold min-w-[34px] text-center border border-black/10">
                            ***
                          </div>
                        </div>
                        <p className="text-[8px] font-semibold opacity-50 px-3 mt-0.5 uppercase tracking-wider">Authorized Signature</p>

                        <div className="flex-1 px-3 flex flex-col justify-end pb-3">
                          <p className="text-[8px] opacity-55 mb-0.5 uppercase tracking-wider">Customer Support</p>
                          <p className="text-[9px] font-mono font-bold">support@fundsphere.io</p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="text-[10px] font-black tracking-tighter">FundSphere</p>
                            <div className="flex -space-x-2">
                              <div className="w-7 h-7 rounded-full bg-black/30 border border-black/15" />
                              <div className="w-7 h-7 rounded-full bg-black/50 border border-black/15" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Smaller glows */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-gold/25 rounded-full blur-xl animate-pulse-slow" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gold/15 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
      />
    </section>
  );
}