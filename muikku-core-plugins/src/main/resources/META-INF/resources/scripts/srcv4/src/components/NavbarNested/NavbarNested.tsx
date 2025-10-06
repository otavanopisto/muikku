import {
  AppShell,
  Group,
  Title,
  Button,
  ScrollArea,
  SegmentedControl,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { LinksGroup } from "../NavbarLinksGroup/NavbarLinksGroup";
import { NavbarLink } from "../NavbarLink/NavbarLink";
import classes from "./NavbarNested.module.css";
import { type NavigationItem } from "~/src/layout/helpers/navigation";
import { UserButton } from "../UserButton/UserButton";
import { useState } from "react";
import { workspaceInfoAtom } from "~/src/atoms/workspace";
import { useAtomValue } from "jotai";

/**
 * NavbarNestedProps - Interface for navbar nested props
 */
interface NavbarNestedProps {
  title: string;
  items: {
    environment: NavigationItem[];
    workspace: NavigationItem[];
  };
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

type Section = "environment" | "workspace";

/**
 * NavbarNested - Navbar nested component
 * @param props - Navbar nested props
 * @returns Navbar nested component
 */
export function NavbarNested(props: NavbarNestedProps) {
  const { items, collapsed = false, onToggleCollapse, title } = props;

  const [section, setSection] = useState<Section>("environment");

  const workspaceInfo = useAtomValue(workspaceInfoAtom);

  const links = items[section].map((item) => {
    // Use LinksGroup if item has sub-links, otherwise use NavbarLink
    if (item.type === "folder") {
      return <LinksGroup key={item.label} {...item} collapsed={collapsed} />;
    } else if (item.type === "link") {
      return <NavbarLink key={item.label} {...item} collapsed={collapsed} />;
    }
  });

  return (
    <>
      <AppShell.Section className={classes.header}>
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

          {!collapsed && (
            <Group
              gap="sm"
              align="center"
              justify="center"
              className={classes.segmentedControl}
            >
              <SegmentedControl
                value={section}
                onChange={(value) => setSection(value as Section)}
                transitionTimingFunction="ease"
                fullWidth
                data={[
                  { label: "Ympäristötaso", value: "environment" },
                  {
                    label: workspaceInfo
                      ? workspaceInfo.name
                      : "Viimeisin työtila",
                    value: "workspace",
                    disabled: !workspaceInfo,
                  },
                ]}
              />
            </Group>
          )}
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

      <AppShell.Section className={classes.footer}>
        <UserButton />
      </AppShell.Section>
    </>
  );
}
