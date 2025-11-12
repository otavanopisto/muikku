import { Outlet } from "react-router";
import { userAtom } from "~/src/atoms/auth";
import { useAtomValue } from "jotai";
import {
  getNavigationItems,
  type NavigationContext,
} from "~/src/layouts/helpers/navigation";
import classes from "./RootLayout.module.css";
import { workspacePermissionsAtom } from "~/src/atoms/permissions";
import { useAppLayout } from "~/src/hooks/useAppLayout";
import { PrimaryNavSection } from "./components/PrimaryNavSection";
import { SecondaryNavSection } from "./components/SecondaryNavSection";

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
  const {
    primaryNavOpened,
    secondaryNavOpened,
    togglePrimaryNav,
    toggleSecondaryNav,
    selectedNavItem,
  } = useAppLayout();

  return (
    <div className={classes.appLayout}>
      <nav className={classes.navigationContainer}>
        <div
          className={`${classes.primarySection} ${
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
        </div>
        <div
          className={`${classes.secondarySection} ${
            secondaryNavOpened ? classes.secondarySectionOpen : ""
          }`}
        >
          {secondaryNavOpened && (
            <SecondaryNavSection
              selectedItem={selectedNavItem}
              collapsed={!secondaryNavOpened} // Use desktop collapsed state
              onToggleCollapse={toggleSecondaryNav} // Toggle desktop collapsed state
            />
          )}
        </div>
      </nav>
      <main className={classes.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
