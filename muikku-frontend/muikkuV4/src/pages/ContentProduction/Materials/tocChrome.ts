import {
  MaterialViewRestriction,
  type MaterialAssigmentType,
  type MaterialContentNode,
} from "~/generated/client";
import type { ProductionTocItem } from "./tocItems";

/**
 * Chrome for a production TOC page.
 */
export interface ProductionTocItemChrome {
  color?: string;
  kindLabel?: string;
  locked: boolean;
  lockLabel?: string;
}

/**
 * True when the node is limited to logged-in users or workspace members.
 * @param viewRestrict - Node viewRestrict
 */
export function isViewRestricted(
  viewRestrict: MaterialContentNode["viewRestrict"] | null | undefined
): boolean {
  return (
    viewRestrict === MaterialViewRestriction.LoggedIn ||
    viewRestrict === MaterialViewRestriction.WorkspaceMembers
  );
}

/**
 * Assignment colour + Finnish kind label.
 * @param assignmentType - Node assignment type
 */
export function getProductionAssignmentChrome(
  assignmentType: MaterialAssigmentType | null
): Pick<ProductionTocItemChrome, "color" | "kindLabel"> {
  switch (assignmentType) {
    case "EXERCISE":
      return { color: "pink", kindLabel: "Harjoitustehtävä" };
    case "EVALUATED":
      return { color: "violet", kindLabel: "Arvioitava tehtävä" };
    case "JOURNAL":
      return { color: "blue", kindLabel: "Oppimispäiväkirja" };
    case "INTERIM_EVALUATION":
      return { color: "orange", kindLabel: "Välipalautetehtävä" };
    default:
      return { color: "teal" };
  }
}

/**
 * Production TOC chrome for one page or folder.
 * @param item - Production TOC item
 */
export function getProductionTocItemChrome(
  item: ProductionTocItem
): ProductionTocItemChrome {
  const { color, kindLabel } = getProductionAssignmentChrome(
    item.assignmentType
  );
  const restricted = isViewRestricted(item.viewRestrict);
  const locked = item.hidden || restricted;

  let lockLabel: string | undefined;
  if (item.hidden && restricted) {
    lockLabel = "Piilotettu ja rajoitettu";
  } else if (item.hidden) {
    lockLabel = "Piilotettu opiskelijoilta";
  } else if (item.viewRestrict === MaterialViewRestriction.LoggedIn) {
    lockLabel = "Näkyy vain kirjautuneille";
  } else if (item.viewRestrict === MaterialViewRestriction.WorkspaceMembers) {
    lockLabel = "Näkyy vain työtilan jäsenille";
  }

  return { color, kindLabel, locked, lockLabel };
}
