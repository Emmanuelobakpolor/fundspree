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
    photo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=480&q=80',
    photoAlt: 'Person creating a new account on laptop',
    icon: <CreateAccountIcon />,
    title: "Create Account",
    description: "Sign up in minutes with your email and basic details. Verify your identity for full access.",
  },
  {
    photo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=480&q=80',
    photoAlt: 'Activating a digital payment card on phone',
    icon: <ActivateCardIcon />,
    title: "Activate Card",
    description: "Once approved, your digital card is ready for use. Request a physical one for global shopping.",
  },
  {
    photo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=480&q=80',
    photoAlt: 'Crypto withdrawal on mobile app',
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

        <div className="flex flex-col md:flex-row items-stretch justify-between gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.18 }}
              className="flex-1 group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2"
            >
              {/* Photo */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={step.photo}
                  alt={step.photoAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />
                {/* Step number badge */}
                <div className="absolute top-4 left-4 w-9 h-9 bg-gold text-black text-sm font-black rounded-full flex items-center justify-center shadow-lg">
                  0{index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="p-7 text-center">
                <div className="relative w-16 h-16 mx-auto mb-5">
                  <div className="w-full h-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center group-hover:border-gold/40 transition-colors duration-300">
                    <div className="text-gold">{step.icon}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white group-hover:text-gold transition-colors">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
