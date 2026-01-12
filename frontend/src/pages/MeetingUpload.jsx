
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  FileText, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  Upload,
  X
} from "lucide-react";

import { createMeeting, processMeeting } from "../api/meetingsApi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MeetingUpload() {
  const [notes, setNotes] = useState("");
  const [meetingType, setMeetingType] = useState("Standup");
  const [participants, setParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const navigate = useNavigate();

  // File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      setAlert({ type: "error", message: "Only .txt files are allowed." });
      return;
    }

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setNotes(event.target.result);
    };
    reader.readAsText(file);
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setNotes("");
  };

  // Submit to AI
  const handleSubmit = async () => {
    setAlert(null);

    if (!notes.trim()) {
      setAlert({ type: "error", message: "Please enter meeting notes." });
      return;
    }

    setLoading(true);

    try {
      const meeting = await createMeeting({
        notes,
        meeting_type: meetingType,
        participants: participants
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
      });

      const processed = await processMeeting({
        meeting_id: meeting.data.meeting_id,
        notes,
      });

      navigate("/summary", { state: { aiResult: processed.data } });
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Failed to process insights. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] overflow-hidden">

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[15%] -left-[15%] w-[60%] h-[60%] rounded-full bg-indigo-500/40 blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[15%] -right-[15%] w-[60%] h-[60%] rounded-full bg-purple-600/30 blur-[120px]"
        />
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-6xl px-6 py-12"
      >

        {/* Header */}
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

        {/* Alert */}
        <AnimatePresence>
          {alert && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Card */}
        <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left Section */}
            <div className="lg:col-span-4 space-y-8">

              {/* Meeting Type */}
              <div>
                <label className="text-sm text-gray-300 font-semibold flex items-center gap-2 mb-2">
                  <Layers size={18} /> Meeting Type
                </label>
                <select
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white"
                >
                  <option className="bg-[#111]" value="Standup">Daily Standup</option>
                  <option className="bg-[#111]" value="Planning">Sprint Planning</option>
                  <option className="bg-[#111]" value="Review">Project Review</option>
                  <option className="bg-[#111]" value="Retro">Retrospective</option>
                </select>
              </div>

              {/* Participants */}
              <div>
                <label className="text-sm text-gray-300 font-semibold flex items-center gap-2 mb-2">
                  <Users size={18} /> Participants
                </label>
                <input
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="John, Sarah, Ajay..."
                  className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-sm text-gray-300 font-semibold flex items-center gap-2 mb-2">
                  <Upload size={18} /> Upload Notes (.txt)
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-gray-200 cursor-pointer"
                  />

                  {uploadedFile && (
                    <button 
                      onClick={removeUploadedFile}
                      className="p-2 bg-red-600/30 border border-red-500/40 rounded-lg hover:bg-red-600/40 text-red-300"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {uploadedFile && (
                  <p className="text-xs text-gray-400 mt-1">Attached: {uploadedFile.name}</p>
                )}
              </div>

            </div>

            {/* Right Section */}
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

          </div>
        </div>
      </motion.div>

      {/* Full Screen Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-[100]"
          >
            <LoadingSpinner />
            <motion.p 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-6 text-indigo-300 tracking-widest uppercase text-sm"
            >
              Analyzing meeting notes...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
