/**
 * Text color function for the PanelItem components
 * @param unseen - Whether the item is unseen
 * @returns - The text colors for the item
 */
export function panelItemTextColors(unseen: boolean | undefined) {
  const viewed = unseen === false;
  return {
    titleColor: viewed ? "panelSeenTitleText" : "panelTitleText",
    textColor: viewed ? "panelSeenContentText" : "panelContentText",
  } as const;
}
