import type {
  MaterialAssigmentType,
  MaterialContentNode,
} from "~/generated/client";

/**
 * Table of contents item.
 */
export interface TocItem {
  id: number;
  title: string;
  isFolder: boolean;
  assignmentType: MaterialAssigmentType | null;
  maxPoints?: number;
  children: TocItem[];
}

export type TocChildGroup =
  | { type: "pages"; items: TocItem[] }
  | { type: "folder"; item: TocItem };

/**
 * Whether the node is a folder.
 * @param node - Material content node
 */
function isFolderNode(node: MaterialContentNode) {
  return node.type === "folder" || (node.children?.length ?? 0) > 0;
}

/**
 * Build a numbered TOC tree from material content nodes.
 * @param nodes - Root material content nodes
 * @param prefix - Number prefix for nested items
 */
export function buildTocItems(nodes: MaterialContentNode[]): TocItem[] {
  return nodes.map((node, index) => ({
    id: node.workspaceMaterialId ?? index,
    title: node.title,
    isFolder: isFolderNode(node),
    assignmentType: node.assignmentType,
    maxPoints: node.maxPoints,
    children: buildTocItems(node.children ?? []),
  }));
}

/**
 * Group consecutive pages so they can share one Timeline.
 * Folders stay outside the Timeline.
 * @param items - Children of a folder (or root)
 */
export function groupTocChildren(items: TocItem[]): TocChildGroup[] {
  const groups: TocChildGroup[] = [];

  for (const item of items) {
    if (item.isFolder) {
      groups.push({ type: "folder", item });
      continue;
    }

    const last = groups.at(-1);
    if (last?.type === "pages") {
      last.items.push(item);
    } else {
      groups.push({ type: "pages", items: [item] });
    }
  }

  return groups;
}
