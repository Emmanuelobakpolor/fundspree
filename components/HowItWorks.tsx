'use client';

import { motion } from 'framer-motion';

function CreateAccountIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <circle cx="20" cy="14" r="6" stroke="currentColor" strokeWidth="2.2" />
      <path d="M6 34c0-7.73 6.27-14 14-14s14 6.27 14 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="32" cy="10" r="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <path d="M32 8v4M30 10h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ActivateCardIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect x="4" y="10" width="32" height="20" rx="4" stroke="currentColor" strokeWidth="2.2" />
      <rect x="4" y="16" width="32" height="5" fill="currentColor" fillOpacity="0.2" />
      <rect x="8" y="26" width="8" height="2" rx="1" fill="currentColor" />
      <rect x="18" y="26" width="5" height="2" rx="1" fill="currentColor" />
      {/* chip */}
      <rect x="9" y="12" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      <path d="M11.5 12v5M14.5 12v5M9 14.5h7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function WithdrawCryptoIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      {/* Bitcoin circle */}
      <circle cx="14" cy="20" r="10" stroke="currentColor" strokeWidth="2.2" />
      <path d="M11 16h4.5c1.38 0 2.5 1.12 2.5 2.5S16.88 21 15.5 21H11v-5zm0 5h5c1.38 0 2.5 1.12 2.5 2.5S17.38 28.5 16 28.5H11V21z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 14v2M13 26v2M15 14v2M15 26v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* Arrow right */}
      <path d="M27 20h8M31 16l4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const steps = [
  {
    icon: <CreateAccountIcon />,
    title: "Create Account",
    description: "Sign up in minutes with your email and basic details. Verify your identity for full access.",
  },
  {
    icon: <ActivateCardIcon />,
    title: "Activate Card",
    description: "Once approved, your digital card is ready for use. Request a physical one for global shopping.",
  },
  {
    icon: <WithdrawCryptoIcon />,
    title: "Withdraw to Crypto",
    description: "Instant withdrawals to any BTC or USDT wallet. Spend globally with your FundSphere card.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-black transition-colors duration-300 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white"
          >
            How It <span className="text-gold">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Get started with FundSphere in three simple steps. We've made it effortless for you to join the future of finance.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 flex-1 text-center group"
            >
              <div className="relative w-20 h-20 mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full bg-white dark:bg-gray-900 border-4 border-gray-100 dark:border-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-gold group-hover:text-gold-dark transition-colors">{step.icon}</div>
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center -translate-y-1 translate-x-1">
                  0{index + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white transition-colors group-hover:text-gold">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
