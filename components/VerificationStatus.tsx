'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerificationStatusProps {
  onBack?: () => void;
}

export default function VerificationStatus({ onBack }: VerificationStatusProps) {
  const handleContactSupport = () => {
    const whatsappNumber = '2341234567890';
    const message = encodeURIComponent('Hello, I need assistance with my account activation');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

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
            {/* Icon + title */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 border bg-gold/5 border-gold/30">
                <MessageCircle className="w-9 h-9 text-gold" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight text-center">
                Account Activation Required
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                Action Needed
              </p>
            </div>

            {/* Message box */}
            <div className="rounded-2xl p-5 mb-2 border bg-gold/5 border-gold/30">
              <p className="text-gray-700 dark:text-gray-300 text-sm text-center leading-relaxed">
                To activate your account, you must contact our support team. Our agents will guide you through the verification process and get your account fully activated.
              </p>
            </div>

            {/* Emphasis note */}
            <p className="text-xs text-center text-gold font-semibold mb-6 mt-3">
              Account activation is only completed via support.
            </p>

            {/* Contact Support button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleContactSupport}
              className="w-full bg-gold-gradient text-black font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm gold-glow hover:opacity-90"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Support to Activate</span>
            </motion.button>

            {/* Footer hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6"
            >
              Support is available 24/7 to assist you.
            </motion.p>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
