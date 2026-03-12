'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Gift, Trophy, Clock, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { authFetch } from '../../../lib/api';

// ─── Config ─────────────────────────────────────────────────────────────────────

const prizes = [
  { label: '$20',        color: '#1a1a1a' },
  { label: '$100',        color: '#D4AF37' },
  { label: '$2',        color: '#1a1a1a' },
  { label: '$200',       color: '#B8860B' },
  { label: '$5',        color: '#1a1a1a' },
  { label: '$65',        color: '#D4AF37' },
  { label: '$12',        color: '#1a1a1a' },
  { label: 'Try Again', color: '#333333' },
];

// ─── Countdown helper ───────────────────────────────────────────────────────────

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function SpinWinView({ onNavigateToCards: _onNavigateToCards }: { onNavigateToCards?: () => void }) {
  const { user, updateUser } = useAuth();

  const [eligibleTier, setEligibleTier] = useState<string | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [maxSpins, setMaxSpins] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [totalWon, setTotalWon] = useState('0.00');
  const [error, setError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());
  const [leaderboard, setLeaderboard] = useState<{ rank: number; name: string; prize: string; date: string }[]>([]);
  const controls = useAnimation();

  const fetchStatus = useCallback(async () => {
    const res = await authFetch('/api/spinwin/status/');
    if (res.ok) {
      const data = await res.json();
      setEligibleTier(data.eligible_tier);
      setMaxSpins(data.max_spins);
      setSpinsLeft(data.spins_left);
      setTotalWon(parseFloat(data.total_won).toFixed(2));
    }
    setStatusLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchStatus();

    authFetch('/api/spinwin/leaderboard/').then(res => {
      if (res.ok) res.json().then(setLeaderboard);
    });

    const timer = setInterval(() => setCountdown(getTimeUntilMidnight()), 60000);
    return () => clearInterval(timer);
  }, [user, fetchStatus]);

  const spinWheel = async () => {
    if (!user || spinning || spinsLeft <= 0) return;
    setError('Spin & Win is temporarily not available.');
    return;

    // eslint-disable-next-line no-unreachable
    setError(null);
    setResult(null);
    setSpinning(true);

    const res = await authFetch('/api/spinwin/spin/', { method: 'POST' });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to spin. Please try again.');
      setSpinning(false);
      return;
    }

    const data = await res.json();
    const prizeIndex: number = data.prize_index;

    // Animate wheel to the server-decided segment
    const extraSpins = 5 + Math.random() * 5;
    const sliceAngle = 360 / prizes.length;
    const targetAngle = rotation + extraSpins * 360 + sliceAngle * prizeIndex;

    await controls.start({
      rotate: targetAngle,
      transition: { duration: 4, ease: [0.23, 1, 0.32, 1] },
    });

    setRotation(targetAngle);
    setResult(data.prize_label);
    setSpinsLeft(data.spins_left);
    setTotalWon(parseFloat(data.total_won).toFixed(2));

    // Sync winnings into the auth context so the dashboard balance updates immediately
    if (parseFloat(data.prize_amount) > 0) {
      updateUser({ balance: Number(user.balance) + parseFloat(data.prize_amount) });
    }

    // Refresh leaderboard
    authFetch('/api/spinwin/leaderboard/').then(r => { if (r.ok) r.json().then(setLeaderboard); });

    setSpinning(false);
  };

  const RADIUS = 120;
  const CENTER = 130;
  const isEligible = !!eligibleTier;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-3">
          <Gift size={14} className="text-gold" />
          <span className="text-xs font-semibold text-gold">Daily Spin Reward</span>
        </div>
        <h2 className="text-2xl font-bold text-black dark:text-white">Spin &amp; Win</h2>

        {!statusLoading && (
          isEligible ? (
            <>
              <p className="text-sm text-gray-500 mt-1">
                You have{' '}
                <span className="font-semibold text-gold">{spinsLeft}</span>
                {' '}of{' '}
                <span className="font-semibold text-gold">{maxSpins}</span>
                {' '}spin{maxSpins !== 1 ? 's' : ''} remaining today
              </p>
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
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 font-medium">
              Upgrade to a Platinum or Business card to access Spin &amp; Win
            </p>
          )
        )}
      </div>

      {/* Upgrade Banner — gold tier */}
      <AnimatePresence>
        {!statusLoading && !isEligible && (
          <motion.div
            className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <AlertCircle size={18} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              Upgrade to a <strong>Platinum</strong> or <strong>Business</strong> card to access Spin &amp; Win.
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

      {/* Wheel */}
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
                {result === 'Try Again' || result === '$0' ? '😅 Try Again!' : `🎉 You won ${result}!`}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {result === 'Try Again' || result === '$0'
                  ? 'Better luck next time.'
                  : 'Credited to your FundSphere wallet.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={spinWheel}
          disabled={spinning || statusLoading || !isEligible || spinsLeft <= 0}
          className="px-10 py-3.5 rounded-2xl bg-gold-gradient text-black font-bold text-sm gold-glow hover:opacity-90 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {spinning
            ? 'Spinning...'
            : !isEligible
            ? 'Platinum / Business Card Required'
            : spinsLeft <= 0
            ? 'Come Back Tomorrow'
            : 'Spin Now'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-4 text-center">
          <Clock size={18} className="text-gold mx-auto mb-1" />
          <p className="text-xs text-gray-400">Resets in</p>
          <p className="font-bold text-black dark:text-white text-sm mt-0.5">{countdown}</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-4 text-center">
          <Star size={18} className="text-gold mx-auto mb-1" />
          <p className="text-xs text-gray-400">Total Won</p>
          <p className="font-bold text-black dark:text-white text-sm mt-0.5">${totalWon}</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-gold" />
          <p className="font-semibold text-black dark:text-white">Today&apos;s Winners</p>
        </div>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-2">No winners yet today. Be the first!</p>
        ) : (
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
        )}
      </div>

    </div>
  );
}
