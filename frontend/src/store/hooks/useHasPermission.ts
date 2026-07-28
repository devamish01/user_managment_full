import { useStore } from "./useStore";

export const useHasPermission = () => useStore().hasPermission;
export default useHasPermission;
