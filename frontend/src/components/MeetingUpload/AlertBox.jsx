import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function AlertBox({ alert }) {
  if (!alert) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }} 
      animate={{ opacity: 1, height: "auto" }} 
      exit={{ opacity: 0, height: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
        <AlertCircle size={20} />
        <p className="text-sm font-medium">{alert.message}</p>
      </div>
    </motion.div>
  );
}
