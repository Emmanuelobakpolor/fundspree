'use client';
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportChatProps {
  whatsappNumber?: string;
  message?: string;
}

export default function SupportChat({
  whatsappNumber = "14254456824",
  message = 'Hello, I need assistance',
}: SupportChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState(message);

  const handleSend = () => {
    if (!userMessage.trim()) return;
    const encoded = encodeURIComponent(userMessage);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 220, damping: 18 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open support chat"
          className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center shadow-xl gold-glow hover:scale-110 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-6 h-6 text-black" strokeWidth={2} />
        </button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Clicking the backdrop closes the modal
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              // Stop clicks inside the modal from closing it
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2.5">
                  {/* Green "online" dot */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">
                    Chat with Support
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  Write your message below and we'll connect you via WhatsApp.
                </p>

                <textarea
                  autoFocus
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={4}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-3 text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none transition"
                  placeholder="Type your message..."
                />

                <p className="text-[11px] text-neutral-400 mt-1.5 text-right">
                  Press Ctrl+Enter to send
                </p>

                <button
                  onClick={handleSend}
                  disabled={!userMessage.trim()}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-gold-gradient text-black font-semibold text-sm py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={15} strokeWidth={2.5} />
                  Send via WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
