import { Indicator, NavLink, Text, Tooltip } from "@mantine/core";
import { Link } from "react-router";
import type { NavigationLink } from "~/src/navigation/navigation";
import { useNavLinkMatch } from "./useNavLinkMatch";
import { navLinkClassNames } from "./navLinkClassnames";

/**
 * Props for the NavbarLink component.
 */
interface NavbarLinkProps extends Omit<NavigationLink, "type" | "badgeKey"> {
  /** main = icon rail (collapsible); secondary = panel links (default) */
  variant?: "main" | "secondary";
  collapsed?: boolean;
  badgeCount?: number;
}

/**
 * Shared sidebar NavLink for main rail and secondary panel.
 */
export function NavbarLink(props: NavbarLinkProps) {
  const {
    icon: Icon,
    label,
    description,
    link,
    variant = "secondary",
    collapsed = false,
    exactMatch = false,
    badgeCount = 0,
  } = props;

  const { to, isActive } = useNavLinkMatch(link, exactMatch);
  const isMain = variant === "main";

  /**
   * Prevent the default behavior of the event.
   * @param event - The event to prevent.
   */
  const preventDefault = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  if (isMain && !Icon) {
    return null;
  }

  const iconNode = Icon ? (
    <Indicator
      display="flex"
      size={16}
      color="cyan"
      label={badgeCount}
      maxValue={99}
      showZero={false}
      disabled={!isMain || !collapsed || badgeCount < 1}
    >
      <Icon size={20} stroke={1.5} />
    </Indicator>
  ) : undefined;

  const leftSection =
    isMain && collapsed && iconNode ? (
      <Tooltip
        label={<Text size="sm">{label}</Text>}
        position="right"
        withArrow
      >
        {iconNode}
      </Tooltip>
    ) : (
      iconNode
    );

  const rightSection = isMain ? (
    <Indicator
      size={16}
      color="cyan"
      label={badgeCount}
      maxValue={99}
      showZero={false}
      disabled={collapsed || badgeCount < 1}
    />
  ) : badgeCount > 0 ? (
    <Indicator
      size={16}
      color="cyan"
      label={badgeCount}
      maxValue={99}
      showZero={false}
    />
  ) : undefined;

  return (
    <NavLink
      component={Link}
      to={to}
      label={label}
      description={isMain ? undefined : description}
      leftSection={leftSection}
      rightSection={rightSection}
      active={isActive}
      classNames={navLinkClassNames}
      onDragStart={preventDefault}
    />
  );
}
