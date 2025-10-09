import { useMemo } from "react";
import { Group, Text, UnstyledButton } from "@mantine/core";
import { Link, useLocation, useParams } from "react-router";
import classes from "./NavbarSubQueryLink.module.css";
import type { NavigationQueryLink } from "~/src/layout/helpers/navigation";

/**
 * NavbarSubQueryLinkProps - Interface for navbar sub-query-link props
 */
interface NavbarSubQueryLinkProps extends Omit<NavigationQueryLink, "type"> {
  basePath: string;
}

/**
 * NavbarSubQueryLink - Sub-query-link component for navigation groups
 * @param props - NavbarSubQueryLinkProps
 * @returns NavbarSubQueryLink component
 */
export function NavbarSubQueryLink(props: NavbarSubQueryLinkProps) {
  const { label, basePath, link } = props;

  const location = useLocation();
  const params = useParams();

  // Check if the link is active (either by path or query params)
  const isActive = useMemo(() => {
    const isPathActive = basePath === location.pathname;

    if (!isPathActive) return false;

    // Check search params if they exist
    if (link && typeof link === "object" && "search" in link) {
      return location.search === link.search;
    }

    return isPathActive;
  }, [basePath, location.pathname, location.search, link]);

  const linkTo = useMemo(
    () => (typeof link === "function" ? link(params) : link),
    [link, params]
  );

  // Render the sub-query-link
  const subLinkElement = (
    <UnstyledButton
      component={Link}
      to={linkTo}
      //onClick={() => void handleNavigation()}
      className={`${classes.link} ${isActive ? classes.active : ""}`}
      p="xs"
    >
      <Group gap="sm" align="center">
        <div style={{ width: 14, height: 14 }} />
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );

  return subLinkElement;
}
