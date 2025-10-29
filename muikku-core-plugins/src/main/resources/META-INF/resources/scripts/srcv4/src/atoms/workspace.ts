import { atom } from "jotai";
import { getWorkspaceApi, getCoursepickerApi, isMApiError } from "~/api";
import type { WorkspaceBasicInfo } from "~/generated/client";
import { initializeWorkspacePermissionsAtom } from "./permissions";

const workspaceApi = getWorkspaceApi();
const coursepickerApi = getCoursepickerApi();

// Workspace info atom
export const workspaceInfoAtom = atom<WorkspaceBasicInfo | null>(null);
export const canUserSignupToWorkspaceAtom = atom<boolean | null>(null);

/**
 * Load workspace info atom action
 */
export const initializeWorkspaceStatusAtom = atom(
  null,
  async (_, set, workspaceUrlName: string | undefined) => {
    if (!workspaceUrlName) return;

    let workspaceBasicInfo: WorkspaceBasicInfo | undefined = undefined;
    try {
      workspaceBasicInfo = await workspaceApi.getWorkspaceBasicInfo({
        urlName: workspaceUrlName,
      });

      if (workspaceBasicInfo) {
        set(workspaceInfoAtom, workspaceBasicInfo);
        await set(loadCanUserSignupToWorkspaceAtom, workspaceBasicInfo.id);
        await set(initializeWorkspacePermissionsAtom, workspaceBasicInfo.id);
      }
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
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
