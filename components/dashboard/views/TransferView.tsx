'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, ChevronDown, AlertCircle, Clock } from 'lucide-react';

const recentRecipients = [
  { initials: 'JD', name: 'J. Doe', id: '@john.doe' },
  { initials: 'AM', name: 'A. Martin', id: '@alex.m' },
];

export default function TransferView() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto">

      {/* Balance pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-black dark:bg-gray-900 p-5 flex items-center justify-between"
      >
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Transferable Balance</p>
          <p className="text-3xl font-bold text-white mt-1">$0.00</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
          <ArrowLeftRight size={20} className="text-gold" />
        </div>
      </motion.div>

      {/* KYC Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-amber-400/40 bg-amber-50 dark:bg-amber-400/10 p-4 flex gap-3 items-start"
      >
        <AlertCircle size={17} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">KYC Required for Transfers</p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Verify your identity to enable balance transfers.</p>
        </div>
      </motion.div>

      {/* Recent recipients */}
      {recentRecipients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Recent Recipients</p>
          <div className="flex gap-3">
            {recentRecipients.map((r) => (
              <button
                key={r.id}
                onClick={() => setRecipient(r.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                  recipient === r.id
                    ? 'border-gold bg-gold/5'
                    : 'border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 hover:border-gold/40'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-black text-sm font-bold">
                  {r.initials}
                </div>
                <p className="text-xs font-medium text-black dark:text-white">{r.name}</p>
                <p className="text-[11px] text-gray-400">{r.id}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Transfer Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5 space-y-4"
      >
        <p className="font-semibold text-black dark:text-white">Send Balance</p>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Recipient Username or ID</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="@username or user ID"
            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-3 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black pl-8 pr-4 py-3 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Note (optional)</label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-3 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition resize-none"
          />
        </div>

        <div className="rounded-xl bg-gray-50 dark:bg-black/40 p-3 text-xs text-gray-500 space-y-1">
          <div className="flex justify-between"><span>Amount</span><span className="font-semibold text-black dark:text-white">${amount || '0.00'}</span></div>
          <div className="flex justify-between"><span>Fee</span><span className="font-semibold text-black dark:text-white">$0.00</span></div>
          <div className="flex justify-between border-t border-gray-200 dark:border-white/10 pt-1 mt-1">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-black dark:text-white">${amount || '0.00'}</span>
          </div>
        </div>

        <button
          disabled
          className="w-full py-3 rounded-xl bg-black dark:bg-gold text-white dark:text-black text-sm font-semibold opacity-50 cursor-not-allowed transition"
        >
          Transfer Balance (KYC Required)
        </button>
      </motion.div>

      {/* Transfer History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={15} className="text-gold" />
          <p className="font-semibold text-black dark:text-white text-sm">Transfer History</p>
        </div>
        <p className="text-sm text-gray-400 text-center py-4">No transfers yet.</p>
      </motion.div>
    </div>
  );
}
