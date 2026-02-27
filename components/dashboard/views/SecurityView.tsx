'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldOff, Lock, Key, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function SecurityView() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passSaved, setPassSaved] = useState(false);

  const handlePassSave = () => {
    setPassSaved(true);
    setTimeout(() => setPassSaved(false), 2500);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto">

      {/* 2FA Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFAEnabled ? 'bg-emerald-500/10' : 'bg-gray-100 dark:bg-white/10'}`}>
              {twoFAEnabled
                ? <ShieldCheck size={18} className="text-emerald-500" />
                : <ShieldOff size={18} className="text-gray-400" />}
            </div>
            <div>
              <p className="font-semibold text-black dark:text-white text-sm">Two-Factor Authentication</p>
              <p className={`text-xs font-semibold mt-0.5 ${twoFAEnabled ? 'text-emerald-500' : 'text-gray-400'}`}>
                {twoFAEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setTwoFAEnabled(!twoFAEnabled); setShowQR(!showQR && !twoFAEnabled); }}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${twoFAEnabled ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-white/20'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${twoFAEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Add an extra layer of security to your account. When 2FA is enabled, you'll need both your password and an authentication code to sign in.
        </p>
      </motion.div>

      {/* QR Setup (show when enabling) */}
      {showQR && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5 space-y-4"
        >
          <p className="font-semibold text-black dark:text-white">Setup Authenticator App</p>
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? 'bg-black dark:bg-white' : ''}`} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500">Scan with Google Authenticator or Authy</p>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Enter 6-digit code to verify</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-3 text-sm text-center tracking-widest text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition font-mono"
            />
          </div>
          <button className="w-full py-3 rounded-xl bg-gold-gradient text-black font-semibold text-sm hover:opacity-90 transition">
            Verify & Enable 2FA
          </button>
        </motion.div>
      )}

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-gold" />
          <p className="font-semibold text-black dark:text-white">Change Password</p>
        </div>

        {(['current', 'new', 'confirm'] as const).map((key) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 capitalize">
              {key === 'current' ? 'Current Password' : key === 'new' ? 'New Password' : 'Confirm New Password'}
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={passwords[key]}
                onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 pr-11 py-3 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
              />
              {key === 'current' && (
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              )}
            </div>
          </div>
        ))}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePassSave}
          className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-80 transition flex items-center justify-center gap-2"
        >
          {passSaved ? <><CheckCircle2 size={16} /> Updated!</> : 'Update Password'}
        </motion.button>
      </motion.div>

      {/* Security Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Key size={15} className="text-gold" />
          <p className="font-semibold text-black dark:text-white text-sm">Recent Security Activity</p>
        </div>
        <div className="space-y-3">
          {[
            { event: 'Account created', time: 'Just now', safe: true },
            { event: 'Logged in', time: 'Just now', safe: true },
          ].map((ev, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-black dark:text-white">{ev.event}</p>
                <p className="text-xs text-gray-400">{ev.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
