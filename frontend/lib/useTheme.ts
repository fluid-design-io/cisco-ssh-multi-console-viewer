// create a custom hook to use the theme using zustand

import { Theme } from "@mui/material";
import create from "zustand";

import { darkTheme, lightTheme } from "./themes";

type ThemeState = {
  theme: Theme;
  toggleTheme: () => void;
};

export const useTheme = create<ThemeState>((set) => ({
  theme: darkTheme,
  toggleTheme: () => set((state: { theme: Theme }) => ({ theme: state.theme === lightTheme ? darkTheme : lightTheme })),
}));
