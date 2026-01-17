import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-4">
        <Sparkles size={14} /> Task Management
      </div>

      <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
        Action{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-300">
          Items
        </span>
      </h1>

      <p className="text-gray-400 font-medium">
        Manage and track your meeting outcomes.
      </p>
    </motion.div>
  );
}
