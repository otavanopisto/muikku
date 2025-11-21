import { useSetAtom } from "jotai";
import type { NavigationItem } from "./navigation";
import { useEffect } from "react";
import { secondaryNavConfigAtom } from "~/src/atoms/layout";
import { useAppLayout } from "~/src/hooks/useAppLayout";

/**
 * Hook for managing the route context navigation
 * @param config - Configuration for the route context navigation
 */
export function useRouteContextNav(config: {
  title: string;
  items: NavigationItem[];
  customWidth?: number;
}) {
  const setConfig = useSetAtom(secondaryNavConfigAtom);
  const {
    openPrimaryNav,
    openSecondaryNav,
    closePrimaryNav,
    closeSecondaryNav,
  } = useAppLayout();

  useEffect(() => {
    setConfig({
      config: { title: config.title, items: config.items },
      customWidth: config.customWidth,
    });
    openSecondaryNav();
    closePrimaryNav();

    return () => {
      setConfig(null);
      closeSecondaryNav();
      openPrimaryNav();
    };
  }, [
    config.title,
    config.items,
    config.customWidth,
    setConfig,
    openPrimaryNav,
    openSecondaryNav,
    closePrimaryNav,
    closeSecondaryNav,
  ]);
}
