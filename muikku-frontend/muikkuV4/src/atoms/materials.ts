import { atom } from "jotai";
import { getMaterialsApi, getWorkspaceApi } from "~/api";
import type { MaterialContentNode, MaterialHtml } from "~/generated/client";

const materialsApi = getMaterialsApi();
const workspaceApi = getWorkspaceApi();

export const materialHtmlAtom = atom<MaterialHtml | null>(null);
export const materialContentNodesAtom = atom<MaterialContentNode[]>([]);

/**
 * Load material HTML atom action
 */
export const loadMaterialHtmlAtom = atom(
  null,
  async (_, set, materialId: number) => {
    const material = await materialsApi.getHtmlMaterial({
      id: materialId,
    });
    set(materialHtmlAtom, material);
  }
);

/**
 * Load material content nodes atom action
 */
export const loadMaterialContentNodesAtom = atom(
  null,
  async (_, set, workspaceId: number) => {
    const contentNodes = await workspaceApi.getWorkspaceMaterialContentNodes({
      workspaceEntityId: workspaceId,
      includeHidden: false,
    });
    set(materialContentNodesAtom, contentNodes);
  }
);
