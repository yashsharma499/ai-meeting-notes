import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";

export default function Alert({
  type = "success",
  message,
  onClose,
  autoClose = false,
  duration = 5000,
}) {
  
  const typeStyles = {
    success: {
      bg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-200",
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    },
    error: {
      bg: "bg-red-500/10 border-red-500/40 text-red-200",
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    },
    warning: {
      bg: "bg-amber-500/10 border-amber-500/40 text-amber-200",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    },
    info: {
      bg: "bg-indigo-500/10 border-indigo-500/40 text-indigo-200",
      icon: <Info className="w-5 h-5 text-indigo-400" />,
      glow: "shadow-[0_0_15px_rgba(99,102,241,0.2)]",
    },
  };

  const selected = typeStyles[type] || typeStyles.info;

  // Auto-close logic
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative overflow-hidden backdrop-blur-xl border rounded-2xl p-4 mb-6 flex items-start gap-4 transition-all ${selected.bg} ${selected.glow}`}
    >
      {/* GLOW DECOR (Subtle light leak inside alert) */}
      <div className={`absolute -left-4 -top-4 w-12 h-12 blur-2xl opacity-20 rounded-full ${selected.bg}`} />

      {/* ICON CONTAINER */}
      <div className="shrink-0 p-1.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
        {selected.icon}
      </div>

      {/* MESSAGE TEXT */}
      <div className="flex-1 leading-relaxed text-sm font-bold tracking-tight py-0.5">
        {message}
      </div>

      {/* CLOSE BUTTON */}
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
        >
          <X size={18} />
        </button>
      )}

      {/* PROGRESS BAR (Visual countdown for auto-close) */}
      {autoClose && (
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 h-[3px] bg-white/20"
        />
      )}
    </motion.div>
  );
}
