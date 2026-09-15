import { Box, Group, ScrollArea, Title } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import type { NavigationItem } from "~/src/navigation/navigation";
import { NavItemList } from "./NavItemList";
import classes from "./MainNav.module.css";
import { UserButton } from "./UserButton";

/**
 * Props for the MainNav component.
 */
interface MainNavProps {
  title: string;
  items: NavigationItem[];
  collapsed: boolean;
}

/**
 * Primary navigation rail. Width comes from parent layer; content clips on collapse.
 */
export function MainNav(props: MainNavProps) {
  const { title, items, collapsed } = props;

  return (
    <div className={classes.mainNav}>
      <div className={classes.mainNavInner}>
        <Box className={classes.mainNavHeader}>
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

        <Box className={classes.mainNavLinks} component={ScrollArea}>
          <ul className={classes.linksInner}>
            <NavItemList items={items} collapsed={collapsed} variant="main" />
          </ul>
        </Box>

        <Box className={classes.mainNavFooter}>
          <UserButton collapsed={collapsed} />
        </Box>
      </div>
    </div>
  );
}
