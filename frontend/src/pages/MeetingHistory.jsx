import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMeetings } from "../api/meetingsApi";

import Header from "../components/MeetingHistory/Header";
import Filters from "../components/MeetingHistory/Filters";
import MeetingCard from "../components/MeetingHistory/MeetingCard";
import EmptyState from "../components/MeetingHistory/EmptyState";
import MeetingModal from "../components/MeetingModal";
import Alert from "../components/Alert";

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterParticipant, setFilterParticipant] = useState("");

  const [alert, setAlert] = useState(null);

  const fetchMeetings = async () => {
    try {
      const res = await getMeetings();
      const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setMeetings(sorted);
    } catch (err) {
      console.error("Error loading meetings:", err);
      setAlert({ type: "error", message: "Failed to load meetings. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return "No date";
    const d = isoString.slice(0, 10);
    const [year, month, day] = d.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
  };

  const filteredMeetings = meetings.filter((m) => {
    const s = search.toLowerCase();
    const p = filterParticipant.toLowerCase();

    const matchSearch =
      m.notes?.toLowerCase().includes(s) ||
      m.meeting_type?.toLowerCase().includes(s) ||
      (m.participants || []).join(", ").toLowerCase().includes(s);

    const matchType = filterType === "All" || m.meeting_type === filterType;

    const matchParticipant =
      p === "" || (m.participants || []).some((x) => x.toLowerCase().includes(p));

    return matchSearch && matchType && matchParticipant;
  });

  if (loading)
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0c]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"
        />
        <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">
          Syncing archives...
        </p>
      </div>
    );

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] text-gray-100 p-6 md:p-12">

      {/* ALERT */}
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

      {/* HEADER */}
      <Header />

      {/* FILTERS */}
      <Filters
        search={search}
        setSearch={setSearch}
        filterType={filterType}
        setFilterType={setFilterType}
        filterParticipant={filterParticipant}
        setFilterParticipant={setFilterParticipant}
      />

      {/* MEETING LIST */}
      <AnimatePresence mode="popLayout">
        {filteredMeetings.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div 
            layout
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
          >
            {filteredMeetings.map((m, i) => (
              <MeetingCard 
                key={m._id} 
                meeting={m} 
                index={i}
                formatDate={formatDate}
                onSelect={setSelectedMeeting}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MEETING MODAL */}
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
