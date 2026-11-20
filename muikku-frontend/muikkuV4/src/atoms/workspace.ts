import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import {
  getWorkspaceApi,
  getCoursepickerApi,
  isMApiError,
  getEvaluationApi,
} from "~/api";
import type { WorkspaceActivity, WorkspaceBasicInfo } from "~/generated/client";
import {
  queryClient,
  workspaceBasicInfoQueryKey,
  workspaceCanSignupQueryKey,
  workspaceStudentActivityQueryKey,
} from "src/queryClient";
import { userAtom } from "./auth";

const workspaceApi = getWorkspaceApi();
const coursepickerApi = getCoursepickerApi();
const evaluationApi = getEvaluationApi();

/** Active workspace urlName — set from workspaceInit before ensureQueryData. */
export const currentWorkspaceUrlNameAtom = atom<string | null>(null);

/** Server cache — do not useAtomValue in components. */
export const workspaceBasicInfoQueryAtom = atomWithQuery((get) => {
  const urlName = get(currentWorkspaceUrlNameAtom);
  const queryKey = workspaceBasicInfoQueryKey(urlName ?? "");
  const cachedStatus = queryClient.getQueryState(queryKey)?.status;
  return {
    queryKey,
    queryFn: async (): Promise<WorkspaceBasicInfo> => {
      if (!urlName) {
        throw new Error("Workspace URL name is required");
      }
      try {
        const info = await workspaceApi.getWorkspaceBasicInfo({ urlName });
        if (!info) {
          throw new Error("Workspace not found");
        }
        return info;
      } catch (err) {
        if (!isMApiError(err)) throw err;
        throw new Error("Workspace not found");
      }
    },
    retry: false,
    enabled: !!urlName && cachedStatus !== "error",
    staleTime: Infinity,
    refetchOnMount: false,
  };
});

/** Workspace info atom */
export const workspaceInfoAtom = atom(
  (get) => get(workspaceBasicInfoQueryAtom).data ?? null
);

/** Workspace id atom */
export const workspaceIdAtom = atom(
  (get) => get(workspaceInfoAtom)?.id ?? null
);

/** Server cache — do not useAtomValue in components. */
export const workspaceCanSignupQueryAtom = atomWithQuery((get) => {
  const workspaceId = get(workspaceIdAtom);
  return {
    queryKey: workspaceCanSignupQueryKey(workspaceId ?? -1),
    queryFn: async () => {
      if (workspaceId == null) {
        throw new Error("Workspace id is required");
      }
      const result = await coursepickerApi.workspaceCanSignUp({ workspaceId });
      return result.canSignup;
    },
    enabled: workspaceId != null,
    staleTime: Infinity,
  };
});

/** Can user signup to workspace atom */
export const canUserSignupToWorkspaceAtom = atom(
  (get) => get(workspaceCanSignupQueryAtom).data ?? null
);

/** Workspace student activity query atom */
export const workspaceStudentActivityQueryAtom = atomWithQuery((get) => {
  const workspaceId = get(workspaceIdAtom);
  const { id, identifier } = get(userAtom) ?? {};

  return {
    queryKey: workspaceStudentActivityQueryKey(workspaceId ?? -1, id ?? -1),
    queryFn: async (): Promise<WorkspaceActivity> => {
      if (workspaceId == null || id == null || identifier == null) {
        throw new Error("Workspace id and user id are required");
      }
      try {
        return await evaluationApi.getWorkspaceStudentActivity({
          workspaceId,
          studentEntityId: identifier,
        });
      } catch (err) {
        if (!isMApiError(err)) throw err;
        throw new Error("Failed to load workspace student activity");
      }
    },
    enabled: workspaceId != null && id != null && identifier != null,
    staleTime: Infinity,
    refetchOnMount: false,
    retry: false,
  };
});

/** Workspace student activity */
export const workspaceStudentActivityAtom = atom(
  (get) => get(workspaceStudentActivityQueryAtom).data ?? null
);
