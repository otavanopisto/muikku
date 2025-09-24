import { atom } from "jotai";
import MApi from "~/api";
import { userAtom } from "./auth";
import {
  PermissionsService,
  type WorkspacePermissions,
} from "../services/permissions";

const discussionApi = MApi.getDiscussionApi();
const workspaceApi = MApi.getWorkspaceApi();

// Discussion area permissions atom
export const discussionAreaPermissionsAtom = atom<unknown>(null);
export const workspacePermissionsAtom = atom<WorkspacePermissions | null>(null);

/**
 * Load discussion area permissions atom action
 */
export const initializeDiscussionAreaPermissionsAtom = atom(
  null,
  async (get, set) => {
    const user = get(userAtom);
    const oldDiscussionAreaPermissions = get(discussionAreaPermissionsAtom);

    // If user is not logged in or discussion area permissions are already loaded, return
    if (oldDiscussionAreaPermissions) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const areaPermissions = user?.services?.environmentForum?.isAvailable
      ? await discussionApi.getDiscussionEnvironmentAreaPermissions()
      : null;

    set(discussionAreaPermissionsAtom, areaPermissions);
  }
);

/**
 * Load workspace permissions atom action
 */
export const initializeWorkspacePermissionsAtom = atom(
  null,
  async (_, set, workspaceId: number) => {
    const permissions = await workspaceApi.getWorkspacePermissions({
      workspaceEntityId: workspaceId,
    });

    set(
      workspacePermissionsAtom,
      PermissionsService.transformWorkspacePermissions(permissions)
    );
  }
);
