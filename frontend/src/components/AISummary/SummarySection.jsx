import { ClipboardList } from "lucide-react";

export default function SummarySection({ summary }) {
  return (
    <div className="backdrop-blur-3xl bg-white/[0.04] border border-white/[0.1] rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 text-indigo-300">
        <ClipboardList size={24} />
        <h3 className="text-xl font-bold uppercase tracking-wider">Executive Summary</h3>
      </div>

      <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg opacity-90">
        {summary}
      </p>
    </div>
  );
}
