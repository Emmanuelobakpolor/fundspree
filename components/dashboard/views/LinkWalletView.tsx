'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, AlertCircle, User, Mail, Hash,
  CheckCircle2, Clock, Trash2, ChevronDown, Search, Wallet,
} from 'lucide-react';
import { useAuth } from '../../AuthContext';

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
  { id: 'gsp', name: 'Global Swift Pay', abbr: 'GSP' },
  { id: 'igp', name: 'Insta Global Pay', abbr: 'IGP' },
  { id: 'imp', name: 'Instant Merchant Payments', abbr: 'IMP' },
  { id: 'aiwps', name: 'Advanced IWPS', abbr: 'AIWPS' },
  { id: 'ngw', name: 'Nexa Global Wallet', abbr: 'NGW' },
  { id: 'intmp', name: 'International Merchant Pay', abbr: 'INTMP' },
  { id: 'asp', name: 'Advanced Swift Pay', abbr: 'ASP' },
  { id: 'sbp', name: 'Swift Business Pay', abbr: 'SBP' },
  { id: 'gbp', name: 'Global Business Pay', abbr: 'GBP' },
  { id: 'iwp', name: 'Insta Wallet Pay', abbr: 'IWP' },
  { id: 'instant-wallet', name: 'Instant Wallet Pay' },
  { id: 'universal-global', name: 'Universal Global Pay' },
  { id: 'insta-business', name: 'Insta Business Pay' },
  { id: 'global-swift-us', name: 'Global Swift US' },
  { id: 'kingscoin', name: 'Kingscoin Wallet' },
  { id: 'lezochain', name: 'LezoChain' },
  { id: 'zenquick', name: 'ZenQuick Cash' },
  { id: 'konnect', name: 'Konnect Wallet' },
  { id: 'globe-pay', name: 'Globe Pay' },
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

function hasActiveCard(userId: string): boolean {
  try {
    const orders = JSON.parse(localStorage.getItem('fundspree_card_orders') || '[]');
    return orders.some(
      (o: { userId: string; status: string }) =>
        o.userId === userId && o.status === 'confirmed'
    );
  } catch {
    return false;
  }
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

  const selected = EXTERNAL_WALLETS.find(w => w.id === value);
  const filtered = EXTERNAL_WALLETS.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    (w.abbr && w.abbr.toLowerCase().includes(search.toLowerCase()))
  );

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
              {selected.abbr && (
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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const all = loadLinkedWallets();
    setLinkedWallets(all.filter(w => w.userId === user.id));
    setFullName(user.name || '');
    setEmail(user.email || '');
  }, [user]);

  const handleLink = () => {
    if (!user) return;
    setError(null);

    if (!hasActiveCard(user.id)) return setError('You need an active FundSphere card to link an external wallet. Please activate a card first.');
    if (!selectedWallet) return setError('Please select a wallet to link.');
    if (!fullName.trim()) return setError('Full name is required.');
    if (!email.trim() || !email.includes('@')) return setError('A valid email address is required.');
    if (!accountNumber.trim()) return setError('Account number is required.');

    const alreadyLinked = linkedWallets.some(
      w => w.walletId === selectedWallet && w.accountNumber === accountNumber.trim()
    );
    if (alreadyLinked) return setError('This account is already linked for the selected wallet.');

    setSubmitting(true);

    setTimeout(() => {
      const wallet = EXTERNAL_WALLETS.find(w => w.id === selectedWallet)!;
      const newEntry: LinkedWallet = {
        id: `lw_${Date.now()}`,
        userId: user.id,
        walletId: selectedWallet,
        walletName: wallet.name,
        fullName: fullName.trim(),
        email: email.trim(),
        accountNumber: accountNumber.trim(),
        linkedAt: new Date().toISOString(),
      };
      const all = loadLinkedWallets();
      all.push(newEntry);
      saveLinkedWallets(all);
      setLinkedWallets(prev => [...prev, newEntry]);
      setSubmitting(false);
      setSuccessId(newEntry.id);
      setSelectedWallet('');
      setAccountNumber('');
      setTimeout(() => setSuccessId(null), 3000);
    }, 1200);
  };

  const handleUnlink = (id: string) => {
    const all = loadLinkedWallets().filter(w => w.id !== id);
    saveLinkedWallets(all);
    setLinkedWallets(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-24">
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

        {/* Success / Error Banners */}
        <AnimatePresence>
          {successId && (
            <motion.div
              className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-300 text-sm font-medium">
                Wallet linked successfully!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

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
            onChange={id => { setSelectedWallet(id); setError(null); }}
          />
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
            <label className="block text-white/50 text-xs font-medium mb-1.5">Account Number</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                <Hash size={15} />
              </div>
              <input
                type="text"
                value={accountNumber}
                onChange={e => { setAccountNumber(e.target.value); setError(null); }}
                placeholder="Enter account number"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/8 transition-all font-mono"
              />
            </div>
          </div>

          <motion.button
            onClick={handleLink}
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_6px_28px_-6px_rgba(212,175,55,0.5)] hover:shadow-[0_8px_36px_-6px_rgba(212,175,55,0.7)] transition-all duration-300"
            whileHover={!submitting ? { scale: 1.01 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
          >
            {submitting ? (
              <>
                <Clock size={16} className="animate-spin" />
                Linking Wallet…
              </>
            ) : (
              <>
                <Link2 size={16} />
                Link Wallet
              </>
            )}
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