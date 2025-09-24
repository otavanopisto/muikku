import { AppShell, Group, Title, Button, ScrollArea } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { LinksGroup } from "../NavbarLinksGroup/NavbarLinksGroup";
//import { UserButton } from "../UserButton/UserButton";
//import { Logo } from "./Logo";
import classes from "./NavbarNested.module.css";
import { type NavigationItem } from "~/src/layout/helpers/navigation";

/**
 * NavbarNestedProps - Interface for navbar nested props
 */
interface NavbarNestedProps {
  title: string;
  items: NavigationItem[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * NavbarNested - Navbar nested component
 * @param props - Navbar nested props
 * @returns Navbar nested component
 */
export function NavbarNested(props: NavbarNestedProps) {
  const { items, collapsed = false, onToggleCollapse, title } = props;
  const links = items.map((item) => (
    <LinksGroup key={item.label} {...item} collapsed={collapsed} />
  ));

  return (
    <>
      <AppShell.Section className={classes.header}>
        <Group
          justify="space-between"
          align="center"
          className={classes.headerContent}
        >
          <Group p="sm" gap="sm" align="center" className={classes.titleGroup}>
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
      </AppShell.Section>

      <AppShell.Section grow className={classes.links} component={ScrollArea}>
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
      </AppShell.Section>

      {/* <AppShell.Section className={classes.footer}>
        <UserButton collapsed={collapsed} />
      </AppShell.Section> */}
    </>
  );
}
