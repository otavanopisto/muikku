import { Group, Text, ThemeIcon, Tooltip, UnstyledButton } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import classes from "./NavbarQueryLink.module.css";
import type { NavigationQueryLink } from "src/layouts/helpers/navigation";

/**
 * NavbarSubQueryLinkProps - Interface for navbar sub-query-link props
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NavbarQueryLinkProps extends Omit<NavigationQueryLink, "type"> {}

/**
 * NavbarSubQueryLink - Sub-query-link component for navigation groups
 * @param props - NavbarSubQueryLinkProps
 * @returns NavbarSubQueryLink component
 */
export function NavbarQueryLink(props: NavbarQueryLinkProps) {
  const { icon: Icon, label, queryName, queryValue: linkQueryValue } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParams = (search: string) => new URLSearchParams(search);
  const currentQueryValue = getQueryParams(location.search).get(queryName);
  const isActive = currentQueryValue === linkQueryValue;

  /**
   * Handle click
   * @param e - React.MouseEvent
   */
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const currentParams = new URLSearchParams(location.search);

    if (isActive) {
      // Toggle off - remove query parameter
      currentParams.delete(queryName);
    } else {
      // Toggle on - set query parameter
      currentParams.set(queryName, linkQueryValue);
    }

    const newSearch = currentParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;

    void navigate(newUrl);
  };

  const collapsed = false;

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
          {<Icon size={20} />}
          {/* {loading ? <Loader size={16} /> : <Icon size={20} />} */}
        </ThemeIcon>
      )}
      <Text
        className={classes.text}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {label}
      </Text>
    </Group>
  );

  // Render the sub-query-link
  const subLinkElement = (
    <UnstyledButton
      onClick={handleClick}
      className={`${classes.link} ${
        isActive && isActive ? classes.active : ""
      }`}
      p="sm"
    >
      {collapsed ? (
        <Tooltip label={label} position="right" withArrow>
          {renderMainLinkContent({ isActive })}
        </Tooltip>
      ) : (
        <Group justify="space-between" gap={0}>
          {renderMainLinkContent({ isActive })}
        </Group>
      )}
    </UnstyledButton>
  );

  return subLinkElement;
}
