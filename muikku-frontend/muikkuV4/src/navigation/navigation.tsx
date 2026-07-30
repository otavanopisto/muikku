import { type User } from "src/services/auth";
import {
  IconHome,
  IconBuilding,
  IconMail,
  IconList,
  IconEdit,
  IconBell,
  IconCalendar,
} from "@tabler/icons-react";
import { type Params, type To } from "react-router";
import type { WorkspacePermissions } from "src/services/permissions";
import { StudentNavigationContent } from "~/src/pages/Guider/StudentNavigationContent";
import {
  hasUserPermission,
  hasWorkspacePermission,
  isActiveUser,
  isLoggedIn,
} from "~/src/services/access";

export const navigationBadges = [
  "communicatorUnread",
  "announcerUnread",
] as const;

export type NavigationContext = "environment" | "workspace";
export type NavigationBadgeKey = (typeof navigationBadges)[number];

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
  exactMatch?: boolean;
  badgeKey?: NavigationBadgeKey;
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
    label: "Ehdotetut kurssit",
    link: "/coursepicker?search=Suggested",
    queryName: "search",
    queryValue: "Suggested",
  },
  {
    type: "queryLink",
    label: "Omat kurssit",
    link: "/coursepicker?search=MyCourses",
    queryName: "search",
    queryValue: "MyCourses",
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
    link: "/communicator?tab=Inbox",
    queryName: "tab",
    queryValue: "Inbox",
  },
  {
    type: "queryLink",
    label: "Lukemattomat",
    link: "/communicator?tab=Unread",
    queryName: "tab",
    queryValue: "Unread",
  },
  {
    type: "queryLink",
    label: "Lähetetyt",
    link: "/communicator?tab=Sent",
    queryName: "tab",
    queryValue: "Sent",
  },
  {
    type: "queryLink",
    label: "Roskakori",
    link: "/communicator?tab=Trash",
    queryName: "tab",
    queryValue: "Trash",
  },
  {
    type: "link",
    label: "Tunnisteet",
    link: "/communicator/taglist",
    exactMatch: true,
  },
];

// Guider sub-items
export const guiderSubItems: NavigationItem[] = [
  { type: "link", label: "Yhteenveto", link: "/guider", exactMatch: true },
  {
    type: "link",
    label: "Opiskelijalistaus",
    link: "/guider/students",
    exactMatch: true,
  },
  { type: "link", label: "Tehtävät", link: "/guider/tasks", exactMatch: true },
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
    link: "/announcer?search=Active",
    queryName: "search",
    queryValue: "Active",
  },
  {
    type: "queryLink",
    label: "Vanhentuneet",
    link: "/announcer?search=Expired",
    queryName: "search",
    queryValue: "Expired",
  },
  {
    type: "queryLink",
    label: "Omat",
    link: "/announcer?search=My",
    queryName: "search",
    queryValue: "My",
  },
  {
    type: "queryLink",
    label: "Arkistoidut",
    link: "/announcer?search=Archived",
    queryName: "search",
    queryValue: "Archived",
  },
  {
    type: "link",
    label: "Kategoriat",
    link: "/announcer/categories",
    exactMatch: true,
  },
];

// Evaluation sub-items
export const evaluationSubItems: NavigationItem[] = [
  {
    type: "queryLink",
    label: "Yhteenveto",
    link: "/evaluation?tab=Overview",
    queryName: "tab",
    queryValue: "Overview",
  },
  {
    type: "queryLink",
    label: "Arviointipyynnöt",
    link: "/evaluation?tab=Requests",
    queryName: "tab",
    queryValue: "Requests",
  },
  {
    type: "queryLink",
    label: "Välipalautepyynnöt",
    link: "/evaluation?tab=FeedbackRequests",
    queryName: "tab",
    queryValue: "FeedbackRequests",
  },
  {
    type: "queryLink",
    label: "Täydennyspyynnöt",
    link: "/evaluation?tab=Supplements",
    queryName: "tab",
    queryValue: "Supplements",
  },
];

// Environment navigation items
export const navigationItemsEnviroment: NavigationItem[] = [
  {
    type: "link",
    label: "Etusivu",
    icon: IconHome,
    link: "/",
    canAccess: (user) => !isLoggedIn(user), // Only visible if user is unauthenticated
  },
  {
    type: "link",
    label: "Etusivu",
    icon: IconHome,
    link: "/dashboard",
    canAccess: isLoggedIn, // Only visible if user is authenticated
  },
  {
    type: "link",
    label: "Kalenteri",
    icon: IconCalendar,
    link: "/calendar",
    canAccess: isLoggedIn,
  },
  {
    type: "link",
    label: "Kurssit",
    icon: IconBuilding,
    link: "/coursepicker",
    canAccess: () => true,
  },
  {
    type: "link",
    label: "Viestit",
    icon: IconMail,
    link: "/communicator?tab=Inbox",
    badgeKey: "communicatorUnread",
    canAccess: (user) => isLoggedIn(user) && isActiveUser(user),
  },
  {
    type: "link",
    label: "Ohjaus",
    icon: IconList,
    link: "/guider",
    canAccess: (user) =>
      isLoggedIn(user) && hasUserPermission("GUIDER_VIEW", user),
    exactMatch: false,
  },
  {
    type: "link",
    label: "Tiedotteet",
    icon: IconBell,
    link: "/announcer",
    badgeKey: "announcerUnread",
    canAccess: (user) =>
      isLoggedIn(user) && hasUserPermission("ANNOUNCER_TOOL", user),
    exactMatch: false,
  },
  {
    type: "link",
    label: "Tiedotteet",
    icon: IconBell,
    link: "/announcements",
    canAccess: (user) =>
      isLoggedIn(user) && (user?.roles.includes("STUDENT") ?? false),
    exactMatch: false,
  },
  {
    type: "link",
    label: "Arviointi",
    icon: IconEdit,
    link: "/evaluation?tab=Overview",
    canAccess: (user) => hasUserPermission("EVALUATION_VIEW_INDEX", user),
    exactMatch: false,
  },
];

// Workspace navigation items
const navigationItemsWorkspace: NavigationItem[] = [
  {
    type: "link",
    label: "Etusivu",
    link: (params) => `/workspace/${params.workspaceUrlName}`,
    canAccess: (_, workspacePermissions) =>
      hasWorkspacePermission("WORKSPACE_HOME_VISIBLE", workspacePermissions), // Always visible
    exactMatch: true,
  },
  {
    type: "link",
    label: "Hallinta",
    link: (params) =>
      `/workspace/${params.workspaceUrlName}/workspaceManagement`,
    canAccess: (user, workspacePermissions) =>
      isLoggedIn(user) &&
      hasWorkspacePermission(
        "WORKSPACE_MANAGE_WORKSPACE",
        workspacePermissions
      ),
  },
  {
    type: "link",
    label: "Ohjeet",
    link: (params) => `/workspace/${params.workspaceUrlName}/workspaceHelp`,
    canAccess: (user, workspacePermissions) =>
      isLoggedIn(user) &&
      hasWorkspacePermission("WORKSPACE_GUIDES_VISIBLE", workspacePermissions),
  },
  {
    type: "link",
    label: "Materiaalit",
    link: (params) =>
      `/workspace/${params.workspaceUrlName}/workspaceMaterials`,
    canAccess: (user, workspacePermissions) =>
      isLoggedIn(user) &&
      hasWorkspacePermission(
        "WORKSPACE_MATERIALS_VISIBLE",
        workspacePermissions
      ),
  },
  {
    type: "link",
    label: "Oppimispäiväkirja",
    link: (params) => `/workspace/${params.workspaceUrlName}/workspaceJournal`,
    canAccess: (user, workspacePermissions) =>
      isLoggedIn(user) &&
      hasWorkspacePermission("WORKSPACE_JOURNAL_VISIBLE", workspacePermissions),
  },
  {
    type: "link",
    label: "Käyttäjät",
    link: (params) => `/workspace/${params.workspaceUrlName}/workspaceUsers`,
    canAccess: (user, workspacePermissions) =>
      isLoggedIn(user) &&
      hasWorkspacePermission("WORKSPACE_USERS_VISIBLE", workspacePermissions),
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
