'use client';

import { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Gift, Trophy, Clock, Star } from 'lucide-react';

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

export default function SpinWinView() {
  const [spinning, setSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const controls = useAnimation();

  const spinWheel = async () => {
    if (spinning || spinsLeft <= 0) return;
    setResult(null);
    setSpinning(true);
    setSpinsLeft((s) => s - 1);

    const extraSpins = 5 + Math.random() * 5;
    const sliceAngle = 360 / prizes.length;
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const targetAngle = rotation + extraSpins * 360 + sliceAngle * prizeIndex;

    await controls.start({
      rotate: targetAngle,
      transition: { duration: 4, ease: [0.23, 1, 0.32, 1] },
    });

    setRotation(targetAngle);
    setResult(prizes[prizeIndex].label);
    setSpinning(false);
  };

  const RADIUS = 120;
  const CENTER = 130;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-3">
          <Gift size={14} className="text-gold" />
          <span className="text-xs font-semibold text-gold">Daily Spin Reward</span>
        </div>
        <h2 className="text-2xl font-bold text-black dark:text-white">Spin & Win</h2>
        <p className="text-sm text-gray-500 mt-1">You have <span className="font-semibold text-gold">{spinsLeft}</span> spin{spinsLeft !== 1 ? 's' : ''} remaining today</p>
      </div>

      {/* Wheel */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative" style={{ width: CENTER * 2, height: CENTER * 2 }}>
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
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill={prize.color === '#D4AF37' || prize.color === '#B8860B' ? '#000' : '#fff'}
                    transform={`rotate(${i * sliceAngle + sliceAngle / 2}, ${lx}, ${ly})`}
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx={CENTER} cy={CENTER} r={20} fill="#D4AF37" />
            <circle cx={CENTER} cy={CENTER} r={14} fill="#B8860B" />
          </motion.svg>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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

        <button
          onClick={spinWheel}
          disabled={spinning || spinsLeft <= 0}
          className="px-10 py-3.5 rounded-2xl bg-gold-gradient text-black font-bold text-sm gold-glow hover:opacity-90 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {spinning ? 'Spinning...' : spinsLeft <= 0 ? 'Come Back Tomorrow' : 'Spin Now'}
        </button>
      </div>

      {/* Spins info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-4 text-center">
          <Clock size={18} className="text-gold mx-auto mb-1" />
          <p className="text-xs text-gray-400">Resets in</p>
          <p className="font-bold text-black dark:text-white text-sm mt-0.5">23h 59m</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-4 text-center">
          <Star size={18} className="text-gold mx-auto mb-1" />
          <p className="text-xs text-gray-400">Total Won</p>
          <p className="font-bold text-black dark:text-white text-sm mt-0.5">$0.00</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-gold" />
          <p className="font-semibold text-black dark:text-white">Today's Winners</p>
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
