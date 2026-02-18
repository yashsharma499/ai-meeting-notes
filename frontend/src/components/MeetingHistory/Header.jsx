import { motion } from "framer-motion";
import { History } from "lucide-react";

export default function Header() {
  return (
    <header className="mb-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 text-indigo-400 font-bold tracking-[0.2em] uppercase text-xs mb-3"
      >
        <History size={16} /> Central Archive
      </motion.div>

      <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-8">
        Meeting <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-300">Vault</span>
      </h1>
    </header>
  );
}
