import { create } from "zustand";

export const useAppStore = create((set) => ({
  meetings: [],
  actions: [],

  setMeetings: (meetings) => set({ meetings }),
  setActions: (actions) => set({ actions }),

  updateAction: (updated) =>
    set((state) => ({
      actions: state.actions.map((a) =>
        a._id === updated._id ? updated : a
      ),
    })),
}));