import { useMemo } from "react";
import { Group, Text, ThemeIcon, UnstyledButton, Tooltip } from "@mantine/core";
import { useParams, useResolvedPath, useMatch, Link } from "react-router";
import classes from "./NavbarLink.module.css";
import type { NavigationLink } from "~/src/layouts/helpers/navigation";

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
    onSelect,
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

  /**
   * Handle click
   */
  const handleClick = () => {
    onSelect?.();

    // if (queryParams && areQueryParamsAllowed) {
    //   void handleQueryParams();
    // }
  };

  // Main content
  const renderMainLinkContent = ({ isActive }: { isActive: boolean }) => (
    <Group gap="md" align="center" className={classes.mainContent}>
      {Icon && (
        <ThemeIcon
          variant="light"
          size={36}
          className={classes.icon}
          style={{
            backgroundColor: isActive ? "#228be6" : "transparent",
            color: isActive ? "white" : "#228be6",
          }}
        >
          <Icon size={20} />
          {/* {loading ? <Loader size={16} /> : <Icon size={20} />} */}
        </ThemeIcon>
      )}
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
    </Group>
  );

  // Render the link/button
  const linkElement = (
    <UnstyledButton
      component={Link}
      to={linkValue}
      onClick={handleClick}
      p="sm"
      className={`${classes.link} ${match ? classes.active : ""}`}
    >
      {collapsed ? (
        <Tooltip label={label} position="right" withArrow>
          {renderMainLinkContent({ isActive: match ? true : false })}
        </Tooltip>
      ) : (
        <Group justify="space-between" gap={0}>
          {renderMainLinkContent({ isActive: match ? true : false })}
        </Group>
      )}
    </UnstyledButton>
  );

  return linkElement;
}
