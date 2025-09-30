import { useMemo } from "react";
import {
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  Tooltip,
  Loader,
} from "@mantine/core";
import { Link, useLocation, useParams, useNavigate } from "react-router";
import classes from "./NavbarLink.module.css";
import type { NavigationLinkItem } from "~/src/layout/helpers/navigation";

/**
 * NavbarLinkProps - Interface for navbar link props
 */
interface NavbarLinkProps extends NavigationLinkItem {
  collapsed?: boolean;
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
    onClick,
    queryParams,
    replaceState = false,
    active = false,
    collapsed = false,
    loading = false,
  } = props;

  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  // Check if query parameters are currently active
  const isQueryParamsActive = useMemo(() => {
    if (!queryParams) return false;

    const currentSearchParams = new URLSearchParams(location.search);
    return Object.entries(queryParams).every(([key, value]) => {
      const currentValue = currentSearchParams.get(key);
      return currentValue === String(value);
    });
  }, [queryParams, location.search]);

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
    if (queryParams) {
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
    if (queryParams) {
      void handleQueryParams();
    }
  };

  // Icon component
  const IconComponent = (
    <ThemeIcon
      variant="light"
      size={36}
      className={classes.icon}
      style={{
        backgroundColor: isActive ? "#228be6" : "transparent",
        color: isActive ? "white" : "#228be6",
      }}
    >
      {loading ? <Loader size={16} /> : <Icon size={20} />}
    </ThemeIcon>
  );

  // Text component - hidden when collapsed
  const TextComponent = !collapsed && (
    <Text
      className={classes.text}
      style={{
        opacity: collapsed ? 0 : 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {label}
    </Text>
  );

  // Main content
  const MainLinkContent = (
    <Group gap="md" align="center" className={classes.mainContent}>
      {IconComponent}
      {TextComponent}
    </Group>
  );

  // Render the link/button
  const linkElement = link ? (
    <UnstyledButton
      component={Link}
      to={link instanceof Function ? link(params) : link}
      onClick={handleClick}
      className={`${classes.control} ${isActive ? classes.active : ""} ${
        collapsed ? classes.collapsed : ""
      }`}
      p="sm"
    >
      {collapsed ? (
        <Tooltip label={label} position="right" withArrow>
          {MainLinkContent}
        </Tooltip>
      ) : (
        <Group justify="space-between" gap={0}>
          {MainLinkContent}
        </Group>
      )}
    </UnstyledButton>
  ) : (
    <UnstyledButton
      onClick={handleClick}
      className={`${classes.control} ${isActive ? classes.active : ""} ${
        collapsed ? classes.collapsed : ""
      }`}
      p="sm"
    >
      {collapsed ? (
        <Tooltip label={label} position="right" withArrow>
          {MainLinkContent}
        </Tooltip>
      ) : (
        <Group gap={0}>{MainLinkContent}</Group>
      )}
    </UnstyledButton>
  );

  return linkElement;
}
