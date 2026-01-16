import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import { getActions, updateAction } from "../api/actionsApi";

import Header from "../components/ActionItems/Header";
import FiltersBar from "../components/ActionItems/FiltersBar";
import ActionCard from "../components/ActionItems/ActionCard";
import EditActionCard from "../components/ActionItems/EditActionCard";
import EmptyState from "../components/ActionItems/EmptyState";

export default function ActionItemsDashboard() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editOwner, setEditOwner] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");

  const [filterOwner, setFilterOwner] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  const fetchActions = async () => {
    try {
      const res = await getActions();
      setActions(res.data);
    } catch {
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
      setAlert({ type: "error", message: "Owner & Priority required" });
      return;
    }
    try {
      await updateAction(editingId, {
        owner: editOwner,
        deadline: editDeadline,
        priority: editPriority,
      });
      setAlert({ type: "success", message: "Item updated" });
      setEditingId(null);
      fetchActions();
    } catch {
      setAlert({ type: "error", message: "Update failed" });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAction(id, { status: newStatus });
      fetchActions();
    } catch {
      setAlert({ type: "error", message: "Status update failed" });
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "Medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "Low":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const filteredActions = actions.filter((item) => {
    const ownerMatch =
      !filterOwner || (item.owner || "").toLowerCase().includes(filterOwner.toLowerCase());
    const priorityMatch =
      filterPriority === "All" || item.priority === filterPriority;
    return ownerMatch && priorityMatch;
  });

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0c]">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-gray-100 p-6 md:p-12">
      <Header />
      <FiltersBar
        filterOwner={filterOwner}
        setFilterOwner={setFilterOwner}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />

      {alert && (
        <div className="my-6">
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredActions.map((item, index) =>
            editingId === item._id ? (
              <EditActionCard
                key={item._id}
                editOwner={editOwner}
                editDeadline={editDeadline}
                editPriority={editPriority}
                setEditOwner={setEditOwner}
                setEditDeadline={setEditDeadline}
                setEditPriority={setEditPriority}
                saveEdit={saveEdit}
                cancelEdit={() => setEditingId(null)}
              />
            ) : (
              <ActionCard
                key={item._id}
                item={item}
                index={index}
                startEdit={startEdit}
                getPriorityStyles={getPriorityStyles}
                handleStatusChange={handleStatusChange}
                editingId={editingId}
              />
            )
          )}
        </AnimatePresence>
      </div>

      {filteredActions.length === 0 && <EmptyState />}
    </div>
  );
}
