import { Outlet, useLocation } from "react-router";
import { userAtom } from "src/atoms/auth";
import { useAtomValue } from "jotai";
import {
  getNavigationItems,
  type NavigationItem,
} from "src/layouts/helpers/navigation";
import classes from "./RootLayout.module.css";
import { workspacePermissionsAtom } from "src/atoms/permissions";
import { useAppLayout } from "src/hooks/useAppLayout";
import { Box, Burger, Group, ScrollArea, Title } from "@mantine/core";
import { Drawer } from "@mantine/core";
import { IconBuilding, IconHome } from "@tabler/icons-react";
import { UserButton } from "~/src/components/UserButton/UserButton";
import { asideConfigAtom, secondaryNavConfigAtom } from "~/src/atoms/layout";
import { NavbarQueryLink } from "~/src/components/NavbarQueryLink/NavbarQueryLink";
import { NavbarLink } from "~/src/components/NavbarLink/NavbarLink";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { workspaceInfoAtom } from "~/src/atoms/workspace";
import { ErrorBoundary } from "~/src/pages";
import { useMemo } from "react";

const navigationVariants: Variants = {
  collapsed: {
    x: -250,
    width: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  expanded: {
    x: 0,
    width: 250,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const navigationItemVariants: Variants = {
  entering: {
    y: 20,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

/**
 * Root layout props
 */
interface RootLayoutProps {
  title?: string;
  isErrorBoundary?: boolean;
}

/**
 * Root layout for the application
 * @param props - Root layout props
 */
export function RootLayout(props: RootLayoutProps) {
  const { title = "Muikku V4", isErrorBoundary = false } = props;

  const location = useLocation();

  const user = useAtomValue(userAtom);
  const workspacePermissions = useAtomValue(workspacePermissionsAtom);
  const secondaryNavConfig = useAtomValue(secondaryNavConfigAtom);
  const asideConfig = useAtomValue(asideConfigAtom);
  const workspaceInfo = useAtomValue(workspaceInfoAtom);

  const { navOpened, toggleNav, asideOpened, toggleAside } = useAppLayout();

  // Memoized primary navigation items
  const primaryNavItems = useMemo(
    () => getNavigationItems(user, workspacePermissions, "environment"),
    [user, workspacePermissions]
  );

  // Memoized workspace navigation items
  const workspaceNavigationItems = useMemo(
    () => getNavigationItems(user, workspacePermissions, "workspace"),
    [user, workspacePermissions]
  );

  // Memoized is workspace route
  const isWorkspaceRoute = useMemo(
    () => location.pathname.startsWith("/workspace"),
    [location.pathname]
  );

  // Memoized updated items for main navigation
  const updatedItems = useMemo(() => {
    const items = [...primaryNavItems];
    if (workspaceInfo) {
      items.push({
        type: "link",
        label: "Viimeisin työtila",
        description: workspaceInfo.name,
        icon: IconBuilding,
        link: `/workspace/${workspaceInfo.urlName}/`,
        canAccess: (_, workspacePermissions) =>
          workspacePermissions?.WORKSPACE_HOME_VISIBLE ?? false, // Always visible
      });
    }
    return items;
  }, [primaryNavItems, workspaceInfo]);

  /**
   * Render navigation item
   * @param item - Navigation item
   * @returns Navigation item component
   */
  const renderNavItem = (
    item: NavigationItem,
    secondaryNav: boolean,
    collapsed = false
  ) => {
    switch (item.type) {
      case "link":
        return (
          <motion.li
            key={item.label}
            variants={secondaryNav ? navigationItemVariants : undefined}
            initial="entering"
            animate="visible"
          >
            <NavbarLink
              key={item.label}
              {...item}
              exactMatch
              collapsed={collapsed}
            />
          </motion.li>
        );
      case "queryLink":
        return (
          <motion.li
            key={item.label}
            variants={secondaryNav ? navigationItemVariants : undefined}
            initial="entering"
            animate="visible"
          >
            <NavbarQueryLink key={item.label} {...item} />
          </motion.li>
        );
      case "component":
        return (
          <motion.li
            key={item.id}
            variants={secondaryNav ? navigationItemVariants : undefined}
            initial="entering"
            animate="visible"
          >
            {item.component}
          </motion.li>
        );
      default:
        return null;
    }
  };

  /**
   * Render main navigation
   * @param collapsed - Whether the navigation is collapsed
   * @returns Main navigation component
   */
  const renderMainNav = (collapsed: boolean) => (
    <Box component="nav" className={classes.mainNav}>
      <Box
        className={classes.mainNavHeader}
        style={{
          height: "60px",
        }}
        data-collapsed={collapsed}
      >
        <Group p="sm" className={classes.headerContent}>
          <Group align="center" className={classes.titleGroup}>
            <IconHome size={35} />

            {!collapsed && (
              <Title
                order={3}
                className={classes.title}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {title}
              </Title>
            )}
          </Group>
        </Group>
      </Box>

      <Box
        className={classes.mainNavLinks}
        component={ScrollArea}
        data-collapsed={collapsed}
      >
        <ul className={classes.linksInner}>
          {updatedItems.map((item) => renderNavItem(item, false, collapsed))}
        </ul>
      </Box>

      <Box className={classes.mainNavFooter} data-collapsed={collapsed}>
        <UserButton collapsed={collapsed} />
      </Box>
    </Box>
  );

  /**
   * Render secondary navigation. Content in workspace route is by default
   * workspace navigation items. Otherwise it's secondary nav config.
   * @returns Secondary navigation component
   */
  const renderSecondaryNav = () => {
    const title = isWorkspaceRoute
      ? workspaceInfo?.name
      : secondaryNavConfig?.config.title;
    const items = isWorkspaceRoute
      ? workspaceNavigationItems
      : secondaryNavConfig?.config.items;

    return (
      <Box component="nav" className={classes.secondaryNav}>
        <Box
          className={classes.header}
          style={{
            height: "60px",
          }}
        >
          <Group p="sm" className={classes.headerContent}>
            <Group align="center" className={classes.titleGroup}>
              <motion.div
                key={title}
                variants={navigationItemVariants}
                initial="entering"
                animate="visible"
              >
                <Title order={3} className={classes.title}>
                  {title ?? ""}
                </Title>
              </motion.div>
            </Group>
          </Group>
        </Box>

        <Box className={classes.links} component={ScrollArea}>
          <ul className={classes.linksInner}>
            {(items ?? []).map((item) => renderNavItem(item, true))}
          </ul>
        </Box>
      </Box>
    );
  };

  // Navigation content component (reusable for both mobile drawer and desktop sidebar)
  const navigationContent = (
    <AnimatePresence mode="popLayout">
      {secondaryNavConfig || isWorkspaceRoute ? (
        <motion.div
          key="Nav-with-secondary"
          className={classes.navWrapper}
          variants={navigationVariants}
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
        >
          {renderMainNav(true)}
          {renderSecondaryNav()}
        </motion.div>
      ) : (
        <motion.div
          key="Nav-without-secondary"
          className={classes.navWrapper}
          variants={navigationVariants}
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
        >
          {renderMainNav(false)}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <Box className={classes.appLayout}>
      {/* Mobile Header with Burger Menu */}
      <Box hiddenFrom="md" className={classes.mobileHeader}>
        <Burger
          opened={navOpened}
          onClick={toggleNav}
          size="sm"
          aria-label="Toggle navigation"
        />
        <span className={classes.headerTitle}>{title}</span>
      </Box>
      {/* Mobile: Drawer for Navigation */}
      <Drawer
        opened={navOpened}
        onClose={toggleNav}
        size="xs"
        className={classes.mobileDrawer}
        hiddenFrom="md"
        classNames={{
          header: classes.mobileDrawerHeader,
          content: classes.mobileDrawerContent,
          body: classes.mobileDrawerBody,
        }}
      >
        {navigationContent}
      </Drawer>

      {/* Mobile: Drawer for Right Aside */}
      {asideConfig && (
        <Drawer
          opened={asideOpened}
          onClose={toggleAside}
          size="xs"
          className={classes.mobileDrawer}
          hiddenFrom="md"
          position="right"
          classNames={{
            header: classes.mobileDrawerHeader,
            content: classes.mobileDrawerContent,
            body: classes.mobileDrawerBody,
          }}
        >
          {asideConfig.config.component}
        </Drawer>
      )}

      {/* Desktop: Navigation */}
      <Box visibleFrom="md" className={classes.desktopNav}>
        {navigationContent}
      </Box>
      {/* Main content */}
      <motion.main
        className={classes.mainContent}
        animate={{
          marginRight: asideConfig ? 400 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        {isErrorBoundary ? <ErrorBoundary /> : <Outlet />}
      </motion.main>

      {/* Desktop: Aside with animation */}
      <Box visibleFrom="md">
        <AnimatePresence>
          {asideConfig && (
            <motion.aside
              key="aside"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={classes.desktopAside}
            >
              {asideConfig.config.component}
            </motion.aside>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
