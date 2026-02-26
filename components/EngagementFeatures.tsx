'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BitcoinIcon } from './icons/CryptoIcons';

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
      <path d="M8 21h8M12 17v4M7 4H5a2 2 0 0 0-2 2v2c0 2.76 2.24 5 5 5h.5M17 4h2a2 2 0 0 1 2 2v2c0 2.76-2.24 5-5 5h-.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4h10v7a5 5 0 0 1-10 0V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
      <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <rect x="1" y="6" width="22" height="15" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M16 13.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" fill="currentColor" />
      <path d="M1 10h22" stroke="currentColor" strokeWidth="2" />
      <path d="M5 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function AirdropIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 15l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 11.5A7 7 0 0 0 5.07 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 6.5A9.95 9.95 0 0 1 12 3c2.76 0 5.26 1.12 7.07 2.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const tiers = [
  {
    name: "Standard Tier",
    amount: "$70,000",
    description: "Ideal for daily use and smaller investments.",
    features: ["Basic support", "Standard card", "1% Cashback"],
    highlight: false,
  },
  {
    name: "Premium Tier",
    amount: "$200,000",
    description: "For the serious crypto enthusiast and trader.",
    features: ["Priority support", "Gold-plated card", "3% Cashback"],
    highlight: true,
  },
  {
    name: "Unlimited Tier",
    amount: "Unlimited",
    description: "Unmatched financial power for global whales.",
    features: ["Concierge service", "Exclusive events", "5% Cashback"],
    highlight: false,
  },
];

export default function EngagementFeatures() {
  return (
    <section id="rewards" className="py-24 bg-gray-50 dark:bg-dark-soft transition-colors duration-300 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20 mb-32">
          {/* Spin to Win Section */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative max-w-md mx-auto"
            >
              {/* Animated Wheel Visual */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full rounded-full border-8 border-gold/30 p-2 shadow-2xl relative"
                >
                  <div className="w-full h-full rounded-full border-4 border-gold bg-dark relative overflow-hidden flex items-center justify-center">
                    {/* Slices */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 left-1/2 w-1 h-1/2 bg-gold/50 origin-bottom"
                        style={{ transform: `translateX(-50%) rotate(${i * 45}deg)` }}
                      ></div>
                    ))}
                    <div className="text-center">
                      <p className="text-gold font-bold text-2xl uppercase tracking-widest">SPIN</p>
                      <div className="flex justify-center mt-2">
                        <BitcoinIcon className="w-8 h-8 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </motion.div>
                {/* Pointer */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '22px solid #D4AF37' }}
                ></div>
              </div>

              <div className="text-center mt-12">
                <h3 className="text-3xl font-bold mb-4 dark:text-white">Spin to <span className="text-gold">Win</span></h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                  Earn amazing crypto rewards and exclusive card upgrades daily. Join the FundSphere lottery for a chance to win up to 1 BTC.
                </p>
                <button className="px-8 py-3 bg-black dark:bg-gold text-white dark:text-black font-bold rounded-full hover:shadow-lg transition-all">
                  Join The Draw
                </button>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gold/10 text-gold font-medium text-sm mb-6">
                <TrophyIcon />
                <span>Rewards Program</span>
              </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black dark:text-white">
                  Earn Passive <span className="text-gold">Rewards</span> Every Day
                </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
                We believe in rewarding our community. From referral bonuses to daily spins, we make sure your financial journey is as rewarding as it is secure.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-gold">
                    <WalletIcon />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg dark:text-white">Referral Bonus</h4>
                    <p className="text-gray-600 dark:text-gray-400">Earn $50 in BTC for every friend who activates their card.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-gold">
                    <AirdropIcon />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg dark:text-white">Exclusive Airdrops</h4>
                    <p className="text-gray-600 dark:text-gray-400">Get early access to premium tokens and NFT drops.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Loan Tiers Section */}
        <div id="loans" className="py-20 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Tiered <span className="text-gold">Loan System</span></h2>
            <p className="text-gray-600 dark:text-gray-400">Borrow against your assets with zero credit check and instant approval.</p>
          </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl border ${
                  tier.highlight
                  ? 'border-gold bg-white dark:bg-gray-900 shadow-[0_0_40px_rgba(212,175,55,0.2)]'
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60'
                } flex flex-col justify-between transition-all hover:translate-y-[-5px] group overflow-hidden`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-3 py-1 bg-gold text-black text-xs font-bold rounded-full uppercase tracking-tighter">Most Popular</span>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white">{tier.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className={`text-4xl font-bold ${tier.highlight ? 'text-gold' : 'text-black dark:text-white'}`}>{tier.amount}</span>
                    <span className="text-gray-500 text-sm ml-2">Limit</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
                    {tier.description}
                  </p>
                  <ul className="space-y-4 mb-10">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                        <div className={`w-1.5 h-1.5 rounded-full ${tier.highlight ? 'bg-gold' : 'bg-gray-400'}`}></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full py-3 rounded-full font-bold transition-all flex items-center justify-center space-x-2 ${
                  tier.highlight 
                  ? 'bg-gold text-black shadow-lg shadow-gold/20' 
                  : 'bg-black dark:bg-white/10 text-white dark:text-white hover:bg-gold hover:text-black'
                }`}>
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Background decorative gradient */}
                <div className={`absolute -bottom-20 -right-20 w-40 h-40 ${tier.highlight ? 'bg-gold/10' : 'bg-gray-200/20'} rounded-full blur-3xl transition-opacity opacity-0 group-hover:opacity-100`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
