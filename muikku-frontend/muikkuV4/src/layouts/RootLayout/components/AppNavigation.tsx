import { motion } from "framer-motion";
import type { NavigationItem } from "~/src/navigation/navigation";
import { MainNav } from "./MainNav";
import { SecondaryNav } from "./SecondaryNav";
import classes from "./AppNavigation.module.css";
import { NAV_TRANSITION } from "../helpers/navigationVariants";

const DEFAULT_COLLAPSED_WIDTH = 64;

/**
 * Props for the AppNavigation component.
 */
interface AppNavigationProps {
  appTitle: string;
  mainItems: NavigationItem[];
  hasSecondaryNav: boolean;
  secondaryTitle?: string;
  secondaryItems?: NavigationItem[];
  collapsedWidth?: number;
}

/**
 * Dual navigation shell (NavV2): Secondary always mounted; Main clips over it.
 */
export function AppNavigation(props: AppNavigationProps) {
  const {
    appTitle,
    mainItems,
    hasSecondaryNav,
    secondaryTitle,
    secondaryItems,
    collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
  } = props;

  const mainWidth = hasSecondaryNav ? collapsedWidth : "100%";

  return (
    <motion.div className={classes.navWrapper}>
      <motion.div
        className={classes.secondaryNavLayer}
        animate={{ opacity: hasSecondaryNav ? 1 : 0.35 }}
        transition={NAV_TRANSITION}
        aria-hidden={!hasSecondaryNav}
        data-secondary-nav={hasSecondaryNav ? "true" : "false"}
      >
        <SecondaryNav
          title={secondaryTitle ?? ""}
          items={secondaryItems ?? []}
        />
      </motion.div>

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
