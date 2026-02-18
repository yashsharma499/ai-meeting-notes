import { motion } from "framer-motion";
import { Calendar, Users, LayoutGrid, ExternalLink } from "lucide-react";

export default function MeetingCard({ meeting, index, formatDate, onSelect }) {
  return (
    <motion.div
      key={meeting._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative backdrop-blur-2xl bg-white/[0.05] border border-white/[0.12] rounded-[2rem] p-7 hover:bg-white/[0.08] hover:border-white/20 cursor-pointer"
      onClick={() => onSelect(meeting)}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full" />

      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-300 border border-indigo-500/30">
          <LayoutGrid size={20} />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          {meeting.meeting_type}
        </div>
      </div>

      <h3 className="text-2xl font-black text-white mb-4">
        {meeting.meeting_type} Session
      </h3>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5">
          <Calendar size={16} className="text-purple-400" />
          {formatDate(meeting.created_at)}
        </div>

        <div className="flex items-center gap-3 text-sm font-medium text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5">
          <Users size={16} className="text-pink-400" />
          <span className="truncate">
            {(meeting.participants || []).length > 0 
              ? meeting.participants.slice(0, 2).join(", ") +
                (meeting.participants.length > 2
                  ? ` +${meeting.participants.length - 2} more`
                  : "")
              : "No participants"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-white/10">
        <span className="text-xs font-black tracking-widest text-gray-500 group-hover:text-indigo-400">
          VIEW ANALYSIS
        </span>
        <ExternalLink size={18} className="text-gray-600 group-hover:text-white" />
      </div>
    </motion.div>
  );
}
