import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getWorkspaceApi, isMApiError } from "~/api";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
  MaterialCompositeReplyStateType,
  MaterialAnswer,
} from "~/generated/client";
import type { AsyncState } from "src/types/AsyncState";
import { workspaceIdAtom } from "src/atoms/workspace";
import {
  queryClient,
  workspaceCompositeRepliesQueryKey,
  workspaceHelpContentNodesQueryKey,
  workspaceMaterialContentNodesQueryKey,
} from "src/queryClient";
import { atomFamily, selectAtom } from "jotai/utils";

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

/** Async state of the workspace composite replies */
export const workspaceCompositeRepliesAsyncStateAtom = atom<AsyncState>(
  (get) => {
    const query = get(workspaceCompositeRepliesQueryAtom);
    if (query.isLoading) return "loading";
    if (query.isError) return "error";
    if (query.data) return "ready";
    return "idle";
  }
);

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

/**
 * Composite reply for a specific workspace material.
 * @param workspaceMaterialId - Workspace material id
 * @returns Composite reply
 */
export const workspaceCompositeReplyAtomFamily = atomFamily(
  (workspaceMaterialId: number) =>
    atom(
      (get) =>
        get(workspaceCompositeRepliesByMaterialIdAtom)[workspaceMaterialId]
    )
);

/** Fields Toc actually paints. Ignores answers and ANSWERED. */
export type TocReplyChrome = {
  done: boolean;
  submitted: MaterialCompositeReply["submitted"];
  evaluationInfo: MaterialCompositeReply["evaluationInfo"];
};
/**
 * Converts a MaterialCompositeReply to a TocReplyChrome.
 * @param reply - MaterialCompositeReply
 * @returns TocReplyChrome
 */
function tocReplyChrome(reply: MaterialCompositeReply): TocReplyChrome {
  return {
    done:
      reply.state === "SUBMITTED" ||
      reply.state === "PASSED" ||
      reply.state === "FAILED",
    submitted: reply.submitted,
    evaluationInfo: reply.evaluationInfo,
  };
}

/**
 * Compares two TocReplyChrome objects.
 * @param a - TocReplyChrome
 * @param b - TocReplyChrome
 * @returns true if the objects are equal, false otherwise
 */
function tocRepliesEqual(
  a: Record<number, TocReplyChrome>,
  b: Record<number, TocReplyChrome>
): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    const id = Number(key);
    const left = a[id];
    const right = b[id];
    if (!right) return false;
    if (left.done !== right.done) return false;
    if (left.submitted !== right.submitted) return false;
    if (left.evaluationInfo !== right.evaluationInfo) return false;
  }
  return true;
}

/**
 * Replies keyed by workspaceMaterialId for TOC lookup.
 * @param replies - MaterialCompositeReply[]
 * @returns Record<number, TocReplyChrome>
 */
export const tocRepliesByMaterialIdAtom = selectAtom(
  workspaceCompositeRepliesAtom,
  (replies) => {
    const byId: Record<number, TocReplyChrome> = {};
    for (const reply of replies) {
      byId[reply.workspaceMaterialId] = tocReplyChrome(reply);
    }
    return byId;
  },
  tocRepliesEqual
);

/**
 * Patch one composite reply in the workspace cache (answers and/or state).
 */
export const patchCompositeReplyAtom = atom(
  null,
  (
    get,
    _set,
    patch: {
      workspaceMaterialId: number;
      state?: MaterialCompositeReplyStateType;
      answer?: { fieldName: string; value: string };
    }
  ) => {
    const workspaceId = get(workspaceIdAtom);
    if (workspaceId == null) return;
    queryClient.setQueryData<MaterialCompositeReply[]>(
      workspaceCompositeRepliesQueryKey(workspaceId),
      (old = []) => {
        const now = new Date();
        const index = old.findIndex(
          (row) => row.workspaceMaterialId === patch.workspaceMaterialId
        );
        const applyAnswer = (answers: MaterialAnswer[]): MaterialAnswer[] => {
          if (!patch.answer) return answers;
          const existing = answers.findIndex(
            (row) => row.fieldName === patch.answer!.fieldName
          );
          const next: MaterialAnswer = {
            fieldName: patch.answer.fieldName,
            value: patch.answer.value,
            workspaceMaterialId: patch.workspaceMaterialId,
          };
          if (existing === -1) return [...answers, next];
          return answers.map((row, i) => (i === existing ? next : row));
        };
        if (index === -1) {
          return [
            ...old,
            {
              answers: applyAnswer([]),
              state: patch.state ?? "ANSWERED",
              created: now,
              lastModified: now,
              submitted: null,
              workspaceMaterialId: patch.workspaceMaterialId,
              workspaceMaterialReplyId: 0,
              lock: "NONE",
            },
          ];
        }
        const current = old[index];
        const next = [...old];
        next[index] = {
          ...current,
          answers: applyAnswer(current.answers),
          state: patch.state ?? current.state,
          lastModified: now,
        };
        return next;
      }
    );
  }
);

/**
 * V3 updateAssignmentState: optional POST, then patch cache.
 */
export const updateWorkspaceAssignmentStateAtom = atom(
  null,
  async (
    _get,
    set,
    params: {
      newState: MaterialCompositeReplyStateType;
      localOnly: boolean;
      workspaceId: number;
      workspaceMaterialId: number;
      successText?: string;
      callback?: () => void;
    }
  ) => {
    if (!params.localOnly) {
      await workspaceApi.updateWorkspaceMaterialState({
        workspaceMaterialId: params.workspaceMaterialId,
        state: params.newState,
      });
    }
    set(patchCompositeReplyAtom, {
      workspaceMaterialId: params.workspaceMaterialId,
      state: params.newState,
    });
    params.callback?.();
  }
);
