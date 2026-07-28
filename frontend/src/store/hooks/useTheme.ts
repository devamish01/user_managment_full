import * as React from "react";
import { ThemeCtx } from "../context/ThemeContext";

export const useTheme = () => {
  const ctx = React.useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};
export default useTheme;
