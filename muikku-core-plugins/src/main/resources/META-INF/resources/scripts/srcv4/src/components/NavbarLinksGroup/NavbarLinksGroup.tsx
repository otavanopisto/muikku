import { useMemo, useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import {
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  Tooltip,
  Loader,
} from "@mantine/core";
import { useLocation, useParams, useNavigate } from "react-router";
import classes from "./NavbarLinksGroup.module.css";
import type { NavigationGroupItem } from "~/src/layout/helpers/navigation";
import { NavbarSubLink } from "../NavbarSubLink/NavbarSubLink";

/**
 * LinksGroupProps - Interface for collapsible navigation group
 */
interface LinksGroupProps extends NavigationGroupItem {
  collapsed?: boolean;
}

/**
 * LinksGroup - Collapsible navigation group component
 * @param props - LinksGroupProps
 * @returns LinksGroup component
 */
export function LinksGroup(props: LinksGroupProps) {
  const {
    icon: Icon,
    label,
    initiallyOpened,
    links,
    parentBehavior = "toggle",
    link,
    queryParams,
    replaceState = false,
    active = false,
    collapsed = false,
    loading = false,
  } = props;

  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(initiallyOpened ?? false);

  // Determine parent route for query parameter restrictions
  const parentRoute = useMemo(() => {
    if (link) {
      return typeof link === "function" ? link(params) : link;
    }
    // If no parent link, use the current pathname as fallback
    return location.pathname;
  }, [link, params, location.pathname]);

  // Check if any sub-link is active (including query params)
  const isAnySubLinkActive = useMemo(
    () =>
      links.some((subLink) => {
        if (subLink.active) {
          return true;
        }
        if (subLink.link) {
          const subLinkPath =
            typeof subLink.link === "function"
              ? subLink.link(params)
              : subLink.link;
          if (subLinkPath === location.pathname) {
            return true;
          }
        }
        // Check if sub-link query params are active (only if on parent route)
        if (subLink.queryParams && location.pathname.startsWith(parentRoute)) {
          const currentSearchParams = new URLSearchParams(location.search);
          return Object.entries(subLink.queryParams).every(([key, value]) => {
            const currentValue = currentSearchParams.get(key);
            return currentValue === String(value);
          });
        }
        return false;
      }),
    [links, location.pathname, location.search, params, parentRoute]
  );

  const isActive = useMemo(
    () =>
      active ||
      isAnySubLinkActive ||
      (link &&
        (typeof link === "function"
          ? link(params) === location.pathname
          : link === location.pathname)),
    [active, isAnySubLinkActive, link, location.pathname, params]
  );

  /**
   * Handle query parameter navigation
   */
  const handleQueryParams = async () => {
    if (queryParams) {
      const currentSearchParams = new URLSearchParams(location.search);

      // Update query parameters
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          currentSearchParams.set(key, String(value));
        } else {
          currentSearchParams.delete(key);
        }
      });

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
   * Handle parent click
   */
  const handleParentClick = () => {
    // Handle parent behavior
    if (parentBehavior === "both" && link) {
      // Navigate to parent link
      const targetLink = typeof link === "function" ? link(params) : link;
      void navigate(targetLink);
      // Toggle sub-links
      setOpened((o) => !o);
    } else if (parentBehavior === "link" && link) {
      // Only navigate
      const targetLink = typeof link === "function" ? link(params) : link;
      void navigate(targetLink);
    } else {
      // Default toggle behavior
      setOpened((o) => !o);
    }

    if (queryParams) {
      void handleQueryParams();
    }
  };

  // Render sub-links using the dedicated component with parent route
  const items = links.map((subLink) => (
    <NavbarSubLink key={subLink.label} {...subLink} parentRoute={parentRoute} />
  ));

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
      <IconChevronRight
        className={classes.chevron}
        stroke={1.5}
        size={16}
        style={{ transform: opened ? "rotate(-90deg)" : "none" }}
      />
    </Text>
  );

  // Main content
  const MainLinkContent = (
    <Group gap="md" align="center" className={classes.mainContent}>
      {IconComponent}
      {TextComponent}
    </Group>
  );

  // Render the main button
  const mainElement = (
    <UnstyledButton
      onClick={handleParentClick}
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
  );

  return (
    <>
      {mainElement}
      {!collapsed ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
