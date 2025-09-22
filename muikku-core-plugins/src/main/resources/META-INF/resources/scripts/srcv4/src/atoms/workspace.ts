import { atom } from "jotai";
import MApi, { isMApiError, isResponseError } from "~/api";
import type { WorkspaceBasicInfo } from "~/generated/client";
import { initializeWorkspacePermissionsAtom } from "./permissions";

const workspaceApi = MApi.getWorkspaceApi();
const coursepickerApi = MApi.getCoursepickerApi();

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
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      // Handling workspace errors
      if (isResponseError(err)) {
        const status = err.response.status;

        switch (status) {
          case 401:
            window.location.href = `/login?redirectUrl=${window.location.pathname}`;
            break;
          case 403:
            window.location.href = `/error/403?workspace=true`;
            break;
          case 404:
            window.location.href = `/error/404?workspace=true`;
            break;
          default:
            window.location.href = `/error/${status}?workspace=true`;
            break;
        }
        return;
      }
    }

    if (workspaceBasicInfo) {
      set(workspaceInfoAtom, workspaceBasicInfo);
      set(loadCanUserSignupToWorkspaceAtom, workspaceBasicInfo.id);
      set(initializeWorkspacePermissionsAtom, workspaceBasicInfo.id);
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
