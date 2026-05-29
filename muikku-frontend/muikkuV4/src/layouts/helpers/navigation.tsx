import { type User } from "src/services/auth";
import {
  IconHome,
  IconBuilding,
  IconMail,
  IconList,
  IconEdit,
  IconUser,
  IconSettings,
  IconLogout,
  IconLogin,
} from "@tabler/icons-react";
import { type Params, type To } from "react-router";
import type { WorkspacePermissions } from "src/services/permissions";
import { StudentNavigationContent } from "src/router/components/StudentNavigationContent/StudentNavigationContent";

export type NavigationContext = "environment" | "workspace";

/**
 * BaseNavigationItem - Base interface for all navigation items
 */
export interface BaseNavigationItem {
  label: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.FC<any>;
  canAccess?: (
    user: User | null,
    workspacePermissions?: WorkspacePermissions | null
  ) => boolean;
}

/**
 * NavigationLink - Interface for navigation link
 */
export interface NavigationLink extends BaseNavigationItem {
  type: "link";
  link: To | ((params: Params) => To);
  onClick?: () => void;
  replaceState?: boolean;
  active?: boolean;
  loading?: boolean;
}

/**
 * NavigationQueryLink - Interface for navigation query link
 */
export interface NavigationQueryLink extends BaseNavigationItem {
  type: "queryLink";
  link: To | ((params: Params) => To);
  queryName: string;
  queryValue: string;
}

/**
 * NavigationDynamicContent - Interface for navigation dynamic content
 */
export interface NavigationDynamicContent {
  type: "component";
  id: string;
  component: React.ReactNode;
}

// Union for any navigation item
export type NavigationItem =
  | NavigationLink
  | NavigationQueryLink
  | NavigationDynamicContent;

// Coursepicker sub-items
export const coursepickerSubItems: NavigationItem[] = [
  {
    type: "queryLink",
    label: "Kaikki kurssit",
    link: "/coursepicker?search=All",
    queryName: "search",
    queryValue: "All",
  },
  {
    type: "queryLink",
    label: "Omat kurssit",
    link: "/coursepicker?search=MyCourses",
    queryName: "search",
    queryValue: "Coursepicker",
  },
  {
    type: "queryLink",
    label: "Julkaisemattomat kurssit",
    link: "/coursepicker?search=Unpublished",
    queryName: "search",
    queryValue: "Unpublished",
  },
];

// Communicator sub-items
export const communicatorSubItems: NavigationItem[] = [
  {
    type: "queryLink",
    label: "Saapuneet",
    link: "?tab=Inbox",
    queryName: "tab",
    queryValue: "Inbox",
  },
  {
    type: "queryLink",
    label: "Lukemattomat",
    link: "?tab=Unread",
    queryName: "tab",
    queryValue: "Unread",
  },
  {
    type: "queryLink",
    label: "Lähetetyt",
    link: "?tab=Sent",
    queryName: "tab",
    queryValue: "Sent",
  },
  {
    type: "queryLink",
    label: "Roskakori",
    link: "?tab=Trash",
    queryName: "tab",
    queryValue: "Trash",
  },
];

// Guider sub-items
export const guiderSubItems: NavigationItem[] = [
  { type: "link", label: "Opiskelijalistaus", link: "/guider" },
  { type: "link", label: "Tehtävät", link: "/guider/tasks" },
  {
    type: "component",
    id: "guider-student_item",
    component: <StudentNavigationContent />,
  },
];

// Announcer sub-items
export const announcerSubItems: NavigationItem[] = [
  {
    type: "queryLink",
    label: "Aktiiviset",
    link: "/announcements?search=Active",
    queryName: "search",
    queryValue: "Active",
  },
  {
    type: "queryLink",
    label: "Vanhentuneet",
    link: "/announcements?search=Expired",
    queryName: "search",
    queryValue: "Expired",
  },
  {
    type: "queryLink",
    label: "Omat",
    link: "/announcements?search=My",
    queryName: "search",
    queryValue: "My",
  },
  {
    type: "queryLink",
    label: "Arkistoidut",
    link: "/announcements?search=Archived",
    queryName: "search",
    queryValue: "Archived",
  },
];

// Evaluation sub-items
export const evaluationSubItems: NavigationItem[] = [
  {
    type: "link",
    label: "Yhteenveto",
    link: "/evaluation",
  },
];

// Environment navigation items
export const navigationItemsEnviroment: NavigationItem[] = [
  {
    type: "link",
    label: "Etusivu",
    icon: IconHome,
    link: "/",
    canAccess: (user) => !(user?.loggedIn ?? false), // Only visible if user is unauthenticated
  },
  {
    type: "link",
    label: "Etusivu",
    icon: IconHome,
    link: "/dashboard",
    canAccess: (user) => user?.loggedIn ?? false, // Only visible if user is authenticated
  },
  {
    type: "link",
    label: "Kurssipoimuri",
    icon: IconBuilding,
    link: "/coursepicker",
    canAccess: () => true,
  },
  {
    type: "link",
    label: "Viestin",
    icon: IconMail,
    link: "/communicator?tab=Inbox",
    canAccess: (user) => (user?.loggedIn && user?.isActive) ?? false,
  },
  {
    type: "link",
    label: "Ohjaamo",
    icon: IconList,
    link: "/guider",
    canAccess: (user) =>
      (user?.loggedIn && user?.permissions.GUIDER_VIEW) ?? false,
  },

  {
    type: "link",
    label: "Arviointi",
    icon: IconEdit,
    link: "/evaluation",
    canAccess: (user) => user?.permissions?.EVALUATION_VIEW_INDEX ?? false,
  },
  {
    type: "link",
    label: "Omat tiedot",
    icon: IconUser,
    link: "/profile",
    canAccess: (user) => user?.loggedIn ?? false,
  },
  {
    type: "link",
    label: "Asetukset",
    icon: IconSettings,
    link: "/appSettings",
    canAccess: () => true,
  },
  {
    type: "link",
    label: "Kirjaudu sisään",
    icon: IconLogin,
    link: "/login",
    canAccess: (user) => !(user?.loggedIn ?? false),
  },
  {
    type: "link",
    label: "Kirjaudu ulos",
    icon: IconLogout,
    link: "/logout",
    canAccess: (user) => user?.loggedIn ?? false,
  },
];

// Workspace navigation items
const navigationItemsWorkspace: NavigationItem[] = [
  {
    type: "link",
    label: "Etusivu",
    link: (params) => `/workspace/${params.workspaceUrlName}`,
    canAccess: (_, workspacePermissions) =>
      workspacePermissions?.WORKSPACE_HOME_VISIBLE ?? false, // Always visible
  },
  {
    type: "link",
    label: "Hallinta",
    link: (params) =>
      `/workspace/${params.workspaceUrlName}/workspaceManagement`,
    canAccess: (user, workspacePermissions) =>
      (user?.loggedIn && workspacePermissions?.WORKSPACE_MANAGE_WORKSPACE) ??
      false, // Always visible
  },
  {
    type: "link",
    label: "Ohjeet",
    link: (params) => `/workspace/${params.workspaceUrlName}/workspaceHelp`,
    canAccess: (user, workspacePermissions) =>
      (user?.loggedIn && workspacePermissions?.WORKSPACE_GUIDES_VISIBLE) ??
      false, // Always visible
  },
  {
    type: "link",
    label: "Materiaalit",
    link: (params) =>
      `/workspace/${params.workspaceUrlName}/workspaceMaterials`,
    canAccess: (user, workspacePermissions) =>
      (user?.loggedIn && workspacePermissions?.WORKSPACE_MATERIALS_VISIBLE) ??
      false, // Always visible
  },
  {
    type: "link",
    label: "Oppimispäiväkirja",
    link: (params) => `/workspace/${params.workspaceUrlName}/workspaceJournal`,
    canAccess: (user, workspacePermissions) =>
      (user?.loggedIn && workspacePermissions?.WORKSPACE_JOURNAL_VISIBLE) ??
      false, // Always visible
  },
  {
    type: "link",
    label: "Käyttäjät",
    link: (params) => `/workspace/${params.workspaceUrlName}/workspaceUsers`,
    canAccess: (user, workspacePermissions) =>
      (user?.loggedIn && workspacePermissions?.WORKSPACE_USERS_VISIBLE) ??
      false, // Always visible
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
  user: User | null,
  workspacePermissions?: WorkspacePermissions | null
): NavigationItem[] {
  return items.filter((item) => {
    if (!("canAccess" in item) || !item.canAccess) {
      return true; // Show if no access check defined
    }
    return item.canAccess(user, workspacePermissions);
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
  workspacePermissions?: WorkspacePermissions | null,
  context: NavigationContext = "environment"
): NavigationItem[] {
  if (context === "workspace") {
    return filterNavigationItems(
      navigationItemsWorkspace,
      user,
      workspacePermissions
    );
  }

  // You can add context-specific filtering here if needed
  // For now, we'll use the same items for both contexts
  return filterNavigationItems(navigationItemsEnviroment, user);
}
