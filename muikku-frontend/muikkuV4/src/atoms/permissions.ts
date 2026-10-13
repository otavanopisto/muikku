import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getWorkspaceApi } from "~/api";
import { workspaceIdAtom } from "./workspace";
import {
  PermissionsService,
  type WorkspacePermissions,
} from "../services/permissions";
import { workspacePermissionsQueryKey } from "src/queryClient";

const workspaceApi = getWorkspaceApi();

/** Server cache — do not useAtomValue in components. */
export const workspacePermissionsQueryAtom = atomWithQuery((get) => {
  const workspaceId = get(workspaceIdAtom);
  return {
    queryKey: workspacePermissionsQueryKey(workspaceId ?? -1),
    queryFn: async (): Promise<WorkspacePermissions> => {
      if (workspaceId == null) {
        throw new Error("Workspace id is required");
      }
      const permissions = await workspaceApi.getWorkspacePermissions({
        workspaceEntityId: workspaceId,
      });
      return PermissionsService.transformWorkspacePermissions(permissions);
    },
    enabled: workspaceId != null,
    staleTime: 5 * 60 * 1000,
    retry: false,
  };
});

export const workspacePermissionsAtom = atom(
  (get) => get(workspacePermissionsQueryAtom).data ?? null
);
