import { atom } from "jotai";
import { isEqual } from "lodash";
import { getMaterialsApi, getWorkspaceApi, isMApiError } from "~/api";
import type {
  MaterialContentNode,
  MaterialProducer,
  WorkspaceMaterial,
} from "~/generated/client";
import { workspaceIdAtom } from "src/atoms/workspace";
import {
  clearMaterialPageDraftAtom,
  isPageDraftPublishable,
  materialPageDraftsAtom,
  resolvedPageDraft,
  type MaterialPageDraft,
} from "src/atoms/workspaceContentDrafts";
import {
  queryClient,
  workspaceMaterialContentNodesQueryKey,
} from "src/queryClient";

const workspaceApi = getWorkspaceApi();
const materialsApi = getMaterialsApi();

const WORKSPACE_MATERIAL_FIELDS = [
  "title",
  "titleLanguage",
  "maxPoints",
  "ai",
  "extraInfo",
] as const satisfies readonly (keyof MaterialPageDraft)[];

/**
 * Create missing producers (no id yet) and delete removed ones.
 * Same split as V3 — producers are not part of updateWorkspaceMaterial.
 */
export async function syncMaterialProducers(
  materialId: number,
  saved: MaterialProducer[] | undefined,
  next: MaterialProducer[]
): Promise<MaterialProducer[]> {
  const created = await Promise.all(
    next.map((producer) =>
      producer.id
        ? producer
        : materialsApi.createMaterialProducer({
            materialId,
            createMaterialProducerRequest: { name: producer.name },
          })
    )
  );
  const deleted = (saved ?? []).filter(
    (producer) => !created.some((row) => row.id === producer.id)
  );
  await Promise.all(
    deleted.map((producer) =>
      materialsApi.deleteMaterialProducer({
        materialId,
        producerId: producer.id,
      })
    )
  );
  return created;
}

/**
 * Patch one node in the materials tree.
 */
function mapContentNodes(
  nodes: MaterialContentNode[],
  workspaceMaterialId: number,
  patch: Partial<MaterialContentNode>
): MaterialContentNode[] {
  return nodes.map((node) => {
    if (node.workspaceMaterialId === workspaceMaterialId) {
      return { ...node, ...patch };
    }
    if (!node.children?.length) return node;
    return {
      ...node,
      children: mapContentNodes(node.children, workspaceMaterialId, patch),
    };
  });
}

/**
 * Publish one page draft. Html / workspace-material / material / producers
 * use separate endpoints, matching V3.
 */
export const publishMaterialPageAtom = atom(
  null,
  async (
    get,
    set,
    payload: {
      page: MaterialContentNode;
      htmlFromEditor?: string;
    }
  ) => {
    const workspaceId = get(workspaceIdAtom);
    const workspaceMaterialId = payload.page.workspaceMaterialId;
    const materialId = payload.page.materialId;
    if (
      workspaceId == null ||
      workspaceMaterialId == null ||
      materialId == null
    ) {
      throw new Error("Workspace- tai materiaalitunniste puuttuu.");
    }

    const drafts = get(materialPageDraftsAtom);
    let draft = drafts[workspaceMaterialId];
    if (payload.htmlFromEditor !== undefined) {
      draft = { ...draft, html: payload.htmlFromEditor };
    }
    if (!isPageDraftPublishable(payload.page, draft)) return;

    const saved = payload.page;
    const next = resolvedPageDraft(saved, draft);
    const cachePatch: Partial<MaterialContentNode> = {};

    try {
      if (draft?.html !== undefined && draft.html !== (saved.html ?? "")) {
        const htmlResult = await materialsApi.updateHtmlMaterialContent({
          materialid: materialId,
          updateHtmlMaterialContentRequest: {
            content: draft.html,
            removeAnswers: false,
          },
        });
        cachePatch.html = draft.html;
        if (htmlResult?.edited) cachePatch.edited = htmlResult.edited;
        if (htmlResult?.editor) cachePatch.editor = htmlResult.editor;
      }

      const workspaceChanged = WORKSPACE_MATERIAL_FIELDS.some(
        (field) =>
          field in (draft ?? {}) && !isEqual(draft?.[field], saved[field])
      );
      if (workspaceChanged) {
        const updated: WorkspaceMaterial =
          await workspaceApi.updateWorkspaceMaterial({
            workspaceEntityId: workspaceId,
            workspaceMaterialId,
            body: {
              id: workspaceMaterialId,
              materialId,
              parentId: saved.parentId,
              nextSiblingId: saved.nextSiblingId,
              hidden: saved.hidden,
              assignmentType: saved.assignmentType,
              correctAnswers: saved.correctAnswers,
              path: saved.path,
              title: next.title,
              titleLanguage: next.titleLanguage,
              maxPoints: next.maxPoints,
              ai: next.ai,
              extraInfo: next.extraInfo,
            },
          });
        cachePatch.title = next.title;
        cachePatch.titleLanguage = next.titleLanguage;
        cachePatch.maxPoints = next.maxPoints;
        cachePatch.ai = next.ai;
        cachePatch.extraInfo = next.extraInfo;
        if (updated.path) cachePatch.path = updated.path;
      }

      if (draft?.license !== undefined && draft.license !== saved.license) {
        await materialsApi.updateMaterial({
          materialId,
          body: {
            id: materialId,
            license: next.license,
            viewRestrict: saved.viewRestrict,
          },
        });
        cachePatch.license = next.license;
      }

      if (
        draft?.producers !== undefined &&
        !isEqual(draft.producers, saved.producers)
      ) {
        cachePatch.producers = await syncMaterialProducers(
          materialId,
          saved.producers,
          draft.producers
        );
      }
    } catch (err) {
      if (!isMApiError(err)) throw err;
      throw new Error("Julkaisu epäonnistui.");
    }

    queryClient.setQueryData<MaterialContentNode[]>(
      workspaceMaterialContentNodesQueryKey(workspaceId),
      (nodes = []) => mapContentNodes(nodes, workspaceMaterialId, cachePatch)
    );
    set(clearMaterialPageDraftAtom, workspaceMaterialId);
  }
);
