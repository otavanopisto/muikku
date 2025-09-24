/* eslint-disable @typescript-eslint/only-throw-error */
import { getAtomValue } from "../jotaiStore";
import { userAtom, userPermissionsAtom } from "../atoms/auth";
import { workspacePermissionsAtom } from "../atoms/permissions";
import type { MiddlewareFunction } from "react-router";
import type {
  UserPermissions,
  WorkspacePermissions,
} from "../services/permissions";
import type { User } from "../services/auth";

/**
 * Permission check configuration
 */
export interface PermissionConfig {
  /** Require authentication */
  requireAuth?: boolean;
  /** User permissions to check */
  userPermissions?: (keyof UserPermissions)[];
  /** Workspace permissions to check */
  workspacePermissions?: (keyof WorkspacePermissions)[];
  /** Redirect path if permission denied */
  redirectPath?: string;
  /** Login path if not authenticated */
  loginPath?: string;
  customCheck?: (
    user: User,
    permissions: UserPermissions,
    workspacePermissions: WorkspacePermissions | null
  ) => boolean;
}

/**
 * Creates a permission middleware based on your existing ProtectedRoute logic
 * @param config - Permission configuration
 * @returns MiddlewareFunction
 */
export function createPermissionMiddleware(
  config: PermissionConfig
): MiddlewareFunction {
  return async ({ request }, next) => {
    const user = getAtomValue(userAtom);
    const userPermissions = getAtomValue(userPermissionsAtom);
    const workspacePermissions = getAtomValue(workspacePermissionsAtom);

    const {
      requireAuth = false,
      userPermissions: requiredUserPermissions = [],
      workspacePermissions: requiredWorkspacePermissions = [],
      customCheck,
      redirectPath = "/",
      loginPath = `/login?redirectUrl=${encodeURIComponent(request.url)}`,
    } = config;

    // Check authentication
    if (requireAuth && !user?.loggedIn) {
      throw new Response("", {
        status: 302,
        headers: { Location: loginPath },
      });
    }

    // Check user permissions
    const hasUserPermissions = requiredUserPermissions.every(
      (permission) => userPermissions[permission]
    );

    if (!hasUserPermissions) {
      throw new Response("", {
        status: 302,
        headers: { Location: redirectPath },
      });
    }

    // Check workspace permissions (if workspacePermissions is loaded)
    const hasWorkspacePermissions =
      requiredWorkspacePermissions.length === 0 ||
      (workspacePermissions &&
        requiredWorkspacePermissions.every(
          (permission) => workspacePermissions[permission] === true
        ));

    if (!hasWorkspacePermissions) {
      throw new Response("", {
        status: 302,
        headers: { Location: redirectPath },
      });
    }

    // Custom permission check
    if (
      customCheck &&
      !customCheck(user!, userPermissions, workspacePermissions)
    ) {
      throw new Response("", {
        status: 302,
        headers: { Location: redirectPath },
      });
    }

    await next();
  };
}

/**
 * Pre-configured permission middlewares
 */
export const permissionMiddlewares = {
  // Basic authentication only
  requireAuth: createPermissionMiddleware({ requireAuth: true }),

  // UNAUTHENTICATED MIDDLEWARES

  // Home view
  homeView: createPermissionMiddleware({
    requireAuth: false,
    redirectPath: "/dashboard",
    customCheck(user) {
      return !user?.loggedIn;
    },
  }),

  // ENVIRONMENT PERMISSIONS MIDDLEWARES

  // Dashboard view
  dashboardView: createPermissionMiddleware({
    requireAuth: true,
  }),

  // Records view (matches your existing usage)
  recordsView: createPermissionMiddleware({
    requireAuth: true,
    userPermissions: ["TRANSCRIPT_OF_RECORDS_VIEW"],
  }),

  // Hops access (matches your existing usage)
  hopsAccess: createPermissionMiddleware({
    requireAuth: true,
    userPermissions: ["HOP_VIEW"],
  }),

  // Guardian view
  guardianView: createPermissionMiddleware({
    requireAuth: true,
    userPermissions: ["GUARDIAN_VIEW"],
  }),

  // Guider view
  guiderView: createPermissionMiddleware({
    requireAuth: true,
    userPermissions: ["GUIDER_VIEW"],
  }),

  // Organization view
  organizationView: createPermissionMiddleware({
    requireAuth: true,
    userPermissions: ["ORGANIZATION_VIEW"],
  }),

  // Evaluation view
  evaluationView: createPermissionMiddleware({
    requireAuth: true,
    userPermissions: ["EVALUATION_VIEW_INDEX"],
  }),

  // WORKSPACE PERMISSIONS MIDDLEWARES

  // Workspace home view
  workspaceHomeView: createPermissionMiddleware({
    requireAuth: true,
    workspacePermissions: ["WORKSPACE_HOME_VISIBLE"],
  }),

  // Workspace management view
  workspaceManagementView: createPermissionMiddleware({
    requireAuth: true,
    workspacePermissions: ["WORKSPACE_MANAGE_WORKSPACE"],
  }),

  // Workspace evaluation view
  workspaceEvaluationView: createPermissionMiddleware({
    requireAuth: true,
    workspacePermissions: ["WORKSPACE_ACCESS_EVALUATION"],
  }),

  // Custom permission checker
  custom: createPermissionMiddleware,
};
