import { motion } from "framer-motion";
import { User, Calendar, Clock, CheckCircle2, Edit3 } from "lucide-react";

export default function ActionCard({
  item,
  index,
  startEdit,
  getPriorityStyles,
  handleStatusChange,
  editingId,
}) {
  return (
    <motion.div
      key={item._id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative flex flex-col backdrop-blur-2xl bg-white/[0.05] border border-white/[0.12] rounded-3xl p-6 transition-all hover:bg-white/[0.08] hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${
        editingId === item._id ? "ring-2 ring-indigo-500/50" : ""
      }`}
    >
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-6">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${getPriorityStyles(
              item.priority
            )}`}
          >
            {item.priority}
          </span>

          <button
            onClick={() => startEdit(item)}
            className="opacity-0 group-hover:opacity-100 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
          >
            <Edit3 size={16} className="text-gray-300" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-white leading-tight mb-6 group-hover:text-indigo-200 transition-colors">
          {item.task}
        </h3>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5">
            <User size={16} className="text-indigo-400" />
            <span>{item.owner || "Unassigned"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5">
            <Calendar size={16} className="text-purple-400" />
            <span>{item.deadline || "No deadline"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-white/10">
        <div className="flex items-center gap-3">
          {item.status === "Done" ? (
            <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30">
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
          ) : (
            <div className="bg-amber-500/20 p-1.5 rounded-lg border border-amber-500/30">
              <Clock size={18} className="text-amber-400" />
            </div>
          )}

          <select
            value={item.status}
            onChange={(e) => handleStatusChange(item._id, e.target.value)}
            className="bg-transparent text-sm font-black tracking-wide focus:outline-none cursor-pointer text-gray-200"
          >
            <option className="bg-[#1a1a1c]" value="Pending">Pending</option>
            <option className="bg-[#1a1a1c]" value="In Progress">In Progress</option>
            <option className="bg-[#1a1a1c]" value="Done">Done</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
