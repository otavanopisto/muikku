import type { Workspace } from "~/generated/client";
import type { CourseListItem } from "../types";
import type { CoursepickerSearchView } from "../types";

/**
 * Minimal Workspace → list row. Enrich panels later.
 */
export function mapWorkspaceToCourseItem(
  workspace: Workspace,
  view: CoursepickerSearchView
): CourseListItem {
  const title = workspace.nameExtension
    ? `${workspace.name} (${workspace.nameExtension})`
    : workspace.name;

  const chips: string[] = [];
  if (workspace.mandatority === "MANDATORY") {
    chips.push("Pakollinen");
  } else if (workspace.mandatority) {
    chips.push("Valinnainen");
  }

  if (view === "MyCourses") {
    return {
      id: workspace.id,
      panelVariant: "my",
      code: workspace.subjectIdentifier || "—",
      title,
      chips,
      statusLabel: workspace.published ? "Julkaistu" : "Julkaisematon",
      assessmentStatus: "—",
      visitsLabel: `Käyntejä: ${workspace.numVisits}`,
      journalLabel: "—",
      messagesLabel: "—",
      gradedTasks: { done: 0, total: 0, summary: "—" },
      practiceTasks: { done: 0, total: 0 },
    };
  }

  return {
    id: workspace.id,
    panelVariant: "catalog",
    code: workspace.subjectIdentifier || "—",
    title,
    chips,
    description: workspace.description || "",
    lengthLabel: "—",
    teacher: { name: "—", email: "" },
  };
}
