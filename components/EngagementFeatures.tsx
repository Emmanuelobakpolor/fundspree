'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, Zap, Building2 } from 'lucide-react';

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path d="M8 21h8M12 17v4M7 4H5a2 2 0 0 0-2 2v2c0 2.76 2.24 5 5 5h.5M17 4h2a2 2 0 0 1 2 2v2c0 2.76-2.24 5-5 5h-.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4h10v7a5 5 0 0 1-10 0V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

const cardTiers = [
  {
    name: 'Gold Card',
    tagline: 'Everyday premium spending',
    price: '1,050 USD',
    badge: 'Entry',
    Icon: Star,
    highlight: false,
    accentColor: 'text-amber-500',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    borderColor: 'border-amber-200/60 dark:border-amber-500/20',
    iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    features: [
      'Virtual Visa debit card',
      'Priority support (email + chat)',
      'Up to $70,000 daily withdrawal',
      'No loan access',
      'No Spin & Win access',
    ],
  },
  {
    name: 'Platinum Card',
    tagline: 'Elevated freedom & rewards',
    price: '3,000 USD',
    badge: 'Most Popular',
    Icon: Zap,
    highlight: true,
    accentColor: 'text-gray-700 dark:text-gray-300',
    badgeColor: 'bg-gold text-black',
    borderColor: 'border-gray-300/60 dark:border-gray-500/30',
    iconBg: 'bg-gray-100 dark:bg-gray-500/20',
    features: [
      'All Gold benefits',
      'Up to $300,000 daily withdrawal',
      'Up to $2,000 credit line (loans)',
      'Spin & Win — 2 spins/day',
    ],
  },
  {
    name: 'Business Card',
    tagline: 'Enterprise-grade power',
    price: '8,000 USD',
    badge: 'Premium',
    Icon: Building2,
    highlight: false,
    accentColor: 'text-indigo-600 dark:text-indigo-400',
    badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
    borderColor: 'border-indigo-200/60 dark:border-indigo-500/20',
    iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
    features: [
      'All Platinum benefits',
      'Unlimited withdrawals',
      'Up to $8,000 credit line (loans)',
      'Spin & Win — 5 spins/day',
    ],
  },
];

export default function EngagementFeatures() {
  return (
    <section
      id="rewards"
      className="relative py-20 lg:py-28 bg-gray-50 dark:bg-dark-soft overflow-hidden"
    >
      {/* subtle background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">

        {/* ===== SPIN SECTION ===== */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 lg:mb-24">

          {/* TEXT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
              <TrophyIcon />
              <span>Cash Rewards</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight mb-6 text-black dark:text-white">
              <span className="block">Spin for</span>
              <span className="text-gold">Real Cash Rewards</span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
              Every active member gets a chance to win real money daily.
              No tokens. No gimmicks. Just direct cash rewards credited to your account.
            </p>

            <button className="px-8 py-3 rounded-full bg-black dark:bg-gold text-white dark:text-black font-semibold transition-all hover:scale-[1.03]">
              Try Your Luck
            </button>
          </motion.div>

          {/* WHEEL SIDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto"
          >
            <div className="relative bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl">

              <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[380px] lg:h-[380px] mx-auto">

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full rounded-full border-8 border-gold/30 p-3"
                >
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white relative">

                    {/* reward labels */}
                    {["$100", "$0", "$500", "$1,000", "$200", "$750"].map((reward, i) => (
                      <div
                        key={i}
                        className="absolute text-sm font-semibold text-gold"
                        style={{
                          transform: `rotate(${i * 60}deg) translateY(-140px) rotate(-${i * 60}deg)`
                        }}
                      >
                        {reward}
                      </div>
                    ))}

                    <div className="text-center">
                      <p className="text-xl font-bold tracking-wide">SPIN</p>
                    </div>
                  </div>
                </motion.div>

                {/* pointer */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '14px solid transparent',
                    borderRight: '14px solid transparent',
                    borderTop: '22px solid #D4AF37'
                  }}
                ></div>

              </div>
            </div>
          </motion.div>

        </div>

        {/* ===== CARD TIERS ===== */}
        <div id="cards" className="pt-16 border-t border-gray-200/50 dark:border-gray-800">

          <div className="text-center mb-14">
            <h2 className="text-4xl font-semibold mb-4 dark:text-white">
              Choose Your <span className="text-gold">Card</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select a card tier that matches your lifestyle and financial goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cardTiers.map((tier, index) => {
              const Icon = tier.Icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 rounded-[2rem] backdrop-blur-xl border ${tier.borderColor}
                  ${tier.highlight
                      ? 'scale-[1.03] z-10 bg-white dark:bg-gray-900 shadow-2xl'
                      : 'bg-white/70 dark:bg-white/5'
                    } transition-all hover:-translate-y-2`}
                >
                  {/* Badge */}
                  <div className={`absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full ${tier.badgeColor}`}>
                    {tier.badge}
                  </div>

                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tier.iconBg}`}>
                      <Icon size={20} className={tier.accentColor} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black dark:text-white">{tier.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tier.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className={`text-3xl font-black mb-6 ${tier.accentColor}`}>
                    {tier.price}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-10">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className={`mt-0.5 font-bold text-xs ${tier.accentColor}`}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-3 rounded-full font-semibold bg-black dark:bg-white/10 text-white hover:bg-gold hover:text-black transition-all flex items-center justify-center space-x-2">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}