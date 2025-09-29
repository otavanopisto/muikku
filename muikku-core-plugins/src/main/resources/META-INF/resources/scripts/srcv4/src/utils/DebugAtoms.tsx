import { useAtomsDebugValue } from "jotai-devtools";

/**
 * DebugAtoms - Debug atoms
 */
export const DebugAtoms = () => {
  useAtomsDebugValue({
    enabled: true,
  });
  return null;
};
