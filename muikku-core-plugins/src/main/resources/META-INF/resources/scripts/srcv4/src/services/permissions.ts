import type { UserWhoAmIServices } from "~/generated/client";

/**
 * User permissions
 */
export type UserPermissions = ReturnType<
  typeof PermissionsService.transformUserPermissions
>;

/**
 * Workspace permissions
 */
export type WorkspacePermissions = ReturnType<
  typeof PermissionsService.transformWorkspacePermissions
>;

/**
 * Permissions service
 */
export class PermissionsService {
  /**
   * Transform the user permissions
   * @param permissions - The permissions
   * @param services - The services
   * @returns The transformed permissions
   */
  static transformUserPermissions(
    permissions: Set<string> | null,
    services: UserWhoAmIServices | null
  ) {
    return {
      ANNOUNCER_CAN_PUBLISH_ENVIRONMENT:
        permissions?.has("CREATE_ANNOUNCEMENT") ?? false,
      ANNOUNCER_CAN_PUBLISH_GROUPS:
        permissions?.has("CREATE_ANNOUNCEMENT") ?? false,
      ANNOUNCER_CAN_PUBLISH_WORKSPACES: true,
      ANNOUNCER_TOOL: permissions?.has("ANNOUNCER_TOOL") ?? false,
      CHAT_MANAGE_PUBLIC_ROOMS:
        permissions?.has("CHAT_MANAGE_PUBLIC_ROOMS") ?? false,
      COMMUNICATOR_GROUP_MESSAGING:
        permissions?.has("COMMUNICATOR_GROUP_MESSAGING") ?? false,
      EVALUATION_VIEW_INDEX: permissions?.has("ACCESS_EVALUATION") ?? false,
      FORUM_LOCK_STICKY_PERMISSION:
        permissions?.has("FORUM_LOCK_OR_STICKIFY_MESSAGES") ?? false,
      FORUM_SHOW_FULL_NAME_PERMISSION:
        permissions?.has("FORUM_SHOW_FULL_NAMES") ?? false,
      FORUM_UPDATEENVIRONMENTFORUM:
        permissions?.has("FORUM_UPDATEENVIRONMENTFORUM") ?? false,
      GUARDIAN_VIEW: permissions?.has("GUARDIAN_VIEW") ?? false,
      GUIDER_VIEW: permissions?.has("GUIDER_VIEW") ?? false,
      ORGANIZATION_VIEW: permissions?.has("ORGANIZATION_VIEW") ?? false,
      TRANSCRIPT_OF_RECORDS_VIEW:
        permissions?.has("TRANSCRIPT_OF_RECORDS_VIEW") ?? false,
      LIST_USER_ORDERS: permissions?.has("LIST_USER_ORDERS") ?? false,
      FIND_ORDER: permissions?.has("FIND_ORDER") ?? false,
      REMOVE_ORDER: permissions?.has("REMOVE_ORDER") ?? false,
      CREATE_ORDER: permissions?.has("CREATE_ORDER") ?? false,
      PAY_ORDER: permissions?.has("PAY_ORDER") ?? false,
      LIST_PRODUCTS: permissions?.has("LIST_PRODUCTS") ?? false,
      COMPLETE_ORDER: permissions?.has("COMPLETE_ORDER") ?? false,
      FORUM_ACCESSENVIRONMENTFORUM:
        permissions?.has("FORUM_ACCESSENVIRONMENTFORUM") ?? false,
      FORUM_CREATEENVIRONMENTFORUM:
        permissions?.has("FORUM_CREATEENVIRONMENTFORUM") ?? false,
      FORUM_DELETEENVIRONMENTFORUM:
        permissions?.has("FORUM_DELETEENVIRONMENTFORUM") ?? false,
      WORKLIST_AVAILABLE: services?.worklist?.isAvailable ?? false,
    };
  }

  /**
   * Transform the workspace permissions
   * @param permissions - The permissions
   * @returns The transformed permissions
   */
  static transformWorkspacePermissions(permissions: string[] | null) {
    return {
      WORKSPACE_ACCESS_EVALUATION:
        permissions?.includes("ACCESS_WORKSPACE_EVALUATION") ?? false,
      WORKSPACE_ANNOUNCER_TOOL:
        permissions?.includes("WORKSPACE_ANNOUNCER_TOOL") ?? false,
      WORKSPACE_CAN_PUBLISH:
        permissions?.includes("PUBLISH_WORKSPACE") ?? false,
      WORKSPACE_DELETE_FORUM_THREAD:
        permissions?.includes("FORUM_DELETE_WORKSPACE_MESSAGES") ?? false,
      WORKSPACE_DISCUSSIONS_VISIBLE:
        permissions?.includes("FORUM_ACCESSWORKSPACEFORUMS") ?? false,
      WORKSPACE_GUIDES_VISIBLE: true,
      WORKSPACE_HOME_VISIBLE: true,
      WORKSPACE_IS_WORKSPACE_STUDENT:
        permissions?.includes("IS_WORKSPACE_STUDENT") ?? false,
      WORKSPACE_JOURNAL_VISIBLE:
        permissions?.includes("ACCESS_WORKSPACE_JOURNAL") ?? false,
      WORKSPACE_LIST_WORKSPACE_ANNOUNCEMENTS:
        permissions?.includes("LIST_WORKSPACE_ANNOUNCEMENTS") ?? false,
      WORKSPACE_MANAGE_PERMISSIONS:
        permissions?.includes("WORKSPACE_MANAGE_PERMISSIONS") ?? false,
      WORKSPACE_MANAGE_WORKSPACE:
        permissions?.includes("MANAGE_WORKSPACE") ?? false,
      WORKSPACE_MANAGE_WORKSPACE_DETAILS:
        permissions?.includes("MANAGE_WORKSPACE_DETAILS") ?? false,
      WORKSPACE_MANAGE_WORKSPACE_FRONTPAGE:
        permissions?.includes("MANAGE_WORKSPACE_FRONTPAGE") ?? false,
      WORKSPACE_MANAGE_WORKSPACE_HELP:
        permissions?.includes("MANAGE_WORKSPACE_HELP") ?? false,
      WORKSPACE_MANAGE_WORKSPACE_MATERIALS:
        permissions?.includes("MANAGE_WORKSPACE_MATERIALS") ?? false,
      WORKSPACE_MATERIALS_VISIBLE: true,
      WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT:
        permissions?.includes("REQUEST_WORKSPACE_ASSESSMENT") ?? false,
      WORKSPACE_SIGNUP: permissions?.includes("WORKSPACE_SIGNUP") ?? false,
      WORKSPACE_USERS_VISIBLE:
        permissions?.includes("MANAGE_WORKSPACE_MEMBERS") ?? false,
      WORKSPACE_VIEW_WORKSPACE_DETAILS:
        permissions?.includes("VIEW_WORKSPACE_DETAILS") ?? false,
      WORSKPACE_LIST_WORKSPACE_MEMBERS:
        permissions?.includes("LIST_WORKSPACE_MEMBERS") ?? false,
    };
  }
}
