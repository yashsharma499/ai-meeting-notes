import { FileText, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function NotesSection({
  notes,
  setNotes,
  handleSubmit,
  loading
}) {
  return (
    <div className="lg:col-span-8 flex flex-col">
      <label className="text-sm text-gray-300 font-semibold flex items-center gap-2 mb-2">
        <FileText size={18} /> Notes / Transcript
      </label>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your meeting transcript..."
        className="w-full min-h-[300px] bg-white/10 border border-white/20 rounded-2xl p-6 text-white"
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-8 w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
          loading
            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            Generate Summary <ArrowRight size={20} />
          </>
        )}
      </motion.button>
    </div>
  );
}
