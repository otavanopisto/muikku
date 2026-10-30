import { initializeWebSocketAtom } from "../atoms/websocket";
import { currentWorkspaceUrlNameAtom } from "../atoms/workspace";
import { AuthService } from "./auth";
import {
  getMeApi,
  getWorkspaceApi,
  getCoursepickerApi,
  isMApiError,
  getEvaluationApi,
} from "~/api";
import { executeAtomAction, getAtomValue, setAtomValue } from "../jotaiStore";
import {
  globalInitializedAtom,
  workspaceInitializedAtom,
} from "../atoms/shared";
import {
  LOCALE_QUERY_KEY,
  WHOAMI_QUERY_KEY,
  queryClient,
  workspaceBasicInfoQueryKey,
  workspaceCanSignupQueryKey,
  workspacePermissionsQueryKey,
  workspaceStudentActivityQueryKey,
} from "../queryClient";
import { PermissionsService } from "./permissions";
import type { WorkspaceBasicInfo } from "~/generated/client";
import { userAtom } from "../atoms/auth";

const meApi = getMeApi();
const workspaceApi = getWorkspaceApi();
const coursepickerApi = getCoursepickerApi();
const evaluationApi = getEvaluationApi();

//// GLOBAL INITIALIZATION ////

/**
 * Fill whoami cache (same key as whoAmIQueryAtom).
 */
async function ensureAuth() {
  await queryClient.ensureQueryData({
    queryKey: WHOAMI_QUERY_KEY,
    queryFn: () => AuthService.checkAuthenticationStatus(),
  });
}

/**
 * Fill locale cache (same key as localeQueryAtom).
 */
async function ensureLocale() {
  await queryClient.ensureQueryData({
    queryKey: LOCALE_QUERY_KEY,
    queryFn: async () => {
      const locale = await meApi.getLocale();
      return locale.lang;
    },
  });
}

/**
 * Core global initialization logic
 * This is the shared logic that both the hook and loader can use
 * @returns Promise
 */
async function performGlobalInitialization() {
  // Ensure auth and locale are fetched and cached.
  await Promise.all([ensureAuth(), ensureLocale()]);

  // After, ensure other global initialization tasks are performed.
  await Promise.all([
    //initializeChatSettings(),
    //initializeDiscussionAreaPermissions(),
    //updateUnreadMessages(),
    // ... other global initialization tasks ...
    executeAtomAction(initializeWebSocketAtom),
  ]);

  // Finally, set global initialized atom to true.
  await executeAtomAction(globalInitializedAtom, true);
}

/**
 * Global initialization function that can be used in loaders
 * This replaces the useGlobalInitialization hook for loader usage
 * @returns Promise
 */
export async function globalInit() {
  return performGlobalInitialization();
}

//// WORKSPACE INITIALIZATION ////

/**
 * Fill workspace basic info cache (same key as workspaceBasicInfoQueryAtom).
 * Throws Response(404) for route ErrorBoundary.
 * @param workspaceUrlName - The workspace URL name
 */
async function ensureWorkspaceBasicInfo(
  workspaceUrlName: string
): Promise<WorkspaceBasicInfo> {
  try {
    return await queryClient.ensureQueryData({
      queryKey: workspaceBasicInfoQueryKey(workspaceUrlName),
      queryFn: async () => {
        const info = await workspaceApi.getWorkspaceBasicInfo({
          urlName: workspaceUrlName,
        });
        if (!info) {
          throw new Error("Workspace not found");
        }
        return info;
      },
      staleTime: Infinity,
      retry: false,
    });
  } catch (err) {
    if (!isMApiError(err) && !(err instanceof Error)) {
      throw err;
    }
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Workspace not found", { status: 404 });
  }
}

/**
 * Fill workspace permissions cache (same key as workspacePermissionsQueryAtom).
 * @param workspaceId - The workspace ID
 */
async function ensureWorkspacePermissions(workspaceId: number) {
  await queryClient.ensureQueryData({
    queryKey: workspacePermissionsQueryKey(workspaceId),
    queryFn: async () => {
      const permissions = await workspaceApi.getWorkspacePermissions({
        workspaceEntityId: workspaceId,
      });
      return PermissionsService.transformWorkspacePermissions(permissions);
    },
  });
}

/**
 * Fill workspace can-signup cache (same key as workspaceCanSignupQueryAtom).
 * @param workspaceId - The workspace ID
 */
async function ensureWorkspaceCanSignup(workspaceId: number) {
  await queryClient.ensureQueryData({
    queryKey: workspaceCanSignupQueryKey(workspaceId),
    queryFn: async () => {
      const result = await coursepickerApi.workspaceCanSignUp({ workspaceId });
      return result.canSignup;
    },
  });
}

/**
 * Fill workspace student activity cache (same key as workspaceStudentActivityQueryAtom).
 * @param workspaceId - The workspace ID
 */
async function ensureWorkspaceStudentActivity(workspaceId: number) {
  const { id, identifier } = getAtomValue(userAtom) ?? {};
  if (id == null || identifier == null) return;

  await queryClient.ensureQueryData({
    queryKey: workspaceStudentActivityQueryKey(workspaceId, id),
    queryFn: () =>
      evaluationApi.getWorkspaceStudentActivity({
        workspaceId,
        studentEntityId: identifier,
      }),
    staleTime: Infinity,
    retry: false,
  });
}

/**
 * Workspace initialization for loaders / middleware.
 * @param workspaceUrlName - The workspace URL name
 */
export async function workspaceInit(workspaceUrlName: string) {
  // Set the current workspace url name atom.
  setAtomValue(currentWorkspaceUrlNameAtom, workspaceUrlName);

  // Ensure workspace basic info is fetched and cached.
  const basicInfo = await ensureWorkspaceBasicInfo(workspaceUrlName);

  // After, ensure other workspace initialization tasks are performed.
  await Promise.all([
    ensureWorkspacePermissions(basicInfo.id),
    ensureWorkspaceCanSignup(basicInfo.id),
    ensureWorkspaceStudentActivity(basicInfo.id),
    // ... other workspace initialization tasks ...
  ]);

  // Finally, set info about that the workspace has been initialized.
  await executeAtomAction(workspaceInitializedAtom, workspaceUrlName);
}
