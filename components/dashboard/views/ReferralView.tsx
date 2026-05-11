'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Users,
  DollarSign,
  Share2,
  Gift,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../AuthContext';

export default function ReferralView() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode ?? '--------';
  const referralCount = user?.referralCount ?? 0;
  const referralBonus = Number(user?.referralBonus ?? 0);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${referralCode}`
    : `https://fundspree.com/?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const steps = [
    {
      step: '01',
      title: 'Share your code',
      description: 'Share your unique referral code or link with friends and family.',
    },
    {
      step: '02',
      title: 'Friend signs up',
      description: 'Your friend creates a FundSpree account using your referral code.',
    },
    {
      step: '03',
      title: 'You earn $50',
      description: 'Once they register, $50 is instantly credited to your Referral Bonus.',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">Invite & Earn</p>
        <h2 className="text-2xl font-bold text-black dark:text-white mt-0.5">
          Referral Program
        </h2>
      </motion.div>

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative rounded-2xl bg-black overflow-hidden p-6"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center">
            <Gift size={28} className="text-gold" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">Earn $50 per referral</p>
            <p className="text-gray-400 text-sm mt-0.5">
              Share your code — every friend who signs up earns you $50 in referral bonus.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users size={15} className="text-emerald-500" />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Referrals</p>
          </div>
          <p className="text-3xl font-bold text-black dark:text-white">{referralCount}</p>
          <p className="text-xs text-gray-400 mt-1">Friends referred</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
              <DollarSign size={15} className="text-gold" />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Referral Bonus</p>
          </div>
          <p className="text-3xl font-bold text-black dark:text-white">
            ${referralBonus.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-1">USD earned</p>
        </div>
      </motion.div>

      {/* Referral Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
          Your Referral Code
        </p>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 dark:bg-black/40 rounded-xl px-5 py-4 border border-dashed border-gray-300 dark:border-white/20">
            <p className="text-2xl font-bold tracking-[0.25em] text-black dark:text-white font-mono">
              {referralCode}
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-4 rounded-xl font-semibold text-sm transition-all ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
            Referral Link
          </p>
          <div className="flex items-center gap-2">
            <p className="flex-1 text-xs text-gray-500 dark:text-gray-400 truncate font-mono bg-gray-50 dark:bg-black/40 rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
              {shareUrl}
            </p>
            <button
              onClick={handleCopyLink}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition text-xs font-semibold"
            >
              <Share2 size={13} />
              Share
            </button>
          </div>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
          How It Works
        </p>

        <div className="space-y-4">
          {steps.map((item, i) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                <span className="text-xs font-bold text-white dark:text-black">{item.step}</span>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-semibold text-sm text-black dark:text-white">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 mt-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-400/10 border border-amber-200/60 dark:border-amber-400/20">
            <Gift size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              The $50 referral bonus is credited immediately upon your friend's registration and appears in your <strong>Referral Bonus</strong> balance on the dashboard.
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
