import { useState } from "react";
import { IconCalendarStats, IconChevronRight } from "@tabler/icons-react";
import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  Tooltip,
} from "@mantine/core";
import { Link, useLocation } from "react-router";
import classes from "./NavbarLinksGroup.module.css";

interface LinksGroupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  // New props for simple navigation links
  link?: string;
  onClick?: () => void;
  active?: boolean;
  // New prop for collapsed state
  collapsed?: boolean;
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  link,
  onClick,
  active = false,
  collapsed = false,
}: LinksGroupProps) {
  const location = useLocation();
  const hasLinks = Array.isArray(links) && links.length > 0;
  const isSimpleLink = !hasLinks && (link ?? onClick);
  const [opened, setOpened] = useState(initiallyOpened ?? false);

  // Determine if this item is active
  const isActive = active || (link && location.pathname === link);

  // Handle click for simple links
  const handleClick = () => {
    if (isSimpleLink) {
      if (onClick) {
        onClick();
      }
      // If it's a link, React Router will handle navigation
    } else if (hasLinks) {
      setOpened((o) => !o);
    }
  };

  // Render sub-links for collapsible groups
  const items = (hasLinks ? links : []).map((subLink) => (
    <Text<typeof Link>
      component={Link}
      className={classes.link}
      to={subLink.link}
      key={subLink.label}
    >
      {subLink.label}
    </Text>
  ));

  // Icon component - always centered when collapsed
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
      <Icon size={20} />
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
      {hasLinks && (
        <IconChevronRight
          className={classes.chevron}
          stroke={1.5}
          size={16}
          style={{ transform: opened ? "rotate(-90deg)" : "none" }}
        />
      )}
    </Text>
  );

  // Main content - clean separation of icon and text
  const MainLinkContent = (
    <Group gap="md" align="center" className={classes.mainContent}>
      {IconComponent}
      {TextComponent}
    </Group>
  );

  // Render the main button/link
  const mainElement =
    isSimpleLink && link ? (
      <UnstyledButton
        component={Link}
        to={link}
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

  return (
    <>
      {mainElement}
      {hasLinks && !collapsed ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

const mockdata = {
  label: "Releases",
  icon: IconCalendarStats,
  links: [
    { label: "Upcoming releases", link: "/" },
    { label: "Previous releases", link: "/" },
    { label: "Releases schedule", link: "/" },
  ],
};

// Example of a simple link item
const simpleLinkData = {
  label: "Dashboard",
  icon: IconCalendarStats,
  link: "/dashboard",
};

export function NavbarLinksGroup() {
  return (
    <Box mih={220} p="md">
      <LinksGroup {...mockdata} />
      <LinksGroup {...simpleLinkData} />
    </Box>
  );
}
