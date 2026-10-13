import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getWorkspaceApi, getCoursepickerApi, isMApiError } from "~/api";
import type { WorkspaceBasicInfo } from "~/generated/client";
import {
  queryClient,
  workspaceBasicInfoQueryKey,
  workspaceCanSignupQueryKey,
} from "src/queryClient";

const workspaceApi = getWorkspaceApi();
const coursepickerApi = getCoursepickerApi();

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
