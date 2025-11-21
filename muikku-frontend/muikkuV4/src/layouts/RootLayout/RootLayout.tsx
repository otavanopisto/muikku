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

  return (
    <div className={classes.appLayout}>
      <div className={classes.navigationContainer}>
        <nav
          className={`${classes.primaryNavigation} ${
            !primaryNavOpened ? classes.collapsed : ""
          }`}
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
        </nav>
        <nav
          aria-hidden={!secondaryNavOpened} // When user has no access to secondary navigation we hide it also from screen readers
          className={`${classes.secondaryNavigation} ${
            secondaryNavOpened ? classes.secondaryNavigationOpen : ""
          }`}
        >
          <SecondaryNavSection
            collapsed={!secondaryNavOpened} // Use desktop collapsed state
            onToggleCollapse={toggleSecondaryNav} // Toggle desktop collapsed state
          />
        </nav>
      </div>
      <main className={classes.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
