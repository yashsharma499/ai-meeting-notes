import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-widest mb-4">
        <Sparkles size={14} /> AI Powered
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3">
        Capture <span className="text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text">Insights</span>
      </h1>
      <p className="text-gray-300 max-w-2xl mx-auto">
        Upload or paste meeting notes to auto-generate AI summaries & action items.
      </p>
    </div>
  );
}
