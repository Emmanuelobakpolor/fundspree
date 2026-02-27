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

      {/* Submit ticket form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5 space-y-4"
      >
        <p className="font-semibold text-black dark:text-white">Submit a Ticket</p>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Brief description of your issue"
            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-3 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category</label>
          <div className="relative">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full appearance-none rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
            >
              <option value="">Select a category</option>
              <option value="account">Account Issues</option>
              <option value="kyc">KYC Verification</option>
              <option value="payments">Payments & Withdrawals</option>
              <option value="cards">Wallet Cards</option>
              <option value="loans">Loans</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Message</label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Describe your issue in detail..."
            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-3 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.subject || !form.message}
          className="w-full py-3 rounded-xl bg-gold-gradient text-black font-semibold text-sm gold-glow hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit Ticket
        </button>
      </motion.div>

      {/* Open tickets */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={15} className="text-gold" />
          <p className="font-semibold text-black dark:text-white text-sm">Open Tickets</p>
        </div>
        <p className="text-sm text-gray-400 text-center py-4">No open tickets. You're all good!</p>
      </motion.div>

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
