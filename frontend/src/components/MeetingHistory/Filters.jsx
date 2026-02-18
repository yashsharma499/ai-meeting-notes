import { motion } from "framer-motion";
import { Search, Filter, Users } from "lucide-react";

export default function Filters({ search, setSearch, filterType, setFilterType, filterParticipant, setFilterParticipant }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl mb-12"
    >
      {/* Search */}
      <div className="lg:col-span-5 relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search transcript, type, or tags..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-white/30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Type Filter */}
      <div className="lg:col-span-3 relative">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <select
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-300 cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option className="bg-[#1a1a1c]" value="All">All Categories</option>
          <option className="bg-[#1a1a1c]" value="Standup">Daily Standup</option>
          <option className="bg-[#1a1a1c]" value="Planning">Sprint Planning</option>
          <option className="bg-[#1a1a1c]" value="Review">Project Review</option>
          <option className="bg-[#1a1a1c]" value="Sprint Retro">Retrospective</option>
        </select>
      </div>

      {/* Participant filter */}
      <div className="lg:col-span-4 relative">
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Attendee name..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-white/30"
          value={filterParticipant}
          onChange={(e) => setFilterParticipant(e.target.value)}
        />
      </div>
    </motion.div>
  );
}
