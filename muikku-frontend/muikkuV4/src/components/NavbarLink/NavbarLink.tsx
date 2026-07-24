import { useMemo } from "react";
import { Indicator, NavLink } from "@mantine/core";
import { useParams, useResolvedPath, useMatch, Link } from "react-router";
import type { NavigationLink } from "~/src/navigation/navigation";
import { navLinkClassNames } from "./navLinkClassnames";

/**
 * Props for the NavbarLink component.
 */
interface NavbarLinkProps extends Omit<NavigationLink, "type"> {
  collapsed?: boolean;
  onSelect?: () => void;
  exactMatch?: boolean;
  badgeCount?: number;
}

/**
 * NavbarLink component.
 * @param props - Props for the NavbarLink component.
 * @returns NavbarLink component.
 */
export function NavbarLink(props: NavbarLinkProps) {
  const {
    icon: Icon,
    label,
    description,
    link,
    collapsed = false,
    exactMatch = false,
    badgeCount = 0,
  } = props;

  const params = useParams();

  const linkValue = useMemo(() => {
    if (link instanceof Function) {
      return link(params);
    }
    return link;
  }, [link, params]);

  const resolved = useResolvedPath(linkValue);
  const match = useMatch({ path: resolved.pathname, end: exactMatch });

  const count = badgeCount;

  const leftSection = Icon && (
    <Indicator
      size={16}
      color="cyan"
      processing={false}
      label={count}
      maxValue={99}
      showZero={false}
      disabled={!collapsed}
    >
      <Icon size={20} stroke={1.5} />
    </Indicator>
  );

  const rightSection = (
    <Indicator
      size={16}
      color="cyan"
      label={count}
      maxValue={99}
      showZero={false}
      disabled={collapsed}
    />
  );

  const navLink = (
    <NavLink
      component={Link}
      to={linkValue}
      label={label}
      description={description}
      leftSection={leftSection}
      rightSection={rightSection}
      active={match !== null}
      classNames={navLinkClassNames}
    />
  );

  return navLink;
}
