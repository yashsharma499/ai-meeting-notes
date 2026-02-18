import { Layers, Users } from "lucide-react";
import FileUploadSection from "./FileUploadSection";

export default function LeftPanel({
  meetingType,
  setMeetingType,
  participants,
  setParticipants,
  uploadedFile,
  handleFileUpload,
  removeUploadedFile
}) {
  return (
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
      <FileUploadSection
        uploadedFile={uploadedFile}
        handleFileUpload={handleFileUpload}
        removeUploadedFile={removeUploadedFile}
      />

    </div>
  );
}
