import * as React from "react";
import type { Route } from "@/routes";

export interface RouterContextType {
  route: Route;
  navigate: (r: Route) => void;
}

export const RouterCtx = React.createContext<RouterContextType | null>(null);
