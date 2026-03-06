'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Banknote, AlertCircle, CheckCircle2, Clock,
  ChevronDown, TrendingUp, Shield, Star, Zap, Building2,
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { authFetch } from '../../../lib/api';

// ─── Types ─────────────────────────────────────────────────────────────────────

type CardTier = 'gold' | 'platinum' | 'business';

interface LoanApplication {
  id: number;
  amount: number;
  purpose: string;
  tier: CardTier;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
}

// ─── Config ─────────────────────────────────────────────────────────────────────

const TIER_LOAN_LIMITS: Record<Exclude<CardTier, 'gold'>, number> = {
  platinum: 2000,
  business: 8000,
};

const LOAN_PLANS = [
  { amount: 500,  interest: '3.5%', duration: '3 months',  monthly: '$170.83' },
  { amount: 1000, interest: '4.0%', duration: '6 months',  monthly: '$170.00' },
  { amount: 2000, interest: '4.5%', duration: '12 months', monthly: '$174.17' },
  { amount: 8000, interest: '5.0%', duration: '24 months', monthly: '$346.67' },
];

const PURPOSES = [
  { value: 'business', label: 'Business Expansion' },
  { value: 'personal', label: 'Personal' },
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
];

const CARD_TIER_INFO = [
  {
    id: 'gold',
    name: 'Gold Card',
    tagline: 'Everyday premium spending',
    price: '1,050 USD',
    badge: 'Entry',
    Icon: Star,
    iconBg: 'bg-amber-100 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    nameColor: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/5',
    border: 'border-amber-200 dark:border-amber-500/20',
    badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    checkColor: 'text-amber-500',
    features: [
      'Virtual Visa debit card',
      'Priority support (email + chat)',
      'Up to $70,000 withdrawal',
      'No loan access',
      'No Spin & Win access',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum Card',
    tagline: 'Elevated freedom & rewards',
    price: '3,000 USD',
    badge: 'Most Popular',
    Icon: Zap,
    iconBg: 'bg-gray-100 dark:bg-gray-500/20',
    iconColor: 'text-gray-600 dark:text-gray-300',
    nameColor: 'text-gray-700 dark:text-gray-300',
    bg: 'bg-gray-50 dark:bg-gray-500/5',
    border: 'border-gray-200 dark:border-gray-500/20',
    badgeBg: 'bg-gray-200 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300',
    checkColor: 'text-gray-500',
    features: [
      'All Gold benefits',
      'Up to $300,000 monthly withdrawal',
      'Up to $2,000 credit line (loans)',
      'Spin & Win — 2 spins/day',
    ],
  },
  {
    id: 'business',
    name: 'Business Card',
    tagline: 'Enterprise-grade power',
    price: '8,000 USD',
    badge: 'Premium',
    Icon: Building2,
    iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    nameColor: 'text-indigo-700 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/5',
    border: 'border-indigo-200 dark:border-indigo-500/20',
    badgeBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
    checkColor: 'text-indigo-500',
    features: [
      'All Platinum benefits',
      'Unlimited withdrawals',
      'Up to $8,000 credit line (loans)',
      'Spin & Win — 5 spins/day',
    ],
  },
];

const TIER_PRIORITY: CardTier[] = ['business', 'platinum', 'gold'];

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function LoansView({ onNavigateToCards: _onNavigateToCards }: { onNavigateToCards?: () => void }) {
  const { user } = useAuth();

  const [cardTier, setCardTier] = useState<CardTier | null>(null);
  const [tierLoading, setTierLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [myLoans, setMyLoans] = useState<LoanApplication[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setTierLoading(true);
      try {
        const [cardsRes, loansRes] = await Promise.all([
          authFetch('/api/cards/cards/'),
          authFetch('/api/loans/'),
        ]);

        if (cardsRes.ok) {
          const confirmedCards: { tier: string }[] = await cardsRes.json();
          for (const t of TIER_PRIORITY) {
            if (confirmedCards.some(c => c.tier === t)) {
              setCardTier(t);
              break;
            }
          }
        }

        if (loansRes.ok) {
          const loans: LoanApplication[] = await loansRes.json();
          setMyLoans(loans);
        }
      } finally {
        setTierLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleApply = async () => {
    if (!user) return;
    setError(null);

    if (!cardTier) {
      return setError('You need an active FundSphere card to apply for a loan. Purchase a Platinum or Business card from Wallet Cards.');
    }
    if (cardTier === 'gold') {
      return setError('Your Gold card does not include loan access. Upgrade to a Platinum or Business card to apply.');
    }
    if (selectedPlan === null) return setError('Please select a loan plan.');
    if (!purpose) return setError('Please select a loan purpose.');

    const plan = LOAN_PLANS[selectedPlan];
    const limit = TIER_LOAN_LIMITS[cardTier as 'platinum' | 'business'];
    if (plan.amount > limit) {
      return setError(
        cardTier === 'platinum'
          ? `Your Platinum card allows loans up to $2,000. Upgrade to Business for up to $8,000.`
          : `Loan amount exceeds your card limit of $${limit.toLocaleString()}.`
      );
    }

    // Check if user already has a pending application
    if (myLoans.some(loan => loan.status === 'pending')) {
      return setError('Loan application is currently under review. Check back later');
    }

    setSubmitting(true);
    try {
      const res = await authFetch('/api/loans/', {
        method: 'POST',
        body: JSON.stringify({ amount: plan.amount, purpose, tier: cardTier }),
      });

      if (res.ok) {
        const newLoan: LoanApplication = await res.json();
        setMyLoans(prev => [newLoan, ...prev]);
        setSuccessId(newLoan.id);
        setSelectedPlan(null);
        setPurpose('');
        setTimeout(() => setSuccessId(null), 4000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit application. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const tierLabel =
    cardTier === 'business' ? 'Business' :
    cardTier === 'platinum' ? 'Platinum' :
    cardTier === 'gold' ? 'Gold' : null;

  const tierLimit =
    cardTier === 'platinum' ? '$2,000' :
    cardTier === 'business' ? '$8,000' : null;

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(212,175,55,0.5)]">
              <Banknote size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Loans</h1>
              <p className="text-gray-400 dark:text-white/40 text-xs">Apply for a loan based on your card tier</p>
            </div>
          </div>
        </motion.div>

        {/* Tier info badge — only when eligible */}
        {!tierLoading && tierLabel && tierLimit && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex items-center gap-3 p-4 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5"
          >
            <Shield size={18} className="text-[#D4AF37] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white text-sm font-semibold">{tierLabel} Card Active</p>
              <p className="text-gray-400 dark:text-white/40 text-xs">Loan limit up to {tierLimit}</p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 font-semibold">
              {tierLabel}
            </span>
          </motion.div>
        )}

        {/* Success Banner */}
        <AnimatePresence>
          {successId && (
            <motion.div
              className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <CheckCircle2 size={20} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                Loan application submitted! We&apos;ll review it within 24–48 hours.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AlertCircle size={18} className="text-red-500 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loan Plans — always visible */}
        <motion.div
          className="rounded-3xl border border-gray-200 dark:border-white/8 bg-white dark:bg-white/[0.03] p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-gray-500 dark:text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
            Select Loan Amount
          </p>
          <div className="grid grid-cols-2 gap-3">
            {LOAN_PLANS.map((plan, i) => {
              const isSelected = selectedPlan === i;
              const outOfRange =
                (cardTier === 'platinum' && plan.amount > TIER_LOAN_LIMITS.platinum) ||
                (!cardTier || cardTier === 'gold');

              return (
                <motion.button
                  key={plan.amount}
                  onClick={() => { setSelectedPlan(i); setError(null); }}
                  whileTap={{ scale: 0.97 }}
                  className={`rounded-2xl p-4 text-left border transition-all duration-200 ${
                    isSelected
                      ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5'
                      : 'border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/[0.02] hover:border-[#D4AF37]/30'
                  } ${outOfRange ? 'opacity-40' : ''}`}
                >
                  {isSelected && <CheckCircle2 size={13} className="text-[#D4AF37] mb-2" />}
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${plan.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5">{plan.duration}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs text-[#D4AF37] font-semibold">{plan.interest} p.a.</span>
                    <span className="text-[11px] text-gray-400 dark:text-white/30">{plan.monthly}/mo</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Application Form — always visible */}
        <motion.div
          className="rounded-3xl border border-gray-200 dark:border-white/8 bg-white dark:bg-white/[0.03] p-5 space-y-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
        >
          <p className="text-gray-500 dark:text-white/60 text-xs font-semibold uppercase tracking-widest">
            Application Details
          </p>

          <div>
            <label className="block text-gray-500 dark:text-white/50 text-xs font-medium mb-1.5">Loan Purpose</label>
            <div className="relative">
              <select
                value={purpose}
                onChange={e => { setPurpose(e.target.value); setError(null); }}
                className="w-full appearance-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
              >
                <option value="">Select purpose…</option>
                {PURPOSES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 pointer-events-none" />
            </div>
          </div>

          <motion.button
            onClick={handleApply}
            disabled={submitting || tierLoading || myLoans.some(loan => loan.status === 'pending')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_6px_28px_-6px_rgba(212,175,55,0.5)] hover:shadow-[0_8px_36px_-6px_rgba(212,175,55,0.7)] transition-all duration-300"
            whileHover={!submitting ? { scale: 1.01 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
          >
            {submitting ? (
              <><Clock size={16} className="animate-spin" />Submitting Application…</>
            ) : (
              <><Banknote size={16} />Apply for Loan</>
            )}
          </motion.button>
        </motion.div>

        {/* Card Tiers - Swipeable */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={15} className="text-[#D4AF37]" />
            <p className="text-gray-500 dark:text-white/60 text-xs font-semibold uppercase tracking-widest">Card Tiers &amp; Loan Access</p>
          </div>
          <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 snap-x">
              {CARD_TIER_INFO.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + index * 0.05 }}
                  className={`min-w-[280px] rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow duration-300 ${tier.bg} ${tier.border} snap-start`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.iconBg}`}>
                        <tier.Icon size={18} className={tier.iconColor} />
                      </div>
                      <div>
                        <p className={`text-base font-bold ${tier.nameColor}`}>{tier.name}</p>
                        <p className="text-gray-400 dark:text-white/30 text-xs">{tier.tagline}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black ${tier.nameColor}`}>{tier.price}</p>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${tier.badgeBg}`}>
                        {tier.badge}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/8">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <span className={`mt-0.5 text-xs font-bold ${tier.checkColor}`}>✓</span>
                        <p className="text-gray-500 dark:text-white/40 text-sm">{f}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Gradient overlays for scroll indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none z-10" />
          </div>
        </motion.div>

        {/* My Loan Applications */}
        {myLoans.length > 0 && (
          <motion.div
            className="rounded-3xl border border-gray-200 dark:border-white/8 bg-white dark:bg-white/[0.03] p-5 space-y-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.27 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-white/60 text-xs font-semibold uppercase tracking-widest">My Applications</p>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 font-medium">
                {myLoans.length}
              </span>
            </div>
            <AnimatePresence>
              {myLoans.map(loan => (
                <motion.div
                  key={loan.id}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/[0.02]"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 to-[#B8860B]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <Banknote size={14} className="text-[#D4AF37]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white font-medium text-sm">${loan.amount.toLocaleString()}</p>
                    <p className="text-gray-400 dark:text-white/35 text-xs capitalize">{loan.purpose}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                      loan.status === 'approved'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : loan.status === 'rejected'
                        ? 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                    <p className="text-gray-400 dark:text-white/25 text-[10px] mt-1">
                      {new Date(loan.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}
