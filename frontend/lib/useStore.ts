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

/**
 * ['Configure AP', 'WiFi', 'Ethernet', 'Sniffer', 'TFTP', 'Finish'];
 * - step: the step name
 * - isCompleted: boolean to check if the step is completed
 * - isCurrent: boolean to check if the step is the current step
 */
export const useQbvSteps = create<QbvStepsState>((set) => ({
  qbvSteps: [
    { name: 'AP', isCompleted: false, isCurrent: true },
    { name: 'WiFi', isCompleted: false, isCurrent: false },
    { name: 'Ethernet', isCompleted: false, isCurrent: false },
    { name: 'Sniffer', isCompleted: false, isCurrent: false },
    { name: 'TFTP', isCompleted: false, isCurrent: false, isDisabled: true },
    { name: 'Setup', isCompleted: false, isCurrent: false },
  ],
  setQbvSteps: (qbvSteps: any) => set(() => ({ qbvSteps })),
  handleNext: () => {
    set((state: { qbvSteps: QbvSteps[] }) => {
      const { qbvSteps } = state;
      const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
      qbvSteps[currentStep].isCurrent = false;
      qbvSteps[currentStep].isCompleted = true;
      qbvSteps[currentStep + 1].isCurrent = true;
      return { qbvSteps };
    });
  },
  handlePrevious: () => {
    set((state: { qbvSteps: QbvSteps[] }) => {
      const { qbvSteps } = state;
      const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
      qbvSteps[currentStep].isCurrent = false;
      qbvSteps[currentStep - 1].isCurrent = true;
      return { qbvSteps };
    });
  },
  handleStep: (index: number) => {
    set((state: { qbvSteps: QbvSteps[] }) => {
      const { qbvSteps } = state;
      const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
      qbvSteps[currentStep].isCurrent = false;
      qbvSteps[index].isCurrent = true;
      return { qbvSteps };
    });
  },
  isStarted: false,
  handleStart: () => {
    // set isStarted to true
    set((state: { isStarted: boolean }) => ({ isStarted: true }));
  },
  handleStop: () => {
    // set isStarted to false
    set((state: { isStarted: boolean }) => ({ isStarted: false }));
  },
  handleStartQbvTest: () => {
    set((state: { qbvSteps: QbvSteps[] }) => ({ isStarted: true }));
  },
  handleStopQbvTest: () => {
    set((state: { qbvSteps: QbvSteps[] }) => ({ isStarted: false }));
  },
  handleStartApCommands: () => {
    set((state: { isStarted: boolean }) => ({ isStarted: true }));
  },
  handleStopApCommands: () => {
    set((state: { isStarted: boolean }) => ({ isStarted: false }));
  },
}));

export type QbvStepsState = {
  qbvSteps: QbvSteps[];
  isStarted: boolean;
  setQbvSteps: (qbvSteps: QbvSteps[]) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleStep: (index: number) => void;
  handleStart: () => void;
  handleStop: () => void;
  handleStartApCommands: () => void;
  handleStopApCommands: () => void;
  handleStartQbvTest: () => void;
  handleStopQbvTest: () => void;
};

export type QbvSteps = {
  name: string;
  isCompleted: boolean;
  isCurrent: boolean;
  [key: string]: any;
};
