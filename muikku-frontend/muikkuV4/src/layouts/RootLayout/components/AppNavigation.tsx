import { motion } from "framer-motion";
import type { NavigationItem } from "~/src/navigation/navigation";
import { MainNav } from "./MainNav";
import { SecondaryNav } from "./SecondaryNav";
import {
  getSecondaryNavWidth,
  NAV_V2_LAYOUT,
} from "../helpers/navigationLayout";
import classes from "./AppNavigation.module.css";
import { NAV_V2_TRANSITION } from "../helpers/navigationVariants";

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
 * Dual navigation shell (NavV2): Secondary always mounted; Main clips over it.
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
    ? NAV_V2_LAYOUT.mainCollapsed
    : NAV_V2_LAYOUT.panelWidth + NAV_V2_LAYOUT.mainCollapsed;
  const shellWidth = NAV_V2_LAYOUT.mainCollapsed + secondaryWidth;

  return (
    <motion.div
      className={classes.navWrapper}
      data-nav-shell
      animate={{ width: shellWidth }}
      transition={NAV_V2_TRANSITION}
    >
      <motion.div
        className={classes.secondaryNavLayer}
        style={{
          left: NAV_V2_LAYOUT.mainCollapsed,
          width: secondaryWidth,
          pointerEvents: hasSecondaryNav ? "auto" : "none",
        }}
        animate={{ opacity: hasSecondaryNav ? 1 : 0.35 }}
        transition={NAV_V2_TRANSITION}
        aria-hidden={!hasSecondaryNav}
      >
        <SecondaryNav
          title={secondaryTitle ?? ""}
          items={secondaryItems ?? []}
        />
      </motion.div>

      <motion.div
        className={classes.mainNavLayer}
        animate={{ width: mainWidth }}
        transition={NAV_V2_TRANSITION}
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
