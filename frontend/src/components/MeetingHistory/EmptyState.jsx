import { motion } from "framer-motion";
import Alert from "../Alert";

export default function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]"
    >
      <Alert type="info" message="No matching records found. Try adjusting filters." />
    </motion.div>
  );
}
