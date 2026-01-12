import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  Filter, 
  Edit3, 
  Save, 
  X, 
  Search,
  Flag,
  Sparkles
} from "lucide-react";
import { getActions, updateAction } from "../api/actionsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";

export default function ActionItemsDashboard() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editOwner, setEditOwner] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editPriority, setEditPriority] = useState("");

  const [filterOwner, setFilterOwner] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  const fetchActions = async () => {
    try {
      const res = await getActions();
      setActions(res.data);
    } catch (error) {
      setAlert({ type: "error", message: "Failed to load actions" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditOwner(item.owner || "");
    setEditDeadline(item.deadline || "");
    setEditPriority(item.priority || "Medium");
  };

  const saveEdit = async () => {
    if (!editOwner.trim() || !editPriority) {
      setAlert({ type: "error", message: "Owner & Priority are required" });
      return;
    }
    try {
      await updateAction(editingId, {
        owner: editOwner,
        deadline: editDeadline,
        priority: editPriority,
      });
      setAlert({ type: "success", message: "Item updated successfully" });
      setEditingId(null);
      fetchActions();
    } catch (error) {
      setAlert({ type: "error", message: "Update failed" });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAction(id, { status: newStatus });
      fetchActions();
    } catch (error) {
      setAlert({ type: "error", message: "Status update failed" });
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-400 border-red-500/40";
      case "Medium": return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "Low": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const filteredActions = actions.filter((item) => {
    const ownerMatch = !filterOwner.trim() || (item.owner || "").toLowerCase().includes(filterOwner.toLowerCase());
    const priorityMatch = filterPriority === "All" || item.priority === filterPriority;
    return ownerMatch && priorityMatch;
  });

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0c]">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] text-gray-100 selection:bg-indigo-500/30 p-6 md:p-12 overflow-x-hidden">
      
      {/* FORCED OVERFLOW FIX */}
      <style dangerouslySetInnerHTML={{ __html: `
        body, html { overflow-x: hidden !important; }
      `}} />

      {/* --- BRIGHTER BACKGROUND ANIMATIONS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/50 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-700/40 blur-[120px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-blue-600/10 blur-[140px] opacity-60" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-4">
               <Sparkles size={14} /> Task Management
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
              Action <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-300">Items</span>
            </h1>
            <p className="text-gray-400 font-medium">Manage and track your meeting outcomes.</p>
          </motion.div>

          {/* FILTERS BAR */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
          >
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Filter by owner..."
                className="bg-transparent pl-10 pr-4 py-2 outline-none text-sm w-48 md:w-64 text-white placeholder-white/30"
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
              />
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
            <div className="flex items-center gap-2 px-3">
              <Filter size={16} className="text-indigo-400" />
              <select
                className="bg-transparent outline-none text-sm cursor-pointer font-bold text-gray-300 hover:text-white transition-colors"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option className="bg-[#1a1a1c]" value="All">All Priorities</option>
                <option className="bg-[#1a1a1c]" value="High">High</option>
                <option className="bg-[#1a1a1c]" value="Medium">Medium</option>
                <option className="bg-[#1a1a1c]" value="Low">Low</option>
              </select>
            </div>
          </motion.div>
        </div>

        {alert && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Alert type={alert.type} message={alert.message} />
          </motion.div>
        )}

        {/* TASKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredActions.map((item, index) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group relative flex flex-col backdrop-blur-2xl bg-white/[0.05] border border-white/[0.12] rounded-3xl p-6 transition-all hover:bg-white/[0.08] hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${
                  editingId === item._id ? "ring-2 ring-indigo-500/50" : ""
                }`}
              >
                {editingId === item._id ? (
                  /* --- EDIT MODE --- */
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase mb-2">
                      <Edit3 size={14} /> Editing Task
                    </div>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editOwner}
                      onChange={(e) => setEditOwner(e.target.value)}
                      placeholder="Owner Name"
                    />
                    <input
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                    />
                    <select
                      className="w-full bg-[#1a1a1c] border border-white/10 rounded-xl p-3 text-sm outline-none"
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                    <div className="flex gap-2 pt-2">
                      <button onClick={saveEdit} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg">
                        <Save size={16} /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-5 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-bold">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- DISPLAY MODE --- */
                  <>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${getPriorityStyles(item.priority)}`}>
                          {item.priority}
                        </span>
                        <button 
                          onClick={() => startEdit(item)}
                          className="opacity-0 group-hover:opacity-100 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                        >
                          <Edit3 size={16} className="text-gray-300" />
                        </button>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white leading-tight mb-6 group-hover:text-indigo-200 transition-colors">
                        {item.task}
                      </h3>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5">
                          <User size={16} className="text-indigo-400" />
                          <span>{item.owner || "Unassigned"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5">
                          <Calendar size={16} className="text-purple-400" />
                          <span>{item.deadline || "No deadline"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        {item.status === "Done" ? (
                          <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30">
                            <CheckCircle2 size={18} className="text-emerald-400" />
                          </div>
                        ) : (
                          <div className="bg-amber-500/20 p-1.5 rounded-lg border border-amber-500/30">
                            <Clock size={18} className="text-amber-400" />
                          </div>
                        )}
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className="bg-transparent text-sm font-black tracking-wide focus:outline-none cursor-pointer text-gray-200 hover:text-indigo-300 transition-colors"
                        >
                          <option className="bg-[#1a1a1c]" value="Pending">Pending</option>
                          <option className="bg-[#1a1a1c]" value="In Progress">In Progress</option>
                          <option className="bg-[#1a1a1c]" value="Done">Done</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredActions.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]"
          >
            <Flag size={54} className="text-gray-700 mb-6" />
            <p className="text-gray-400 text-xl font-bold italic">No matching action items found.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


