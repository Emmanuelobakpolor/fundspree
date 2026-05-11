'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

function MFAIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect x="8" y="4" width="24" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="22" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M20 18v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="22" r="1.5" fill="currentColor" />
      <path d="M20 23.5V27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Fingerprint lines */}
      <path d="M14 34c1.33-.8 3.5-1.5 6-1.5s4.67.7 6 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EncryptionIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect x="4" y="18" width="32" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M12 18v-5a8 8 0 0 1 16 0v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="27" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
      <path d="M20 30v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Binary pattern */}
      <text x="6" y="14" fontSize="5" fill="currentColor" fillOpacity="0.4" fontFamily="monospace">1010</text>
    </svg>
  );
}

function KeyVaultIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <circle cx="15" cy="17" r="7" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="17" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 22l12 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M28 29l2 2-4 4-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WAFIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect x="3" y="8" width="34" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 14h34M3 20h34M3 26h34" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M14 8v24M26 8v24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Shield overlay */}
      <path d="M20 10l6 2v5c0 3.5-2.5 6.5-6 8-3.5-1.5-6-4.5-6-8v-5l6-2z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 19l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const securityFeatures = [
  {
    icon: <MFAIcon />,
    title: "MFA Protection",
    description: "Every account is protected by multi-factor authentication, including biometric and hardware keys.",
  },
  {
    icon: <EncryptionIcon />,
    title: "End-to-End Encryption",
    description: "All transactions and personal data are encrypted with state-of-the-art AES-256 protocols.",
  },
  {
    icon: <KeyVaultIcon />,
    title: "Secure Key Management",
    description: "Your keys, your crypto. We use advanced vaulting technology to keep your private keys safe.",
  },
  {
    icon: <WAFIcon />,
    title: "WAF Protection",
    description: "Cloudflare-powered enterprise firewalls and DDoS protection ensure 99.99% uptime.",
  },
];

// Shield SVG for the main card header
function ShieldGoldIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <path d="M16 2L4 7v9c0 7.18 5.37 13.89 12 15.5C23.63 29.89 29 23.18 29 16V7L16 2z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11 16l3.5 3.5L21 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SecuritySection() {
  return (
    <section id="security" className="py-24 bg-white dark:bg-black transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-gold/20"
              style={{ aspectRatio: '4/5' }}
            >
              {/* Real photo */}
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=85"
                alt="Secure mobile banking"
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay – bottom heavy */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

              {/* Top-left live badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-xs font-semibold tracking-wide">Active Protection</span>
              </div>

              {/* Top-right shield badge */}
              <div className="absolute top-5 right-5 w-11 h-11 bg-gold rounded-2xl flex items-center justify-center text-black shadow-lg shadow-gold/30">
                <ShieldGoldIcon />
              </div>

              {/* Bottom overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Gold-Tier Shield</p>
                <p className="text-white font-bold text-xl leading-tight mb-5">Enterprise-Grade<br />Security Active</p>

                {/* Feature chips */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {[
                    { label: 'Biometric Auth', status: 'VERIFIED' },
                    { label: 'AES-256', status: 'ACTIVE' },
                    { label: 'Cold Storage', status: 'SECURED' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5">
                      <CheckCircle2 className="text-green-400 w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-white/90 text-[11px] font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Score bar */}
                <div className="bg-white/10 backdrop-blur-sm border border-gold/30 rounded-2xl px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5">Security Score</p>
                    <p className="text-white font-black text-2xl tracking-tight">A+ GRADE</p>
                  </div>
                  <div className="relative w-14 h-14">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D4AF37" strokeWidth="3"
                        strokeDasharray="100 0" strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-sm text-white">100</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative background shapes */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/20 rounded-full blur-xl animate-pulse -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gold/10 rounded-full blur-2xl -z-10"></div>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black dark:text-white leading-tight">
                Your Security is Our <span className="text-gold">Top Priority</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
                At FundSphere, we believe that security and luxury should go hand in hand.
                Our platform is built on enterprise-grade infrastructure to provide you with the most secure digital wallet experience in the world.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {securityFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="text-gold mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                    <h4 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
