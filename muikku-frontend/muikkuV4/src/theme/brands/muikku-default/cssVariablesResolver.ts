import { alpha, type CSSVariablesResolver } from "@mantine/core";
import { muikkuTokens } from "./tokens";

/**
 * CSS variables resolver for the Muikku default theme.
 * @param theme - The theme to resolve the CSS variables for.
 * @returns The CSS variables resolver.
 */
export const muikkuDefaultCssVariablesResolver: CSSVariablesResolver = (
  _theme
) => ({
  variables: {
    "--muikku-accent": muikkuTokens.accent,
    "--muikku-color-priority-high-bg": alpha(_theme.colors.high[6], 0.1),
    "--muikku-color-priority-medium-bg": alpha(_theme.colors.medium[6], 0.1),
    "--muikku-color-priority-low-bg": alpha(_theme.colors.low[6], 0.1),
  },
  light: {},
  dark: {
    "--mantine-color-body": muikkuTokens.dark.body,
    "--mantine-color-text": muikkuTokens.dark.text,
    "--mantine-color-dimmed": muikkuTokens.dark.dimmed,
    "--mantine-color-default": muikkuTokens.dark.default,
    "--mantine-color-default-hover": muikkuTokens.dark.defaultHover,
    "--mantine-color-default-border": muikkuTokens.dark.defaultBorder,
    "--muikku-surface": muikkuTokens.dark.surface,
  },
});
