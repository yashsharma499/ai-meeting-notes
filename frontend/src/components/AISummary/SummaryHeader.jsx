import { Sparkles, ArrowLeft, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SummaryHeader() {
  const navigate = useNavigate();

  return (
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
  );
}
