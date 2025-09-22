import { useAtomsDebugValue } from "jotai-devtools";

export const DebugAtoms = () => {
  useAtomsDebugValue({
    enabled: true,
  });
  return null;
};
