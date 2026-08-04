import * as React from "react";
import type { RouteName } from "@/shared/constants/routes";

export interface RouterContextType {
  route: RouteName;
  navigate: (r: RouteName) => void;
}

export const RouterCtx = React.createContext<RouterContextType | null>(null);
