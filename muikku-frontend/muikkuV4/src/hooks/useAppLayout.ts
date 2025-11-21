import { useAtom } from "jotai";
import { secondaryNavOpenedAtom, primaryNavOpenedAtom } from "../atoms/layout";

/**
 * Hook for managing the app layout
 * @returns Object containing sidebar state and control functions
 */
export const useAppLayout = () => {
  const [primaryNavOpened, setPrimaryNavOpened] = useAtom(primaryNavOpenedAtom);
  const [secondaryNavOpened, setSecondaryNavOpened] = useAtom(
    secondaryNavOpenedAtom
  );

  /**
   * Open the sidebar
   */
  const openPrimaryNav = () => {
    setPrimaryNavOpened(true);
  };

  /**
   * Close the sidebar
   */
  const closePrimaryNav = () => {
    setPrimaryNavOpened(false);
  };

  /**
   * Toggle the sidebar
   */
  const togglePrimaryNav = () => {
    setPrimaryNavOpened(!primaryNavOpened);
  };

  /**
   * Open the secondary sidebar
   */
  const openSecondaryNav = () => {
    setSecondaryNavOpened(true);
  };

  /**
   * Close the secondary sidebar
   */
  const closeSecondaryNav = () => {
    setSecondaryNavOpened(false);
  };

  /**
   * Toggle the secondary sidebar
   */
  const toggleSecondaryNav = () => {
    setSecondaryNavOpened(!secondaryNavOpened);
  };

  return {
    primaryNavOpened,
    openPrimaryNav,
    closePrimaryNav,
    togglePrimaryNav,
    secondaryNavOpened,
    openSecondaryNav,
    closeSecondaryNav,
    toggleSecondaryNav,
  };
};
