import { useMemo } from "react";
import { Group, Text, UnstyledButton } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
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
  const { label, basePath, queryParams, replaceState = false } = props;

  const location = useLocation();
  const navigate = useNavigate();

  // Check if query parameters are currently active
  const isQueryParamsActive = useMemo(() => {
    const currentSearchParams = new URLSearchParams(location.search);
    return Object.entries(queryParams).every(([key, value]) => {
      const currentValue = currentSearchParams.get(key);
      return currentValue === String(value);
    });
  }, [queryParams, location.search]);

  // Check if the link is active (either by path or query params)
  const isActive = useMemo(() => {
    const isPathActive = basePath === location.pathname;
    return isPathActive && isQueryParamsActive;
  }, [basePath, location.pathname, isQueryParamsActive]);

  /**
   * Handle navigation with query parameters
   */
  const handleNavigation = async () => {
    if (queryParams) {
      // Create new URL with query parameters
      const searchParams = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.set(key, String(value));
        }
      });

      const newUrl = `${basePath}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;

      if (replaceState) {
        await navigate(newUrl, { replace: true });
      } else {
        await navigate(newUrl);
      }
    } else {
      // Navigate to base path only
      if (replaceState) {
        await navigate(basePath, { replace: true });
      } else {
        await navigate(basePath);
      }
    }
  };

  // Render the sub-query-link
  const subLinkElement = (
    <UnstyledButton
      onClick={() => void handleNavigation()}
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
