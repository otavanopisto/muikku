import { useMemo } from "react";
import { NavLink, Tooltip } from "@mantine/core";
import { useParams, useResolvedPath, useMatch, Link } from "react-router";
import type { NavigationLink } from "src/layouts/helpers/navigation";

/**
 * NavbarLinkProps - Interface for navbar link props
 */
interface NavbarLinkProps extends Omit<NavigationLink, "type"> {
  collapsed?: boolean;
  onSelect?: () => void;
  exactMatch?: boolean;
}

/**
 * NavbarLink - Simple navigation link component
 * @param props - NavbarLinkProps
 * @returns NavbarLink component
 */
export function NavbarLink(props: NavbarLinkProps) {
  const {
    icon: Icon,
    label,
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

  return collapsed ? (
    <Tooltip label={label} position="right" withArrow>
      <NavLink
        component={Link}
        to={linkValue}
        leftSection={Icon ? <Icon size={20} /> : null}
        active={match !== null}
      />
    </Tooltip>
  ) : (
    <NavLink
      component={Link}
      to={linkValue}
      label={label}
      leftSection={Icon ? <Icon size={20} /> : null}
      active={match !== null}
    />
  );
}
