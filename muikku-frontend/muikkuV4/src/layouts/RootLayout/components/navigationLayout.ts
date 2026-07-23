export const NAV_LAYOUT = {
  mainExpanded: 250,
  mainCollapsed: 56,
  secondaryDefault: 200,
  transition: {
    duration: 0.25,
    ease: "easeInOut" as const,
  },
} as const;

/**
 * Get the width of the secondary navigation.
 */
export function getSecondaryNavWidth(customWidth?: number): number {
  return customWidth ?? NAV_LAYOUT.secondaryDefault;
}

/**
 * Total shell width for desktop nav / main content offset.
 */
export function getNavWidth(options: {
  hasSecondaryNav: boolean;
  customWidth?: number;
}): number {
  const { hasSecondaryNav, customWidth } = options;

  if (!hasSecondaryNav) {
    return NAV_LAYOUT.mainExpanded;
  }

  return NAV_LAYOUT.mainCollapsed + getSecondaryNavWidth(customWidth);
}
