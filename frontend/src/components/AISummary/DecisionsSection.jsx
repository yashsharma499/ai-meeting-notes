import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function DecisionsSection({ decisions }) {
  return (
    <div className="backdrop-blur-3xl bg-white/[0.04] border border-white/[0.1] rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 text-amber-300">
        <Lightbulb size={24} />
        <h3 className="text-xl font-bold uppercase tracking-wider">Key Decisions</h3>
      </div>

      <div className="space-y-4">
        {decisions.map((d, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start"
          >
            <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-400" />
            <p className="text-gray-300">
              {d.description || d.decision || d}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
