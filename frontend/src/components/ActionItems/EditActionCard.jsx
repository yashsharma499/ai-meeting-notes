import { Edit3, Save, X } from "lucide-react";

export default function EditActionCard({
  editOwner,
  editDeadline,
  editPriority,
  setEditOwner,
  setEditDeadline,
  setEditPriority,
  saveEdit,
  cancelEdit,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase mb-2">
        <Edit3 size={14} /> Editing Task
      </div>

      <input
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
        value={editOwner}
        onChange={(e) => setEditOwner(e.target.value)}
        placeholder="Owner Name"
      />

      {/^\d{4}-\d{2}-\d{2}$/.test(editDeadline) ? (
        <input
          type="date"
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
          value={editDeadline}
          onChange={(e) => setEditDeadline(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
          value={editDeadline}
          placeholder="Enter deadline (e.g., Friday)"
          onChange={(e) => setEditDeadline(e.target.value)}
        />
      )}

      <select
        className="w-full bg-[#1a1a1c] border border-white/10 rounded-xl p-3 text-sm"
        value={editPriority}
        onChange={(e) => setEditPriority(e.target.value)}
      >
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>

      <div className="flex gap-2 pt-2">
        <button
          onClick={saveEdit}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2"
        >
          <Save size={16} /> Save
        </button>
        <button
          onClick={cancelEdit}
          className="px-5 bg-white/10 py-3 rounded-xl text-sm font-bold"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
