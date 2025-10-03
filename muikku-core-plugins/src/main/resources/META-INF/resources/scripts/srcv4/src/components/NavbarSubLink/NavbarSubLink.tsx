import { useMemo } from "react";
import { Group, Text, UnstyledButton, Loader } from "@mantine/core";
import { Link, useLocation, useParams } from "react-router";
import classes from "./NavbarSubLink.module.css";
import type { NavigationLink } from "~/src/layout/helpers/navigation";

/**
 * NavbarSubLinkProps - Interface for navbar sub-link props
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NavbarSubLinkProps extends Omit<NavigationLink, "type"> {}

/**
 * NavbarSubLink - Sub-link component for navigation groups
 * @param props - NavbarSubLinkProps
 * @returns NavbarSubLink component
 */
export function NavbarSubLink(props: NavbarSubLinkProps) {
  const { label, link, onClick, active = false, loading = false } = props;

  const location = useLocation();
  const params = useParams();

  const isActive = useMemo(
    () =>
      active ||
      (link &&
        (typeof link === "function"
          ? link(params) === location.pathname
          : link === location.pathname)),
    [active, link, location.pathname, params]
  );

  /**
   * Handle click
   */
  const handleClick = () => {
    if (onClick) {
      onClick();
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
