'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircle, Camera, CheckCircle2, Trash2, AlertTriangle,
  ShieldCheck, ShieldX, Clock, Upload, FileText, Home, X,
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { authFetch, authFetchMultipart, API_BASE } from '../../../lib/api';

// ── KYC status badge ──────────────────────────────────────────────────────────

function KYCBadge({ status }: { status: string }) {
  if (status === 'approved') return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-0.5 rounded-full">
      <ShieldCheck size={11} /> KYC Verified
    </span>
  );
  if (status === 'pending') return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 px-2.5 py-0.5 rounded-full">
      <Clock size={11} /> KYC Under Review
    </span>
  );
  if (status === 'rejected') return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 px-2.5 py-0.5 rounded-full">
      <ShieldX size={11} /> KYC Rejected
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-50 dark:bg-amber-400/10 px-2.5 py-0.5 rounded-full">
      <AlertTriangle size={11} /> KYC Unverified
    </span>
  );
}

// ── File picker helper ────────────────────────────────────────────────────────

function FilePicker({
  label, icon: Icon, file, onChange,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <label className="flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-black/30 px-4 py-3 cursor-pointer hover:border-gold/50 transition group">
        <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          {file ? (
            <p className="text-sm font-medium text-black dark:text-white truncate">{file.name}</p>
          ) : (
            <p className="text-sm text-gray-400 group-hover:text-gray-500 transition">
              Click to upload image
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or PDF · max 5 MB</p>
        </div>
        {file && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onChange(null); }}
            className="text-gray-400 hover:text-red-400 transition flex-shrink-0"
          >
            <X size={15} />
          </button>
        )}
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProfileView() {
  const { user, updateUser, logout } = useAuth();

  // ── Avatar ────────────────────────────────────────────────────────────────
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatarUrl ?? null
  );
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    setAvatarPreview(user?.avatarUrl ?? null);
  }, [user?.avatarUrl]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await authFetchMultipart('/api/auth/avatar/', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        updateUser(data);
        if (data.avatarUrl) setAvatarPreview(data.avatarUrl);
      }
    } catch {
      // Keep local preview on error
    } finally {
      setAvatarUploading(false);
      // Reset input so the same file can be picked again
      e.target.value = '';
    }
  };

  // ── Profile form ─────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    username: user?.username ?? '',
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    country: user?.country ?? '',
    dateOfBirth: user?.dateOfBirth ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // ── KYC form ─────────────────────────────────────────────────────────────
  const [govIdFile, setGovIdFile] = useState<File | null>(null);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [homeAddress, setHomeAddress] = useState('');
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [kycSuccess, setKycSuccess] = useState(false);
  const [kycError, setKycError] = useState('');

  // ── Delete account ────────────────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const kycStatus = user?.kycStatus ?? 'none';
  const canSubmitKyc = kycStatus === 'none' || kycStatus === 'rejected';

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const res = await authFetch('/api/auth/profile/', {
        method: 'PATCH',
        body: JSON.stringify({
          username: form.username,
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          dateOfBirth: form.dateOfBirth || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        const firstField = Object.values(data)[0];
        setSaveError(Array.isArray(firstField) ? (firstField[0] as string) : 'Failed to save changes.');
      }
    } catch {
      setSaveError('Network error. Is the server running?');
    } finally {
      setSaving(false);
    }
  };

  const handleKYCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!govIdFile || !passportFile || !homeAddress.trim()) {
      setKycError('Please fill in all required fields and upload both documents.');
      return;
    }
    setKycSubmitting(true);
    setKycError('');
    try {
      const fd = new FormData();
      fd.append('government_id', govIdFile);
      fd.append('passport', passportFile);
      fd.append('home_address', homeAddress.trim());

      const res = await authFetchMultipart('/api/auth/kyc/', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        updateUser(data);
        setKycSuccess(true);
        setGovIdFile(null);
        setPassportFile(null);
        setHomeAddress('');
      } else {
        const firstField = Object.values(data)[0];
        setKycError(Array.isArray(firstField) ? (firstField[0] as string) : 'Submission failed. Please try again.');
      }
    } catch {
      setKycError('Network error. Is the server running?');
    } finally {
      setKycSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') return;
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await authFetch('/api/auth/profile/', { method: 'DELETE' });
      if (res.ok) {
        logout();
      } else {
        setDeleteError('Failed to delete account. Please try again.');
      }
    } catch {
      setDeleteError('Network error. Is the server running?');
    } finally {
      setDeleting(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key] ?? ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder || label}
        className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-3 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
      />
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto">

      {/* Avatar + status */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gold-gradient flex items-center justify-center shadow-xl gold-glow overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserCircle size={52} className="text-black" />
            )}
            {avatarUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black border-2 border-white dark:border-gray-900 flex items-center justify-center hover:bg-gray-800 transition"
          >
            <Camera size={14} className="text-white" />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="text-center">
          <p className="font-bold text-black dark:text-white">{user?.name}</p>
          <p className="text-xs text-gray-400 mb-1">{user?.email}</p>
          <KYCBadge status={kycStatus} />
        </div>
      </motion.div>

      {/* Personal info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5 space-y-4">
        <p className="font-semibold text-black dark:text-white">Personal Information</p>
        {field('Username', 'username')}
        {field('Full Name', 'name')}
        {field('Email Address', 'email', 'email')}
        {field('Phone Number', 'phone', 'tel', '+1 (000) 000-0000')}
        {field('Country', 'country', 'text', 'Your country')}
        {field('Date of Birth', 'dateOfBirth', 'date')}
        {saveError && <p className="text-xs text-red-500 dark:text-red-400">{saveError}</p>}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gold-gradient text-black font-semibold text-sm gold-glow hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saved ? <><CheckCircle2 size={16} /> Saved!</>
            : saving ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Saving...</>
            : 'Save Changes'}
        </motion.button>
      </motion.div>

      {/* KYC section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5 space-y-4">

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-black dark:text-white">KYC Verification</p>
            <p className="text-xs text-gray-400 mt-0.5">Verify your identity to unlock higher withdrawal limits.</p>
          </div>
          <KYCBadge status={kycStatus} />
        </div>

        {/* Approved */}
        {kycStatus === 'approved' && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20">
            <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Identity Verified</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5 leading-relaxed">
                Your KYC has been approved. You now have access to full withdrawal limits.
              </p>
            </div>
          </div>
        )}

        {/* Pending */}
        {kycStatus === 'pending' && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20">
            <Clock size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Under Review</p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5 leading-relaxed">
                Your documents have been submitted and are being reviewed by our team. This usually takes 1–2 business days.
              </p>
            </div>
          </div>
        )}

        {/* Rejected banner */}
        {kycStatus === 'rejected' && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200/60 dark:border-red-500/20">
            <ShieldX size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Verification Rejected</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-0.5 leading-relaxed">
                Your KYC was rejected. Please resubmit with clearer, valid documents below.
              </p>
            </div>
          </div>
        )}

        {/* Submission form (none or rejected) */}
        {canSubmitKyc && (
          <>
            {/* Withdrawal limit comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-amber-50 dark:bg-amber-400/10 border border-amber-200/60 dark:border-amber-400/20 p-3 text-center">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">Without KYC</p>
                <p className="text-lg font-black text-amber-700 dark:text-amber-300">$500</p>
                <p className="text-[11px] text-amber-500">max per withdrawal</p>
              </div>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 p-3 text-center">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">With KYC</p>
                <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">Unlimited</p>
                <p className="text-[11px] text-emerald-500">full access</p>
              </div>
            </div>

            {kycSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Documents submitted! We'll review and notify you shortly.
                </p>
              </div>
            )}

            <form onSubmit={handleKYCSubmit} className="space-y-4">
              <FilePicker
                label="Government-Issued ID (Driver's Licence / National ID)"
                icon={FileText}
                file={govIdFile}
                onChange={setGovIdFile}
              />
              <FilePicker
                label="Passport (photo / data page)"
                icon={Upload}
                file={passportFile}
                onChange={setPassportFile}
              />

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Home Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Home size={15} className="absolute left-3 top-3.5 text-gray-400" />
                  <textarea
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    rows={3}
                    placeholder="Street, City, State / Province, Postal Code, Country"
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black pl-9 pr-4 pt-3 pb-3 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition resize-none"
                  />
                </div>
              </div>

              {kycError && <p className="text-xs text-red-500 dark:text-red-400">{kycError}</p>}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={kycSubmitting}
                className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-80 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {kycSubmitting
                  ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Submitting...</>
                  : <><ShieldCheck size={15} /> Submit KYC Documents</>}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-5">
        <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</p>
        <p className="text-xs text-red-500 dark:text-red-400 mb-3">
          Once you delete your account, all data will be permanently removed. This cannot be undone.
        </p>
        <button
          onClick={() => { setShowDeleteConfirm(true); setDeleteInput(''); setDeleteError(''); }}
          className="px-4 py-2 rounded-xl border border-red-400 text-red-500 text-xs font-semibold hover:bg-red-500/10 transition flex items-center gap-1.5"
        >
          <Trash2 size={13} /> Delete Account
        </button>
      </motion.div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-black dark:text-white text-sm">Delete your account?</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">This action is permanent and cannot be reversed.</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Type <span className="text-red-500 font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="DELETE"
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                />
              </div>
              {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== 'DELETE' || deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {deleting
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><Trash2 size={14} /> Delete</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
