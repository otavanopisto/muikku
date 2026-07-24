import { Outlet } from "react-router";
import { useAtomValue } from "jotai";
import { Box, Burger, Drawer } from "@mantine/core";
import { motion } from "framer-motion";
import { useAppLayout } from "src/hooks/useAppLayout";
import { asideConfigAtom } from "~/src/atoms/layout";
import { ErrorBoundary } from "~/src/pages";
import { AppAside } from "./components/AppAside";
import { useRootLayoutNav } from "./hooks/useRootLayoutNav";
import { useIsBreakpoint } from "~/src/hooks/use-is-breakpoint";
import classes from "./RootLayout.module.css";
import { AppNavigation } from "./components/AppNavigation";
import { NAV_V2_TRANSITION as NAV_TRANSITION } from "./helpers/navigationVariants";
import { getNavWidth } from "./helpers/navigationLayout";

/**
 * Props for the RootLayout component.
 */
interface RootLayoutProps {
  title?: string;
  isErrorBoundary?: boolean;
}

/**
 * Root layout component for the application.
 * @param props - Props for the RootLayout component.
 */
export function RootLayout(props: RootLayoutProps) {
  const { title = "Muikku V4", isErrorBoundary = false } = props;

  const nav = useRootLayoutNav();
  const asideConfig = useAtomValue(asideConfigAtom);
  const { navOpened, toggleNav, asideOpened, toggleAside } = useAppLayout();
  const isDesktop = useIsBreakpoint("min", 768);

  const navWidth = getNavWidth({
    hasSecondaryNav: nav.hasSecondaryNav,
    customWidth: nav.customWidth,
  });

  const navigationContent = (
    <AppNavigation
      appTitle={title}
      mainItems={nav.mainItems}
      hasSecondaryNav={nav.hasSecondaryNav}
      secondaryTitle={nav.secondaryTitle}
      secondaryItems={nav.secondaryItems}
      customWidth={nav.customWidth}
    />
  );

  return (
    <Box className={classes.appLayout}>
      <Box hiddenFrom="md" className={classes.mobileHeader}>
        <Burger
          opened={navOpened}
          onClick={toggleNav}
          size="sm"
          aria-label="Toggle navigation"
        />
        <span className={classes.headerTitle}>{title}</span>
      </Box>

      {/* <Drawer
        opened={navOpened}
        onClose={toggleNav}
        size={`${navWidth}px`}
        className={classes.mobileDrawer}
        hiddenFrom="md"
        
        classNames={{
          header: classes.mobileDrawerHeader,
          content: classes.mobileDrawerContent,
          body: classes.mobileDrawerBody,
        }}
      >
        {navigationContent}
      </Drawer> */}

      <Drawer.Root
        opened={navOpened}
        onClose={toggleNav}
        className={classes.mobileDrawer}
        size={`${navWidth}px`}
        hiddenFrom="md"
        position="left"
        classNames={{
          header: classes.mobileDrawerHeader,
          content: classes.mobileDrawerContent,
          body: classes.mobileDrawerBody,
        }}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Body>{navigationContent}</Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      {asideConfig && (
        <Drawer.Root
          opened={asideOpened}
          onClose={toggleAside}
          size={`${navWidth}px`}
          className={classes.mobileDrawer}
          hiddenFrom="md"
          position="right"
          classNames={{
            header: classes.mobileDrawerHeader,
            content: classes.mobileDrawerContent,
            body: classes.mobileDrawerBody,
          }}
        >
          <Drawer.Overlay />
          <Drawer.Content>
            <Drawer.Body>
              <AppAside>{asideConfig?.config.component}</AppAside>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      )}

      <Box
        visibleFrom="md"
        component={motion.div}
        className={classes.desktopNav}
        animate={{ width: navWidth }}
        transition={NAV_TRANSITION}
      >
        {navigationContent}
      </Box>

      <Box
        component={motion.main}
        className={classes.mainContent}
        animate={{
          marginLeft: isDesktop ? navWidth : 0,
          marginRight: isDesktop && asideConfig ? 400 : 0,
        }}
        transition={NAV_TRANSITION}
      >
        {isErrorBoundary ? <ErrorBoundary /> : <Outlet />}
      </Box>

      <Box visibleFrom="md">
        <AppAside>{asideConfig?.config.component}</AppAside>
      </Box>
    </Box>
  );
}
