import { Outlet } from "react-router";
import { AppShell, Box, Burger, Group } from "@mantine/core";
import { ErrorBoundary } from "~/src/pages";
import { useRootLayoutNav } from "./hooks/useRootLayoutNav";
import { useIsBreakpoint } from "~/src/hooks/use-is-breakpoint";
import { AppNavigation } from "./components/AppNavigation";
import { getNavWidth } from "./helpers/navigationLayout";
import { useDisclosure, useDrag, useHeadroom } from "@mantine/hooks";
import classes from "./RootLayout.module.css";
import { useRef } from "react";
import { asideConfigAtom } from "~/src/atoms/layout";
import { useAtomValue } from "jotai";
import { useAppLayout } from "~/src/hooks/useAppLayout";

const CLOSE_THRESHOLD = 100;
const ASIDE_WIDTH = 300;

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

  // Reference to the navbar element
  const navbarEl = useRef<HTMLElement | null>(null);

  const nav = useRootLayoutNav();
  const asideConfig = useAtomValue(asideConfigAtom);
  const { asideOpened, toggleAside } = useAppLayout();
  const isDesktop = useIsBreakpoint("min", 768);
  const [opened, { toggle, close }] = useDisclosure(false, {
    onOpen: () => {
      if (asideOpened) {
        toggleAside();
      }
    },
  });
  const { pinned } = useHeadroom({ fixedAt: 120 });

  // Drag the navbar to close it
  const { ref: dragRef } = useDrag(
    ({ movement: [mx], velocity: [vx], last }) => {
      if (!opened || isDesktop) return;
      const el = navbarEl.current;
      if (!el) return;
      const offset = Math.min(0, mx);
      if (!last) {
        el.style.transition = "none";
        el.style.transform = `translateX(${offset}px)`;
        return;
      }
      const shouldClose = Math.abs(offset) > CLOSE_THRESHOLD || vx < -0.5;
      el.style.transition = "";
      el.style.transform = "";
      if (shouldClose) close();
    },
    { axis: "x", threshold: 8, enabled: opened && !isDesktop }
  );

  /**
   * Set the navbar reference and drag the navbar to close it.
   * @param node - The navbar element.
   */
  const setNavbarRef = (node: HTMLElement | null) => {
    navbarEl.current = node;
    dragRef(node);
  };

  // Get the width of the navigation
  const navWidth = getNavWidth({
    hasSecondaryNav: nav.hasSecondaryNav,
    customWidth: nav.customWidth,
  });

  // Does the aside exist?
  const asideExists = asideConfig !== null;

  // Is the mobile navigation open?
  const isMobileNavOpen = opened && !isDesktop;

  return (
    <AppShell
      layout="alt"
      header={{
        collapsed: isDesktop || !pinned,
        height: 60,
      }}
      navbar={{
        width: navWidth,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      aside={{
        width: ASIDE_WIDTH,
        breakpoint: "sm",
        collapsed: {
          desktop: !asideExists,
          mobile: !asideExists || !asideOpened,
        },
      }}
    >
      <AppShell.Header hiddenFrom="sm">
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} />
          Header
        </Group>
      </AppShell.Header>
      <AppShell.Navbar
        ref={setNavbarRef}
        styles={{
          navbar: {
            width: navWidth,
          },
        }}
      >
        <AppNavigation
          appTitle={title}
          mainItems={nav.mainItems}
          hasSecondaryNav={nav.hasSecondaryNav}
          secondaryTitle={nav.secondaryTitle}
          secondaryItems={nav.secondaryItems}
          customWidth={nav.customWidth}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        {isErrorBoundary ? <ErrorBoundary /> : <Outlet />}
      </AppShell.Main>
      <Box
        className={classes.backdrop}
        data-open={isMobileNavOpen || undefined}
        onClick={close}
        aria-hidden
      />
      <AppShell.Aside p="md" styles={{ aside: { width: ASIDE_WIDTH } }}>
        {asideConfig?.config.component}
      </AppShell.Aside>
    </AppShell>
  );
}
