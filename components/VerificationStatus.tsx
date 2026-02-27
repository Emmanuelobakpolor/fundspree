'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VerificationStatusProps {
  onBack?: () => void;
}

type VerificationState = 'pending' | 'verified' | 'rejected';

export default function VerificationStatus({ onBack }: VerificationStatusProps) {
  const [verificationState, setVerificationState] = useState<VerificationState>('pending');
  const [checking, setChecking] = useState(false);

  const checkVerificationStatus = async () => {
    setChecking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setChecking(false);
    if (Math.random() > 0.7) {
      setVerificationState('verified');
    }
  };

  const handleContactSupport = () => {
    const whatsappNumber = '2341234567890';
    const message = encodeURIComponent('Hello, I need assistance with my account verification');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const getStatusInfo = () => {
    switch (verificationState) {
      case 'pending':
        return {
          title: 'Verification Pending',
          icon: Clock,
          iconColor: 'text-gold',
          borderColor: 'border-gold/30',
          bgColor: 'bg-gold/5',
          message: 'Your account is currently under review. Our team will verify your details shortly.',
          buttonText: 'Check Status',
          buttonAction: checkVerificationStatus,
          buttonDisabled: checking,
        };
      case 'verified':
        return {
          title: 'Account Verified',
          icon: CheckCircle2,
          iconColor: 'text-emerald-500',
          borderColor: 'border-emerald-500/30',
          bgColor: 'bg-emerald-500/5',
          message: 'Your account has been successfully verified. You now have full access to all features.',
          buttonText: 'Go to Dashboard',
          buttonAction: onBack || (() => {}),
          buttonDisabled: false,
        };
      case 'rejected':
        return {
          title: 'Verification Rejected',
          icon: AlertCircle,
          iconColor: 'text-red-500',
          borderColor: 'border-red-500/30',
          bgColor: 'bg-red-500/5',
          message: 'Your account verification was rejected. Please contact our support team for assistance.',
          buttonText: 'Contact Support',
          buttonAction: handleContactSupport,
          buttonDisabled: false,
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="relative min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 overflow-hidden">

      {/* Subtle gold ambient blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="glass rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden"
        >
          {/* Gold top accent line */}
          <div className="h-1 w-full bg-gold-gradient" />

          <div className="p-8">
            {/* Status icon + title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={verificationState}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center mb-8"
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                  <StatusIcon className={`w-9 h-9 ${statusInfo.iconColor}`} strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">
                  {statusInfo.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  Account Verification Status
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Message box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={verificationState + '-msg'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl p-5 mb-6 border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
              >
                <p className="text-gray-700 dark:text-gray-300 text-sm text-center leading-relaxed">
                  {statusInfo.message}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar — pending only */}
            {verificationState === 'pending' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Verification progress</span>
                  <span className="text-xs font-semibold text-gold">60%</span>
                </div>
                <div className="bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                    className="bg-gold-gradient h-full rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {/* Action button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={statusInfo.buttonAction}
              disabled={statusInfo.buttonDisabled}
              className="w-full bg-gold-gradient text-black font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm gold-glow hover:opacity-90"
            >
              {statusInfo.buttonDisabled ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <span>{statusInfo.buttonText}</span>
              )}
            </motion.button>

            {/* Footer hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6"
            >
              Have questions?{' '}
              <span
                onClick={handleContactSupport}
                className="text-gold font-medium cursor-pointer hover:underline"
              >
                Chat with our support team
              </span>
              {' '}— available 24/7.
            </motion.p>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
