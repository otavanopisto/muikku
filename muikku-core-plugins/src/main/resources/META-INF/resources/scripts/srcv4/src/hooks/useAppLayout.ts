import { useAtom } from "jotai";
import { sidebarOpenedAtom } from "../atoms/layout";

/**
 * Hook for managing the app layout
 * @returns Object containing sidebar state and control functions
 */
export const useAppLayout = () => {
  const [sidebarOpened, setSidebarOpened] = useAtom(sidebarOpenedAtom);

  /**
   * Open the sidebar
   */
  const openSidebar = () => {
    setSidebarOpened(true);
  };

  /**
   * Close the sidebar
   */
  const closeSidebar = () => {
    setSidebarOpened(false);
  };

  /**
   * Toggle the sidebar
   */
  const toggleSidebar = () => {
    setSidebarOpened(!sidebarOpened);
  };

  return {
    sidebarOpened,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
};
