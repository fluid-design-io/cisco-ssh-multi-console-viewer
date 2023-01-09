// set a useCollapsed hook to use the collapsed state using zustand

import create from "zustand";

type CollapsedState = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
};

export const useCollapsed = create<CollapsedState>((set) => ({
  collapsed: false,
  toggleCollapsed: () => set((state: { collapsed: boolean }) => ({ collapsed: !state.collapsed })),
  setCollapsed: (collapsed: boolean) => set(() => ({ collapsed })),
}));
