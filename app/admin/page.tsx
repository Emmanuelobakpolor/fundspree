'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Eye, X, CreditCard, RefreshCw } from 'lucide-react';

type CardTier = 'gold' | 'platinum' | 'business';
type PaymentMethod = 'btc' | 'usdt' | 'eth';
type OrderStatus = 'pending' | 'confirmed' | 'rejected';

interface CardOrder {
  id: string;
  userId: string;
  tier: CardTier;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  proofImage: string;
  submittedAt: string;
  cardNumber: string;
  cardExpiry: string;
  cardHolder: string;
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
}

const TIER_LABELS: Record<CardTier, string> = {
  gold: 'Gold Card',
  platinum: 'Platinum Card',
  business: 'Business Card',
};

const TIER_COLORS: Record<CardTier, string> = {
  gold: 'bg-yellow-100 text-yellow-800',
  platinum: 'bg-gray-100 text-gray-700',
  business: 'bg-indigo-100 text-indigo-800',
};

const METHOD_COLORS: Record<PaymentMethod, string> = {
  btc: '#f7931a',
  usdt: '#26a17b',
  eth: '#627eea',
};

function loadOrders(): CardOrder[] {
  try { return JSON.parse(localStorage.getItem('fundspree_card_orders') || '[]'); }
  catch { return []; }
}

function saveOrders(orders: CardOrder[]) {
  localStorage.setItem('fundspree_card_orders', JSON.stringify(orders));
}

function loadUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem('fundspree_users') || '[]'); }
  catch { return []; }
}

export default function AdminPage() {
  const [orders, setOrders] = useState<CardOrder[]>([]);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('pending');
  const [proofModal, setProofModal] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const reload = () => {
    setOrders(loadOrders());
    setUsers(loadUsers());
  };

  useEffect(() => { reload(); }, []);

  const handleConfirm = async (id: string) => {
    setActionLoading(id);
    await new Promise(r => setTimeout(r, 600));
    const updated = loadOrders().map(o => o.id === id ? { ...o, status: 'confirmed' as const } : o);
    saveOrders(updated);
    setOrders(updated);
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    await new Promise(r => setTimeout(r, 600));
    const updated = loadOrders().map(o => o.id === id ? { ...o, status: 'rejected' as const } : o);
    saveOrders(updated);
    setOrders(updated);
    setActionLoading(null);
  };

  const getUserInfo = (userId: string) => {
    const u = users.find(u => u.id === userId);
    return u ? `${u.name} (${u.email})` : `User ${userId.slice(-6)}`;
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black dark:bg-gold flex items-center justify-center">
            <CreditCard size={16} className="text-white dark:text-black" />
          </div>
          <div>
            <h1 className="text-base font-black text-black dark:text-white">Admin Panel</h1>
            <p className="text-xs text-gray-500">Card Order Management</p>
          </div>
        </div>
        <button
          onClick={reload}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {([
            { key: 'all', label: 'Total Orders', color: 'text-gray-700 dark:text-gray-200', bg: 'bg-white dark:bg-gray-900' },
            { key: 'pending', label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            { key: 'confirmed', label: 'Confirmed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-500/10' },
            { key: 'rejected', label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
          ] as const).map(({ key, label, color, bg }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${bg} ${
                filter === key ? 'border-current' : 'border-transparent'
              }`}
            >
              <p className={`text-2xl font-black ${color}`}>{counts[key]}</p>
              <p className={`text-xs font-semibold mt-0.5 ${color} opacity-70`}>{label}</p>
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 p-12 text-center">
              <p className="text-gray-400 font-semibold">No {filter === 'all' ? '' : filter} orders</p>
            </div>
          )}

          <AnimatePresence>
            {filtered.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Proof thumbnail */}
                  <button
                    onClick={() => setProofModal(order.proofImage)}
                    className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 hover:ring-2 hover:ring-blue-400 transition relative group"
                  >
                    <img src={order.proofImage} alt="Proof" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Eye size={16} className="text-white" />
                    </div>
                  </button>

                  {/* Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${TIER_LABELS[order.tier] && TIER_COLORS[order.tier]}`}>
                            {TIER_LABELS[order.tier]}
                          </span>
                          <span
                            className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                            style={{ background: METHOD_COLORS[order.paymentMethod] }}
                          >
                            {order.paymentMethod.toUpperCase()}
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-black dark:text-white mt-1.5">{order.cardHolder}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{getUserInfo(order.userId)}</p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5">
                          <p className="text-xs text-gray-400">
                            <span className="text-gray-500">Order:</span> #{order.id.slice(-8)}
                          </p>
                          <p className="text-xs text-gray-400">
                            <span className="text-gray-500">Card:</span> {order.cardNumber}
                          </p>
                          <p className="text-xs text-gray-400">
                            <span className="text-gray-500">Submitted:</span>{' '}
                            {new Date(order.submittedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons — only for pending */}
                      {order.status === 'pending' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleReject(order.id)}
                            disabled={actionLoading === order.id}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition disabled:opacity-50"
                          >
                            {actionLoading === order.id ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            Reject
                          </button>
                          <button
                            onClick={() => handleConfirm(order.id)}
                            disabled={actionLoading === order.id}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition disabled:opacity-50 shadow-sm"
                          >
                            {actionLoading === order.id ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            Confirm
                          </button>
                        </div>
                      )}

                      {order.status === 'confirmed' && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold flex-shrink-0">
                          <CheckCircle size={14} />
                          Activated
                        </div>
                      )}

                      {order.status === 'rejected' && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 text-xs font-bold flex-shrink-0">
                          <XCircle size={14} />
                          Rejected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Proof image lightbox */}
      <AnimatePresence>
        {proofModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setProofModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setProofModal(null)}
                className="absolute -top-10 right-0 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
              >
                <X size={18} />
              </button>
              <img src={proofModal} alt="Payment proof" className="w-full rounded-2xl shadow-2xl" />
              <p className="text-white/60 text-xs text-center mt-3">Payment Proof Screenshot</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
