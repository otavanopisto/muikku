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
import { PrimaryNavSection } from "./components/PrimaryNavSection";
import { SecondaryNavSection } from "./components/SecondaryNavSection";
import { secondaryNavConfigAtom } from "~/src/atoms/layout";
import { useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Animation variants for primary navigation
const primaryNavVariants: Variants = {
  expanded: {
    width: "270px",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1], // Custom easing
    },
  },
  collapsed: {
    width: "60px",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
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
  //const [opened, { toggle }] = useDisclosure(); // Navbar state

  const secondaryNavConfig = useAtomValue(secondaryNavConfigAtom);
  const {
    primaryNavOpened,
    secondaryNavOpened,
    togglePrimaryNav,
    toggleSecondaryNav,
    closePrimaryNav,
    openSecondaryNav,
  } = useAppLayout();

  useEffect(() => {
    if (secondaryNavConfig && primaryNavOpened) {
      openSecondaryNav();
      closePrimaryNav();
    }
  }, [secondaryNavConfig, primaryNavOpened, openSecondaryNav, closePrimaryNav]);

  // Animation variants for secondary navigation
  const secondaryNavVariants: Variants = {
    open: {
      width: secondaryNavConfig?.customWidth
        ? `${secondaryNavConfig.customWidth}px`
        : "250px",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    closed: {
      width: "0px",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className={classes.appLayout}>
      <div className={classes.navigationContainer}>
        <motion.nav
          className={classes.primaryNavigation}
          variants={primaryNavVariants}
          animate={primaryNavOpened ? "expanded" : "collapsed"}
          initial={primaryNavOpened ? "expanded" : "collapsed"}
        >
          <PrimaryNavSection
            title={title}
            items={{
              environment: getNavigationItems(
                user,
                workspacePermissions,
                "environment"
              ),
              workspace: getNavigationItems(
                user,
                workspacePermissions,
                "workspace"
              ),
            }}
            collapsed={!primaryNavOpened} // Use desktop collapsed state
            onToggleCollapse={togglePrimaryNav} // Toggle desktop collapsed state
          />
        </motion.nav>
        <AnimatePresence mode="popLayout">
          {secondaryNavOpened && secondaryNavConfig && (
            <motion.nav
              className={classes.secondaryNavigation}
              variants={secondaryNavVariants}
              initial="closed"
              animate="open"
              exit="closed"
              aria-hidden={!secondaryNavOpened}
            >
              <SecondaryNavSection
                collapsed={!secondaryNavOpened} // Use desktop collapsed state
                onToggleCollapse={toggleSecondaryNav} // Toggle desktop collapsed state
              />
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
      <main className={classes.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
