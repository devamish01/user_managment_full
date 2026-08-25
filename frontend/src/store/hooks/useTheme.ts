import * as React from "react";
import { ThemeCtx } from "../context/ThemeContext";
import type { ThemeContextType } from "../context/ThemeContext";

export const useTheme = () => {
  const ctx = React.useContext(ThemeCtx) as ThemeContextType | null;
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};
export default useTheme;
