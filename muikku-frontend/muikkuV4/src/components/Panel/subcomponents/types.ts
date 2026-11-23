export type PanelItemVariant = "high" | "medium" | "low";
export type PanelItemState = "warning" | "success" | "info";

export type PanelItemBadge = {
  label: string;
  state?: PanelItemState;
  color?: string;
};

/**
 * A menu item for a panel item
 */
export interface PanelMenuItem {
  label: string;
  action: (id?: number | string) => void;
  icon?: React.ReactNode;
}

/**
 * Props for a panel item
 */
export interface PanelItemProps {
  title: string;
  date?: string | React.ReactNode;
  itemId: number | string;
  variant?: PanelItemVariant;
  unseen?: boolean;
  itemActions?: PanelMenuItem[];
  icons?: React.ReactNode;
  badges?: PanelItemBadge | PanelItemBadge[];
  children?: React.ReactNode;
}
