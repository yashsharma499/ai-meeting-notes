



import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Calendar, 
  Users, 
  History, 
  Filter, 
  ExternalLink, 
  LayoutGrid,
  ClipboardList,
  Sparkles
} from "lucide-react";

import { getMeetings } from "../api/meetingsApi";
import MeetingModal from "../components/MeetingModal";
import Alert from "../components/Alert"; // <-- added

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Search + filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterParticipant, setFilterParticipant] = useState("");

  const [alert, setAlert] = useState(null); // <-- added

  // const fetchMeetings = async () => {
  //   try {
  //     const res = await getMeetings();
  //     setMeetings(res.data);
  //   } catch (err) {
  //     console.error("Error loading meetings:", err);

  //     // Show alert instead of silent error
  //     setAlert({
  //       type: "error",
  //       message: "Failed to load meetings. Please try again."
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchMeetings = async () => {
  try {
    const res = await getMeetings();

    // Sort by date DESC (newest first)
    const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setMeetings(sorted);

  } catch (err) {
    console.error("Error loading meetings:", err);
    setAlert({
      type: "error",
      message: "Failed to load meetings. Please try again."
    });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMeetings();
  }, []);

  const formatDate = (isoString) => {
  if (!isoString) return "No date";

  const d = isoString.slice(0, 10); // YYYY-MM-DD
  const [year, month, day] = d.split("-");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return `${day} ${months[parseInt(month) - 1]} ${year}`;
};

  const filteredMeetings = meetings.filter((m) => {
    const searchStr = search.toLowerCase();
    const participantStr = filterParticipant.toLowerCase();

    const matchesSearch =
      m.notes?.toLowerCase().includes(searchStr) ||
      m.meeting_type?.toLowerCase().includes(searchStr) ||
      (m.participants || []).join(", ").toLowerCase().includes(searchStr);

    const matchesType = filterType === "All" || m.meeting_type === filterType;

    const matchesParticipant =
      participantStr === "" ||
      (m.participants || []).some((p) =>
        p.toLowerCase().includes(participantStr)
      );

    return matchesSearch && matchesType && matchesParticipant;
  });

  // Loader section remains same
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0c]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"
        />
        <p className="text-gray-400 font-medium animate-pulse tracking-widest uppercase text-xs">
          Syncing archives...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] text-gray-100 selection:bg-indigo-500/30 p-6 md:p-12 overflow-x-hidden">

      {/* ALERT PANEL */}
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto mb-6"
          >
            <Alert type={alert.type} message={alert.message} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Animations — unchanged */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/50 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-700/40 blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER — unchanged */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-indigo-400 font-bold tracking-[0.2em] uppercase text-xs mb-3"
          >
            <History size={16} /> Central Archive
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-8">
            Meeting <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-300">Vault</span>
          </h1>

          {/* Filters — unchanged */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
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

            {/* Filter Type */}
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

            {/* Filter by participant */}
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
        </header>

        {/* LISTING GRID — unchanged except alert used if no meetings */}
        <AnimatePresence mode="popLayout">
          {filteredMeetings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]"
            >
              <Alert type="info" message="No matching records found. Try adjusting filters." />
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
            >
              {filteredMeetings.map((m, index) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative backdrop-blur-2xl bg-white/[0.05] border border-white/[0.12] rounded-[2rem] p-7 hover:bg-white/[0.08] hover:border-white/20 cursor-pointer"
                  onClick={() => setSelectedMeeting(m)}
                >
                  {/* Card UI stays unchanged */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full" />

                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-300 border border-indigo-500/30">
                      <LayoutGrid size={20} />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      {m.meeting_type}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-4">
                    {m.meeting_type} Session
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5">
                      <Calendar size={16} className="text-purple-400" />
                      {formatDate(m.created_at)}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5">
                      <Users size={16} className="text-pink-400" />
                      <span className="truncate">
                        {(m.participants || []).length > 0 
                          ? (m.participants || []).slice(0, 2).join(", ") + ((m.participants || []).length > 2 ? ` +${(m.participants || []).length - 2} more` : "")
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
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL POPUP */}
      <AnimatePresence>
        {selectedMeeting && (
          <MeetingModal
            meeting={selectedMeeting}
            onClose={() => setSelectedMeeting(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
