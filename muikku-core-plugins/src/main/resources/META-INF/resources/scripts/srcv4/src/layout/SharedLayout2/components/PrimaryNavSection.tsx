import { Group, Title, Button, ScrollArea, Box } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { LinksGroup } from "~/src/components/NavbarLinksGroup/NavbarLinksGroup";
import { NavbarLink } from "~/src/components/NavbarLink/NavbarLink";
import classes from "./PrimaryNavSection.module.css";
import { type NavigationItem } from "~/src/layout/helpers/navigation";
import { UserButton } from "~/src/components/UserButton/UserButton";
import { useAppLayout } from "~/src/hooks/useAppLayout";

/**
 * PrimaryNavSectionProps - Interface for primary nav section props
 */
interface PrimaryNavSectionProps {
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
export function PrimaryNavSection(props: PrimaryNavSectionProps) {
  const { items, collapsed = false, onToggleCollapse, title } = props;
  const { toggleSecondaryNav } = useAppLayout();

  const links = items.environment.map((item) => {
    // Use LinksGroup if item has sub-links, otherwise use NavbarLink
    if (item.type === "folder") {
      return <LinksGroup key={item.label} {...item} collapsed={collapsed} />;
    } else if (item.type === "link") {
      return <NavbarLink key={item.label} {...item} collapsed={collapsed} />;
    }
  });

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

            {toggleSecondaryNav && (
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                onClick={toggleSecondaryNav}
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
          {links}
        </div>
      </Box>

      <Box className={classes.footer}>
        <UserButton />
      </Box>
    </>
  );
}
