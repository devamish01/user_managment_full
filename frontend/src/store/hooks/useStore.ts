import * as React from "react";
import { StoreCtx } from "../context/StoreContext";

export const useStore = () => {
  const ctx = React.useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
};
export default useStore;
