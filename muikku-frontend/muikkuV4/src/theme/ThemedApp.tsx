// src/theme/ThemedApp.tsx
import { MantineProvider } from "@mantine/core";
import { useAtomValue } from "jotai";
import { brandIdAtom } from "../atoms/theme";
import { brandRegistry } from "src/theme/brands";

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
      {children}
    </MantineProvider>
  );
}
