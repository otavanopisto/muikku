import React, { useMemo, useState } from "react";
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
import classes from "./NavbarLinksGroup.module.css";
import type { NavigationGroupItem } from "~/src/layout/helpers/navigation";
import { NavbarSubLink } from "../NavbarSubLink/NavbarSubLink";
import { NavbarSubQueryLink } from "../NavbarSubQueryLink/NavbarSubQueryLink";
import { useParams } from "react-router";

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
    contents,
    basePath,
    collapsed = false,
    loading = false,
  } = props;

  const [opened, setOpened] = useState(initiallyOpened ?? false);
  const params = useParams();

  // Check if the folder is active based on base route
  const isFolderActive = useMemo(() => {
    if (!basePath) return false;

    const folderPath =
      typeof basePath === "function" ? basePath(params) : basePath;
    return location.pathname.startsWith(folderPath);
  }, [basePath, params]);

  /**
   * Handle parent click
   */
  const handleClick = () => {
    setOpened((o) => !o);
  };

  // Process contents - handle both NavigationLink and NavigationDynamicContent
  const processedContents = useMemo(
    () =>
      contents.map((content) => {
        switch (content.type) {
          case "component":
            return (
              <React.Fragment key={content.id}>
                {content.component}
              </React.Fragment>
            );
          case "link":
            return <NavbarSubLink key={content.label} {...content} />;
          case "queryLink":
            return (
              <NavbarSubQueryLink
                key={content.label}
                {...content}
                basePath={
                  basePath instanceof Function ? basePath(params) : basePath
                }
              />
            );
          default:
            return null;
        }
      }),
    [basePath, contents, params]
  );

  // Icon component
  const IconComponent = (
    <ThemeIcon
      variant="light"
      size={36}
      className={classes.icon}
      style={{
        backgroundColor: isFolderActive ? "#228be6" : "transparent",
        color: isFolderActive ? "white" : "#228be6",
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
        fontWeight: isFolderActive ? 600 : 400,
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
      onClick={handleClick}
      className={`${classes.control} ${collapsed ? classes.collapsed : ""} ${
        isFolderActive ? classes.active : ""
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
      {!collapsed ? <Collapse in={opened}>{processedContents}</Collapse> : null}
    </>
  );
}
