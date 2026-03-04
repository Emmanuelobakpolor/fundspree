'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CheckCircle, XCircle, Eye, X, CreditCard, RefreshCw,
  Users, DollarSign, Gift, Wallet, Search, Shield, LogOut,
  Menu, ChevronRight, BarChart3, Clock, Ban, Save, ShieldCheck,
  ArrowUpRight, Plus, Minus,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ApiUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  country: string;
  balance: string;
  welcomeBonus: number;
  referralBonus: string;
  withdrawalThisMonth: string;
  withdrawalAllTime: string;
  referralCode: string;
  referralCount: number;
  isOnline?: boolean;
  lastLogin?: string | null;
  isPending?: boolean;
}

interface CardOrder {
  id: number;
  tier: 'gold' | 'platinum' | 'business';
  payment_method: 'btc' | 'usdt' | 'eth';
  proof_image_url: string | null;
  status: 'pending' | 'confirmed' | 'rejected';
  card_number: string;
  card_expiry: string;
  card_holder: string;
  submitted_at: string;
  reviewed_at: string | null;
  user_email: string;
  user_name: string;
}

interface Loan {
  id: number;
  amount: string;
  purpose: string;
  tier: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  reviewed_at: string | null;
  user_email: string;
  user_name: string;
}

interface SpinResult {
  id: number;
  user_email: string;
  prize_label: string;
  prize_amount: string;
  prize_index: number;
  spun_at: string;
}

interface KYCSubmission {
  id: number;
  user_email: string;
  user_name: string;
  kyc_status: string;
  home_address: string;
  government_id_url: string | null;
  passport_url: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  admin_note: string;
}

interface FundForm {
  balance: string;
  welcome_bonus: string;
  referral_bonus: string;
}

type FundMode = 'set' | 'add' | 'subtract';

interface Withdrawal {
  id: number;
  user_email: string;
  user_name: string;
  amount: string;
  crypto: string;
  network: string;
  wallet_address: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  processed_at: string | null;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const TIER_LABELS = { gold: 'Gold', platinum: 'Platinum', business: 'Business' } as const;

const TIER_COLORS = {
  gold: 'bg-yellow-100 text-yellow-800',
  platinum: 'bg-gray-200 text-gray-700',
  business: 'bg-indigo-100 text-indigo-800',
} as const;

const METHOD_COLORS = { btc: '#f7931a', usdt: '#26a17b', eth: '#627eea' } as const;

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  approved:  'bg-green-100 text-green-700',
  rejected:  'bg-red-100 text-red-700',
  active:    'bg-blue-100 text-blue-700',
};

const NAV_ITEMS = [
  { id: 'overview',     label: 'Overview',      Icon: BarChart3,    color: 'text-blue-500'   },
  { id: 'users',        label: 'Users',          Icon: Users,        color: 'text-indigo-500' },
  { id: 'cards',        label: 'Card Orders',    Icon: CreditCard,   color: 'text-green-500'  },
  { id: 'loans',        label: 'Loans',          Icon: DollarSign,   color: 'text-yellow-500' },
  { id: 'spinwin',      label: 'Spin & Win',     Icon: Gift,         color: 'text-purple-500' },
  { id: 'kyc',          label: 'KYC Reviews',    Icon: ShieldCheck,  color: 'text-teal-500'   },
  { id: 'withdrawals',  label: 'Withdrawals',    Icon: ArrowUpRight, color: 'text-orange-500' },
];

// ─── API helpers ───────────────────────────────────────────────────────────────

async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function apiPost(path: string, body: object) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function apiPatch(path: string, body: object) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// ─── Small reusable pieces ─────────────────────────────────────────────────────

function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full"
    />
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 p-12 text-center">
      <p className="text-gray-400 font-semibold">{label}</p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();

  // UI state
  const [tab, setTab]               = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [proofModal, setProofModal]   = useState<string | null>(null);
  const [fundModal, setFundModal]     = useState<ApiUser | null>(null);
  const [fundForm, setFundForm]       = useState<FundForm>({ balance: '', welcome_bonus: '', referral_bonus: '' });
  const [fundMode, setFundMode]       = useState<FundMode>('add');
  const [fundLoading, setFundLoading] = useState(false);
  const [fundError, setFundError]     = useState<string | null>(null);

  // Data
  const [allUsers, setAllUsers]           = useState<ApiUser[]>([]);
  const [pendingUserIds, setPendingUserIds] = useState<Set<number>>(new Set());
  const [orders, setOrders]               = useState<CardOrder[]>([]);
  const [loans, setLoans]                 = useState<Loan[]>([]);
  const [spinResults, setSpinResults]     = useState<SpinResult[]>([]);
  const [kycSubmissions, setKycSubmissions]   = useState<KYCSubmission[]>([]);
  const [withdrawals, setWithdrawals]         = useState<Withdrawal[]>([]);
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [kycFilter, setKycFilter]         = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [kycDocModal, setKycDocModal]     = useState<{ url: string; label: string } | null>(null);
  const [kycNoteInput, setKycNoteInput]   = useState<Record<number, string>>({});

  // Filters
  const [userFilter,  setUserFilter]  = useState<'all' | 'pending' | 'active'>('all');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('pending');
  const [loanFilter,  setLoanFilter]  = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Loading / error
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      router.replace('/admin/login');
    }
  }, [router]);

  // ── Load all data ────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, pendingData, ordersData, loansData, spinData, kycData, withdrawalData] = await Promise.all([
        apiGet('/api/auth/admin/users/'),
        apiGet('/api/auth/pending-users/'),
        apiGet('/api/cards/admin/orders/'),
        apiGet('/api/loans/admin/loans/'),
        apiGet('/api/spinwin/admin/results/'),
        apiGet('/api/auth/admin/kyc/'),
        apiGet('/api/withdrawals/admin/'),
      ]);
      setAllUsers(usersData);
      setPendingUserIds(new Set((pendingData as ApiUser[]).map(u => u.id)));
      setOrders(ordersData);
      setLoans(loansData);
      setSpinResults(spinData);
      setKycSubmissions(kycData);
      setWithdrawals(withdrawalData);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Auth actions ─────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  // ── Card order actions ───────────────────────────────────────────────────────
  const handleOrderAction = async (id: number, action: 'confirm' | 'reject') => {
    setActionLoading(`order-${id}`);
    try {
      await apiPost(`/api/cards/admin/orders/${id}/action/`, { action });
      setOrders(prev => prev.map(o =>
        o.id === id ? { ...o, status: action === 'confirm' ? 'confirmed' : 'rejected' } : o
      ));
    } finally {
      setActionLoading(null);
    }
  };

  // ── Loan actions ─────────────────────────────────────────────────────────────
  const handleLoanAction = async (id: number, action: 'approve' | 'reject') => {
    setActionLoading(`loan-${id}`);
    try {
      await apiPost(`/api/loans/admin/loans/${id}/action/`, { action });
      setLoans(prev => prev.map(l =>
        l.id === id ? { ...l, status: action === 'approve' ? 'approved' : 'rejected' } : l
      ));
    } finally {
      setActionLoading(null);
    }
  };

  // ── KYC actions ──────────────────────────────────────────────────────────────
  const handleKYCAction = async (id: number, action: 'approve' | 'reject') => {
    setActionLoading(`kyc-${id}`);
    const note = kycNoteInput[id] ?? '';
    try {
      await apiPost(`/api/auth/admin/kyc/${id}/action/`, { action, note });
      setKycSubmissions(prev => prev.map(k =>
        k.id === id ? { ...k, kyc_status: action === 'approve' ? 'approved' : 'rejected', reviewed_at: new Date().toISOString(), admin_note: note } : k
      ));
    } finally {
      setActionLoading(null);
    }
  };

  // ── User actions ─────────────────────────────────────────────────────────────
  const handleUserAction = async (id: number, action: 'approve' | 'deactivate') => {
    setActionLoading(`user-${id}`);
    try {
      await apiPost(`/api/auth/users/${id}/action/`, { action });
      setPendingUserIds(prev => {
        const next = new Set(prev);
        action === 'approve' ? next.delete(id) : next.add(id);
        return next;
      });
    } finally {
      setActionLoading(null);
    }
  };

  // ── Fund user ────────────────────────────────────────────────────────────────
  const openFundModal = (user: ApiUser) => {
    setFundModal(user);
    setFundError(null);
    setFundMode('add');
    setFundForm({ balance: '', welcome_bonus: '', referral_bonus: '' });
  };

  const handleFundUser = async () => {
    if (!fundModal) return;
    setFundLoading(true);
    setFundError(null);
    try {
      const body: Record<string, any> = {};

      const applyMode = (current: number, input: string, isInt = false) => {
        if (input === '') return undefined;
        const delta = isInt ? parseInt(input, 10) : parseFloat(input);
        if (isNaN(delta)) return undefined;
        if (fundMode === 'set')      return isInt ? delta : String(delta.toFixed(2));
        if (fundMode === 'add')      return isInt ? current + delta : String((current + delta).toFixed(2));
        if (fundMode === 'subtract') return isInt ? Math.max(0, current - delta) : String(Math.max(0, current - delta).toFixed(2));
      };

      const newBalance = applyMode(parseFloat(fundModal.balance || '0'), fundForm.balance);
      const newWelcome = applyMode(fundModal.welcomeBonus ?? 0, fundForm.welcome_bonus, true);
      const newReferral = applyMode(parseFloat(fundModal.referralBonus || '0'), fundForm.referral_bonus);

      if (newBalance  !== undefined) body.balance        = newBalance;
      if (newWelcome  !== undefined) body.welcome_bonus  = newWelcome;
      if (newReferral !== undefined) body.referral_bonus = newReferral;

      if (Object.keys(body).length === 0) { setFundError('Enter at least one value.'); setFundLoading(false); return; }

      const updated = await apiPatch(`/api/auth/users/${fundModal.id}/fund/`, body);
      setAllUsers(prev => prev.map(u => u.id === fundModal.id ? { ...u, ...updated } : u));
      setFundModal(null);
    } catch (e: any) {
      setFundError(e.message ?? 'Failed to update user');
    } finally {
      setFundLoading(false);
    }
  };

  // ── Derived data ─────────────────────────────────────────────────────────────
  const usersWithStatus = allUsers.map(u => ({ ...u, isPending: pendingUserIds.has(u.id) }));

  const q = searchQuery.toLowerCase();

  const filteredUsers = usersWithStatus.filter(u => {
    const match = u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    if (!match) return false;
    if (userFilter === 'pending') return u.isPending;
    if (userFilter === 'active')  return !u.isPending;
    return true;
  });

  const filteredOrders = orders.filter(o => {
    const match = o.card_holder.toLowerCase().includes(q) || o.user_email.toLowerCase().includes(q);
    if (!match) return false;
    return orderFilter === 'all' || o.status === orderFilter;
  });

  const filteredLoans = loans.filter(l => {
    const match = l.user_name?.toLowerCase().includes(q) || l.user_email.toLowerCase().includes(q);
    if (!match) return false;
    return loanFilter === 'all' || l.status === loanFilter;
  });

  const changeTab = (id: string) => {
    setTab(id);
    setSearchQuery('');
    setSidebarOpen(false);
  };

  // ─── Overview ───────────────────────────────────────────────────────────────
  const renderOverview = () => {
    const pendingOrders   = orders.filter(o => o.status === 'pending').length;
    const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
    const pendingLoans    = loans.filter(l => l.status === 'pending').length;
    const approvedLoans   = loans.filter(l => l.status === 'approved').length;
    const totalSpin       = spinResults.reduce((s, r) => s + parseFloat(r.prize_amount || '0'), 0);
    const pendingKYC      = kycSubmissions.filter(k => k.kyc_status === 'pending').length;
    const approvedKYC     = kycSubmissions.filter(k => k.kyc_status === 'approved').length;
    const totalWithdrawn  = withdrawals.reduce((s, w) => s + parseFloat(w.amount || '0'), 0);
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

    const stats = [
      { label: 'Total Users',    value: allUsers.length,       sub: `${pendingUserIds.size} pending approval`,               Icon: Users,        bg: 'bg-indigo-50 dark:bg-indigo-500/10',  ic: 'text-indigo-500' },
      { label: 'Card Orders',    value: orders.length,         sub: `${pendingOrders} pending · ${confirmedOrders} active`,  Icon: CreditCard,   bg: 'bg-green-50 dark:bg-green-500/10',    ic: 'text-green-500'  },
      { label: 'Loan Requests',  value: loans.length,          sub: `${pendingLoans} pending · ${approvedLoans} approved`,   Icon: DollarSign,   bg: 'bg-yellow-50 dark:bg-yellow-500/10',  ic: 'text-yellow-500' },
      { label: 'KYC Reviews',    value: kycSubmissions.length, sub: `${pendingKYC} pending · ${approvedKYC} approved`,       Icon: ShieldCheck,  bg: 'bg-teal-50 dark:bg-teal-500/10',      ic: 'text-teal-500'   },
      { label: 'Withdrawals',    value: withdrawals.length,    sub: `$${totalWithdrawn.toFixed(2)} · ${pendingWithdrawals} pending`, Icon: ArrowUpRight, bg: 'bg-orange-50 dark:bg-orange-500/10', ic: 'text-orange-500' },
      { label: 'Spin Results',   value: spinResults.length,    sub: `$${totalSpin.toFixed(2)} total won`,                    Icon: Gift,         bg: 'bg-purple-50 dark:bg-purple-500/10',  ic: 'text-purple-500' },
    ];

    return (
      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, sub, Icon, bg, ic }) => (
            <div key={label} className={`rounded-2xl p-5 ${bg}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{value}</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{label}</p>
                  <p className="text-xs text-gray-500 mt-1">{sub}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/10">
                  <Icon size={20} className={ic} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-5">
            <h3 className="font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
              <Clock size={15} className="text-amber-500" /> Pending Card Orders
            </h3>
            <div className="space-y-2">
              {orders.filter(o => o.status === 'pending').slice(0, 6).map(o => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{o.card_holder}</p>
                    <p className="text-xs text-gray-500">{o.user_email} · {TIER_LABELS[o.tier]}</p>
                  </div>
                  <button onClick={() => { changeTab('cards'); setOrderFilter('pending'); }} className="text-xs text-blue-500 hover:underline font-semibold">
                    Review
                  </button>
                </div>
              ))}
              {orders.filter(o => o.status === 'pending').length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">All clear</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-5">
            <h3 className="font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
              <Clock size={15} className="text-amber-500" /> Pending Loans
            </h3>
            <div className="space-y-2">
              {loans.filter(l => l.status === 'pending').slice(0, 6).map(l => (
                <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{l.user_name || l.user_email}</p>
                    <p className="text-xs text-gray-500">${parseFloat(l.amount).toFixed(2)} · {l.tier} card</p>
                  </div>
                  <button onClick={() => { changeTab('loans'); setLoanFilter('pending'); }} className="text-xs text-blue-500 hover:underline font-semibold">
                    Review
                  </button>
                </div>
              ))}
              {loans.filter(l => l.status === 'pending').length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">All clear</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-5">
            <h3 className="font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
              <Users size={15} className="text-indigo-500" /> Pending User Approvals
            </h3>
            <div className="space-y-2">
              {usersWithStatus.filter(u => u.isPending).slice(0, 6).map(u => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{u.name || u.email}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <button onClick={() => { changeTab('users'); setUserFilter('pending'); }} className="text-xs text-blue-500 hover:underline font-semibold">
                    Review
                  </button>
                </div>
              ))}
              {usersWithStatus.filter(u => u.isPending).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">All clear</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-5">
            <h3 className="font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
              <Gift size={15} className="text-purple-500" /> Recent Spin Results
            </h3>
            <div className="space-y-2">
              {spinResults.filter(r => parseFloat(r.prize_amount) > 0).slice(0, 6).map(r => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{r.user_email}</p>
                    <p className="text-xs text-gray-500">{new Date(r.spun_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-black text-green-600 dark:text-green-400">+${parseFloat(r.prize_amount).toFixed(2)}</span>
                </div>
              ))}
              {spinResults.filter(r => parseFloat(r.prize_amount) > 0).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No wins yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Users ───────────────────────────────────────────────────────────────────
  const renderUsers = () => (
    <div className="space-y-5">
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'active'] as const).map(f => {
          const count = f === 'all' ? usersWithStatus.length
            : f === 'pending' ? usersWithStatus.filter(u => u.isPending).length
            : usersWithStatus.filter(u => !u.isPending).length;
          return (
            <button
              key={f}
              onClick={() => setUserFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                userFilter === f
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or email..." />

      {/* List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 && <EmptyState label="No users found" />}
        <AnimatePresence>
          {filteredUsers.map(user => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-5"
            >
              <div className="flex items-start gap-4">
                {/* Avatar with online indicator */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                  {user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" title="Online" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={user.isPending ? 'pending' : 'active'} />
                        {user.country && (
                          <span className="text-xs text-gray-400">{user.country}</span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.phone && <p className="text-xs text-gray-400 mt-0.5">{user.phone}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">
                        Last login: <span className="font-semibold text-gray-600 dark:text-gray-300">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
                        <span className="text-xs text-gray-500">Balance: <span className="font-bold text-gray-800 dark:text-gray-200">${parseFloat(user.balance || '0').toFixed(2)}</span></span>
                        <span className="text-xs text-gray-500">Welcome: <span className="font-bold text-gray-800 dark:text-gray-200">${user.welcomeBonus}</span></span>
                        <span className="text-xs text-gray-500">Ref Bonus: <span className="font-bold text-gray-800 dark:text-gray-200">${parseFloat(user.referralBonus || '0').toFixed(2)}</span></span>
                        <span className="text-xs text-gray-500">Referrals: <span className="font-bold text-gray-800 dark:text-gray-200">{user.referralCount}</span></span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-wrap flex-shrink-0">
                      <button
                        onClick={() => openFundModal(user)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition"
                      >
                        <Wallet size={12} /> Fund
                      </button>

                      {user.isPending ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'approve')}
                          disabled={actionLoading === `user-${user.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition disabled:opacity-50"
                        >
                          {actionLoading === `user-${user.id}` ? <Spinner /> : <CheckCircle size={12} />}
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, 'deactivate')}
                          disabled={actionLoading === `user-${user.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition disabled:opacity-50"
                        >
                          {actionLoading === `user-${user.id}` ? <Spinner /> : <Ban size={12} />}
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  // ─── Card Orders ─────────────────────────────────────────────────────────────
  const renderCards = () => (
    <div className="space-y-5">
      {/* Stats tabs */}
      <div className="grid grid-cols-4 gap-3">
        {(['all', 'pending', 'confirmed', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setOrderFilter(f)}
            className={`rounded-2xl p-4 text-left border-2 transition-all bg-white dark:bg-gray-900 ${
              orderFilter === f ? 'border-blue-400 dark:border-blue-500' : 'border-transparent'
            }`}
          >
            <p className="text-2xl font-black text-gray-800 dark:text-white">
              {f === 'all' ? orders.length : orders.filter(o => o.status === f).length}
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5 capitalize">{f}</p>
          </button>
        ))}
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by cardholder or email..." />

      <div className="space-y-3">
        {filteredOrders.length === 0 && <EmptyState label={`No ${orderFilter === 'all' ? '' : orderFilter} orders`} />}
        <AnimatePresence>
          {filteredOrders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-5"
            >
              <div className="flex items-start gap-4">
                {/* Proof thumbnail */}
                {order.proof_image_url ? (
                  <button
                    onClick={() => setProofModal(order.proof_image_url!)}
                    className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:ring-2 hover:ring-blue-400 transition relative group"
                  >
                    <img src={order.proof_image_url} alt="Proof" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Eye size={16} className="text-white" />
                    </div>
                  </button>
                ) : (
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <CreditCard size={24} className="text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${TIER_COLORS[order.tier]}`}>
                          {TIER_LABELS[order.tier]}
                        </span>
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                          style={{ background: METHOD_COLORS[order.payment_method] }}
                        >
                          {order.payment_method.toUpperCase()}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{order.card_holder}</p>
                      <p className="text-xs text-gray-500">{order.user_name} · {order.user_email}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                        <span className="text-xs text-gray-400">Card: {order.card_number}</span>
                        <span className="text-xs text-gray-400">Expires: {order.card_expiry}</span>
                        <span className="text-xs text-gray-400">Submitted: {new Date(order.submitted_at).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {order.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleOrderAction(order.id, 'reject')}
                          disabled={actionLoading === `order-${order.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition disabled:opacity-50"
                        >
                          {actionLoading === `order-${order.id}` ? <Spinner /> : <XCircle size={14} />}
                          Reject
                        </button>
                        <button
                          onClick={() => handleOrderAction(order.id, 'confirm')}
                          disabled={actionLoading === `order-${order.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition disabled:opacity-50 shadow-sm"
                        >
                          {actionLoading === `order-${order.id}` ? <Spinner /> : <CheckCircle size={14} />}
                          Confirm
                        </button>
                      </div>
                    )}
                    {order.status === 'confirmed' && (
                      <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold flex-shrink-0">
                        <CheckCircle size={14} /> Active
                      </span>
                    )}
                    {order.status === 'rejected' && (
                      <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 text-xs font-bold flex-shrink-0">
                        <XCircle size={14} /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  // ─── Loans ───────────────────────────────────────────────────────────────────
  const renderLoans = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setLoanFilter(f)}
            className={`rounded-2xl p-4 text-left border-2 transition-all bg-white dark:bg-gray-900 ${
              loanFilter === f ? 'border-blue-400 dark:border-blue-500' : 'border-transparent'
            }`}
          >
            <p className="text-2xl font-black text-gray-800 dark:text-white">
              {f === 'all' ? loans.length : loans.filter(l => l.status === f).length}
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5 capitalize">{f}</p>
          </button>
        ))}
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or email..." />

      <div className="space-y-3">
        {filteredLoans.length === 0 && <EmptyState label={`No ${loanFilter === 'all' ? '' : loanFilter} loans`} />}
        <AnimatePresence>
          {filteredLoans.map(loan => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                  <DollarSign size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <StatusBadge status={loan.status} />
                        <span className="text-xs font-semibold text-gray-500 capitalize">{loan.tier} card</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{loan.user_name || loan.user_email}</p>
                      <p className="text-xs text-gray-500">{loan.user_email}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">${parseFloat(loan.amount).toFixed(2)}</span>
                        <span className="text-xs text-gray-400">Applied: {new Date(loan.applied_at).toLocaleDateString()}</span>
                        {loan.purpose && <span className="text-xs text-gray-400">Purpose: {loan.purpose}</span>}
                      </div>
                    </div>

                    {loan.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleLoanAction(loan.id, 'reject')}
                          disabled={actionLoading === `loan-${loan.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition disabled:opacity-50"
                        >
                          {actionLoading === `loan-${loan.id}` ? <Spinner /> : <XCircle size={14} />}
                          Reject
                        </button>
                        <button
                          onClick={() => handleLoanAction(loan.id, 'approve')}
                          disabled={actionLoading === `loan-${loan.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition disabled:opacity-50 shadow-sm"
                        >
                          {actionLoading === `loan-${loan.id}` ? <Spinner /> : <CheckCircle size={14} />}
                          Approve
                        </button>
                      </div>
                    )}
                    {loan.status === 'approved' && (
                      <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold flex-shrink-0">
                        <CheckCircle size={14} /> Approved
                      </span>
                    )}
                    {loan.status === 'rejected' && (
                      <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 text-xs font-bold flex-shrink-0">
                        <XCircle size={14} /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  // ─── Spin & Win ──────────────────────────────────────────────────────────────
  const renderSpinWin = () => {
    const total    = spinResults.reduce((s, r) => s + parseFloat(r.prize_amount || '0'), 0);
    const filtered = spinResults.filter(r => r.user_email.toLowerCase().includes(q));

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10">
            <p className="text-3xl font-black text-gray-800 dark:text-white">{spinResults.length}</p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">Total Spins</p>
          </div>
          <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10">
            <p className="text-3xl font-black text-green-600 dark:text-green-400">${total.toFixed(2)}</p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">Total Winnings Paid</p>
          </div>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by email..." />

        <div className="space-y-3">
          {filtered.length === 0 && <EmptyState label="No spin results" />}
          <AnimatePresence>
            {filtered.map(result => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Gift size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{result.user_email}</p>
                    <p className="text-xs text-gray-500">{result.prize_label} · {new Date(result.spun_at).toLocaleString()}</p>
                  </div>
                  {parseFloat(result.prize_amount) > 0 && (
                    <span className="flex-shrink-0 text-sm font-black text-green-600 dark:text-green-400">
                      +${parseFloat(result.prize_amount).toFixed(2)}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // ─── KYC Reviews ─────────────────────────────────────────────────────────────
  const renderKYC = () => {
    const filtered = kycSubmissions.filter(k =>
      kycFilter === 'all' || k.kyc_status === kycFilter
    ).filter(k =>
      k.user_email.toLowerCase().includes(q) || k.user_name?.toLowerCase().includes(q)
    );

    const counts = {
      all: kycSubmissions.length,
      pending: kycSubmissions.filter(k => k.kyc_status === 'pending').length,
      approved: kycSubmissions.filter(k => k.kyc_status === 'approved').length,
      rejected: kycSubmissions.filter(k => k.kyc_status === 'rejected').length,
    };

    return (
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setKycFilter(f)}
              className={`rounded-2xl p-4 text-left transition ${
                kycFilter === f ? 'ring-2 ring-teal-500' : ''
              } bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10`}
            >
              <p className="text-2xl font-black text-gray-800 dark:text-white">{counts[f]}</p>
              <p className="text-xs font-semibold text-gray-500 capitalize mt-0.5">{f}</p>
            </button>
          ))}
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or email..." />

        <div className="space-y-3">
          {filtered.length === 0 && <EmptyState label={`No ${kycFilter === 'all' ? '' : kycFilter} KYC submissions`} />}
          <AnimatePresence>
            {filtered.map(sub => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                    {(sub.user_name || sub.user_email).charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={sub.kyc_status} />
                          <span className="text-xs text-gray-400">{new Date(sub.submitted_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{sub.user_name}</p>
                        <p className="text-xs text-gray-500">{sub.user_email}</p>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          <span className="font-semibold text-gray-600 dark:text-gray-300">Address:</span> {sub.home_address}
                        </p>
                      </div>

                      {/* Document previews */}
                      <div className="flex gap-2 flex-shrink-0">
                        {sub.government_id_url && (
                          <button
                            onClick={() => setKycDocModal({ url: sub.government_id_url!, label: 'Government ID' })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          >
                            <Eye size={12} /> Gov ID
                          </button>
                        )}
                        {sub.passport_url && (
                          <button
                            onClick={() => setKycDocModal({ url: sub.passport_url!, label: 'Passport' })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          >
                            <Eye size={12} /> Passport
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Note input + action buttons (pending only) */}
                    {sub.kyc_status === 'pending' && (
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Admin note (optional)"
                          value={kycNoteInput[sub.id] ?? ''}
                          onChange={e => setKycNoteInput(prev => ({ ...prev, [sub.id]: e.target.value }))}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        />
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleKYCAction(sub.id, 'reject')}
                            disabled={actionLoading === `kyc-${sub.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition disabled:opacity-50"
                          >
                            {actionLoading === `kyc-${sub.id}` ? <Spinner /> : <XCircle size={12} />}
                            Reject
                          </button>
                          <button
                            onClick={() => handleKYCAction(sub.id, 'approve')}
                            disabled={actionLoading === `kyc-${sub.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 text-white text-xs font-bold hover:bg-teal-600 transition disabled:opacity-50"
                          >
                            {actionLoading === `kyc-${sub.id}` ? <Spinner /> : <CheckCircle size={12} />}
                            Approve
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Show admin note for reviewed submissions */}
                    {sub.kyc_status !== 'pending' && sub.admin_note && (
                      <p className="mt-2 text-xs text-gray-500 italic">Note: {sub.admin_note}</p>
                    )}
                    {sub.reviewed_at && (
                      <p className="mt-1 text-xs text-gray-400">Reviewed: {new Date(sub.reviewed_at).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // ─── Withdrawals ──────────────────────────────────────────────────────────────
  const renderWithdrawals = () => {
    const filtered = withdrawals.filter(w => {
      if (withdrawalFilter === 'all') return true;
      if (withdrawalFilter === 'pending') return w.status === 'pending' || w.status === 'processing';
      return w.status === 'completed';
    });

    const totalAmount = withdrawals.reduce((s, w) => s + parseFloat(w.amount || '0'), 0);
    const pendingCount = withdrawals.filter(w => w.status === 'pending' || w.status === 'processing').length;

    return (
      <div className="space-y-5">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{withdrawals.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">withdrawal requests</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Pending</p>
            <p className="text-2xl font-black text-amber-500 mt-1">{pendingCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">awaiting processing</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total USD</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">${totalAmount.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-0.5">all time withdrawals</p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setWithdrawalFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                withdrawalFilter === f
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState label="No withdrawals found" />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map(w => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-4"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-black text-gray-900 dark:text-white">{w.user_name || w.user_email}</p>
                        <StatusBadge status={w.status} />
                      </div>
                      <p className="text-xs text-gray-500">{w.user_email}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="text-xs text-gray-500">
                          Amount: <span className="font-bold text-gray-800 dark:text-gray-200">${parseFloat(w.amount).toFixed(2)}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          Crypto: <span className="font-bold text-gray-800 dark:text-gray-200">{w.crypto}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          Network: <span className="font-bold text-gray-800 dark:text-gray-200">{w.network}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-mono break-all">
                        Address: <span className="text-gray-700 dark:text-gray-300">{w.wallet_address}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(w.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-black text-red-500">-${parseFloat(w.amount).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{w.crypto}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  // ─── Layout ───────────────────────────────────────────────────────────────────
  const activeNav = NAV_ITEMS.find(n => n.id === tab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-white/10 flex flex-col transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center">
              <Shield size={20} className="text-white dark:text-black" />
            </div>
            <div>
              <p className="text-base font-black text-gray-900 dark:text-white">Fundspree</p>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ id, label, Icon, color }) => (
            <button
              key={id}
              onClick={() => changeTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                tab === id
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={18} className={tab === id ? color : 'text-gray-400'} />
              {label}
              {tab === id && <ChevronRight size={14} className="ml-auto text-gray-400" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">{activeNav?.label ?? 'Dashboard'}</h2>
              <p className="text-xs text-gray-500 hidden sm:block">Fundspree Admin Portal</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {loading && allUsers.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <RefreshCw size={32} className="text-gray-400 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 font-semibold">Loading dashboard...</p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-8 text-center">
              <p className="text-red-600 dark:text-red-400 font-semibold mb-3">{error}</p>
              <button
                onClick={loadData}
                className="px-5 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {tab === 'overview'     && renderOverview()}
              {tab === 'users'        && renderUsers()}
              {tab === 'cards'        && renderCards()}
              {tab === 'loans'        && renderLoans()}
              {tab === 'spinwin'      && renderSpinWin()}
              {tab === 'kyc'          && renderKYC()}
              {tab === 'withdrawals'  && renderWithdrawals()}
            </>
          )}
        </main>
      </div>

      {/* ── Proof image lightbox ─────────────────────────────────────────────── */}
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

      {/* ── KYC Document lightbox ───────────────────────────────────────────── */}
      <AnimatePresence>
        {kycDocModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setKycDocModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setKycDocModal(null)}
                className="absolute -top-10 right-0 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
              >
                <X size={18} />
              </button>
              <img src={kycDocModal.url} alt={kycDocModal.label} className="w-full rounded-2xl shadow-2xl" />
              <p className="text-white/60 text-xs text-center mt-3">{kycDocModal.label}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fund User Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {fundModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setFundModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-6 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Manage Balance</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{fundModal.name} · {fundModal.email}</p>
                </div>
                <button onClick={() => setFundModal(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500">
                  <X size={18} />
                </button>
              </div>

              {/* Current values */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-4 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="text-sm font-black text-gray-800 dark:text-gray-100">${parseFloat(fundModal.balance || '0').toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Welcome</p>
                  <p className="text-sm font-black text-gray-800 dark:text-gray-100">${fundModal.welcomeBonus}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Ref Bonus</p>
                  <p className="text-sm font-black text-gray-800 dark:text-gray-100">${parseFloat(fundModal.referralBonus || '0').toFixed(2)}</p>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-5">
                {([
                  { id: 'add',      label: 'Add',      Icon: Plus,  active: 'bg-emerald-500 text-white' },
                  { id: 'subtract', label: 'Subtract',  Icon: Minus, active: 'bg-red-500 text-white'     },
                  { id: 'set',      label: 'Set Value', Icon: Save,  active: 'bg-blue-500 text-white'    },
                ] as { id: FundMode; label: string; Icon: any; active: string }[]).map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setFundMode(m.id); setFundForm({ balance: '', welcome_bonus: '', referral_bonus: '' }); setFundError(null); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition ${
                      fundMode === m.id ? m.active : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <m.Icon size={12} /> {m.label}
                  </button>
                ))}
              </div>

              {/* Mode hint */}
              <p className="text-xs text-gray-400 mb-4 px-1">
                {fundMode === 'add'      && 'Enter the amount to ADD to the current value.'}
                {fundMode === 'subtract' && 'Enter the amount to SUBTRACT from the current value.'}
                {fundMode === 'set'      && 'Enter the new absolute value to SET directly.'}
              </p>

              {/* Form */}
              <div className="space-y-4">
                {[
                  { key: 'balance',        label: 'Balance ($)',        step: '0.01' },
                  { key: 'welcome_bonus',  label: 'Welcome Bonus ($)',  step: '1'    },
                  { key: 'referral_bonus', label: 'Referral Bonus ($)', step: '0.01' },
                ].map(({ key, label, step }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                    <input
                      type="number"
                      min="0"
                      step={step}
                      value={fundForm[key as keyof FundForm]}
                      onChange={e => setFundForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder={fundMode === 'set' ? 'New value…' : 'Amount…'}
                    />
                  </div>
                ))}
              </div>

              {fundError && (
                <p className="mt-3 text-sm text-red-500 font-medium">{fundError}</p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setFundModal(null)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFundUser}
                  disabled={fundLoading}
                  className={`flex-1 py-3 rounded-xl text-white text-sm font-bold transition disabled:opacity-50 flex items-center justify-center gap-2 ${
                    fundMode === 'subtract' ? 'bg-red-500 hover:bg-red-600' :
                    fundMode === 'add'      ? 'bg-emerald-500 hover:bg-emerald-600' :
                                             'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {fundLoading ? <><Spinner /> Saving...</> : (
                    fundMode === 'subtract' ? <><Minus size={14} /> Subtract</> :
                    fundMode === 'add'      ? <><Plus size={14} /> Add Funds</> :
                                             <><Save size={14} /> Set Values</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Search bar helper ────────────────────────────────────────────────────────
function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative max-w-md">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
