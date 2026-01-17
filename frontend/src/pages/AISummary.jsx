import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import { getMeetings } from "../api/meetingsApi";

import SummaryHeader from "../components/AISummary/SummaryHeader";
import SummarySection from "../components/AISummary/SummarySection";
import DecisionsSection from "../components/AISummary/DecisionsSection";
import ActionItemsSection from "../components/AISummary/ActionItemsSection";
import { useAppStore } from "../store/useAppStore";

export default function AISummary() {
  const location = useLocation();
  const meetingId = location.state?.meeting_id;
  

  const meetings = useAppStore((s) => s.meetings);
  const setMeetings = useAppStore((s) => s.setMeetings);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeeting() {
      try {
        
        if (meetings.length > 0) {
          const meeting = meetings.find((m) => m._id === meetingId);
          setAiResult(meeting || null);
        } 
        
        else {
          const res = await getMeetings();
          setMeetings(res.data);
          const meeting = res.data.find((m) => m._id === meetingId);
          setAiResult(meeting || null);
        }
      } catch (err) {
        console.error("Error loading meeting:", err);
      } finally {
        setLoading(false);
      }
    }

    meetingId ? loadMeeting() : setLoading(false);
  }, [meetingId, meetings, setMeetings]);

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Low": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-gray-300">
        Loading AI summary...
      </div>
    );

  if (!aiResult)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-6">
        <div className="backdrop-blur-xl bg-white/5 p-10 rounded-3xl text-center max-w-md border border-white/10">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg mb-6">
            No AI summary available. Please upload a meeting first.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#0a0a0c]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
        <SummaryHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <SummarySection summary={aiResult.summary} />
            <DecisionsSection decisions={aiResult.key_decisions} />
          </div>

          <div className="lg:col-span-5">
            <ActionItemsSection items={aiResult.action_items} getPriorityStyles={getPriorityStyles} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
