'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Gift, Trophy, Clock, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '../../AuthContext';

// ─── Types ─────────────────────────────────────────────────────────────────────

type CardTier = 'gold' | 'platinum' | 'business';

// ─── Config ─────────────────────────────────────────────────────────────────────

const TIER_SPIN_LIMITS: Record<Exclude<CardTier, 'gold'>, number> = {
  platinum: 2,
  business: 5,
};

const prizes = [
  { label: '$0', color: '#1a1a1a' },
  { label: '$5', color: '#D4AF37' },
  { label: '$0', color: '#1a1a1a' },
  { label: '$10', color: '#B8860B' },
  { label: '$0', color: '#1a1a1a' },
  { label: '$2', color: '#D4AF37' },
  { label: '$0', color: '#1a1a1a' },
  { label: 'Try Again', color: '#333333' },
];

const leaderboard = [
  { rank: 1, name: 'User****', prize: '$50', date: 'Today' },
  { rank: 2, name: 'Alex****', prize: '$10', date: 'Yesterday' },
  { rank: 3, name: 'John****', prize: '$5', date: '2 days ago' },
];

// ─── localStorage helpers ───────────────────────────────────────────────────────

function getUserHighestCardTier(userId: string): CardTier | null {
  try {
    const orders = JSON.parse(localStorage.getItem('fundspree_card_orders') || '[]');
    const confirmed = orders.filter(
      (o: { userId: string; status: string }) => o.userId === userId && o.status === 'confirmed'
    );
    if (confirmed.length === 0) return null;
    for (const tier of ['business', 'platinum', 'gold'] as CardTier[]) {
      if (confirmed.some((o: { tier: string }) => o.tier === tier)) return tier;
    }
    return 'gold';
  } catch {
    return null;
  }
}

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function getSpinsUsedToday(userId: string): number {
  try {
    const data = JSON.parse(localStorage.getItem(`fundspree_spins_${userId}`) || '{}');
    return data.date === getTodayString() ? (data.used ?? 0) : 0;
  } catch {
    return 0;
  }
}

function setSpinsUsedToday(userId: string, used: number) {
  localStorage.setItem(
    `fundspree_spins_${userId}`,
    JSON.stringify({ date: getTodayString(), used })
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function SpinWinView({ onNavigateToCards: _onNavigateToCards }: { onNavigateToCards?: () => void }) {
  const { user } = useAuth();

  const [cardTier, setCardTier] = useState<CardTier | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [maxSpins, setMaxSpins] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [totalWon, setTotalWon] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (!user) return;
    const tier = getUserHighestCardTier(user.id);
    setCardTier(tier);
    if (tier && tier !== 'gold') {
      const max = TIER_SPIN_LIMITS[tier as 'platinum' | 'business'];
      const used = getSpinsUsedToday(user.id);
      setMaxSpins(max);
      setSpinsLeft(Math.max(0, max - used));
    }
  }, [user]);

  const spinWheel = async () => {
    if (!user) return;
    setError(null);

    // ── Card / tier checks ──
    if (!cardTier) {
      return setError('You need an active FundSphere card to use Spin & Win. Purchase a Platinum or Business card from Wallet Cards.');
    }
    if (cardTier === 'gold') {
      return setError('Your Gold card does not include Spin & Win access. Upgrade to a Platinum or Business card.');
    }
    if (spinning) return;
    if (spinsLeft <= 0) return;

    setSpinning(true);
    const used = getSpinsUsedToday(user.id);
    setSpinsUsedToday(user.id, used + 1);
    setSpinsLeft(s => s - 1);

    const extraSpins = 5 + Math.random() * 5;
    const sliceAngle = 360 / prizes.length;
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const targetAngle = rotation + extraSpins * 360 + sliceAngle * prizeIndex;

    await controls.start({
      rotate: targetAngle,
      transition: { duration: 4, ease: [0.23, 1, 0.32, 1] },
    });

    setRotation(targetAngle);
    const prize = prizes[prizeIndex];
    setResult(prize.label);

    const value = parseFloat(prize.label.replace('$', ''));
    if (!isNaN(value) && value > 0) setTotalWon(prev => prev + value);

    setSpinning(false);
  };

  const RADIUS = 120;
  const CENTER = 130;

  // Eligible = has platinum or business
  const isEligible = cardTier === 'platinum' || cardTier === 'business';

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-3">
          <Gift size={14} className="text-gold" />
          <span className="text-xs font-semibold text-gold">Daily Spin Reward</span>
        </div>
        <h2 className="text-2xl font-bold text-black dark:text-white">Spin &amp; Win</h2>

        {isEligible ? (
          <>
            <p className="text-sm text-gray-500 mt-1">
              You have{' '}
              <span className="font-semibold text-gold">{spinsLeft}</span>
              {' '}of{' '}
              <span className="font-semibold text-gold">{maxSpins}</span>
              {' '}spin{maxSpins !== 1 ? 's' : ''} remaining today
            </p>
            {/* Spin dots */}
            <div className="flex items-center justify-center gap-2 mt-2">
              {Array.from({ length: maxSpins }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i < spinsLeft
                      ? 'bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.6)]'
                      : 'bg-gray-200 dark:bg-white/10'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400 mt-1">
            Platinum: <span className="text-gold font-semibold">2 spins/day</span>
            {' · '}
            Business: <span className="text-gold font-semibold">5 spins/day</span>
          </p>
        )}
      </div>

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

      {/* Wheel — always visible */}
      <div className="flex flex-col items-center gap-6">
        <div
          className={`relative transition-opacity duration-300 ${!isEligible ? 'opacity-50' : ''}`}
          style={{ width: CENTER * 2, height: CENTER * 2 }}
        >
          {/* Pointer */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10"
            style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '22px solid #D4AF37' }}
          />

          <motion.svg
            width={CENTER * 2}
            height={CENTER * 2}
            animate={controls}
            style={{ originX: '50%', originY: '50%' }}
          >
            {prizes.map((prize, i) => {
              const sliceAngle = 360 / prizes.length;
              const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);
              const x1 = CENTER + RADIUS * Math.cos(startAngle);
              const y1 = CENTER + RADIUS * Math.sin(startAngle);
              const x2 = CENTER + RADIUS * Math.cos(endAngle);
              const y2 = CENTER + RADIUS * Math.sin(endAngle);
              const midAngle = (startAngle + endAngle) / 2;
              const labelR = RADIUS * 0.65;
              const lx = CENTER + labelR * Math.cos(midAngle);
              const ly = CENTER + labelR * Math.sin(midAngle);
              const largeArc = sliceAngle > 180 ? 1 : 0;

              return (
                <g key={i}>
                  <path
                    d={`M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={prize.color}
                    stroke="#111"
                    strokeWidth="1.5"
                  />
                  <text
                    x={lx} y={ly}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="10" fontWeight="700"
                    fill={prize.color === '#D4AF37' || prize.color === '#B8860B' ? '#000' : '#fff'}
                    transform={`rotate(${i * sliceAngle + sliceAngle / 2}, ${lx}, ${ly})`}
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}
            <circle cx={CENTER} cy={CENTER} r={20} fill="#D4AF37" />
            <circle cx={CENTER} cy={CENTER} r={14} fill="#B8860B" />
          </motion.svg>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              key={result + rotation}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-black dark:text-white">
                {result === 'Try Again' ? '😅 Try Again!' : `🎉 You won ${result}!`}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {result === 'Try Again' ? 'Better luck next time.' : 'Credited to your FundSphere wallet.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={spinWheel}
          disabled={spinning || (isEligible && spinsLeft <= 0)}
          className="px-10 py-3.5 rounded-2xl bg-gold-gradient text-black font-bold text-sm gold-glow hover:opacity-90 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {spinning
            ? 'Spinning...'
            : isEligible && spinsLeft <= 0
            ? 'Come Back Tomorrow'
            : 'Spin Now'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-4 text-center">
          <Clock size={18} className="text-gold mx-auto mb-1" />
          <p className="text-xs text-gray-400">Resets in</p>
          <p className="font-bold text-black dark:text-white text-sm mt-0.5">23h 59m</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-4 text-center">
          <Star size={18} className="text-gold mx-auto mb-1" />
          <p className="text-xs text-gray-400">Total Won</p>
          <p className="font-bold text-black dark:text-white text-sm mt-0.5">${totalWon.toFixed(2)}</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-gold" />
          <p className="font-semibold text-black dark:text-white">Today&apos;s Winners</p>
        </div>
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div key={entry.rank} className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                entry.rank === 1 ? 'bg-gold text-black' : 'bg-gray-100 dark:bg-white/10 text-gray-500'
              }`}>
                {entry.rank}
              </span>
              <span className="flex-1 text-sm text-black dark:text-white font-medium">{entry.name}</span>
              <span className="text-sm font-bold text-emerald-500">{entry.prize}</span>
              <span className="text-xs text-gray-400">{entry.date}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
