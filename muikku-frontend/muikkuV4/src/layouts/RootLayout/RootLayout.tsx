import React from "react";
import { Outlet } from "react-router";
import { userAtom } from "src/atoms/auth";
import { useAtomValue } from "jotai";
import {
  getNavigationItems,
  type NavigationContext,
} from "src/layouts/helpers/navigation";
import classes from "./RootLayout.module.css";
import { workspacePermissionsAtom } from "src/atoms/permissions";
import { useAppLayout } from "src/hooks/useAppLayout";
import { Box, Burger, Group, ScrollArea, Title } from "@mantine/core";
import { Drawer } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import { UserButton } from "~/src/components/UserButton/UserButton";
import { secondaryNavConfigAtom } from "~/src/atoms/layout";
import { NavbarQueryLink } from "~/src/components/NavbarQueryLink/NavbarQueryLink";
import { NavbarLink } from "~/src/components/NavbarLink/NavbarLink";
import { AnimatePresence, motion, type Variants } from "framer-motion";

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

/**
 * Root layout props
 */
interface RootLayoutProps {
  title?: string;
  context?: NavigationContext;
}

/**
 * Root layout for the application
 * @param props - Root layout props
 */
export function RootLayout(props: RootLayoutProps) {
  const { title = "Muikku V4" } = props;
  const user = useAtomValue(userAtom);
  const workspacePermissions = useAtomValue(workspacePermissionsAtom);
  const secondaryNavConfig = useAtomValue(secondaryNavConfigAtom);

  const { navOpened, toggleNav } = useAppLayout();

  const primaryNavItems = getNavigationItems(
    user,
    workspacePermissions,
    "environment"
  );

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
        {primaryNavItems.map((item) => {
          switch (item.type) {
            case "link":
              return (
                <NavbarLink
                  key={item.label}
                  {...item}
                  exactMatch
                  collapsed={collapsed}
                />
              );
            case "queryLink":
              return <NavbarQueryLink key={item.label} {...item} />;
          }
        })}
      </Box>

      <Box className={classes.mainNavFooter} data-collapsed={collapsed}>
        <UserButton collapsed={collapsed} />
      </Box>
    </Box>
  );

  /**
   * Render secondary navigation
   * @returns Secondary navigation component
   */
  const renderSecondaryNav = () => (
    <Box component="nav" className={classes.secondaryNav}>
      <Box
        className={classes.header}
        style={{
          height: "60px",
        }}
      >
        <Group p="sm" className={classes.headerContent}>
          <Group align="center" className={classes.titleGroup}>
            <Title order={3} className={classes.title}>
              {secondaryNavConfig?.config.title}
            </Title>
          </Group>
        </Group>
      </Box>

      <Box className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>
          {secondaryNavConfig?.config.items.map((item) => {
            switch (item.type) {
              case "link":
                return <NavbarLink key={item.label} {...item} exactMatch />;
              case "queryLink":
                return <NavbarQueryLink key={item.label} {...item} />;
              case "component":
                return (
                  <React.Fragment key={item.id}>
                    {item.component}
                  </React.Fragment>
                );
              default:
                return null;
            }
          })}
        </div>
      </Box>
    </Box>
  );

  // Navigation content component (reusable for both mobile drawer and desktop sidebar)
  const navigationContent = (
    <AnimatePresence mode="popLayout">
      {secondaryNavConfig ? (
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

      {/* Desktop: Navigation */}
      <Box visibleFrom="md" className={classes.desktopNav}>
        {navigationContent}
      </Box>
      {/* Main content */}
      <Box component="main" className={classes.mainContent}>
        <Outlet />
      </Box>
    </Box>
  );
}
