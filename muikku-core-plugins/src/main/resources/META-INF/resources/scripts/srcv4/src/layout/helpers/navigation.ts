import { AuthService, type User } from "~/src/services/auth";
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
  IconLogin,
  IconHelp,
  IconCalendar,
  IconBook,
} from "@tabler/icons-react";
import { type Params } from "react-router";
import type { WorkspacePermissions } from "~/src/services/permissions";

export type NavigationContext = "environment" | "workspace";

/**
 * NavigationLink - Interface for a navigation link (now supports all navigation features)
 */
export interface NavigationLink {
  label: string;
  // Navigation options
  link?: string | ((params: Params) => string);
  onClick?: () => void;
  // Query parameter navigation
  queryParams?: Record<string, string | number | boolean>;
  replaceState?: boolean;
  // State
  active?: boolean;
  loading?: boolean;
}

/**
 * BaseNavigationItem - Common properties for all navigation items
 */
interface BaseNavigationItem {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  // Navigation options
  link?: string | ((params: Params) => string);
  onClick?: () => void;
  // Query parameter navigation
  queryParams?: Record<string, string | number | boolean>;
  replaceState?: boolean;
  // Permission checking
  canAccess?: (
    user: User | null,
    workspacePermissions?: WorkspacePermissions | null
  ) => boolean;
  // Additional props
  active?: boolean;
  // Loading state for dynamic content
  loading?: boolean;
}

/**
 * NavigationLinkItem - Navigation link item
 */
export interface NavigationLinkItem extends BaseNavigationItem {
  type: "link";
}

/**
 * NavigationGroupItem - Navigation group item
 */
export interface NavigationGroupItem extends BaseNavigationItem {
  type: "group";
  links: NavigationLink[];
  initiallyOpened?: boolean;
  parentBehavior?: "link" | "toggle" | "both";
}

/**
 * NavigationItem - Discriminated union of navigation item types
 */
export type NavigationItem = NavigationLinkItem | NavigationGroupItem;

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
    type: "group",
    label: "Viestin",
    icon: IconMail,
    link: "/communicator",
    parentBehavior: "both",
    links: [
      { label: "Saapuneet", queryParams: { tab: "Inbox" } },
      { label: "Lukemattomat", queryParams: { tab: "Unread" } },
      { label: "Lähetetyt", queryParams: { tab: "Sent" } },
      { label: "Roskakori", queryParams: { tab: "Trash" } },
    ],
    initiallyOpened: false,
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
    type: "group",
    label: "Arviointi",
    icon: IconEdit,
    link: "/evaluation",
    parentBehavior: "both",
    links: [
      { label: "Arviointien hallinta", link: "/evaluation/manage" },
      { label: "Arviointiraportit", link: "/evaluation/reports" },
      { label: "Arviointiasetukset", link: "/evaluation/settings" },
    ],
    initiallyOpened: false,
    canAccess: (user) => user?.permissions?.EVALUATION_VIEW_INDEX ?? false,
  },
  {
    type: "group",
    label: "Organisaation hallinta",
    icon: IconBuildingStore,
    link: "/organization",
    parentBehavior: "both",
    links: [
      { label: "Organisaation tiedot", queryParams: { tab: "info" } },
      { label: "Käyttäjien hallinta", link: "/organization/users" },
      { label: "Roolien hallinta", link: "/organization/roles" },
      { label: "Oikeuksien hallinta", link: "/organization/permissions" },
    ],
    initiallyOpened: false,
    canAccess: (user) =>
      (user?.loggedIn && user?.permissions?.ORGANIZATION_VIEW) ?? false,
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
    onClick: () => {
      // This will be handled by the parent component
      AuthService.login();
    },
    canAccess: (user) => !(user?.loggedIn ?? false),
  },
  {
    type: "link",
    label: "Kirjaudu ulos",
    icon: IconLogout,
    onClick: () => {
      // This will be handled by the parent component
      AuthService.logout();
    },
    canAccess: (user) => user?.loggedIn ?? false,
  },
];

const navigationItemsWorkspace: NavigationItem[] = [
  {
    type: "link",
    label: "Etusivu",
    icon: IconHome,
    link: "/dashboard",
    canAccess: (user) => user?.loggedIn ?? false,
  },
  {
    type: "link",
    label: "Työtilan etusivu",
    icon: IconHome,
    link: (params) => `/workspace/${params.workspaceUrlName}`,
    canAccess: (_, workspacePermissions) =>
      workspacePermissions?.WORKSPACE_HOME_VISIBLE ?? false, // Always visible
  },
  {
    type: "link",
    label: "Työtilan hallinta",
    icon: IconBuildingStore,
    link: (params) =>
      `/workspace/${params.workspaceUrlName}/workspaceManagement`,
    canAccess: (user, workspacePermissions) =>
      (user?.loggedIn && workspacePermissions?.WORKSPACE_MANAGE_WORKSPACE) ??
      false, // Always visible
  },
  {
    type: "link",
    label: "Ohjeet",
    icon: IconHelp,
    link: (params) => `/workspace/${params.workspaceUrlName}/workspaceHelp`,
    canAccess: (user, workspacePermissions) =>
      (user?.loggedIn && workspacePermissions?.WORKSPACE_GUIDES_VISIBLE) ??
      false, // Always visible
  },
  {
    type: "link",
    label: "Materiaalit",
    icon: IconBook,
    link: (params) =>
      `/workspace/${params.workspaceUrlName}/workspaceMaterials`,
    canAccess: (user, workspacePermissions) =>
      (user?.loggedIn && workspacePermissions?.WORKSPACE_MATERIALS_VISIBLE) ??
      false, // Always visible
  },
  {
    type: "link",
    label: "Oppimispäiväkirja",
    icon: IconCalendar,
    link: (params) => `/workspace/${params.workspaceUrlName}/workspaceJournal`,
    canAccess: (user, workspacePermissions) =>
      (user?.loggedIn && workspacePermissions?.WORKSPACE_JOURNAL_VISIBLE) ??
      false, // Always visible
  },
  {
    type: "link",
    label: "Käyttäjät",
    icon: IconUser,
    link: (params) => `/workspace/${params.workspaceUrlName}/workspaceUsers`,
    canAccess: (user, workspacePermissions) =>
      (user?.loggedIn && workspacePermissions?.WORKSPACE_USERS_VISIBLE) ??
      false, // Always visible
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
    canAccess: (user) => user?.loggedIn ?? false,
  },
  {
    type: "link",
    label: "Kirjaudu ulos",
    icon: IconLogout,
    onClick: () => {
      // This will be handled by the parent component
      AuthService.logout();
    },
    canAccess: (user) => user?.loggedIn ?? false,
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
    if (!item.canAccess) {
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
