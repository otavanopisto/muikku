import type { User } from "src/services/auth";
import type {
  UserPermissions,
  WorkspacePermissions,
} from "src/services/permissions";

/**
 * AccessCheck - Shared signature for nav canAccess and optional middleware pieces
 */
export type AccessCheck = (
  user: User | null,
  workspacePermissions?: WorkspacePermissions | null
) => boolean;

/**
 * User is logged in
 */
export const isLoggedIn = (user: User | null): boolean =>
  user?.loggedIn ?? false;

/**
 * User is active (e.g. communicator)
 */
export const isActiveUser = (user: User | null): boolean =>
  user?.isActive ?? false;

/**
 * User has a specific user-level permission
 * @param permission - User permission key
 */
export const hasUserPermission = (
  permission: keyof UserPermissions,
  user: User | null
) => user?.permissions?.[permission] ?? false;

/**
 * Workspace has a specific workspace-level permission
 * @param permission - Workspace permission key
 */
export const hasWorkspacePermission = (
  permission: keyof WorkspacePermissions,
  workspacePermissions?: WorkspacePermissions | null
) => workspacePermissions?.[permission] ?? false;
