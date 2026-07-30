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
