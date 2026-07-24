import { Box, Group, ScrollArea, Title } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import type { NavigationItem } from "~/src/navigation/navigation";
import { UserButton } from "~/src/components/UserButton/UserButton";
import { NavItemList } from "./NavItemList";
import { NAV_LAYOUT } from "./navigationLayout";
import classes from "../RootLayout.module.css";

/**
 * Props for the MainNav component.
 */
interface MainNavProps {
  title: string;
  items: NavigationItem[];
  collapsed: boolean;
}

/**
 * Primary application navigation (logo, links, user footer).
 * Width is controlled by AppNavigation's mainNavLayer.
 */
export function MainNav(props: MainNavProps) {
  const { title, items, collapsed } = props;

  return (
    <div className={classes.mainNav}>
      {/* Keep expanded layout; parent layer clips */}
      <div
        className={classes.mainNavInner}
        style={{
          width: NAV_LAYOUT.mainExpanded,
          minWidth: NAV_LAYOUT.mainExpanded,
        }}
      >
        <Box className={classes.mainNavHeader} data-collapsed={collapsed}>
          <Group
            h={60}
            gap="sm"
            wrap="nowrap"
            align="center"
            className={classes.headerContent}
          >
            <Box className={classes.headerIconSlot}>
              <IconHome size={20} stroke={1.5} />
            </Box>
            <Title order={3} className={classes.title}>
              {title}
            </Title>
          </Group>
        </Box>

        <Box
          className={classes.mainNavLinks}
          component={ScrollArea}
          data-collapsed={collapsed}
        >
          <ul className={classes.linksInner}>
            <NavItemList items={items} collapsed={collapsed} />
          </ul>
        </Box>

        <Box className={classes.mainNavFooter} data-collapsed={collapsed}>
          <UserButton collapsed={collapsed} />
        </Box>
      </div>
    </div>
  );
}
