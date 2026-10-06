import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getWorkspaceApi, isMApiError } from "~/api";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
} from "~/generated/client";
import type { AsyncState } from "src/types/AsyncState";
import { workspaceIdAtom } from "src/atoms/workspace";
import {
  workspaceCompositeRepliesQueryKey,
  workspaceHelpContentNodesQueryKey,
  workspaceMaterialContentNodesQueryKey,
} from "src/queryClient";

const workspaceApi = getWorkspaceApi();

const EMPTY_NODES: MaterialContentNode[] = [];

/** Set true when the materials view mounts. Do not useAtomValue in components. */
export const workspaceMaterialContentNodesEnabledAtom = atom(false);

/** Set true when the help view mounts. Do not useAtomValue in components. */
export const workspaceHelpContentNodesEnabledAtom = atom(false);

/** Server cache — do not useAtomValue in components. */
export const workspaceMaterialContentNodesQueryAtom = atomWithQuery((get) => {
  const workspaceId = get(workspaceIdAtom);
  const enabled = get(workspaceMaterialContentNodesEnabledAtom);

  return {
    queryKey: workspaceMaterialContentNodesQueryKey(workspaceId ?? -1),
    queryFn: async (): Promise<MaterialContentNode[]> => {
      if (workspaceId == null) {
        throw new Error("Workspace id is required");
      }

      try {
        return await workspaceApi.getWorkspaceMaterialContentNodes({
          workspaceEntityId: workspaceId,
          includeHidden: false,
        });
      } catch (err) {
        if (!isMApiError(err)) throw err;
        throw new Error("Failed to load workspace materials");
      }
    },
    enabled: workspaceId != null && enabled,
    staleTime: Infinity,
    refetchOnMount: false,
    retry: false,
  };
});

/** Server cache — do not useAtomValue in components. */
export const workspaceHelpContentNodesQueryAtom = atomWithQuery((get) => {
  const workspaceId = get(workspaceIdAtom);
  const enabled = get(workspaceHelpContentNodesEnabledAtom);

  return {
    queryKey: workspaceHelpContentNodesQueryKey(workspaceId ?? -1),
    queryFn: async (): Promise<MaterialContentNode[]> => {
      if (workspaceId == null) {
        throw new Error("Workspace id is required");
      }

      try {
        return await workspaceApi.getWorkspaceHelp({
          workspaceId,
          includeHidden: false,
        });
      } catch (err) {
        if (!isMApiError(err)) throw err;
        throw new Error("Failed to load workspace help");
      }
    },
    enabled: workspaceId != null && enabled,
    staleTime: Infinity,
    refetchOnMount: false,
    retry: false,
  };
});

/** Materials content nodes */
export const workspaceMaterialContentNodesAtom = atom(
  (get) => get(workspaceMaterialContentNodesQueryAtom).data ?? EMPTY_NODES
);

export const workspaceMaterialContentNodesIsLoadingAtom = atom(
  (get) => get(workspaceMaterialContentNodesQueryAtom).isLoading
);

export const workspaceMaterialContentNodesErrorAtom = atom(
  (get) => get(workspaceMaterialContentNodesQueryAtom).error ?? null
);

export const workspaceMaterialContentNodesAsyncStateAtom = atom<AsyncState>(
  (get) => {
    const query = get(workspaceMaterialContentNodesQueryAtom);
    if (query.isLoading) return "loading";
    if (query.isError) return "error";
    if (query.data) return "ready";
    return "idle";
  }
);

/** Help content nodes */
export const workspaceHelpContentNodesAtom = atom(
  (get) => get(workspaceHelpContentNodesQueryAtom).data ?? EMPTY_NODES
);

export const workspaceHelpContentNodesIsLoadingAtom = atom(
  (get) => get(workspaceHelpContentNodesQueryAtom).isLoading
);

export const workspaceHelpContentNodesErrorAtom = atom(
  (get) => get(workspaceHelpContentNodesQueryAtom).error ?? null
);

export const workspaceHelpContentNodesAsyncStateAtom = atom<AsyncState>(
  (get) => {
    const query = get(workspaceHelpContentNodesQueryAtom);
    if (query.isLoading) return "loading";
    if (query.isError) return "error";
    if (query.data) return "ready";
    return "idle";
  }
);

const EMPTY_REPLIES: MaterialCompositeReply[] = [];
/** Server cache — do not useAtomValue in components. */
export const workspaceCompositeRepliesQueryAtom = atomWithQuery((get) => {
  const workspaceId = get(workspaceIdAtom);
  const materialsEnabled = get(workspaceMaterialContentNodesEnabledAtom);
  const helpEnabled = get(workspaceHelpContentNodesEnabledAtom);
  return {
    queryKey: workspaceCompositeRepliesQueryKey(workspaceId ?? -1),
    queryFn: async (): Promise<MaterialCompositeReply[]> => {
      if (workspaceId == null) {
        throw new Error("Workspace id is required");
      }
      try {
        return await workspaceApi.getWorkspaceCompositeReplies({
          workspaceEntityId: workspaceId,
        });
      } catch (err) {
        if (!isMApiError(err)) throw err;
        throw new Error("Failed to load workspace composite replies");
      }
    },
    enabled: workspaceId != null && (materialsEnabled || helpEnabled),
    staleTime: Infinity,
    refetchOnMount: false,
    retry: false,
  };
});

/** Composite replies for the current user */
export const workspaceCompositeRepliesAtom = atom(
  (get) => get(workspaceCompositeRepliesQueryAtom).data ?? EMPTY_REPLIES
);

/**
 * Replies keyed by workspaceMaterialId for TOC lookup.
 */
export const workspaceCompositeRepliesByMaterialIdAtom = atom((get) => {
  const replies = get(workspaceCompositeRepliesAtom);
  const byId: Record<number, MaterialCompositeReply> = {};
  for (const reply of replies) {
    byId[reply.workspaceMaterialId] = reply;
  }
  return byId;
});
