import { useAtom } from "jotai";
import {
  secondaryNavOpenedAtom,
  primaryNavOpenedAtom,
  selectedNavItemAtom,
} from "../atoms/layout";
import type { NavigationItem } from "../layouts/helpers/navigation";

/**
 * Hook for managing the app layout
 * @returns Object containing sidebar state and control functions
 */
export const useAppLayout = () => {
  const [primaryNavOpened, setPrimaryNavOpened] = useAtom(primaryNavOpenedAtom);
  const [secondaryNavOpened, setSecondaryNavOpened] = useAtom(
    secondaryNavOpenedAtom
  );
  const [selectedNavItem, setSelectedNavItem] = useAtom(selectedNavItemAtom);

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

  const selectNavItem = (item: NavigationItem) => {
    setSelectedNavItem(item);

    if ("contents" in item && item.contents && item.contents.length > 0) {
      closePrimaryNav();
      openSecondaryNav();
    } else {
      openPrimaryNav();
      closeSecondaryNav();
    }
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
    selectedNavItem,
    selectNavItem,
  };
};
