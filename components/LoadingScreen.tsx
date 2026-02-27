'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none"
        >
          {/* Particle dots */}
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold/30"
              style={{
                top: `${20 + Math.sin(i * 1.05) * 30}%`,
                left: `${15 + (i * 14)}%`,
              }}
              animate={{ y: [0, -18, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.28, ease: 'easeInOut' }}
            />
          ))}

          {/* Rings */}
          <div className="relative w-28 h-28 mb-8">
            {/* Outer slow dashed ring */}
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full block"
              style={{ border: '1px dashed rgba(212,175,55,0.25)' }}
            />
            {/* Middle fast arc */}
            <motion.span
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-3 rounded-full block"
              style={{
                borderTop: '2.5px solid #D4AF37',
                borderRight: '2.5px solid rgba(212,175,55,0.35)',
                borderBottom: '2.5px solid transparent',
                borderLeft: '2.5px solid transparent',
              }}
            />
            {/* Inner glow core */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-7 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center"
            >
              <span className="font-black text-gold text-base tracking-tight">FS</span>
            </motion.div>
          </div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
            className="text-center"
          >
            <p className="text-white text-[1.6rem] font-bold tracking-tight leading-none">
              Fund<span className="text-gold">Sphere</span>
            </p>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.28em] mt-2 font-medium">
              Premium Digital Finance
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="mt-10 w-48 h-px bg-white/8 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 2.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, #D4AF37 30%, #FDE68A 60%, #D4AF37 100%)',
              }}
            />
          </div>

          {/* Loading dots */}
          <div className="flex gap-1.5 mt-5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-gold/60"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.22 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
