import { motion } from "framer-motion";
import type { NavigationItem } from "~/src/navigation/navigation";
import { MainNav } from "./MainNav";
import { SecondaryNav } from "./SecondaryNav";
import { getSecondaryNavWidth, NAV_LAYOUT } from "./navigationLayout";
import { NAV_TRANSITION } from "./navigationVariants";
import classes from "../RootLayout.module.css";

/**
 * Props for the AppNavigation component.
 */
interface AppNavigationProps {
  appTitle: string;
  mainItems: NavigationItem[];
  hasSecondaryNav: boolean;
  secondaryTitle?: string;
  secondaryItems?: NavigationItem[];
  customWidth?: number;
}

/**
 * Dual navigation shell: SecondaryNav stays mounted behind MainNav.
 * MainNav shrinks to reveal secondary on routes that need it.
 */
export function AppNavigation(props: AppNavigationProps) {
  const {
    appTitle,
    mainItems,
    hasSecondaryNav,
    secondaryTitle,
    secondaryItems,
    customWidth,
  } = props;

  const secondaryWidth = getSecondaryNavWidth(customWidth);
  const mainWidth = hasSecondaryNav
    ? NAV_LAYOUT.mainCollapsed
    : NAV_LAYOUT.mainExpanded;
  const shellWidth = hasSecondaryNav
    ? NAV_LAYOUT.mainCollapsed + secondaryWidth
    : NAV_LAYOUT.mainExpanded;

  return (
    <motion.div
      className={classes.navWrapper}
      animate={{ width: shellWidth }}
      transition={NAV_TRANSITION}
    >
      {/* Always mounted — under MainNav */}
      <motion.div
        className={classes.secondaryNavLayer}
        style={{
          left: NAV_LAYOUT.mainCollapsed,
          width: secondaryWidth,
          pointerEvents: hasSecondaryNav ? "auto" : "none",
        }}
        animate={{ opacity: hasSecondaryNav ? 1 : 0.35 }}
        transition={NAV_TRANSITION}
        aria-hidden={!hasSecondaryNav}
      >
        <SecondaryNav
          title={secondaryTitle ?? ""}
          items={secondaryItems ?? []}
        />
      </motion.div>

      {/* On top — opaque rail that reveals secondary when minimized */}
      <motion.div
        className={classes.mainNavLayer}
        animate={{ width: mainWidth }}
        transition={NAV_TRANSITION}
      >
        <MainNav
          title={appTitle}
          items={mainItems}
          collapsed={hasSecondaryNav}
        />
      </motion.div>
    </motion.div>
  );
}
