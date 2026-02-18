import { motion } from "framer-motion";
import { Flag } from "lucide-react";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]"
    >
      <Flag size={54} className="text-gray-700 mb-6" />
      <p className="text-gray-400 text-xl font-bold italic">
        No matching action items found.
      </p>
    </motion.div>
  );
}
