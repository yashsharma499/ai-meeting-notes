import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Header from "../components/MeetingUpload/Header";
import AlertBox from "../components/MeetingUpload/AlertBox";
import LeftPanel from "../components/MeetingUpload/LeftPanel";
import NotesSection from "../components/MeetingUpload/NotesSection";
import LoadingSpinner from "../components/LoadingSpinner";

import { createMeeting, processMeeting } from "../api/meetingsApi";

export default function MeetingUpload() {
  const [notes, setNotes] = useState("");
  const [meetingType, setMeetingType] = useState("Standup");
  const [participants, setParticipants] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  // same file upload logic
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "text/plain") {
      setAlert({ type: "error", message: "Only .txt files allowed." });
      return;
    }

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => setNotes(event.target.result);
    reader.readAsText(file);
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setNotes("");
  };

  const handleSubmit = async () => {
  setAlert(null);

  if (!notes.trim()) {
    setAlert({ type: "error", message: "Please enter meeting notes." });
    return;
  }

  try {
    setLoading(true);

    const title = meetingType + " Meeting";

    const meeting = await createMeeting({
      title,                 // ✅ REQUIRED
      notes: notes.trim(),   // ✅ REQUIRED
    });

    await processMeeting({
      meeting_id: meeting.data.meeting_id,
      notes: notes.trim(),
    });

   navigate(`/summary/${meeting.data.meeting_id}`);

  } catch (err) {
    console.error(err);
    setAlert({ type: "error", message: "Failed to process insights. Try again." });
  } finally {
    setLoading(false);
  }
};

      
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] overflow-hidden">

      {/* Background (unchanged) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* gradient blobs... UNCHANGED */}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-6xl px-6 py-12"
      >

        <Header />

        <AnimatePresence>{alert && <AlertBox alert={alert} />}</AnimatePresence>

        <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            <LeftPanel
              meetingType={meetingType}
              setMeetingType={setMeetingType}
              participants={participants}
              setParticipants={setParticipants}
              uploadedFile={uploadedFile}
              handleFileUpload={handleFileUpload}
              removeUploadedFile={removeUploadedFile}
            />

            <NotesSection
              notes={notes}
              setNotes={setNotes}
              handleSubmit={handleSubmit}
              loading={loading}
            />

          </div>
        </div>

      </motion.div>

      {/* Full screen loader */}
      <AnimatePresence>
        {loading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-[100]">
            <LoadingSpinner />
            <p className="mt-6 text-indigo-300 tracking-widest uppercase text-sm animate-pulse">
              Analyzing meeting notes...
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
