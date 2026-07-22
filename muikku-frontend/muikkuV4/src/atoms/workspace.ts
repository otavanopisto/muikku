import { atom } from "jotai";
import { getWorkspaceApi, getCoursepickerApi, isMApiError } from "~/api";
import type { WorkspaceBasicInfo } from "~/generated/client";
import {
  initializeWorkspacePermissionsAtom,
  workspacePermissionsAtom,
} from "./permissions";
import { workspaceInitializedAtom } from "./shared";

const workspaceApi = getWorkspaceApi();
const coursepickerApi = getCoursepickerApi();

// Workspace info atom
export const workspaceInfoAtom = atom<WorkspaceBasicInfo | null>(null);
export const canUserSignupToWorkspaceAtom = atom<boolean | null>(null);

/**
 * Clears workspace-scoped state before switching / re-initializing.
 * Keeps workspaceInfo until a successful load so "last workspace" can still
 * show the previous name briefly; permissions are cleared immediately.
 */
export const clearWorkspaceStatusAtom = atom(null, (_, set) => {
  set(workspacePermissionsAtom, null);
  set(canUserSignupToWorkspaceAtom, null);
  set(workspaceInitializedAtom, null);
});

/**
 * Load workspace info atom action
 */
export const initializeWorkspaceStatusAtom = atom(
  null,
  async (_, set, workspaceUrlName: string | undefined) => {
    if (!workspaceUrlName) return;

    // Clear workspace-scoped state before loading new workspace
    set(clearWorkspaceStatusAtom);

    try {
      const workspaceBasicInfo = await workspaceApi.getWorkspaceBasicInfo({
        urlName: workspaceUrlName,
      });

      if (!workspaceBasicInfo) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Response("Workspace not found", { status: 404 });
      }

      set(workspaceInfoAtom, workspaceBasicInfo);
      await set(loadCanUserSignupToWorkspaceAtom, workspaceBasicInfo.id);
      await set(initializeWorkspacePermissionsAtom, workspaceBasicInfo.id);
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw new Response("Workspace not found", { status: 404 });
    }
  }
);

/**
 * Load can user signup to workspace atom action
 */
export const loadCanUserSignupToWorkspaceAtom = atom(
  null,
  async (_, set, workspaceId: number) => {
    const canUserSignupToWorkspace = await coursepickerApi.workspaceCanSignUp({
      workspaceId,
    });

    set(canUserSignupToWorkspaceAtom, canUserSignupToWorkspace.canSignup);
  }
);
