'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeadphonesIcon, ChevronDown, CheckCircle2, MessageCircle, Clock, Tag } from 'lucide-react';

const faqs = [
  {
    q: 'How do I verify my account?',
    a: 'Click "Start Verification" on your dashboard KYC banner to begin the identity verification process.',
  },
  {
    q: 'How long does KYC verification take?',
    a: 'KYC verification typically takes 24–48 business hours after document submission.',
  },
  {
    q: 'How do I withdraw my balance?',
    a: 'Navigate to your Dashboard, click "Withdraw Balance" on the balance card, and follow the steps.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. We use bank-grade 256-bit encryption and two-factor authentication to protect your account.',
  },
];

export default function SupportView() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ subject: '', category: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.subject || !form.message) return;
    setSubmitted(true);
    setForm({ subject: '', category: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-black dark:bg-gray-900 p-6 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
          <HeadphonesIcon size={22} className="text-gold" />
        </div>
        <div>
          <p className="font-bold text-white">Support Center</p>
          <p className="text-xs text-gray-400 mt-0.5">We're here to help — available 24/7</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Support Online</span>
          </div>
        </div>
      </motion.div>

      {/* Quick contact */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: MessageCircle, label: 'Live Chat', sub: 'Instant response', action: () => window.open('https://wa.me/2341234567890', '_blank') },
          { icon: Tag, label: 'Submit Ticket', sub: '24–48h response', action: () => {} },
        ].map(({ icon: Icon, label, sub, action }, i) => (
          <motion.button
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={action}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 hover:border-gold/40 hover:bg-gold/5 transition text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-black dark:text-white">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Success message */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 p-4 flex items-center gap-3"
        >
          <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">Ticket Submitted!</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">We'll respond within 24–48 hours.</p>
          </div>
        </motion.div>
      )}



      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 overflow-hidden"
      >
        <div className="p-5 border-b border-gray-100 dark:border-white/10">
          <p className="font-semibold text-black dark:text-white">Frequently Asked Questions</p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/10">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition"
              >
                <span className="text-sm font-medium text-black dark:text-white pr-4">{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-4"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
