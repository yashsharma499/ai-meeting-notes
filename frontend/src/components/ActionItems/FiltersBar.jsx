import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

export default function FiltersBar({ filterOwner, setFilterOwner, filterPriority, setFilterPriority }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-4 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
    >
      <div className="relative group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Filter by owner..."
          className="bg-transparent pl-10 pr-4 py-2 outline-none text-sm w-48 md:w-64 text-white placeholder-white/30"
          value={filterOwner}
          onChange={(e) => setFilterOwner(e.target.value)}
        />
      </div>

      <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

      <div className="flex items-center gap-2 px-3">
        <Filter size={16} className="text-indigo-400" />
        <select
          className="bg-transparent outline-none text-sm cursor-pointer font-bold text-gray-300"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option className="bg-[#1a1a1c]" value="All">All Priorities</option>
          <option className="bg-[#1a1a1c]" value="High">High</option>
          <option className="bg-[#1a1a1c]" value="Medium">Medium</option>
          <option className="bg-[#1a1a1c]" value="Low">Low</option>
        </select>
      </div>
    </motion.div>
  );
}
