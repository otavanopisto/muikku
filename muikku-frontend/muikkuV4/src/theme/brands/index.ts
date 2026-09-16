import { muikkuDefaultTheme } from "./muikku-default/theme";
import { muikkuDefaultCssVariablesResolver } from "./muikku-default/cssVariablesResolver";
import { createTheme } from "@mantine/core";

export type BrandId = "mantineDefault" | "muikkuDefault";

export const brandRegistry = {
  mantineDefault: {
    theme: createTheme({}),
    cssVariablesResolver: undefined,
  },
  muikkuDefault: {
    theme: muikkuDefaultTheme,
    cssVariablesResolver: muikkuDefaultCssVariablesResolver,
  },
} as const;
