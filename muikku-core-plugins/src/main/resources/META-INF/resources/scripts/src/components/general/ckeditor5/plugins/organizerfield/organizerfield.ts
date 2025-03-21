import { Plugin } from "@ckeditor/ckeditor5-core";
import OrganizerFieldEditing from "./organizerfield-editing";
import OrganizerFieldUI from "./organizerfield-ui";

/**
 * Organizer field data interface
 */
export interface OrganizerFieldData {
  name?: string;
  termTitle: string;
  categories: CategoryData[];
}

/**
 * Category data interface
 */
export interface CategoryData {
  id: string;
  name: string;
  terms: TermData[];
}

/**
 * Term data interface
 */
export interface TermData {
  id: string;
  text: string;
}

/**
 * Form data interface
 */
export interface FormData {
  termTitle: string;
  categories: CategoryData[];
  terms: TermData[];
}

/**
 * Category element data interface
 */
export interface CategoryElementData {
  id: string;
  name: string;
  terms: TermData[];
}

/**
 * Organizer field attributes interface
 */
export interface OrganizerFieldAttributes {
  name: string;
  termTitle: string;
  categories: string; // JSON string of CategoryData[]
  terms: string; // JSON string of TermData[]
}

/**
 * Balloon position data interface
 */
export interface BalloonPositionData {
  target: HTMLElement;
  positions?: Array<unknown>;
}

/**
 * @module muikku-organizerfield
 */
export default class OrganizerField extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return "MuikkuOrganizerField";
  }

  /**
   * @inheritDoc
   */
  static get requires() {
    return [OrganizerFieldEditing, OrganizerFieldUI];
  }
}
