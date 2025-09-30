import { useMemo } from "react";
import { Group, Text, UnstyledButton, Loader } from "@mantine/core";
import { Link, useLocation, useParams, useNavigate } from "react-router";
import classes from "./NavbarSubLink.module.css";
import type { NavigationLink } from "~/src/layout/helpers/navigation";

/**
 * NavbarSubLinkProps - Interface for navbar sub-link props
 */
interface NavbarSubLinkProps extends NavigationLink {
  // Additional props specific to sub-links
  parentRoute?: string; // Parent route to restrict query params to
}

/**
 * NavbarSubLink - Sub-link component for navigation groups
 * @param props - NavbarSubLinkProps
 * @returns NavbarSubLink component
 */
export function NavbarSubLink(props: NavbarSubLinkProps) {
  const {
    label,
    link,
    onClick,
    queryParams,
    replaceState = false,
    active = false,
    loading = false,
    parentRoute,
  } = props;

  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  // Check if query parameters are allowed on current route (restrict to parent route)
  const areQueryParamsAllowed = useMemo(() => {
    if (!queryParams || !parentRoute) return true;

    // Check if current pathname starts with parent route
    return location.pathname.startsWith(parentRoute);
  }, [queryParams, parentRoute, location.pathname]);

  // Check if query parameters are currently active
  const isQueryParamsActive = useMemo(() => {
    if (!queryParams || !areQueryParamsAllowed) return false;

    const currentSearchParams = new URLSearchParams(location.search);
    return Object.entries(queryParams).every(([key, value]) => {
      const currentValue = currentSearchParams.get(key);
      return currentValue === String(value);
    });
  }, [queryParams, areQueryParamsAllowed, location.search]);

  const isActive = useMemo(
    () =>
      active ||
      isQueryParamsActive ||
      (link &&
        (typeof link === "function"
          ? link(params) === location.pathname
          : link === location.pathname)),
    [active, isQueryParamsActive, link, location.pathname, params]
  );

  /**
   * Handle query parameter navigation with toggle behavior
   */
  const handleQueryParams = async () => {
    if (queryParams && areQueryParamsAllowed) {
      const currentSearchParams = new URLSearchParams(location.search);

      // Check if all query params are currently active
      const allParamsActive = Object.entries(queryParams).every(
        ([key, value]) => {
          const currentValue = currentSearchParams.get(key);
          return currentValue === String(value);
        }
      );

      if (allParamsActive) {
        // Remove the query parameters (toggle off)
        Object.keys(queryParams).forEach((key) => {
          currentSearchParams.delete(key);
        });
      } else {
        // Add/update the query parameters (toggle on)
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            currentSearchParams.set(key, String(value));
          } else {
            currentSearchParams.delete(key);
          }
        });
      }

      const newSearch = currentSearchParams.toString();
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;

      if (replaceState) {
        await navigate(newUrl, { replace: true });
      } else {
        await navigate(newUrl);
      }
    }
  };

  /**
   * Handle click
   */
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (queryParams && areQueryParamsAllowed) {
      void handleQueryParams();
    }
  };

  // Render the sub-link
  const subLinkElement = link ? (
    <UnstyledButton
      component={Link}
      to={link instanceof Function ? link(params) : link}
      onClick={handleClick}
      className={`${classes.link} ${isActive ? classes.active : ""}`}
      p="xs"
    >
      <Group gap="sm" align="center">
        {loading ? (
          <Loader size={14} />
        ) : (
          <div style={{ width: 14, height: 14 }} />
        )}
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  ) : (
    <UnstyledButton
      onClick={handleClick}
      className={`${classes.link} ${isActive ? classes.active : ""}`}
      p="xs"
    >
      <Group gap="sm" align="center">
        {loading ? (
          <Loader size={14} />
        ) : (
          <div style={{ width: 14, height: 14 }} />
        )}
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );

  return subLinkElement;
}
