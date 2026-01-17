import { create } from "zustand";

export const useAppStore = create((set) => ({
  // ---- STATE ----
  meetings: [],
  actions: [],

  // ---- SETTERS ----
  setMeetings: (meetings) => set({ meetings }),
  setActions: (actions) => set({ actions }),

  // ---- UPDATE SINGLE ACTION (SAFE) ----
  updateAction: (updatedAction) =>
    set((state) => ({
      actions: state.actions.map((action) =>
        action._id === updatedAction._id ? updatedAction : action
      ),
    })),

  // ---- RESET STORE (OPTIONAL, FOR LOGOUT) ----
  resetStore: () =>
    set({
      meetings: [],
      actions: [],
    }),
}));
