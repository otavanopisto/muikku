import type {
  MaterialAssigmentType,
  MaterialContentNode,
} from "~/generated/client";

/**
 * Production TOC item. Includes authoring fields the student TOC does not need.
 */
export interface ProductionTocItem {
  id: number;
  title: string;
  path: string;
  isFolder: boolean;
  assignmentType: MaterialAssigmentType | null;
  hidden: boolean;
  viewRestrict: MaterialContentNode["viewRestrict"];
  children: ProductionTocItem[];
}

export type ProductionTocChildGroup =
  | { type: "pages"; items: ProductionTocItem[] }
  | { type: "folder"; item: ProductionTocItem };

/**
 * Whether the node is a folder.
 * @param node - Material content node
 */
export function isProductionFolderNode(node: MaterialContentNode) {
  return node.type === "folder" || (node.children?.length ?? 0) > 0;
}

/**
 * Build a production TOC tree from the full (including hidden) node list.
 * @param nodes - Root material content nodes
 */
export function buildProductionTocItems(
  nodes: MaterialContentNode[]
): ProductionTocItem[] {
  return nodes.map((node, index) => ({
    id: node.workspaceMaterialId ?? index,
    title: node.title,
    path: node.path ?? "",
    isFolder: isProductionFolderNode(node),
    assignmentType: node.assignmentType,
    hidden: Boolean(node.hidden),
    viewRestrict: node.viewRestrict,
    children: buildProductionTocItems(node.children ?? []),
  }));
}

/**
 * Group consecutive pages so they can share one rail.
 * @param items - Children of a folder (or root)
 */
export function groupProductionTocChildren(
  items: ProductionTocItem[]
): ProductionTocChildGroup[] {
  const groups: ProductionTocChildGroup[] = [];
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
