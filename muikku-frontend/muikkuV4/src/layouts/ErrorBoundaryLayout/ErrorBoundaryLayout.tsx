import { userAtom } from "~/src/atoms/auth";
import { useAtomValue } from "jotai";
import {
  getNavigationItems,
  type NavigationContext,
} from "~/src/layouts/helpers/navigation";
import classes from "./ErrorBoundaryLayout.module.css";
import { workspacePermissionsAtom } from "~/src/atoms/permissions";
import { ErrorBoundary } from "~/src/pages/";
import { useAppLayout } from "~/src/hooks/useAppLayout";
import { SecondaryNavSection } from "~/src/layouts/SharedLayout/components/SecondaryNavSection";
import { PrimaryNavSection } from "~/src/layouts/SharedLayout/components/PrimaryNavSection";

/**
 * Shared layout props
 */
interface SharedLayoutProps {
  title?: string;
  context?: NavigationContext;
}

/**
 * Shared layout for the application
 * @param props - Shared layout props
 */
export function ErrorBoundaryLayout(props: SharedLayoutProps) {
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
        <ErrorBoundary />
      </main>
    </div>
  );
}
