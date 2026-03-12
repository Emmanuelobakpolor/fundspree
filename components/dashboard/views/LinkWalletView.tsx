'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, AlertCircle, User, Mail, Hash,
  CheckCircle2, Trash2, ChevronDown, Search, Wallet,
  CreditCard, Lock, PenLine,
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { authFetch } from '../../../lib/api';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ExternalWallet {
  id: string;
  name: string;
  abbr?: string;
}

interface LinkedWallet {
  id: string;
  userId: string;
  walletId: string;
  walletName: string;
  fullName: string;
  email: string;
  accountNumber: string;
  linkedAt: string;
}

// ─── Wallet List ───────────────────────────────────────────────────────────────

const EXTERNAL_WALLETS: ExternalWallet[] = [
  { id: 'gbp', name: 'Global Business Pay', abbr: 'GBP' },
  { id: 'gsp', name: 'Global Swift Pay', abbr: 'GSP' },
  { id: 'igp', name: 'Insta Global Pay', abbr: 'IGP' },
  { id: 'imp', name: 'Instant Merchant Payments', abbr: 'IMP' },
  { id: 'aiwps', name: 'Advanced IWPS', abbr: 'AIWPS' },
  { id: 'ngw', name: 'Nexa Global Wallet', abbr: 'NGW' },
  { id: 'intmp', name: 'International Merchant Pay', abbr: 'INTMP' },
  { id: 'asp', name: 'Advanced Swift Pay', abbr: 'ASP' },
  { id: 'sbp', name: 'Swift Business Pay', abbr: 'SBP' },
  { id: 'iwp', name: 'Insta Wallet Pay', abbr: 'IWP' },
  { id: 'instant-wallet', name: 'Instant Wallet Pay', abbr: 'INW' },
  { id: 'universal-global', name: 'Universal Global Pay', abbr: 'UGP' },
  { id: 'insta-business', name: 'Insta Business Pay', abbr: 'IBP' },
  { id: 'global-swift-us', name: 'Global Swift US' ,abbr: 'GS' },
  { id: 'kingscoin', name: 'Kingscoin Wallet' ,abbr: 'KCW'},
  { id: 'lezochain', name: 'LezoChain', abbr: 'LC' },
  { id: 'zenquick', name: 'ZenQuick Cash', abbr: 'ZQC' },
  { id: 'konnect', name: 'Konnect Wallet', abbr: 'KW' },
  { id: 'globe-pay', name: 'Globe Pay', abbr: 'GP' },
];

// ─── localStorage helpers ───────────────────────────────────────────────────────

function loadLinkedWallets(): LinkedWallet[] {
  try {
    return JSON.parse(localStorage.getItem('fundspree_linked_wallets') || '[]');
  } catch {
    return [];
  }
}

function saveLinkedWallets(wallets: LinkedWallet[]): void {
  localStorage.setItem('fundspree_linked_wallets', JSON.stringify(wallets));
}


// ─── Custom Wallet Dropdown ────────────────────────────────────────────────────

function WalletDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const OTHER = { id: 'other', name: 'Other', abbr: '...' };
  const selected = value === 'other' ? OTHER : EXTERNAL_WALLETS.find(w => w.id === value);
  const filtered = EXTERNAL_WALLETS.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    (w.abbr && w.abbr.toLowerCase().includes(search.toLowerCase()))
  );
  const showOther = 'other'.includes(search.toLowerCase()) || 'other wallet'.includes(search.toLowerCase()) || search === '';

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch(''); }}
        className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-left transition-all duration-200 focus:outline-none"
        style={{
          borderColor: open ? 'rgba(212,175,55,0.5)' : undefined,
          background: open ? 'rgba(255,255,255,0.08)' : undefined,
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
          <Wallet size={14} className="text-[#D4AF37]" />
        </div>
        <div className="flex-1 min-w-0">
          {selected ? (
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium truncate">{selected.name}</span>
              {selected.id === 'other' ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/50 border border-white/10 font-mono font-semibold flex-shrink-0">
                  Custom
                </span>
              ) : selected.abbr && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 font-mono font-semibold flex-shrink-0">
                  {selected.abbr}
                </span>
              )}
            </div>
          ) : (
            <span className="text-white/30 text-sm">Choose a wallet…</span>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/40 flex-shrink-0"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-white/10 overflow-hidden"
            style={{
              background: 'rgba(10,10,10,0.97)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 24px 64px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.1)',
            }}
          >
            {/* Search */}
            <div className="p-3 border-b border-white/8">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                  <Search size={13} />
                </div>
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search wallets…"
                  className="w-full bg-white/5 border border-white/8 rounded-lg pl-8 pr-3 py-2 text-white text-xs placeholder-white/25 focus:outline-none focus:border-[#D4AF37]/30 transition-all"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-56 overflow-y-auto overscroll-contain">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-white/30 text-xs">No wallets found</div>
              ) : (
                filtered.map((wallet, i) => {
                  const isSelected = wallet.id === value;
                  return (
                    <motion.button
                      key={wallet.id}
                      type="button"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.015 }}
                      onClick={() => {
                        onChange(wallet.id);
                        setOpen(false);
                        setSearch('');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 group"
                      style={{
                        background: isSelected
                          ? 'rgba(212,175,55,0.08)'
                          : undefined,
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = '';
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold font-mono"
                        style={{
                          background: isSelected
                            ? 'rgba(212,175,55,0.2)'
                            : 'rgba(255,255,255,0.05)',
                          color: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                          border: isSelected
                            ? '1px solid rgba(212,175,55,0.3)'
                            : '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        {wallet.abbr ? wallet.abbr.slice(0, 3) : wallet.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span
                        className="flex-1 text-sm truncate"
                        style={{ color: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.75)' }}
                      >
                        {wallet.name}
                      </span>
                      {wallet.abbr && !wallet.name.includes(`(${wallet.abbr})`) && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold flex-shrink-0"
                          style={{
                            background: isSelected ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                            color: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.25)',
                          }}
                        >
                          {wallet.abbr}
                        </span>
                      )}
                      {isSelected && (
                        <CheckCircle2 size={13} className="text-[#D4AF37] flex-shrink-0" />
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Other option */}
            {showOther && (
              <>
                <div className="mx-4 border-t border-white/8" />
                <motion.button
                  type="button"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => { onChange('other'); setOpen(false); setSearch(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150"
                  style={{ background: value === 'other' ? 'rgba(212,175,55,0.08)' : undefined }}
                  onMouseEnter={e => { if (value !== 'other') (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (value !== 'other') (e.currentTarget as HTMLButtonElement).style.background = ''; }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                    style={{
                      background: value === 'other' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                      color: value === 'other' ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                      border: value === 'other' ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <PenLine size={12} />
                  </div>
                  <span className="flex-1 text-sm" style={{ color: value === 'other' ? '#D4AF37' : 'rgba(255,255,255,0.75)' }}>
                    Other
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)' }}
                  >
                    Custom
                  </span>
                  {value === 'other' && <CheckCircle2 size={13} className="text-[#D4AF37] flex-shrink-0" />}
                </motion.button>
              </>
            )}

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-white/5">
              <p className="text-white/20 text-[10px]">{EXTERNAL_WALLETS.length} wallets available</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Linked Wallet Row ──────────────────────────────────────────────────────────

function LinkedWalletRow({
  linked,
  onUnlink,
}: {
  linked: LinkedWallet;
  onUnlink: () => void;
}) {
  const maskedAcc =
    linked.accountNumber.length > 6
      ? '••••' + linked.accountNumber.slice(-4)
      : linked.accountNumber;

  return (
    <motion.div
      className="flex items-center gap-3 p-4 rounded-2xl border border-white/8 bg-white/3"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 to-[#B8860B]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
        <Wallet size={14} className="text-[#D4AF37]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{linked.walletName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-white/40 text-xs font-mono">{maskedAcc}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 size={9} />
            Active
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/25 text-[10px]">
          {new Date(linked.linkedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <button
          onClick={onUnlink}
          className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function LinkWalletView({ onNavigateToCards: _onNavigateToCards }: { onNavigateToCards?: () => void }) {
  const { user } = useAuth();

  const [linkedWallets, setLinkedWallets] = useState<LinkedWallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [customWalletName, setCustomWalletName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveCard, setHasActiveCard] = useState(true); // optimistic default
  const [cardTier, setCardTier] = useState<'gold' | 'platinum' | 'business' | null>(null);

  useEffect(() => {
    if (!user) return;
    const all = loadLinkedWallets();
    setLinkedWallets(all.filter(w => w.userId === user.id));
    setFullName(user.name || '');
    setEmail(user.email || '');
    // Check for active cards from the backend and determine tier
    authFetch('/api/cards/cards/').then(res => {
      if (res.ok) res.json().then((data: { tier: string }[]) => {
        setHasActiveCard(data.length > 0);
        const TIER_PRIORITY: Array<'gold' | 'platinum' | 'business'> = ['business', 'platinum', 'gold'];
        for (const t of TIER_PRIORITY) {
          if (data.some(c => c.tier === t)) {
            setCardTier(t);
            break;
          }
        }
      });
    }).catch(() => {});
  }, [user]);

  const handleLink = () => {
    if (!user) return;
    setError(null);

    if (!hasActiveCard) return setError('You need an active FundSphere card to link an external wallet. Please activate a card first.');
    if (!selectedWallet) return setError('Please select a wallet to link.');
    if (selectedWallet === 'other' && !customWalletName.trim()) return setError('Please enter your wallet name.');
    if (!fullName.trim()) return setError('Full name is required.');
    if (!email.trim() || !email.includes('@')) return setError('A valid email address is required.');
    if (!accountNumber.trim()) return setError('Account number is required.');
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 12) return setError('A valid card number is required.');
    if (!cvv.trim() || cvv.length < 3) return setError('A valid CVV is required.');

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);

      let errorMsg: string;
      if (selectedWallet === 'other') {
        errorMsg = 'Your card does not match your account limit, upgrade to a higher limit card to connect successfully.';
      } else {
        const wallet = EXTERNAL_WALLETS.find(w => w.id === selectedWallet);
        const abbr = wallet?.abbr || wallet?.name.slice(0, 3).toUpperCase() || 'wallet';
        if (cardTier === 'business') {
          errorMsg = 'Connection failed. Contact support.';
        } else {
          // gold or platinum
          errorMsg = `Your card does not match your ${abbr} account limit. Upgrade to a higher limit card to connect successfully.`;
        }
      }

      setError(errorMsg);
    }, 1200);
  };

  const handleUnlink = (id: string) => {
    const all = loadLinkedWallets().filter(w => w.id !== id);
    saveLinkedWallets(all);
    setLinkedWallets(prev => prev.filter(w => w.id !== id));
  };

  // Wallet currently being linked (for the preloader label)
  const linkingWalletName = selectedWallet === 'other'
    ? (customWalletName.trim() || 'Custom wallet')
    : selectedWallet
      ? EXTERNAL_WALLETS.find(w => w.id === selectedWallet)?.name ?? 'wallet'
      : 'wallet';

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-24">

      {/* ── Fullscreen Connecting Overlay ───────────────────────────────── */}
      <AnimatePresence>
        {submitting && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
          >
            {/* Pulsing glow ring */}
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-48 h-48 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)' }}
            />
            {/* Wallet icon */}
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-[0_0_48px_-8px_rgba(212,175,55,0.7)] mb-8"
            >
              <Wallet size={36} className="text-black" />
            </motion.div>
            <p className="text-white text-xl font-bold tracking-tight mb-2">Connecting to wallet</p>
            <div className="flex items-center gap-1 mb-3">
              {[0, 0.2, 0.4].map((d, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: d }}
                  className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                />
              ))}
            </div>
            <p className="text-white/40 text-sm">{linkingWalletName}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fullscreen Success Overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {successId && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
          >
            {/* Soft green glow */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="absolute w-56 h-56 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.2) 0%, transparent 70%)' }}
            />
            {/* Check circle */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.05 }}
              className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center mb-7"
            >
              <CheckCircle2 size={44} className="text-emerald-400" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white text-2xl font-bold mb-2"
            >
              Wallet Linked!
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/50 text-sm"
            >
              {linkedWallets[linkedWallets.length - 1]?.walletName ?? 'External wallet'} connected successfully
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-lg mx-auto space-y-6">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(212,175,55,0.5)]">
              <Link2 size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Link External Wallet</h1>
              <p className="text-white/40 text-xs">Connect your payment wallets to FundSphere</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wallet Selection – Custom Dropdown */}
        <motion.div
          className="rounded-3xl border border-white/8 bg-white/[0.03] p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
            Select Wallet
          </p>
          <WalletDropdown
            value={selectedWallet}
            onChange={id => { setSelectedWallet(id); setCustomWalletName(''); setError(null); }}
          />

          <AnimatePresence>
            {selectedWallet === 'other' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <label className="block text-white/50 text-xs font-medium mb-1.5">Wallet Link</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                    <PenLine size={15} />
                  </div>
                  <input
                    type="text"
                    value={customWalletName}
                    onChange={e => { setCustomWalletName(e.target.value); setError(null); }}
                    placeholder="Enter your wallet link"
                    className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#D4AF37]/60 focus:bg-white/8 transition-all"
                    autoFocus
                  />
                </div>
                <p className="mt-1.5 text-white/25 text-[11px]">Enter the exact wallet link.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Account Details Form */}
        <motion.div
          className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 space-y-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
            Account Details
          </p>

          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                <User size={15} />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={e => { setFullName(e.target.value); setError(null); }}
                placeholder="Enter your full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/8 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                <Mail size={15} />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null); }}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/8 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">Account Number/ID</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                <Hash size={15} />
              </div>
              <input
                type="text"
                value={accountNumber}
                onChange={e => { setAccountNumber(e.target.value); setError(null); }}
                placeholder="Enter account number / id"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/8 transition-all font-mono"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/8 pt-4">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
              Purchased Card Details
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5">Card Number</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                    <CreditCard size={15} />
                  </div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = raw.match(/.{1,4}/g)?.join(' ') ?? raw;
                      setCardNumber(formatted);
                      setError(null);
                    }}
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength={19}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/8 transition-all font-mono tracking-widest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5">CVV</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                    <Lock size={15} />
                  </div>
                  <input
                    type="password"
                    value={cvv}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setCvv(val);
                      setError(null);
                    }}
                    placeholder="CVV"
                    maxLength={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/8 transition-all font-mono tracking-widest"
                  />
                </div>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleLink}
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_6px_28px_-6px_rgba(212,175,55,0.5)] hover:shadow-[0_8px_36px_-6px_rgba(212,175,55,0.7)] transition-all duration-300"
            whileHover={!submitting ? { scale: 1.01 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
          >
            <>
              <Link2 size={16} />
              Link Wallet
            </>
          </motion.button>
        </motion.div>

        {/* Linked Wallets */}
        {linkedWallets.length > 0 && (
          <motion.div
            className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 space-y-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Linked Wallets
              </p>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 font-medium">
                {linkedWallets.length} active
              </span>
            </div>
            <AnimatePresence>
              {linkedWallets.map(linked => (
                <LinkedWalletRow
                  key={linked.id}
                  linked={linked}
                  onUnlink={() => handleUnlink(linked.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}