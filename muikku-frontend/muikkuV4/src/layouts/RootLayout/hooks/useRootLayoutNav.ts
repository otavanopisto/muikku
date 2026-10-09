import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { IconBuilding } from "@tabler/icons-react";
import { userAtom } from "src/atoms/auth";
import { workspacePermissionsAtom } from "src/atoms/permissions";
import { workspaceInfoAtom } from "~/src/atoms/workspace";
import {
  getNavigationItems,
  type NavigationItem,
} from "~/src/navigation/navigation";
import { useDeepestHandleValue } from "~/src/router/hooks/useTypedMatches";

/**
 * Interface for the RootLayoutNavState.
 */
export interface RootLayoutNavState {
  mainItems: NavigationItem[];
  hasSecondaryNav: boolean;
  secondaryTitle?: string;
  secondaryItems?: NavigationItem[];
  customWidth?: number;
}

/**
 * Assembles main and secondary navigation data for RootLayout.
 */
export function useRootLayoutNav(): RootLayoutNavState {
  const user = useAtomValue(userAtom);
  const workspacePermissions = useAtomValue(workspacePermissionsAtom);
  const workspaceInfo = useAtomValue(workspaceInfoAtom);
  const secondaryNavFromHandle = useDeepestHandleValue("secondaryNav");

  const primaryNavItems = useMemo(
    () => getNavigationItems(user, workspacePermissions, "environment"),
    [user, workspacePermissions]
  );

  const workspaceNavigationItems = useMemo(
    () => getNavigationItems(user, workspacePermissions, "workspace"),
    [user, workspacePermissions]
  );

  const isWorkspaceRoute = secondaryNavFromHandle?.type === "workspace";

  const mainItems = useMemo(() => {
    const items = [...primaryNavItems];

    if (workspaceInfo) {
      items.push({
        type: "link",
        label: "Viimeisin työtila",
        description: workspaceInfo.name,
        icon: IconBuilding,
        link: `/workspace/${workspaceInfo.urlName}/`,
        canAccess: (_, workspacePermissions) =>
          workspacePermissions?.WORKSPACE_HOME_VISIBLE ?? false, // Always visible
      });
    }

    return items;
  }, [primaryNavItems, workspaceInfo]);

  const hasSecondaryNav = Boolean(secondaryNavFromHandle);

  const secondaryTitle = isWorkspaceRoute
    ? workspaceInfo?.name
    : secondaryNavFromHandle?.title;

  const secondaryItems = isWorkspaceRoute
    ? workspaceNavigationItems
    : secondaryNavFromHandle?.items;

  return {
    mainItems,
    hasSecondaryNav,
    secondaryTitle,
    secondaryItems,
    customWidth: secondaryNavFromHandle?.customWidth,
  };
}
