import type { WorkspaceMandatority } from "~/generated/client";

export type CoursePanelVariant = "catalog" | "my";

/**
 * Base interface for all course list items
 */
export interface CourseListItemBase {
  id: number;
  code: string;
  title: string;
  chips: string[];
}

/**
 * Catalog course item
 */
export interface CatalogCourseItem extends CourseListItemBase {
  panelVariant: "catalog";
  description: string;
  lengthLabel: string;
  teacher: {
    name: string;
    email: string;
  };
}

/**
 * My course item
 */
export interface MyCourseItem extends CourseListItemBase {
  panelVariant: "my";
  statusLabel: string;
  assessmentStatus: string;
  visitsLabel: string;
  journalLabel: string;
  messagesLabel: string;
  gradedTasks: {
    done: number;
    total: number;
    summary: string;
  };
  practiceTasks: {
    done: number;
    total: number;
  };
}

export type CourseListItem = CatalogCourseItem | MyCourseItem;

/**
 * Coursepicker section data
 */
export interface CoursepickerSectionData {
  id: string;
  title: string;
  info?: string;
  items: CourseListItem[];
}

export type CoursepickerSearchView =
  | "All"
  | "Suggested"
  | "MyCourses"
  | "Unpublished";

export const COURSEPICKER_SEARCH_VIEWS: CoursepickerSearchView[] = [
  "All",
  "Suggested",
  "MyCourses",
  "Unpublished",
];

/**
 * Check if a value is a valid CoursepickerSearchView
 * @param value - The value to check
 * @returns True if the value is a valid CoursepickerSearchView, false otherwise
 */
export function isCoursepickerSearchView(
  value: string | null
): value is CoursepickerSearchView {
  return (
    value !== null && (COURSEPICKER_SEARCH_VIEWS as string[]).includes(value)
  );
}

/** Coarse mandatority filter used in URL + PillsInput. */
export type MandatorityFilter = "mandatory" | "optional";

export const MANDATORITY_FILTER_OPTIONS: {
  value: MandatorityFilter;
  label: string;
}[] = [
  { value: "mandatory", label: "Pakollinen" },
  { value: "optional", label: "Valinnainen" },
];

export const OPTIONAL_MANDATORITIES: WorkspaceMandatority[] = [
  "SCHOOL_LEVEL_OPTIONAL",
  "NATIONAL_LEVEL_OPTIONAL",
  "UNSPECIFIED_OPTIONAL",
];

/**
 * Check if a mandatority matches a filter
 * @param mandatority - The mandatority to check
 * @param selected - The selected filters
 * @returns True if the mandatority matches the filter, false otherwise
 */
export function matchesMandatorityFilter(
  mandatority: WorkspaceMandatority | null | undefined,
  selected: MandatorityFilter[]
): boolean {
  if (selected.length === 0) return true;
  if (mandatority == null) return false;
  const isMandatory = mandatority === "MANDATORY";
  const isOptional = OPTIONAL_MANDATORITIES.includes(mandatority);
  return (
    (selected.includes("mandatory") && isMandatory) ||
    (selected.includes("optional") && isOptional)
  );
}

/**
 * Check if a value is a valid MandatorityFilter
 * @param value - The value to check
 * @returns True if the value is a valid MandatorityFilter, false otherwise
 */
export function isMandatorityFilter(value: string): value is MandatorityFilter {
  return value === "mandatory" || value === "optional";
}
