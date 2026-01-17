import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ActionItemsSection({ items, getPriorityStyles }) {
  return (
    <div className="backdrop-blur-3xl bg-white/[0.04] border border-white/[0.1] rounded-3xl p-8 shadow-2xl h-full">
      <div className="flex items-center gap-3 mb-8 text-pink-300">
        <CheckCircle2 size={24} />
        <h3 className="text-xl font-bold uppercase tracking-wider">Action Items</h3>
      </div>

      <div className="space-y-6">
        {items.length ? (
          items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all"
            >
              <h4 className="text-white font-bold text-lg mb-3">{item.task}</h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Owner:</span>
                  <span className="text-gray-300">{item.owner || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Deadline:</span>
                  <span className="text-gray-300">{item.deadline || "Not specified"}</span>
                </div>
              </div>

              <div className={`inline-block px-3 py-1 text-xs rounded-full font-bold mt-4 border ${getPriorityStyles(item.priority)}`}>
                {item.priority || "Not set"}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic py-10">No action items found</p>
        )}
      </div>
    </div>
  );
}
