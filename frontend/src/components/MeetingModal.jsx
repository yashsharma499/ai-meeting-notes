
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  X, 
  Users, 
  FileText, 
  CheckSquare, 
  Lightbulb, 
  ArrowRight,
  Calendar,
  User 
} from "lucide-react";

export default function MeetingModal({ meeting, onClose }) {
  const navigate = useNavigate();

  const handleViewFullSummary = () => {
    navigate("/summary", {
      state: {
        aiResult: {
          summary: typeof meeting.summary === "string" && meeting.summary.trim().length > 0 
            ? meeting.summary 
            : "No summary available",
          key_decisions: Array.isArray(meeting.key_decisions) ? meeting.key_decisions : [],
          action_items: Array.isArray(meeting.action_items) ? meeting.action_items : [],
        },
      },
    });
  };

  const hasSummary =
    typeof meeting.summary === "string" &&
    meeting.summary.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0a0a0c]/80 backdrop-blur-md flex justify-center items-start z-[110] p-4 pt-[80px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl backdrop-blur-3xl bg-white/[0.06] border border-white/[0.12] rounded-[2.5rem] shadow-2xl p-8 md:p-10 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all z-20"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-3">
            <Calendar size={12} /> {meeting.meeting_type || "Meeting"} Session
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
            Meeting <span className="text-indigo-400">Details</span>
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400 font-medium">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <Users size={16} className="text-purple-400" />
              <span>
                {(meeting.participants || []).length > 0 
                  ? meeting.participants.join(", ")
                  : "Internal Team"}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-8 relative z-10">

          {hasSummary ? (
            <>
              {/* SUMMARY SECTION */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-black text-gray-200 uppercase tracking-widest mb-4">
                  <FileText size={18} className="text-blue-400" /> AI Executive Summary
                </h3>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line font-medium opacity-90">
                    {meeting.summary}
                  </p>
                </div>
              </section>

              {/* KEY DECISIONS */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-black text-gray-200 uppercase tracking-widest mb-4">
                  <Lightbulb size={18} className="text-amber-400" /> Key Decisions
                </h3>

                {Array.isArray(meeting.key_decisions) && meeting.key_decisions.length > 0 ? (
                  <div className="grid gap-3">
                    {meeting.key_decisions.map((d, i) => (
                      <div
                        key={i}
                        className="flex gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl"
                      >
                        <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                        <p className="text-gray-300 text-sm font-medium leading-relaxed">
                          {d.description || d.decision || d}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic px-4">No decisions recorded.</p>
                )}
              </section>

              {/* ACTION ITEMS */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-black text-gray-200 uppercase tracking-widest mb-4">
                  <CheckSquare size={18} className="text-emerald-400" /> Action Items
                </h3>

                {Array.isArray(meeting.action_items) && meeting.action_items.length > 0 ? (
                  <div className="grid gap-3">
                    {meeting.action_items.map((item, i) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <span className="text-white font-bold text-base">{item.task}</span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 rounded-lg text-xs font-bold text-indigo-300 border border-indigo-500/20">
                            <User size={12} /> {item.owner || "Unassigned"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic px-4">No tasks extracted.</p>
                )}
              </section>
            </>
          ) : (
            <div className="text-center py-10 opacity-60 text-gray-400">
              <p className="text-lg font-semibold mb-2">No AI Summary Available</p>
              <p className="text-sm">This meeting did not generate valid AI output.</p>
            </div>
          )}
        </div>

        {/* FOOTER BUTTON */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <button
            onClick={handleViewFullSummary}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white text-lg font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] transition-all"
          >
            Open Interactive Summary <ArrowRight size={20} />
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
}
