import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { asideConfigAtom } from "~/src/atoms/layout";

/**
 * Hook for managing the root aside
 * @param config - Configuration for the route context navigation
 */
export function useRootAside(config: { component: React.ReactNode }) {
  const setConfig = useSetAtom(asideConfigAtom);

  useEffect(() => {
    setConfig({
      config: { component: config.component },
    });

    return () => {
      setConfig(null);
    };
  }, [config.component, setConfig]);
}
