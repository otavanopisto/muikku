import { useAtom } from "jotai";
import { asideOpenedAtom, navOpenedAtom } from "../atoms/layout";

/**
 * Hook for managing the app layout
 * @returns Object containing sidebar state and control functions
 */
export const useAppLayout = () => {
  const [navOpened, setNavOpened] = useAtom(navOpenedAtom);
  const [asideOpened, setAsideOpened] = useAtom(asideOpenedAtom);

  const toggleNav = () => setNavOpened(!navOpened);
  const toggleAside = () => setAsideOpened(!asideOpened);

  return {
    navOpened,
    toggleNav,
    asideOpened,
    toggleAside,
  };
};
