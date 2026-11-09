import type { MaterialContentNode } from "~/generated/client";
import { isFolderNode } from "./tocItems";

/**
 * Absolute materials URL for a node path (or the materials root).
 * @param workspaceUrlName - Workspace urlName
 * @param path - MaterialContentNode.path
 */
export function workspaceMaterialsHref(
  workspaceUrlName: string,
  path = ""
): string {
  const base = `/workspace/${workspaceUrlName}/workspaceMaterials`;
  const normalized = normalizeMaterialPath(path);
  return normalized ? `${base}/${normalized}` : base;
}

/**
 * Strip leading/trailing slashes.
 * @param path - Raw path or splat
 */
export function normalizeMaterialPath(path: string | undefined): string {
  return (path ?? "").replace(/^\/+|\/+$/g, "");
}

/**
 * Indexed node for path lookup.
 */
interface IndexedNode {
  node: MaterialContentNode;
  parent: MaterialContentNode | null;
}

/**
 * Index the node tree by path.
 */
function indexNodes(
  nodes: MaterialContentNode[],
  parent: MaterialContentNode | null,
  byPath: Map<string, IndexedNode>
): void {
  for (const node of nodes) {
    const path = normalizeMaterialPath(node.path);
    if (path) {
      byPath.set(path, { node, parent });
    }
    if (node.children?.length) {
      indexNodes(node.children, node, byPath);
    }
  }
}

/**
 * Page children of a folder, or root-level pages when section is null.
 */
function pageChildren(
  section: MaterialContentNode | null,
  roots: MaterialContentNode[]
): MaterialContentNode[] {
  const list = section ? (section.children ?? []) : roots;
  return list.filter((child) => !isFolderNode(child));
}

/**
 * First folder path, else first root page path.
 */
function firstNavigablePath(nodes: MaterialContentNode[]): string | undefined {
  for (const node of nodes) {
    if (isFolderNode(node)) {
      const path = normalizeMaterialPath(node.path);
      if (path) return path;
    }
  }
  for (const node of nodes) {
    if (!isFolderNode(node)) {
      const path = normalizeMaterialPath(node.path);
      if (path) return path;
    }
  }
  return undefined;
}

/**
 * Resolved materials location from the URL splat.
 */
export interface MaterialLocation {
  status: "empty" | "ok" | "not-found";
  splat: string;
  section: MaterialContentNode | null;
  pages: MaterialContentNode[];
  page: MaterialContentNode | null;
  defaultPath?: string;
}

/**
 * Map splat → section (folder or root) + pages to render.
 * @param nodes - Root material content nodes
 * @param splat - `useParams()["*"]`
 */
export function resolveMaterialLocation(
  nodes: MaterialContentNode[],
  splat: string
): MaterialLocation {
  const defaultPath = firstNavigablePath(nodes);
  const normalizedSplat = normalizeMaterialPath(splat);

  if (!normalizedSplat) {
    return {
      status: "empty",
      splat: "",
      section: null,
      pages: [],
      page: null,
      defaultPath,
    };
  }

  const byPath = new Map<string, IndexedNode>();
  indexNodes(nodes, null, byPath);
  const hit = byPath.get(normalizedSplat);

  if (!hit) {
    return {
      status: "not-found",
      splat: normalizedSplat,
      section: null,
      pages: [],
      page: null,
      defaultPath,
    };
  }

  const folder = isFolderNode(hit.node);
  const section = folder ? hit.node : hit.parent;
  const page = folder ? null : hit.node;

  return {
    status: "ok",
    splat: normalizedSplat,
    section,
    pages: pageChildren(section, nodes),
    page,
    defaultPath,
  };
}
