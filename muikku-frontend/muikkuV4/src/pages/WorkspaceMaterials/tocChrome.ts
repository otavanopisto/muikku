import type {
  MaterialAssigmentType,
  MaterialCompositeReply,
} from "~/generated/client";
import type { TocItem } from "./tocItems";

/**
 * Chrome for a TOC item.
 */
export interface TocItemChrome {
  color?: string;
  kindLabel?: string;
  done: boolean;
  meta: string[];
}

/**
 * Map assignment type to Timeline color and Finnish label.
 * @param assignmentType - Node assignment type
 */
function assignmentChrome(
  assignmentType: MaterialAssigmentType | null
): Pick<TocItemChrome, "color" | "kindLabel"> {
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
      return {};
  }
}

/**
 * Presentation for a TOC page. Reply can be omitted until that API is wired.
 * @param item - Numbered TOC item
 * @param reply - Composite reply for this page, if loaded
 */
export function getTocItemChrome(
  item: TocItem,
  reply?: MaterialCompositeReply
): TocItemChrome {
  const { color, kindLabel } = assignmentChrome(item.assignmentType);
  const done =
    reply?.state === "SUBMITTED" ||
    reply?.state === "PASSED" ||
    reply?.state === "FAILED";

  const meta: string[] = [];
  if (reply?.submitted) {
    meta.push(`Tehty: ${reply.submitted.toLocaleDateString("fi-FI")}`);
  }
  if (reply?.evaluationInfo?.points != null) {
    if (item.maxPoints != null) {
      meta.push(`Pisteet: ${reply.evaluationInfo.points}/${item.maxPoints}`);
    } else {
      meta.push(`Pisteet: ${reply.evaluationInfo.points}`);
    }
  }
  if (reply?.evaluationInfo?.grade) {
    meta.push(`Arvosana: ${reply.evaluationInfo.grade}`);
  }

  return { color, kindLabel, done, meta };
}
