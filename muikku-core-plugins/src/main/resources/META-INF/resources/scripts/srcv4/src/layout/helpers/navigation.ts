import type { User } from "~/src/services/auth";
import {
  IconHome,
  IconBuilding,
  IconMail,
  IconList,
  IconEdit,
  IconBuildingStore,
  IconUser,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { type Params } from "react-router";

export type NavigationContext = "environment" | "workspace";

export interface NavigationLink {
  label: string;
  link: string;
}

export interface NavigationItem {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  // For simple navigation links
  link?: string | ((params: Params) => string);
  onClick?: () => void;
  // For collapsible groups
  links?: NavigationLink[];
  initiallyOpened?: boolean;
  // Permission checking
  canAccess?: (user: User | null) => boolean;
  // Additional props
  active?: boolean;
}

export const navigationItemsEnviroment: NavigationItem[] = [
  {
    label: "Etusivu",
    icon: IconHome,
    link: "/",
    canAccess: () => true, // Always visible
  },
  {
    label: "Kurssipoimuri",
    icon: IconBuilding,
    link: "/coursepicker",
    canAccess: (user) => user?.loggedIn ?? false,
  },
  {
    label: "Viestin",
    icon: IconMail,
    link: "/messages",
    canAccess: (user) => user?.loggedIn ?? false,
  },
  {
    label: "Ohjaamo",
    icon: IconList,
    link: "/dashboard",
    canAccess: (user) => user?.loggedIn ?? false,
  },

  {
    label: "Arviointi",
    icon: IconEdit,
    links: [
      { label: "Arviointien hallinta", link: "/evaluation/manage" },
      { label: "Arviointiraportit", link: "/evaluation/reports" },
      { label: "Arviointiasetukset", link: "/evaluation/settings" },
    ],
    initiallyOpened: false,
    canAccess: (user) => user?.permissions?.EVALUATION_VIEW_INDEX ?? false,
  },
  {
    label: "Organisaation hallinta",
    icon: IconBuildingStore,
    links: [
      { label: "Organisaation tiedot", link: "/organization/info" },
      { label: "Käyttäjien hallinta", link: "/organization/users" },
      { label: "Roolien hallinta", link: "/organization/roles" },
      { label: "Oikeuksien hallinta", link: "/organization/permissions" },
    ],
    initiallyOpened: false,
    canAccess: (user) => user?.permissions?.ORGANIZATION_VIEW ?? false,
  },
  {
    label: "Omat tiedot",
    icon: IconUser,
    link: "/profile",
    canAccess: (user) => user?.loggedIn ?? false,
  },
  {
    label: "Asetukset",
    icon: IconSettings,
    link: "/settings",
    canAccess: (user) => user?.loggedIn ?? false,
  },
  {
    label: "Kirjaudu ulos",
    icon: IconLogout,
    onClick: () => {
      // This will be handled by the parent component
      console.log("Logout clicked");
    },
    canAccess: (user) => user?.loggedIn ?? false,
  },
];

const navigationItemsWorkspace: NavigationItem[] = [
  {
    label: "Etusivu",
    icon: IconHome,
    link: (params) => `/workspace/${params.workspaceUrlName}`,
    canAccess: (user) => user?.loggedIn ?? false, // Always visible
  },
  {
    label: "Asetukset",
    icon: IconSettings,
    link: (params) =>
      `/workspace/${params.workspaceUrlName}/workspaceManagement`,
    canAccess: (user) => user?.loggedIn ?? false, // Always visible
  },
];

/**
 * Filter navigation items based on user permissions
 * @param items - Navigation items to filter
 * @param user - Current user
 * @returns Filtered navigation items
 */
export function filterNavigationItems(
  items: NavigationItem[],
  user: User | null
): NavigationItem[] {
  return items.filter((item) => {
    if (!item.canAccess) {
      return true; // Show if no access check defined
    }
    return item.canAccess(user);
  });
}

/**
 * Get navigation items for a specific context (environment/workspace)
 * @param user - Current user
 * @param _context - Navigation context
 * @returns Filtered navigation items for the context
 */
export function getNavigationItems(
  user: User | null,
  context: NavigationContext = "environment"
): NavigationItem[] {
  if (context === "workspace") {
    return filterNavigationItems(navigationItemsWorkspace, user);
  }

  // You can add context-specific filtering here if needed
  // For now, we'll use the same items for both contexts
  return filterNavigationItems(navigationItemsEnviroment, user);
}
