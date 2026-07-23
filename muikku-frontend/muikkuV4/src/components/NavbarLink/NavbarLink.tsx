import { useMemo } from "react";
import { NavLink, Tooltip } from "@mantine/core";
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

  const navLink = (
    <NavLink
      component={Link}
      to={linkValue}
      label={collapsed ? undefined : label}
      description={collapsed ? undefined : description}
      leftSection={Icon ? <Icon size={20} stroke={1.5} /> : null}
      active={match !== null}
      classNames={navLinkClassNames}
    />
  );

  if (collapsed) {
    return (
      <Tooltip label={label} position="right" withArrow>
        {navLink}
      </Tooltip>
    );
  }

  return navLink;
}
