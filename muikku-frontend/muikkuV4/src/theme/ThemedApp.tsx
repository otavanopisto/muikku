// src/theme/ThemedApp.tsx
import { MantineProvider, useComputedColorScheme } from "@mantine/core";
import { useAtomValue } from "jotai";
import { brandIdAtom } from "../atoms/theme";
import { brandRegistry } from "src/theme/brands";
import { useEffect } from "react";

/**
 * SyncTiptapDarkClass is a component that syncs the dark class to the document element.
 * @returns The SyncTiptapDarkClass component.
 */
function SyncTiptapDarkClass() {
  const scheme = useComputedColorScheme("light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", scheme === "dark");
  }, [scheme]);
  return null;
}

/**
 * ThemedApp component that provides the MantineProvider with the appropriate theme and cssVariablesResolver.
 * @param children - The children to render.
 * @returns The ThemedApp component.
 */
export function ThemedApp({ children }: { children: React.ReactNode }) {
  const brandId = useAtomValue(brandIdAtom);
  const brand = brandRegistry[brandId];

  return (
    <MantineProvider
      theme={brand.theme}
      cssVariablesResolver={brand.cssVariablesResolver}
      defaultColorScheme="light"
    >
      <SyncTiptapDarkClass />
      {children}
    </MantineProvider>
  );
}
