import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  LayoutDashboard, 
  CheckCircle2, 
  Lightbulb, 
  ClipboardList,
  AlertCircle
} from "lucide-react";

export default function AISummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { aiResult } = location.state || {};

  if (!aiResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-3xl text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg mb-6">
            No AI summary available. Please upload a meeting first.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-500/20"
          >
            Go to Upload Page
          </button>
        </div>
      </div>
    );
  }

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Low": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] selection:bg-indigo-500/30 overflow-x-hidden p-4 md:p-8">
      
      {/* --- BACKGROUND ANIMATIONS (Synced with Upload Page) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/40 blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/30 blur-[100px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl mx-auto"
      >
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles size={14} /> AI Analysis Complete
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Meeting <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">Intelligence</span>
            </h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition font-bold"
            >
              <ArrowLeft size={18} /> Upload Again
            </button>

            <button
              onClick={() => navigate("/actions")}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition font-bold shadow-lg shadow-indigo-600/20"
            >
              <LayoutDashboard size={18} /> Action Dashboard
            </button>
          </div>
        </div>

        {/* MAIN SUMMARY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: SUMMARY & DECISIONS */}
          <div className="lg:col-span-7 space-y-8">
            {/* SUMMARY CARD */}
            <div className="backdrop-blur-3xl bg-white/[0.04] border border-white/[0.1] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 text-indigo-300">
                <ClipboardList size={24} />
                <h3 className="text-xl font-bold uppercase tracking-wider">Executive Summary</h3>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg opacity-90">
                {aiResult.summary}
              </p>
            </div>

            {/* KEY DECISIONS CARD */}
            <div className="backdrop-blur-3xl bg-white/[0.04] border border-white/[0.1] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 text-amber-300">
                <Lightbulb size={24} />
                <h3 className="text-xl font-bold uppercase tracking-wider">Key Decisions</h3>
              </div>
              <div className="space-y-4">
                {aiResult.key_decisions?.length > 0 ? (
                  aiResult.key_decisions.map((decision, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start"
                    >
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                      <p className="text-gray-300">
                        {decision.description || decision.decision || decision}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No key decisions found</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION ITEMS */}
          <div className="lg:col-span-5">
            <div className="backdrop-blur-3xl bg-white/[0.04] border border-white/[0.1] rounded-3xl p-8 shadow-2xl h-full">
              <div className="flex items-center gap-3 mb-8 text-pink-300">
                <CheckCircle2 size={24} />
                <h3 className="text-xl font-bold uppercase tracking-wider">Action Items</h3>
              </div>

              <div className="space-y-6">
                {aiResult.action_items?.length > 0 ? (
                  aiResult.action_items.map((item, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="relative group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all"
                    >
                      <h4 className="text-white font-bold text-lg mb-3">
                        {item.task}
                      </h4>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Owner:</span>
                          <span className="text-gray-300 font-medium">{item.owner || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Deadline:</span>
                          <span className="text-gray-300 font-medium">{item.deadline || "Not specified"}</span>
                        </div>
                      </div>

                      <div className={`inline-block px-3 py-1 text-xs rounded-full font-bold mt-4 border ${getPriorityStyles(item.priority)}`}>
                        {item.priority || "Not set"}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 italic">No action items found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
