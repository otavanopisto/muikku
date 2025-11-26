import { useSetAtom } from "jotai";
import type { NavigationItem } from "./navigation";
import { useEffect } from "react";
import { secondaryNavConfigAtom } from "~/src/atoms/layout";

/**
 * Hook for managing the route context navigation
 * @param config - Configuration for the route context navigation
 */
export function useRootNav(config: {
  title: string;
  items: NavigationItem[];
  customWidth?: number;
}) {
  const setConfig = useSetAtom(secondaryNavConfigAtom);

  useEffect(() => {
    setConfig({
      config: { title: config.title, items: config.items },
      customWidth: config.customWidth,
    });

    return () => {
      setConfig(null);
    };
  }, [config.title, config.items, config.customWidth, setConfig]);
}
