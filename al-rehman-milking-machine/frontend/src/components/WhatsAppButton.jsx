import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "923084590379";

const WhatsAppButton = () => {
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [unread, setUnread] = useState(true);

  // Show the bubble automatically shortly after the page loads
  useEffect(() => {
    const timer = setTimeout(() => setBubbleVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const dismissBubble = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBubbleVisible(false);
  };

  const handleOpen = () => {
    setUnread(false);
    setBubbleVisible(false);
  };

  return (
    <motion.div
      className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 flex items-end gap-3"
      initial={{ opacity: 0, scale: 0.5, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {/* Keyframes for the pulse ring — kept local so this component has no external CSS dependency */}
      <style>{`
        @keyframes wa-pulse-ring {
          0% { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes wa-pulse-ring-delayed {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.9); opacity: 0; }
        }
      `}</style>

      {/* Chat bubble */}
      <AnimatePresence>
        {bubbleVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden mb-1"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#25d366] flex items-center justify-center">
                  <FaWhatsapp size={18} className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-display font-semibold text-ink-950 leading-tight">Al Rahman</div>
                <div className="text-[11px] text-green-600 font-medium">Online now</div>
              </div>
              <button
                type="button"
                onClick={dismissBubble}
                aria-label="Dismiss"
                className="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors shrink-0"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message preview */}
            <div className="px-4 pb-4">
              <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-[13px] text-gray-700 leading-snug">
                Assalam o Alaikum! 👋 Milking machines ya spare parts ke baare mein koi sawal hai?
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Assalam o Alaikum, I'm interested in Al Rahman milking machines."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpen}
                className="mt-3 flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#20bd5a] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                <FaWhatsapp size={15} />
                Start Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          "Assalam o Alaikum, I'm interested in Al Rahman milking machines."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={handleOpen}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-16 h-16 rounded-full bg-[#25d366] flex items-center justify-center shadow-[0_15px_35px_rgba(37,211,102,0.45)] overflow-visible"
      >
        {/* Layered glow rings */}
        <span
          className="absolute inset-0 rounded-full bg-[#25d366]"
          style={{ animation: "wa-pulse-ring 2.4s ease-out infinite" }}
        />
        <span
          className="absolute inset-0 rounded-full bg-[#25d366]"
          style={{ animation: "wa-pulse-ring-delayed 2.4s ease-out infinite 1.2s" }}
        />

        <FaWhatsapp size={38} className="relative z-10 text-white" />

        {/* Unread badge */}
        {unread && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
            style={{ width: 22, height: 22 }}
            className="absolute -top-1.5 -right-1.5 z-20 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-[11px] font-bold leading-none"
          >
            1
          </motion.span>
        )}
      </motion.a>
    </motion.div>
  );
};

export default WhatsAppButton;