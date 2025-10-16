import { Group, Title, ScrollArea, Box, Button } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { NavbarLink } from "~/src/components/NavbarLink/NavbarLink";
import classes from "./SecondaryNavSection.module.css";
import { type NavigationItem } from "~/src/layout/helpers/navigation";

/**
 * SecondaryNavSectionProps - Interface for secondary nav section props
 */
interface SecondaryNavSectionProps {
  title: string;
  items: {
    environment: NavigationItem[];
    workspace: NavigationItem[];
  };
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * NavbarNested - Navbar nested component
 * @param props - Navbar nested props
 * @returns Navbar nested component
 */
export function SecondaryNavSection(props: SecondaryNavSectionProps) {
  const { collapsed = false, title, onToggleCollapse } = props;

  return (
    <>
      <Box className={classes.header}>
        <Group p="sm" className={classes.headerContent}>
          <Group align="center" className={classes.titleGroup}>
            {!collapsed && (
              <Title
                order={3}
                className={classes.title}
                style={{
                  opacity: collapsed ? 0 : 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {title}
              </Title>
            )}

            {onToggleCollapse && (
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                onClick={onToggleCollapse}
                className={classes.toggleButton}
                style={{
                  padding: "4px",
                  minWidth: "auto",
                  height: "auto",
                }}
                p="xs"
              >
                {collapsed ? (
                  <IconChevronRight size={16} />
                ) : (
                  <IconChevronLeft size={16} />
                )}
              </Button>
            )}
          </Group>
        </Group>
      </Box>

      <Box className={classes.links} component={ScrollArea}>
        <div
          className={classes.linksInner}
          style={{
            padding: collapsed
              ? "var(--mantine-spacing-sm)"
              : "var(--mantine-spacing-md)",
            paddingTop: collapsed
              ? "var(--mantine-spacing-sm)"
              : "var(--mantine-spacing-lg)",
            paddingBottom: collapsed
              ? "var(--mantine-spacing-sm)"
              : "var(--mantine-spacing-lg)",
            minWidth: collapsed ? "60px" : "200px",
          }}
        >
          <NavbarLink
            icon={IconChevronLeft}
            label="Back"
            collapsed={false}
            type="link"
          />
          <NavbarLink
            icon={IconChevronLeft}
            label="Back"
            collapsed={false}
            type="link"
          />
        </div>
      </Box>
    </>
  );
}
