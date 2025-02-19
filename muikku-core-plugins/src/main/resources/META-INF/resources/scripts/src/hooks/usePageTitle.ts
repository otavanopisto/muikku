import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { titleManager } from "../util/title-manager";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { TFunction } from "i18next";
import { WorkspaceDataType } from "~/reducers/workspaces";

/**
 * Get localized route titles
 * @param t - Translation function
 * @param workspace - Workspace data
 * @returns Record of route paths to localized titles
 */
const getRouteTitles = (t: TFunction, workspace: WorkspaceDataType | null) => {
  let workspaceTitle = "";

  // Check and set workspace title
  if (workspace) {
    workspaceTitle = workspace.name;

    // Check and add name extension if available
    if (workspace.nameExtension) {
      workspaceTitle += ` (${workspace.nameExtension})`;
    }
  }

  const appName = t("appName", { ns: "pageTitles" });

  // Static routes
  const baseRoutes: Record<string, string> = {
    "/": `${t("home", { ns: "pageTitles" })} | ${appName}`,
    "/announcements": `${t("announcements", { ns: "pageTitles" })} | ${appName}`,
    "/announcer": `${t("announcer", { ns: "pageTitles" })} | ${appName}`,
    "/ceepos/done": `${t("ceeposDone", { ns: "pageTitles" })} | ${appName}`,
    "/ceepos/pay": `${t("ceeposPay", { ns: "pageTitles" })} | ${appName}`,
    "/communicator": `${t("communicator", { ns: "pageTitles" })} | ${appName}`,
    "/coursepicker": `${t("coursepicker", { ns: "pageTitles" })} | ${appName}`,
    "/discussions": `${t("discussions", { ns: "pageTitles" })} | ${appName}`,
    "/evaluation": `${t("evaluation", { ns: "pageTitles" })} | ${appName}`,
    "/guider": `${t("guider", { ns: "pageTitles" })} | ${appName}`,
    "/hops": `${t("hops", { ns: "pageTitles" })} | ${appName}`,
    "/organization": `${t("organization", { ns: "pageTitles" })} | ${appName}`,
    "/profile": `${t("profile", { ns: "pageTitles" })} | ${appName}`,
    "/studies": `${t("studies", { ns: "pageTitles" })} | ${appName}`,
  };

  // Dynamic workspace routes with pattern
  const workspaceRoutes: Record<string, string> = {
    "/workspace/:workspaceUrl": `${t("home", { ns: "pageTitles", context: "workspace", workspaceName: workspaceTitle })} | ${appName}`,
    "/workspace/:workspaceUrl/help": `${t("instructions", { ns: "pageTitles", context: "workspace", workspaceName: workspaceTitle })} | ${appName}`,
    "/workspace/:workspaceUrl/materials": `${t("materials", { ns: "pageTitles", context: "workspace", workspaceName: workspaceTitle })} | ${appName}`,
    "/workspace/:workspaceUrl/discussions": `${t("discussions", { ns: "pageTitles", context: "workspace", workspaceName: workspaceTitle })} | ${appName}`,
    "/workspace/:workspaceUrl/announcements": `${t("announcements", { ns: "pageTitles", context: "workspace", workspaceName: workspaceTitle })} | ${appName}`,
    "/workspace/:workspaceUrl/users": `${t("users", { ns: "pageTitles", workspaceName: workspaceTitle })} | ${appName}`,
    "/workspace/:workspaceUrl/journal": `${t("journal", { ns: "pageTitles", workspaceName: workspaceTitle })} | ${appName}`,
    "/workspace/:workspaceUrl/evaluation": `${t("evaluation", { ns: "pageTitles", context: "workspace", workspaceName: workspaceTitle })} | ${appName}`,
    "/workspace/:workspaceUrl/announcer": `${t("announcer", { ns: "pageTitles", context: "workspace", workspaceName: workspaceTitle })} | ${appName}`,
    "/workspace/:workspaceUrl/workspace-management": `${t("workspaceManagement", { ns: "pageTitles", context: "workspace", workspaceName: workspaceTitle })} | ${appName}`,
  };

  return { baseRoutes, workspaceRoutes };
};

/**
 * Convert route pattern to regex pattern
 * @param pattern - Route pattern
 * @returns Regex pattern
 */
const patternToRegex = (pattern: string): RegExp => {
  const regexPattern = pattern
    .replace(/:[^/]+/g, "[^/]+") // Replace :param with regex pattern
    .replace(/\//g, "\\/"); // Escape forward slashes
  return new RegExp(`^${regexPattern}$`);
};

/**
 * Find matching pattern from routes
 * @param pathname - Current pathname
 * @param routes - Routes
 * @returns Matching pattern
 */
const findMatchingPattern = (
  pathname: string,
  routes: Record<string, string>
): string | undefined =>
  Object.keys(routes).find((pattern) => patternToRegex(pattern).test(pathname));

/**
 * Hook for managing page title based on current route, notifications, and localization
 * @returns Current title and favicon state
 */
export function usePageTitle() {
  const location = useLocation();
  const { t } = useTranslation(["common"]);
  const [state, setState] = useState({
    title: titleManager.getCurrentTitle(),
  });

  // Get workspace data from Redux store
  const currentWorkspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );

  /**
   * Update the state with the new title
   * @param state - The new title state
   * @param state.title - The new title
   */
  const updateStateCallback = (state: { title: string }) => {
    setState(state);
  };

  // Subscribe to title/favicon changes
  useLayoutEffect(() => {
    titleManager.subscribe(updateStateCallback);

    // Cleanup on unmount
    return () => {
      titleManager.destroy();
    };
  }, []);

  // Update base title when route, workspace, or language changes
  useEffect(() => {
    const { baseRoutes, workspaceRoutes } = getRouteTitles(t, currentWorkspace);

    // First check static routes
    let newTitle = baseRoutes[location.pathname];

    // If not found in static routes, check workspace patterns
    if (!newTitle) {
      const matchingPattern = findMatchingPattern(
        location.pathname,
        workspaceRoutes
      );
      if (matchingPattern) {
        newTitle = workspaceRoutes[matchingPattern];
      }
    }

    // Fallback to app name if no match found
    if (!newTitle) {
      newTitle = t("appName", { ns: "pageTitles" });
    }

    titleManager.setBaseTitle(newTitle);
  }, [location, currentWorkspace, t]);

  return state;
}
