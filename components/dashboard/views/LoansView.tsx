'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Banknote, Clock, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';

const loanOptions = [
  { amount: '$500', interest: '3.5%', duration: '3 months', monthly: '$170.83' },
  { amount: '$1,000', interest: '4.0%', duration: '6 months', monthly: '$170.00' },
  { amount: '$2,500', interest: '4.5%', duration: '12 months', monthly: '$218.75' },
  { amount: '$5,000', interest: '5.0%', duration: '24 months', monthly: '$218.75' },
];

export default function LoansView() {
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <Banknote size={18} className="text-gold" />
          </div>
          <div>
            <p className="font-semibold text-black dark:text-white">Active Loans</p>
            <p className="text-xs text-gray-400">No active loans</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100 dark:border-white/10 text-center">
          {[
            { label: 'Total Borrowed', value: '$0.00' },
            { label: 'Outstanding', value: '$0.00' },
            { label: 'Next Payment', value: '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] text-gray-400">{label}</p>
              <p className="text-sm font-bold text-black dark:text-white mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Loan Eligibility */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-amber-400/40 bg-amber-50 dark:bg-amber-400/10 p-4 flex gap-3 items-start"
      >
        <AlertCircle size={17} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            KYC Required for Loans
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
            Complete your identity verification to unlock loan services.
          </p>
        </div>
      </motion.div>

      {/* Loan Plans */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="font-semibold text-black dark:text-white mb-3">Available Loan Plans</p>
        <div className="grid grid-cols-2 gap-3">
          {loanOptions.map((opt, i) => (
            <motion.button
              key={i}
              onClick={() => setSelectedLoan(i)}
              whileTap={{ scale: 0.97 }}
              className={`rounded-2xl p-4 text-left border transition-all ${
                selectedLoan === i
                  ? 'border-gold bg-gold/5 dark:bg-gold/10'
                  : 'border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 hover:border-gold/40'
              }`}
            >
              {selectedLoan === i && (
                <CheckCircle2 size={14} className="text-gold mb-1.5" />
              )}
              <p className="text-xl font-bold text-black dark:text-white">{opt.amount}</p>
              <p className="text-xs text-gray-500 mt-1">{opt.duration}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gold font-semibold">{opt.interest} p.a.</span>
                <span className="text-[11px] text-gray-400">{opt.monthly}/mo</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Application Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5 space-y-4"
      >
        <p className="font-semibold text-black dark:text-white">Apply for a Loan</p>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Loan Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-3 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Loan Purpose</label>
          <div className="relative">
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
            >
              <option value="">Select purpose</option>
              <option value="business">Business Expansion</option>
              <option value="personal">Personal</option>
              <option value="education">Education</option>
              <option value="medical">Medical</option>
            </select>
            <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button
          disabled
          className="w-full py-3 rounded-xl bg-black dark:bg-gold text-white dark:text-black text-sm font-semibold opacity-50 cursor-not-allowed transition"
        >
          Request Loan (KYC Required)
        </button>
      </motion.div>

      {/* Processing times */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={15} className="text-gold" />
          <p className="font-semibold text-black dark:text-white text-sm">Processing Info</p>
        </div>
        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
          <p>• Loan approval takes 24–48 hours after KYC verification</p>
          <p>• Funds are disbursed directly to your FundSphere wallet</p>
          <p>• Early repayment is allowed with no penalties</p>
        </div>
      </motion.div>
    </div>
  );
}
