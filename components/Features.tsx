'use client';

import { motion } from 'framer-motion';

// Custom professional SVG icons
function CardActivationIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect x="2" y="7" width="28" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="2" y="12" width="28" height="4" fill="currentColor" opacity="0.3" />
      <rect x="6" y="20" width="6" height="2" rx="1" fill="currentColor" />
      <rect x="14" y="20" width="4" height="2" rx="1" fill="currentColor" />
      <circle cx="25" cy="21" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M27 23l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WithdrawIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
      <path d="M16 10v12M11 15l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WalletConnectIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect x="2" y="8" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="22" y="13" width="8" height="6" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="27" cy="16" r="1.5" fill="currentColor" />
      <path d="M2 13h20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect x="3" y="13" width="26" height="4" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="6" y="17" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 13v16" stroke="currentColor" strokeWidth="2" />
      <path d="M16 13c0 0-3-6 0-6s0 6 0 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 13c0 0 3-6 0-6s0 6 0 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <path d="M16 3L4 8v8c0 6.63 5.15 12.82 12 14 6.85-1.18 12-7.37 12-14V8L16 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11 16l3.5 3.5L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobalIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="16" cy="16" rx="5.5" ry="13" stroke="currentColor" strokeWidth="2" />
      <path d="M3 16h26" stroke="currentColor" strokeWidth="2" />
      <path d="M5 10h22M5 22h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const features = [
  {
    icon: <CardActivationIcon />,
    title: "Card Activation",
    description: "Activate your FundSphere physical or virtual card in seconds and spend your crypto globally.",
    color: "bg-blue-500",
    textColor: "text-white",
  },
  {
    icon: <WithdrawIcon />,
    title: "BTC & USDT Withdrawals",
    description: "Instant withdrawals to any external BTC or USDT wallet with minimal network fees.",
    color: "bg-gold",
    textColor: "text-black",
  },
  {
    icon: <WalletConnectIcon />,
    title: "Secure Wallet Connection",
    description: "Connect your existing wallets with ease and manage all your assets in one high-end interface.",
    color: "bg-emerald-500",
    textColor: "text-white",
  },
  {
    icon: <GiftIcon />,
    title: "Bonus & Referral Rewards",
    description: "Get rewarded for every friend you invite. Share the future of finance and earn together.",
    color: "bg-purple-500",
    textColor: "text-white",
  },
  {
    icon: <ShieldCheckIcon />,
    title: "Gold-Tier Security",
    description: "Multi-factor authentication and end-to-end encryption for every transaction you make.",
    color: "bg-gray-900",
    textColor: "text-white",
  },
  {
    icon: <GlobalIcon />,
    title: "Global Integration",
    description: "Accept and send payments across borders without the traditional banking delays.",
    color: "bg-rose-500",
    textColor: "text-white",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-dark-soft transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white"
          >
            Powerful Features for the <span className="text-gold">Modern Era</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Experience a suite of tools designed to make your crypto journey as smooth and premium as possible.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className={`w-16 h-16 ${feature.color} ${feature.textColor} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
