export const NAV_V2_LAYOUT = {
  /** Expanded main rail and default secondary panel share the same width */
  panelWidth: 320,
  mainCollapsed: 64,
  transition: {
    duration: 0.25,
    ease: "easeInOut" as const,
  },
} as const;

/**
 * Width of the secondary navigation panel.
 */
export function getSecondaryNavWidth(customWidth?: number): number {
  return customWidth ?? NAV_V2_LAYOUT.panelWidth;
}

/**
 * Total shell width for desktop nav / main content offset.
 */
export function getNavWidth(options: {
  hasSecondaryNav: boolean;
  customWidth?: number;
}): number {
  const { customWidth } = options;

  return NAV_V2_LAYOUT.mainCollapsed + getSecondaryNavWidth(customWidth);
}
