'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowUpRight,
  CreditCard,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { authFetch } from '../../../lib/api';
import WithdrawModal from './WithdrawModal';


export default function HomeView({ onNavigateToCards, onNavigateToProfile }: { onNavigateToCards?: () => void; onNavigateToProfile?: () => void }) {
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible]   = useState(true);
  const [activeCardCount, setActiveCardCount] = useState<number>(0);
  const [showWithdraw, setShowWithdraw]       = useState(false);

  useEffect(() => {
    authFetch('/api/cards/cards/').then(res => {
      if (res.ok) res.json().then((cards: unknown[]) => setActiveCardCount(cards.length));
    });
  }, []);

  const kycStatus = user?.kycStatus ?? 'none';
  const balance = Number(user?.balance ?? 0);
  const welcomeBonus = Number(user?.welcomeBonus ?? 0);
  const referralBonus = Number(user?.referralBonus ?? 0);
  const withdrawalThisMonth = Number(user?.withdrawalThisMonth ?? 0);
  const withdrawalAllTime = Number(user?.withdrawalAllTime ?? 0);
  const usableBalance = welcomeBonus + referralBonus;
  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto">

      {/* Welcome + Active Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome!</p>
          <h2 className="text-2xl font-bold text-black dark:text-white mt-0.5">
            {user?.name ?? 'User'}
          </h2>
        </div>
        <button
          onClick={onNavigateToCards}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 dark:border-white/20 text-sm font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
        >
          Active Cards
          <ChevronRight size={15} />
        </button>
      </motion.div>

      {/* KYC Banner — hidden when approved */}
      {kycStatus !== 'approved' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-2xl border p-4 flex gap-3 ${
            kycStatus === 'pending'
              ? 'border-blue-400/40 bg-blue-50 dark:bg-blue-400/10'
              : 'border-amber-400/40 bg-amber-50 dark:bg-amber-400/10'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {kycStatus === 'pending'
              ? <Clock size={18} className="text-blue-500" />
              : <AlertTriangle size={18} className="text-amber-500" />}
          </div>
          <div className="flex-1">
            {kycStatus === 'pending' ? (
              <>
                <p className="font-semibold text-blue-700 dark:text-blue-400 text-sm">KYC Under Review</p>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5 leading-relaxed">
                  Your documents have been submitted and are being reviewed. Withdrawal limits will be lifted once approved.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-amber-700 dark:text-amber-400 text-sm">
                  {kycStatus === 'rejected' ? 'KYC Rejected — Action Required' : 'KYC Unverified'}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5 leading-relaxed">
                  {kycStatus === 'rejected'
                    ? 'Your KYC was rejected. Please resubmit your documents to unlock full withdrawal access.'
                    : 'Submit your KYC documents to comply with anti-fraud requirements and unlock higher withdrawal limits.'}
                </p>
                <button
                  onClick={onNavigateToProfile}
                  className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 underline underline-offset-2 hover:text-amber-700 transition"
                >
                  {kycStatus === 'rejected' ? 'Resubmit Documents' : 'Start Verification'}
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Available Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-black dark:bg-gray-900 p-6 relative overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-gold/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Available Balance
            </p>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-gray-500 hover:text-gray-300 transition"
              aria-label="Toggle balance visibility"
            >
              {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          <p className="text-4xl font-bold text-white mt-1">
            {balanceVisible ? `$${fmt(balance)}` : '••••'}{' '}
            <span className="text-xl font-semibold text-gray-400">USD</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{fmt(usableBalance)} USD usable</p>

          <button
            onClick={() => setShowWithdraw(true)}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition"
          >
            <ArrowUpRight size={16} />
            Withdraw Balance
          </button>
        </div>
      </motion.div>

      {/* Usable Balances + Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
          Usable Balances
        </p>
        <p className="text-3xl font-bold text-black dark:text-white">
          {fmt(usableBalance)} <span className="text-base font-semibold text-gray-400">USD</span>
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/10">
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
              Welcome Bonus
            </p>
            <p className="text-base font-bold text-black dark:text-white">
              {fmt(welcomeBonus)} USD
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
              Referral Rewards
            </p>
            <p className="text-base font-bold text-black dark:text-white">
              {fmt(referralBonus)} USD
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="flex-1 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:opacity-80 transition">
            Request Loan
          </button>
          <button className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-black dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition">
            Chat with us
          </button>
        </div>
      </motion.div>

      {/* Total Withdrawal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
          Total Withdrawal
        </p>
        <p className="text-3xl font-bold text-black dark:text-white">
          {fmt(withdrawalAllTime)} <span className="text-base font-semibold text-gray-400">USD</span>
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/10">
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
              This Month
            </p>
            <p className="text-base font-bold text-black dark:text-white">
              {fmt(withdrawalThisMonth)} USD
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
              All Time
            </p>
            <p className="text-base font-bold text-black dark:text-white">
              {fmt(withdrawalAllTime)} USD
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={onNavigateToCards}
          className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5 cursor-pointer hover:border-gold/40 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
              <CreditCard size={15} className="text-gold" />
            </div>
            <p className="text-xs font-semibold text-gray-500">Active Cards</p>
          </div>
          <p className="text-2xl font-bold text-black dark:text-white">{activeCardCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp size={15} className="text-emerald-500" />
            </div>
            <p className="text-xs font-semibold text-gray-500">Referrals</p>
          </div>
          <p className="text-2xl font-bold text-black dark:text-white">0</p>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-black dark:text-white">Recent Transactions</p>
          <button className="text-xs text-gold font-medium hover:underline">View all</button>
        </div>
        <div className="space-y-3">
          {(user?.referralCount ?? 0) > 0 ? (
            Array.from({ length: user!.referralCount }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={15} className="text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black dark:text-white truncate">Referral Bonus</p>
                  <p className="text-xs text-gray-400">Referral #{i + 1}</p>
                </div>
                <p className="text-sm font-semibold text-emerald-500">+$50.00</p>
              </div>
            ))
          ) : (
            <div className="pt-2 text-center">
              <p className="text-xs text-gray-400">No transactions yet. Start by funding your wallet.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Withdraw Modal */}
      {showWithdraw && (
        <WithdrawModal
          onClose={() => setShowWithdraw(false)}
          onSuccess={() => setShowWithdraw(false)}
        />
      )}
    </div>
  );
}
