'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Camera, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../AuthContext';

export default function ProfileView() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    country: '',
    dob: '',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder || label}
        className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black px-4 py-3 text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
      />
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto">

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gold-gradient flex items-center justify-center shadow-xl gold-glow">
            <UserCircle size={52} className="text-black" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black border-2 border-white dark:border-gray-900 flex items-center justify-center hover:bg-gray-800 transition">
            <Camera size={14} className="text-white" />
          </button>
        </div>
        <div className="text-center">
          <p className="font-bold text-black dark:text-white">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-amber-500 bg-amber-50 dark:bg-amber-400/10 px-2.5 py-0.5 rounded-full">
            KYC Unverified
          </span>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5 space-y-4"
      >
        <p className="font-semibold text-black dark:text-white">Personal Information</p>
        {field('Full Name', 'name')}
        {field('Email Address', 'email', 'email')}
        {field('Phone Number', 'phone', 'tel', '+1 (000) 000-0000')}
        {field('Country', 'country', 'text', 'Select your country')}
        {field('Date of Birth', 'dob', 'date')}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-gold-gradient text-black font-semibold text-sm gold-glow hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          {saved ? (
            <>
              <CheckCircle2 size={16} />
              Saved!
            </>
          ) : (
            'Save Changes'
          )}
        </motion.button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-5"
      >
        <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</p>
        <p className="text-xs text-red-500 dark:text-red-400 mb-3">
          Once you delete your account, all data will be permanently removed.
        </p>
        <button className="px-4 py-2 rounded-xl border border-red-400 text-red-500 text-xs font-semibold hover:bg-red-500/10 transition">
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
