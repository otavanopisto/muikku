import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { atomWithQuery } from "jotai-tanstack-query";
import { getWorkspaceApi, isMApiError } from "~/api";
import type { WorkspaceMaterial } from "~/generated/client";
import type { AsyncState } from "src/types/AsyncState";
import { workspaceIdAtom } from "src/atoms/workspace";
import { workspaceMaterialAttachmentsQueryKey } from "src/queryClient";

const workspaceApi = getWorkspaceApi();

const EMPTY_ATTACHMENTS: WorkspaceMaterial[] = [];

/**
 * Attachments of one page: GET materials?parentId=page.workspaceMaterialId.
 * Do not useAtomValue on this query atom in components.
 */
export const pageAttachmentsQueryAtomFamily = atomFamily((parentId: number) =>
  atomWithQuery((get) => {
    const workspaceId = get(workspaceIdAtom);

    return {
      queryKey: workspaceMaterialAttachmentsQueryKey(
        workspaceId ?? -1,
        parentId
      ),
      queryFn: async (): Promise<WorkspaceMaterial[]> => {
        if (workspaceId == null) {
          throw new Error("Workspace id is required");
        }

        try {
          const list = await workspaceApi.getWorkspaceMaterials({
            workspaceEntityId: workspaceId,
            parentId,
          });
          return list ?? EMPTY_ATTACHMENTS;
        } catch (err) {
          if (!isMApiError(err)) throw err;
          throw new Error("Failed to load page attachments");
        }
      },
      enabled: workspaceId != null && parentId > 0,
      staleTime: Infinity,
      refetchOnMount: false,
    };
  })
);

/**
 * Attachment list for a page (workspaceMaterialId of the parent page).
 */
export const pageAttachmentsAtomFamily = atomFamily((parentId: number) =>
  atom(
    (get) =>
      get(pageAttachmentsQueryAtomFamily(parentId)).data ?? EMPTY_ATTACHMENTS
  )
);

/**
 * Async state of that attachments query.
 */
export const pageAttachmentsAsyncStateAtomFamily = atomFamily(
  (parentId: number) =>
    atom<AsyncState>((get) => {
      const query = get(pageAttachmentsQueryAtomFamily(parentId));
      if (query.isLoading) return "loading";
      if (query.isError) return "error";
      if (query.data) return "ready";
      return "idle";
    })
);
