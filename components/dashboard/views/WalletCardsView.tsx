'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Wifi, CreditCard, X, Check, Star, Zap, Building2,
  ShoppingCart, ChevronRight, Copy, Upload, Clock, ArrowLeft,
  RefreshCw, AlertCircle, CheckCircle,
} from 'lucide-react';
import { ChipIcon } from '../../icons/CryptoIcons';
import { useAuth } from '../../AuthContext';
import { authFetch, authFetchMultipart } from '../../../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type CardTier = 'gold' | 'platinum' | 'business';
type PaymentMethod = 'btc' | 'usdt' | 'eth';
type OrderStatus = 'pending' | 'confirmed' | 'rejected';

interface CardOrder {
  id: number;
  tier: CardTier;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  proofImageUrl: string | null;
  submittedAt: string;
  cardNumber: string;
  cardExpiry: string;
  cardHolder: string;
}

interface StoredCard {
  id: string;
  tier: CardTier;
  number: string;
  expiry: string;
  holder: string;
  cvv: string;
  balance: string;
  addedAt: string;
}

// ─── Card Tier Definitions ────────────────────────────────────────────────────

interface CardTierConfig {
  id: CardTier;
  name: string;
  tagline: string;
  price: string;
  gradient: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge: string;
  badgeBg: string;
  features: string[];
  cardGradient: string;
  glowColor: string;
  borderColor: string;
  accentHex: string;
}

const CARD_TIERS: CardTierConfig[] = [
  {
    id: 'gold',
    name: 'Gold Card',
    tagline: 'Everyday premium spending',
    price: '1,050 USD',
    gradient: 'from-amber-700 via-amber-600 to-amber-500',
    icon: Star,
    badge: 'Entry',
    badgeBg: 'bg-amber-100/80 text-amber-800 border border-amber-200',
    features: [
      'Virtual Visa debit card',
      'Priority support (email + chat)',
      'Up to $70,000 daily withdrawal',
    ],
    cardGradient: 'from-amber-900 via-amber-800 to-amber-700',
    glowColor: 'shadow-[0_15px_60px_-10px_rgba(245,158,11,0.4)]',
    borderColor: 'border-amber-500/40',
    accentHex: '#d97706',
  },
  {
    id: 'platinum',
    name: 'Platinum Card',
    tagline: 'Elevated freedom & rewards',
    price: '3,000 USD',
    gradient: 'from-gray-700 via-gray-600 to-gray-500',
    icon: Zap,
    badge: 'Most Popular',
    badgeBg: 'bg-gray-200/80 text-gray-900 border border-gray-300',
    features: [
      'All Gold benefits',
      'Up to $300,000 daily withdrawal',
      'Up to $2,000 credit line',
      'Spin-to-win rewards (2 attempts)',
    ],
    cardGradient: 'from-gray-800 via-gray-700 to-gray-600',
    glowColor: 'shadow-[0_15px_60px_-10px_rgba(156,163,175,0.5)]',
    borderColor: 'border-gray-400/50',
    accentHex: '#6b7280',
  },
  {
    id: 'business',
    name: 'Business Card',
    tagline: 'Enterprise-grade power',
    price: '8,000 USD',
    gradient: 'from-indigo-900 via-indigo-800 to-indigo-700',
    icon: Building2,
    badge: 'Premium',
    badgeBg: 'bg-indigo-100/80 text-indigo-900 border border-indigo-200',
    features: [
      'All Platinum benefits',
      'Unlimited withdrawals',
      'Up to $8,000 credit line',
      'Spin-to-win rewards (5 attempts)',
    ],
    cardGradient: 'from-indigo-950 via-indigo-900 to-indigo-800',
    glowColor: 'shadow-[0_15px_60px_-10px_rgba(99,102,241,0.45)]',
    borderColor: 'border-indigo-500/40',
    accentHex: '#4f46e5',
  },
];

// ─── Crypto Payment Wallets ───────────────────────────────────────────────────

const PAYMENT_WALLETS: Record<PaymentMethod, {
  label: string; symbol: string; address: string; color: string; network: string; emoji: string;
}> = {
  btc: {
    label: 'Bitcoin',
    symbol: 'BTC',
    address: 'bc1q55pmv8c2rpgtxnz5qx40kpe82dzp7ad42tq024',
    color: '#f7931a',
    network: 'Bitcoin Network',
    emoji: '₿',
  },
  usdt: {
    label: 'Tether USD',
    symbol: 'USDT',
    address: 'TQBZfMKBoLcAzTsaUE1x8F2EJWXF1U9j1w',
    color: '#26a17b',
    network: 'TRC20 (Tron Network)',
    emoji: '₮',
  },
  eth: {
    label: 'Ethereum',
    symbol: 'ETH',
    address: '0xCBDc0110eCbEb07a56a6BA9e74DF93D5Ad8C1D2F',
    color: '#627eea',
    network: 'Ethereum Mainnet',
    emoji: 'Ξ',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateCardNumber() {
  const rand4 = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `${rand4()} ${rand4()} ${rand4()} ${rand4()}`;
}

function generateExpiry() {
  const now = new Date();
  const year = (now.getFullYear() + 3).toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${month}/${year}`;
}

function generateCVV() {
  return Math.floor(100 + Math.random() * 900).toString();
}


// ─── Card Face: Front ─────────────────────────────────────────────────────────

function CardFront({ tier, cardNumber, expiry, holder, locked = false }: {
  tier: CardTierConfig; cardNumber: string; expiry: string; holder: string; locked?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className={`
        w-full h-full rounded-2xl bg-gradient-to-br ${tier.cardGradient}
        p-4 sm:p-6 relative overflow-hidden border ${tier.borderColor}
        shadow-2xl
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Enhanced depth with multiple overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-white/15 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIvPjwvZz48L2c+PC9zdmc+')] pointer-events-none" />
      
      {/* Dynamic glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-2xl opacity-0"
        animate={{ 
          background: `radial-gradient(circle at 30% 30%, ${tier.accentHex}20 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${tier.accentHex}15 0%, transparent 50%)`
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between text-white">
        {/* Top row – brand & contactless */}
        <div className="flex items-center justify-between">
          <div>
            <motion.p 
              className="text-xs font-semibold tracking-widest uppercase opacity-80"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {tier.name}
            </motion.p>
            <motion.p 
              className="text-sm font-bold tracking-wide mt-0.5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              FUNDSPHERE
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Wifi size={20} className="opacity-70" />
          </motion.div>
        </div>

        {/* Center – chip + network logo area */}
        <div className="flex items-center justify-between mt-3 sm:mt-6">
          <motion.div 
            className="w-12 h-9 bg-gradient-to-br from-amber-300/40 to-yellow-100/30 rounded-md flex items-center justify-center border border-white/30 shadow-inner"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ChipIcon className="w-8 h-6 opacity-90" />
          </motion.div>
          <motion.p 
            className="text-2xl font-black tracking-tighter italic opacity-90"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            VISA
          </motion.p>
        </div>

        {/* Card number – animated reveal */}
        <div className="mt-3 sm:mt-6 relative">
          <div className="flex items-center gap-2">
            <motion.p
              className={`text-sm sm:text-base md:text-xl font-mono tracking-[0.15em] sm:tracking-[0.2em] font-semibold opacity-95 break-all transition-all duration-300 ${locked ? 'blur-[5px] select-none' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.95, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {cardNumber}
            </motion.p>
            {!locked && (
              <button
                onClick={handleCopy}
                className="flex-shrink-0 p-1.5 rounded-md bg-white/15 hover:bg-white/30 transition-colors"
                title="Copy card number"
              >
                {copied
                  ? <Check size={13} className="text-green-300" />
                  : <Copy size={13} className="text-white/80" />
                }
              </button>
            )}
          </div>
          {locked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider">
                🔒 Unlocks after payment
              </span>
            </div>
          )}
        </div>

        {/* Bottom – holder + expiry */}
        <div className="flex justify-between items-end mt-3 sm:mt-6">
          <div>
            <motion.p 
              className="text-[10px] uppercase tracking-wider opacity-60 font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              Cardholder
            </motion.p>
            <motion.p 
              className="text-base font-semibold tracking-wide truncate max-w-[180px]"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {holder.toUpperCase()}
            </motion.p>
          </div>

          <div className="text-right">
            <motion.p 
              className="text-[10px] uppercase tracking-wider opacity-60 font-medium"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              Valid Thru
            </motion.p>
            <motion.p 
              className="text-lg font-semibold"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {expiry}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ backgroundColor: tier.accentHex }}
      />
    </motion.div>
  );
}

// ─── Card Face: Back ──────────────────────────────────────────────────────────

function CardBack({ tier, cvv, holder, locked = false }: {
  tier: CardTierConfig; cvv: string; holder: string; locked?: boolean;
}) {
  return (
    <motion.div 
      className={`
        w-full h-full rounded-2xl bg-gradient-to-br ${tier.cardGradient}
        border ${tier.borderColor} shadow-2xl relative overflow-hidden
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      
      {/* Enhanced magnetic stripe */}
      <motion.div 
        className="h-10 bg-gradient-to-r from-gray-950 via-black to-gray-950 mt-8 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTAgMGgxMHYxMEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      </motion.div>

      {/* Signature panel + CVV */}
      <div className="px-6 mt-5">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex-1 h-10 bg-white/90 rounded flex items-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/30 opacity-50" />
            <div className="w-full h-5 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 opacity-40 rounded relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60" />
            </div>
            <div className="absolute right-2 text-[8px] text-gray-400 italic">Authorized Signature</div>
          </div>

          <div className="bg-white/95 rounded px-4 py-2 min-w-[70px] text-center border border-gray-300 relative overflow-hidden">
            <p className="text-[10px] uppercase tracking-wider text-gray-600 font-medium">CVV</p>
            <motion.p
              className={`text-lg font-mono font-bold text-gray-900 transition-all duration-300 ${locked ? 'blur-[6px] select-none' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              {cvv}
            </motion.p>
            {locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded">
                <span className="text-[9px] font-bold text-gray-500 tracking-wider">🔒 LOCKED</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50 pointer-events-none" />
          </div>
        </motion.div>

        <motion.p 
          className="mt-3 text-xs text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.7 }}
        >
          Cardholder: {holder.toUpperCase()}
        </motion.p>
      </div>

      <motion.div 
        className="absolute bottom-4 left-6 right-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-[10px] text-center text-white/40 leading-tight">
          This card remains the property of FUNDSPHERE. Unauthorized use is prohibited.
        </p>
      </motion.div>

      {/* Enhanced security patterns */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ backgroundColor: tier.accentHex }}
      />
    </motion.div>
  );
}

// ─── Flippable Card ───────────────────────────────────────────────────────────

function FlippableCard({ tier, cardNumber, expiry, holder, cvv, locked = false }: {
  tier: CardTierConfig; cardNumber: string; expiry: string; holder: string; cvv: string; locked?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full cursor-pointer select-none" style={{ perspective: '1500px' }} onClick={() => setFlipped(f => !f)}>
        <motion.div
          animate={{ 
            rotateY: flipped ? 180 : 0,
            scale: flipped ? 1.03 : 1
          }}
          transition={{ 
            duration: 0.8, 
            type: 'spring', 
            stiffness: 180, 
            damping: 24 
          }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', willChange: 'transform' }}
          className={`w-full rounded-3xl ${tier.glowColor}`}
        >
          {/* Front face */}
          <div
            className="w-full rounded-3xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg)', aspectRatio: '85.6 / 54' }}
          >
            <CardFront tier={tier} cardNumber={cardNumber} expiry={expiry} holder={holder} locked={locked} />
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CardBack tier={tier} cvv={cvv} holder={holder} locked={locked} />
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => setFlipped(f => !f)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          rotate: flipped ? 180 : 0,
          color: flipped ? '#6b7280' : '#9ca3af'
        }}
        transition={{ duration: 0.3 }}
      >
        <RefreshCw size={11} />
        {flipped ? 'View front' : 'Tap to see back'}
      </motion.button>
    </div>
  );
}

// ─── Purchase Modal (choose tier) ────────────────────────────────────────────

function PurchaseModal({ onClose, onSelect }: {
  onClose: () => void;
  onSelect: (tier: CardTier) => void;
}) {
  const [selected, setSelected] = useState<CardTier | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm sm:p-4 p-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-lg bg-white dark:bg-gray-950 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col"
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 sm:pt-6 pb-4 border-b border-gray-100 dark:border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">Choose Your Card</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Select a tier that suits your needs</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 hover:bg-gray-200 transition">
            <X size={18} />
          </button>
        </div>

        {/* Tier list */}
        <div className="flex-1 overflow-y-auto dashboard-scroll px-4 sm:px-6 py-4 space-y-3">
          {CARD_TIERS.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selected === tier.id;
            return (
              <motion.button
                key={tier.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(tier.id)}
                className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                  isSelected
                    ? `${tier.borderColor} bg-gradient-to-br ${tier.gradient} text-white shadow-xl`
                    : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                {/* Top row: icon + name/badge + selected check */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-white dark:bg-white/10 shadow-sm'}`}>
                    <Icon size={18} className={isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-black dark:text-white'}`}>{tier.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/25 text-white' : tier.badgeBg}`}>{tier.badge}</span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/75' : 'text-gray-500 dark:text-gray-400'}`}>{tier.tagline}</p>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
                      <Check size={13} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Price pill */}
                <div className={`inline-flex items-baseline gap-1 px-3 py-1.5 rounded-xl mb-3 ${isSelected ? 'bg-white/15' : 'bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10'}`}>
                  <span className={`text-lg font-black tracking-tight ${isSelected ? 'text-white' : 'text-black dark:text-white'}`}>{tier.price}</span>
                </div>

                {/* Features */}
                <ul className="space-y-1.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <Check size={11} className={`flex-shrink-0 mt-0.5 ${isSelected ? 'text-white/80' : 'text-green-500'}`} />
                      <span className={isSelected ? 'text-white/80' : 'text-gray-600 dark:text-gray-300'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-white/10 flex-shrink-0">
          {selected && (
            <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">
              You selected: <span className="font-semibold text-black dark:text-white">{CARD_TIERS.find(t => t.id === selected)?.name}</span> — {CARD_TIERS.find(t => t.id === selected)?.price}
            </motion.p>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all ${
              selected ? 'bg-black dark:bg-gold text-white dark:text-black hover:opacity-90 shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={16} />
            {selected ? `Purchase ${CARD_TIERS.find(t => t.id === selected)?.name}` : 'Select a Card to Continue'}
            {selected && <ChevronRight size={16} />}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Checkout Screen ──────────────────────────────────────────────────────────

function CheckoutScreen({ tier, holder, onBack, onSubmitted }: {
  tier: CardTierConfig;
  holder: string;
  onBack: () => void;
  onSubmitted: (order: CardOrder) => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('btc');
  const [copied, setCopied] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [hasProofFile, setHasProofFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Stable card data — generated once on mount
  const [cardNumber] = useState(() => generateCardNumber());
  const [expiry] = useState(() => generateExpiry());
  const [cvv] = useState(() => generateCVV());

  const wallet = PAYMENT_WALLETS[paymentMethod];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* fallback: browser didn't allow */ }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    setHasProofFile(true);
    const reader = new FileReader();
    reader.onload = (ev) => setProofPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!proofFile) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('tier', tier.id);
      formData.append('payment_method', paymentMethod);
      formData.append('proof_image', proofFile);
      formData.append('card_number', cardNumber);
      formData.append('card_expiry', expiry);
      formData.append('card_holder', holder);
      formData.append('card_cvv', cvv);

      const res = await authFetchMultipart('/api/cards/orders/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) return;

      const data = await res.json();
      const order: CardOrder = {
        id: data.id,
        tier: data.tier,
        status: data.status,
        paymentMethod: data.payment_method,
        proofImageUrl: data.proof_image_url,
        submittedAt: data.submitted_at,
        cardNumber: data.card_number,
        cardExpiry: data.card_expiry,
        cardHolder: data.card_holder,
      };
      onSubmitted(order);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100 dark:border-white/10 flex-shrink-0">
        <button onClick={onBack} className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-black dark:text-white truncate">Activate {tier.name}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Complete crypto payment to activate your card</p>
        </div>
        <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r ${tier.gradient} text-white`}>
          {tier.price}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* Card preview section */}
        <div className="px-4 sm:px-6 py-4 sm:py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/60 dark:to-gray-950 flex flex-col items-center">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center mb-5">
             Activate Card Now — Preview
          </p>
          <div className="w-full max-w-sm">
            <FlippableCard tier={tier} cardNumber={cardNumber} expiry={expiry} holder={holder} cvv={cvv} locked />
          </div>
        </div>

        {/* Payment section */}
        <div className="px-5 py-6 space-y-5">

          {/* Title */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">Choose Payment Method</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Send exactly <strong className="text-black dark:text-white">{tier.price}</strong> to the address below
            </p>
          </div>

          {/* Crypto tabs */}
          <div className="flex gap-2">
            {(['btc', 'usdt', 'eth'] as PaymentMethod[]).map((method) => {
              const w = PAYMENT_WALLETS[method];
              const isActive = paymentMethod === method;
              return (
                <button
                  key={method}
                  onClick={() => { setPaymentMethod(method); setCopied(false); }}
                  className={`flex-1 py-3 px-2 rounded-2xl border-2 transition-all text-center ${
                    isActive ? 'border-transparent text-white shadow-lg' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                  style={isActive ? { background: w.color } : {}}
                >
                  <span className="text-xl block">{w.emoji}</span>
                  <span className={`text-xs font-bold block mt-0.5 ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{w.symbol}</span>
                </button>
              );
            })}
          </div>

          {/* Wallet address */}
          <AnimatePresence mode="wait">
            <motion.div
              key={paymentMethod}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{wallet.label} Address</p>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{wallet.network}</span>
              </div>

              <div className="flex items-start gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <p className="flex-1 text-xs font-mono text-gray-800 dark:text-gray-200 break-all leading-relaxed">{wallet.address}</p>
                <button
                  onClick={handleCopy}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    copied ? 'bg-green-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
                  }`}
                >
                  {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Network warning */}
              <div
                className="flex items-start gap-2 p-3 rounded-xl text-xs"
                style={{ background: `${wallet.color}18`, border: `1px solid ${wallet.color}35` }}
              >
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: wallet.color }} />
                <p style={{ color: wallet.color }}>
                  Send only <strong>{wallet.symbol}</strong> on <strong>{wallet.network}</strong>. Sending wrong assets may result in permanent loss.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <p className="text-xs font-medium text-gray-400">After you've sent payment</p>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          {/* Upload proof */}
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-bold text-black dark:text-white">Upload Payment Screenshot</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">A screenshot of your transaction confirmation</p>
            </div>

            <label className="block cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {proofPreview ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden border-2 border-green-400 dark:border-green-500"
                >
                  <img src={proofPreview} alt="Payment proof" className="w-full max-h-52 object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition gap-2">
                    <p className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-lg">Click to change</p>
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-green-500 rounded-full p-1">
                    <Check size={13} className="text-white" />
                  </div>
                </motion.div>
              ) : (
                <div className="w-full py-9 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/15 hover:border-gray-300 dark:hover:border-white/25 transition flex flex-col items-center gap-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <span className="text-sm font-semibold">Tap to upload screenshot</span>
                  <span className="text-xs">PNG, JPG, or WEBP accepted</span>
                </div>
              )}
            </label>
          </div>

          {/* Submit button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!hasProofFile || submitting}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              hasProofFile && !submitting
                ? 'bg-black dark:bg-gold text-white dark:text-black shadow-lg hover:opacity-90'
                : 'bg-gray-100 dark:bg-white/10 text-gray-400 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
                Submitting Proof…
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Submit Payment Proof
                <ChevronRight size={16} />
              </>
            )}
          </motion.button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 pb-6">
            Our team will verify your payment and activate your card within 24 hours.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Confirmation Screen ──────────────────────────────────────────────────────

function ConfirmationScreen({ order, tier, onDone }: {
  order: CardOrder; tier: CardTierConfig; onDone: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 280 }}
        className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-6"
      >
        <Clock size={36} className="text-amber-500" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-black text-black dark:text-white">Proof Submitted!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-xs mx-auto leading-relaxed">
          We've received your payment screenshot. Your {tier.name} will be activated once our team verifies your payment.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="mt-6 w-full max-w-xs rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 text-left space-y-2.5"
      >
        {[
          { label: 'Order ID', value: `#${order.id}`, mono: true },
          { label: 'Card Tier', value: tier.name, mono: false },
          { label: 'Payment', value: `${order.paymentMethod.toUpperCase()} · ${tier.price}`, mono: false },
          { label: 'Status', value: 'Pending Verification', amber: true },
        ].map(({ label, value, mono, amber }) => (
          <div key={label} className="flex justify-between items-center text-xs">
            <span className="text-gray-500">{label}</span>
            <span className={`font-semibold ${amber ? 'text-amber-500' : 'text-black dark:text-white'} ${mono ? 'font-mono' : ''}`}>{value}</span>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        onClick={onDone}
        whileTap={{ scale: 0.97 }}
        className="mt-8 px-8 py-3.5 rounded-2xl bg-black dark:bg-gold text-white dark:text-black text-sm font-bold hover:opacity-90 transition shadow-lg"
      >
        Back to Wallet Cards
      </motion.button>
    </motion.div>
  );
}

// ─── Pending Orders Banner ────────────────────────────────────────────────────

function PendingOrderBanner({ orders }: { orders: CardOrder[] }) {
  if (orders.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Clock size={17} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
            {orders.length === 1 ? 'Card Order Pending Confirmation' : `${orders.length} Card Orders Pending`}
          </p>
          <div className="mt-1 space-y-0.5">
            {orders.map(o => {
              const t = CARD_TIERS.find(c => c.id === o.tier);
              return (
                <p key={o.id} className="text-xs text-amber-700 dark:text-amber-400">
                  {t?.name} · {o.paymentMethod.toUpperCase()} · Submitted {new Date(o.submittedAt).toLocaleDateString()}
                </p>
              );
            })}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
            Your card will appear here once our team confirms your payment.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Confirmed Card (flippable, on the cards page) ───────────────────────────

function ConfirmedCardVisual({ card, tier }: { card: StoredCard; tier: CardTierConfig }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full cursor-pointer select-none" style={{ perspective: '1500px' }} onClick={() => setFlipped(f => !f)}>
        <motion.div
          animate={{ 
            rotateY: flipped ? 180 : 0,
            scale: flipped ? 1.03 : 1
          }}
          transition={{ 
            duration: 0.8, 
            type: 'spring', 
            stiffness: 180, 
            damping: 24 
          }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', willChange: 'transform' }}
          className={`w-full rounded-3xl ${tier.glowColor}`}
        >
          <div
            className="w-full rounded-3xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg)', aspectRatio: '85.6 / 54' }}
          >
            <CardFront tier={tier} cardNumber={card.number} expiry={card.expiry} holder={card.holder} />
          </div>
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <CardBack tier={tier} cvv={card.cvv} holder={card.holder} />
          </div>
        </motion.div>
      </div>
      <motion.button
        onClick={() => setFlipped(f => !f)}
        className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          rotate: flipped ? 180 : 0,
          color: flipped ? '#6b7280' : '#9ca3af'
        }}
        transition={{ duration: 0.3 }}
      >
        <RefreshCw size={10} />
        {flipped ? 'View front' : 'Tap to see back'}
      </motion.button>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

type AppStep = 'cards' | 'checkout' | 'done';

export default function WalletCardsView() {
  const { user } = useAuth();
  const [step, setStep] = useState<AppStep>('cards');
  const [showPurchase, setShowPurchase] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<CardTierConfig | null>(null);
  const [latestOrder, setLatestOrder] = useState<CardOrder | null>(null);
  const [userOrders, setUserOrders] = useState<CardOrder[]>([]);
  const [confirmedCards, setConfirmedCards] = useState<StoredCard[]>([]);

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const [ordersRes, cardsRes] = await Promise.all([
        authFetch('/api/cards/orders/'),
        authFetch('/api/cards/cards/'),
      ]);
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUserOrders(data.map((o: any) => ({
          id: o.id,
          tier: o.tier,
          status: o.status,
          paymentMethod: o.payment_method,
          proofImageUrl: o.proof_image_url,
          submittedAt: o.submitted_at,
          cardNumber: o.card_number,
          cardExpiry: o.card_expiry,
          cardHolder: o.card_holder,
        } as CardOrder)));
      }
      if (cardsRes.ok) {
        const data = await cardsRes.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setConfirmedCards(data.map((o: any) => ({
          id: String(o.id),
          tier: o.tier as CardTier,
          number: o.card_number as string,
          expiry: o.card_expiry as string,
          holder: o.card_holder as string,
          cvv: o.card_cvv as string,
          balance: '$0.00',
          addedAt: o.submitted_at as string,
        } as StoredCard)));
      }
    } catch { /* silently fail */ }
  };

  useEffect(() => {
    refreshUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSelectTier = (tier: CardTier) => {
    setCheckoutTier(CARD_TIERS.find(t => t.id === tier)!);
    setShowPurchase(false);
    setStep('checkout');
  };

  const handleOrderSubmitted = (order: CardOrder) => {
    setLatestOrder(order);
    setUserOrders(prev => [...prev, order]);
    setStep('done');
  };

  const handleDone = () => {
    setStep('cards');
    setCheckoutTier(null);
    setLatestOrder(null);
    refreshUserData();
  };

  const pendingOrders = userOrders.filter(o => o.status === 'pending');
  const hasCards = confirmedCards.length > 0;

  return (
    <>
      <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Your Cards</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {hasCards ? `${confirmedCards.length} active card${confirmedCards.length > 1 ? 's' : ''}` : 'No cards yet'}
            </p>
          </div>
          <button
            onClick={() => setShowPurchase(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black dark:bg-gold text-white dark:text-black text-sm font-semibold hover:opacity-80 transition"
          >
            <Plus size={15} />
            Add Card
          </button>
        </div>

        {/* Pending banner */}
        <PendingOrderBanner orders={pendingOrders} />

        {/* Empty state */}
        {!hasCards && pendingOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 p-10 flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
              <CreditCard size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <p className="font-bold text-black dark:text-white text-lg">No cards yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                Choose from our Gold, Platinum, or Business tiers to get started.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {CARD_TIERS.map(t => (
                <span key={t.id} className={`text-xs font-semibold px-3 py-1 rounded-full ${t.badgeBg}`}>{t.name}</span>
              ))}
            </div>
            <button
              onClick={() => setShowPurchase(true)}
              className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl bg-black dark:bg-gold text-white dark:text-black text-sm font-bold hover:opacity-80 transition shadow-lg"
            >
              <ShoppingCart size={16} />
              Purchase a Card
            </button>
          </motion.div>
        )}

        {/* Confirmed cards */}
        {hasCards && (
          <>
            <div className="space-y-6 flex flex-col items-center">
              {confirmedCards.map(card => {
                const tier = CARD_TIERS.find(t => t.id === card.tier)!;
                return (
                  <div key={card.id} className="w-full max-w-sm">
                    <ConfirmedCardVisual card={card} tier={tier} />
                  </div>
                );
              })}
            </div>

           

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
            >
              <p className="font-semibold text-black dark:text-white mb-4">Spending Summary</p>
              <div className="space-y-3">
                {[{ label: 'Total Funded', value: '$0.00' }, { label: 'Total Spent', value: '$0.00' }, { label: 'Available', value: '$0.00' }].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-black dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchase && (
          <PurchaseModal onClose={() => setShowPurchase(false)} onSelect={handleSelectTier} />
        )}
      </AnimatePresence>

      {/* Checkout Screen */}
      <AnimatePresence>
        {step === 'checkout' && checkoutTier && (
          <CheckoutScreen
            tier={checkoutTier}
            holder={user?.name ?? 'Card Holder'}
            onBack={() => { setStep('cards'); setShowPurchase(true); }}
            onSubmitted={handleOrderSubmitted}
          />
        )}
      </AnimatePresence>

      {/* Confirmation Screen */}
      <AnimatePresence>
        {step === 'done' && latestOrder && checkoutTier && (
          <ConfirmationScreen order={latestOrder} tier={checkoutTier} onDone={handleDone} />
        )}
      </AnimatePresence>
    </>
  );
}
