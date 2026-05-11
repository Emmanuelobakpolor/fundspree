'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowUpRight, ChevronDown, AlertTriangle, CheckCircle,
  Clock, Copy, Check,
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { authFetch } from '../../../lib/api';
import {
  BitcoinIcon, EthereumIcon, TetherIcon, USDCIcon, BNBIcon, SolanaIcon,
} from '../../icons/CryptoIcons';

// ─── Crypto / Network Config ──────────────────────────────────────────────────

interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  Icon: React.ComponentType<{ className?: string }>;
  networks: string[];
}

const CRYPTOS: CryptoOption[] = [
  {
    id: 'BTC', name: 'Bitcoin',   symbol: 'BTC',  Icon: BitcoinIcon,
    networks: ['Bitcoin Network (Native)'],
  },
  {
    id: 'ETH', name: 'Ethereum',  symbol: 'ETH',  Icon: EthereumIcon,
    networks: ['Ethereum (ERC-20)'],
  },
  {
    id: 'USDT', name: 'Tether USD', symbol: 'USDT', Icon: TetherIcon,
    networks: ['Ethereum (ERC-20)', 'Tron (TRC-20)', 'BNB Smart Chain (BEP-20)'],
  },
  {
    id: 'USDC', name: 'USD Coin',  symbol: 'USDC', Icon: USDCIcon,
    networks: ['Ethereum (ERC-20)', 'Solana Network', 'BNB Smart Chain (BEP-20)'],
  },
  {
    id: 'BNB',  name: 'BNB',       symbol: 'BNB',  Icon: BNBIcon,
    networks: ['BNB Smart Chain (BEP-20)'],
  },
  {
    id: 'SOL',  name: 'Solana',    symbol: 'SOL',  Icon: SolanaIcon,
    networks: ['Solana Network'],
  },
];

// ─── Crypto SVG Logo ──────────────────────────────────────────────────────────

function CryptoLogo({ crypto, size = 28 }: { crypto: CryptoOption; size?: number }) {
  const { Icon } = crypto;
  return (
    <div className="flex-shrink-0" style={{ width: size, height: size }}>
      <Icon className="w-full h-full" />
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

type Step = 'select-crypto' | 'fill-details' | 'processing' | 'done';

interface WithdrawModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function WithdrawModal({ onClose, onSuccess }: WithdrawModalProps) {
  const { user, refreshUser } = useAuth();

  const [step, setStep] = useState<Step>('select-crypto');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [walletAddress, setWalletAddress]     = useState('');
  const [amount, setAmount]                   = useState('');
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState<string | null>(null);
  const [txId, setTxId]                       = useState<string | null>(null);
  const [copied, setCopied]                   = useState(false);

  const balance     = Number(user?.balance ?? 0);
  const kycStatus   = user?.kycStatus ?? 'none';
  const maxWithdraw = kycStatus === 'approved' ? Infinity : 500;
  const parsedAmt   = parseFloat(amount) || 0;

  function selectCrypto(c: CryptoOption) {
    setSelectedCrypto(c);
    setSelectedNetwork(c.networks[0]);
    setError(null);
    setStep('fill-details');
  }

  async function handleSubmit() {
    setError(null);
    if (!walletAddress.trim()) { setError('Please enter your wallet address.'); return; }
    if (parsedAmt <= 0)        { setError('Please enter a valid amount.'); return; }
    if (parsedAmt > balance)   { setError('Amount exceeds your available balance.'); return; }
    if (parsedAmt > maxWithdraw) {
      setError(`KYC verification required for withdrawals over $${maxWithdraw}. Complete your KYC in Profile Settings.`);
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch('/api/withdrawals/', {
        method: 'POST',
        body: JSON.stringify({
          amount:         parsedAmt,
          crypto:         selectedCrypto!.id,
          network:        selectedNetwork,
          wallet_address: walletAddress.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Withdrawal failed. Please try again.');
        setLoading(false);
        return;
      }
      setTxId(`TXN-${data.id}-${Date.now().toString(36).toUpperCase()}`);
      setStep('processing');
      // Refresh user balance
      if (refreshUser) refreshUser();
      // After 5 seconds in the modal, mark as done UI-wise
      setTimeout(() => setStep('done'), 5000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyTxId() {
    if (!txId) return;
    navigator.clipboard.writeText(txId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/10">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                {step === 'select-crypto' && 'Withdraw Funds'}
                {step === 'fill-details'  && `Withdraw via ${selectedCrypto?.name}`}
                {step === 'processing'    && 'Processing Withdrawal'}
                {step === 'done'          && 'Withdrawal Submitted'}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Available: <span className="font-bold text-gray-700 dark:text-gray-200">${balance.toFixed(2)}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-5">

            {/* ── Step 1: Select Crypto ──────────────────────────────────────── */}
            {step === 'select-crypto' && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Choose currency
                </p>
                {CRYPTOS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => selectCrypto(c)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-gold/50 hover:bg-gold/5 transition group"
                  >
                    <CryptoLogo crypto={c} />
                    <div className="text-left flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{c.symbol}</p>
                      <p className="text-xs text-gray-400">{c.name}</p>
                    </div>
                    <ChevronDown size={14} className="text-gray-400 rotate-[-90deg] group-hover:text-gold transition" />
                  </button>
                ))}

                {/* KYC limit notice */}
                {kycStatus !== 'approved' && (
                  <div className="mt-3 flex gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20">
                    <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Unverified account: max <strong>$500</strong> per withdrawal. Complete KYC for unlimited access.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 2: Fill Details ──────────────────────────────────────── */}
            {step === 'fill-details' && selectedCrypto && (
              <div className="space-y-4">

                {/* Crypto info bar */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <CryptoLogo crypto={selectedCrypto} size={36} />
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{selectedCrypto.name}</p>
                    <p className="text-xs text-gray-400">{selectedCrypto.symbol}</p>
                  </div>
                  <button
                    onClick={() => { setStep('select-crypto'); setError(null); }}
                    className="ml-auto text-xs text-gold font-semibold hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Network selector */}
                {selectedCrypto.networks.length > 1 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                      Network / Chain
                    </label>
                    <div className="grid gap-2">
                      {selectedCrypto.networks.map(net => (
                        <button
                          key={net}
                          onClick={() => setSelectedNetwork(net)}
                          className={`text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                            selectedNetwork === net
                              ? 'border-gold bg-gold/10 text-gray-900 dark:text-white'
                              : 'border-gray-200 dark:border-white/10 text-gray-500 hover:border-gold/40'
                          }`}
                        >
                          {net}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Single network display */}
                {selectedCrypto.networks.length === 1 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                      Network / Chain
                    </label>
                    <div className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {selectedCrypto.networks[0]}
                    </div>
                  </div>
                )}

                {/* Wallet address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={e => setWalletAddress(e.target.value)}
                    placeholder={`Enter your ${selectedCrypto.symbol} wallet address`}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 font-mono"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      max={Math.min(balance, maxWithdraw)}
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-gray-400">
                      Balance: <span className="font-semibold text-gray-600 dark:text-gray-300">${balance.toFixed(2)}</span>
                    </p>
                    {kycStatus !== 'approved' && (
                      <p className="text-xs text-amber-500 font-semibold">Max: $500.00</p>
                    )}
                    <button
                      onClick={() => setAmount(String(Math.min(balance, maxWithdraw === Infinity ? balance : maxWithdraw)))}
                      className="text-xs text-gold font-bold hover:underline"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                    <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm hover:opacity-80 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <ArrowUpRight size={16} />
                      Withdraw ${parsedAmt > 0 ? parsedAmt.toFixed(2) : '0.00'}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ── Step 3: Processing ────────────────────────────────────────── */}
            {step === 'processing' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mx-auto">
                  <Clock size={28} className="text-blue-500 animate-pulse" />
                </div>
                <div>
                  <p className="font-black text-gray-900 dark:text-white text-lg">Processing…</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your withdrawal is being processed. Funds will be sent to your wallet shortly.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2 text-left">
                  <Row label="Amount"    value={`$${parsedAmt.toFixed(2)}`} />
                  <Row label="Currency"  value={selectedCrypto?.symbol ?? ''} />
                  <Row label="Network"   value={selectedNetwork} />
                  <Row label="Address"   value={`${walletAddress.slice(0, 8)}…${walletAddress.slice(-6)}`} mono />
                </div>
              </div>
            )}

            {/* ── Step 4: Done ──────────────────────────────────────────────── */}
            {step === 'done' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle size={28} className="text-emerald-500" />
                </div>
                <div>
                  <p className="font-black text-gray-900 dark:text-white text-lg">Withdrawal Submitted</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your request has been queued. Typical processing time is ~5 minutes.
                  </p>
                </div>

                {txId && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2 text-left">
                    <Row label="Amount"   value={`$${parsedAmt.toFixed(2)}`} />
                    <Row label="Currency" value={`${selectedCrypto?.symbol} · ${selectedNetwork}`} />
                    <Row label="Address"  value={`${walletAddress.slice(0, 8)}…${walletAddress.slice(-6)}`} mono />
                    <div className="flex items-center justify-between pt-1 border-t border-gray-200 dark:border-white/10">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Reference ID</p>
                        <p className="text-xs font-mono font-bold text-gray-700 dark:text-gray-200">{txId}</p>
                      </div>
                      <button
                        onClick={copyTxId}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition text-gray-400"
                      >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => { onSuccess?.(); onClose(); }}
                  className="w-full py-3.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm hover:opacity-80 transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-xs font-bold text-gray-700 dark:text-gray-200 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
