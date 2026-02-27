'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wifi, CreditCard } from 'lucide-react';
import { ChipIcon } from '../../icons/CryptoIcons';

const cardGradients = [
  'from-gray-900 via-gray-800 to-black',
  'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
  'from-[#2d1b00] via-[#4a2e00] to-[#2d1b00]',
];

export default function WalletCardsView() {
  const [activeCard, setActiveCard] = useState(0);

  const cards = [
    {
      id: 1,
      type: 'Virtual Debit',
      number: '**** **** **** 0000',
      holder: 'FundSphere User',
      expiry: '••/••',
      balance: '$0.00',
      gradient: cardGradients[0],
      network: 'VISA',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Your Cards</p>
          <p className="text-xs text-gray-400 mt-0.5">{cards.length} active card</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black dark:bg-gold text-white dark:text-black text-sm font-semibold hover:opacity-80 transition">
          <Plus size={15} />
          Add Card
        </button>
      </div>

      {/* Card Carousel */}
      <div className="space-y-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => setActiveCard(idx)}
            className={`relative w-full rounded-3xl bg-gradient-to-br ${card.gradient} p-6 cursor-pointer overflow-hidden select-none`}
            style={{ aspectRatio: '1.586 / 1', maxHeight: 220 }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-3xl" />

            {/* Top row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-white/50 uppercase">{card.type}</p>
                <p className="text-xl font-bold text-white mt-1">{card.balance}</p>
              </div>
              <Wifi size={22} className="text-white/60 rotate-90" />
            </div>

            {/* Chip */}
            <div className="w-11 h-8 mb-5">
              <ChipIcon className="w-full h-full" />
            </div>

            {/* Card number */}
            <p className="text-base font-mono tracking-widest text-white/80 mb-4">{card.number}</p>

            {/* Bottom row */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Card Holder</p>
                <p className="text-sm font-semibold text-white">{card.holder}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Expires</p>
                <p className="text-sm font-semibold text-white">{card.expiry}</p>
              </div>
            </div>

            {/* Network badge */}
            <div className="absolute bottom-5 right-6 text-white/70 font-black italic text-lg tracking-tight">
              {card.network}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Card Actions */}
      <div className="grid grid-cols-3 gap-3">
        {['Fund Card', 'Freeze Card', 'Card Details'].map((action, i) => (
          <motion.button
            key={action}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 hover:border-gold/40 hover:bg-gold/5 transition text-xs font-semibold text-gray-700 dark:text-gray-300"
          >
            <CreditCard size={18} className="text-gold" />
            {action}
          </motion.button>
        ))}
      </div>

      {/* Spending Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <p className="font-semibold text-black dark:text-white mb-4">Spending Summary</p>
        <div className="space-y-3">
          {[
            { label: 'Total Funded', value: '$0.00' },
            { label: 'Total Spent', value: '$0.00' },
            { label: 'Available', value: '$0.00' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-black dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* No transactions notice */}
      <div className="text-center py-8 text-sm text-gray-400">
        No card transactions yet. Fund your card to get started.
      </div>
    </div>
  );
}
