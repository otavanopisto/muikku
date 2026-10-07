import type { CoursepickerSearchView, CoursepickerSectionData } from "../types";

const VIEW_SECTION_IDS: Record<CoursepickerSearchView, string[]> = {
  All: ["suggested", "myCourses", "available"],
  Suggested: ["suggested"],
  MyCourses: ["myCourses"],
  // Mock: reuse available list until unpublished data exists
  Unpublished: ["available"],
};

/**
 * Filters mock/API sections by nav view and auth.
 */
export function getVisibleSections(options: {
  sections: CoursepickerSectionData[];
  view: CoursepickerSearchView;
  isAuthenticated: boolean;
}): CoursepickerSectionData[] {
  const { sections, view, isAuthenticated } = options;

  if (!isAuthenticated) {
    return sections.filter((section) => section.id === "available");
  }

  const allowedIds = VIEW_SECTION_IDS[view];
  return sections.filter((section) => allowedIds.includes(section.id));
}
