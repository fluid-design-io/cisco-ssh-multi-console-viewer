// set a useCollapsed hook to use the collapsed state using zustand

import { create } from 'zustand';

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

type QbvCollapsedState = {
  qbvCollapsedSettings: boolean;
  toggleQbvCollapsedSettings: () => void;
  setQbvCollapsedSettings: (collapsed: boolean) => void;
  qbvCollapsedDevices: boolean;
  toggleQbvCollapsedDevices: () => void;
  setQbvCollapsedDevices: (collapsed: boolean) => void;
  qbvCollapsedCommands: boolean;
  toggleQbvCollapsedCommands: () => void;
  setQbvCollapsedCommands: (collapsed: boolean) => void;
};

export const useQbvCollapsed = create<QbvCollapsedState>((set) => ({
  qbvCollapsedSettings: false,
  toggleQbvCollapsedSettings: () =>
    set((state: { qbvCollapsedSettings: boolean }) => ({
      qbvCollapsedSettings: !state.qbvCollapsedSettings,
    })),
  setQbvCollapsedSettings: (collapsed: boolean) => set(() => ({ qbvCollapsedSettings: collapsed })),
  qbvCollapsedDevices: false,
  toggleQbvCollapsedDevices: () =>
    set((state: { qbvCollapsedDevices: boolean }) => ({
      qbvCollapsedDevices: !state.qbvCollapsedDevices,
    })),
  setQbvCollapsedDevices: (collapsed: boolean) => set(() => ({ qbvCollapsedDevices: collapsed })),
  qbvCollapsedCommands: false,
  toggleQbvCollapsedCommands: () =>
    set((state: { qbvCollapsedCommands: boolean }) => ({
      qbvCollapsedCommands: !state.qbvCollapsedCommands,
    })),
  setQbvCollapsedCommands: (collapsed: boolean) => set(() => ({ qbvCollapsedCommands: collapsed })),
}));
