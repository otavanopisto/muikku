import { TFunction } from "i18next";
import * as React from "react";
import { PageLocation } from "~/@types/shared";
import {
  AttachmentsTab,
  ExamAttendeesTab,
  ExamCategoriesTab,
  ExamSettingsTab,
  ExamSmowlIntegrationTab,
  MaterialContentTab,
  MetadataTab,
  SectionContentTab,
} from "./editor-tabs";

/**
 * Tab configuration interface
 */
export interface EditorTab {
  id: string;
  name: string;
  component: JSX.Element;
  stateManagement: "redux" | "local" | "hybrid";
  visible: boolean;
}

/**
 * Editor permissions interface
 */
export interface EditorPermissions {
  editable?: boolean;
  canDelete?: boolean;
  canHide?: boolean;
  disablePlugins?: boolean;
  canPublish?: boolean;
  canRevert?: boolean;
  canRestrictView?: boolean;
  canCopy?: boolean;
  canChangePageType?: boolean;
  canChangeExerciseType?: boolean;
  canSetLicense?: boolean;
  canSetProducers?: boolean;
  canAddAttachments?: boolean;
  canEditContent?: boolean;
  canSetTitle?: boolean;
}

/**
 * Editor strategy interface for different entity types
 */
export interface EditorStrategy {
  /**
   * Get tabs for the editor
   * @param examEnabled - Whether exam is enabled
   * @param permissions - Permissions for the editor
   * @returns Tabs for the editor
   */
  getTabs(
    examEnabled: boolean,
    smowlEnabled: boolean,
    permissions: EditorPermissions,
    t: TFunction,
    locationPage?: PageLocation
  ): EditorTab[];
}

/**
 * Base editor strategy with common functionality
 */
export abstract class BaseEditorStrategy implements EditorStrategy {
  abstract getTabs(
    examEnabled: boolean,
    smowlEnabled: boolean,
    permissions: EditorPermissions,
    t: TFunction,
    locationPage?: PageLocation
  ): EditorTab[];

  /**
   * Check if a tab should be visible based on permissions and state
   * @param tabId - Id of the tab
   * @param permissions - Permissions for the editor
   * @param examEnabled - Whether exam is enabled
   * @param smowlEnabled - Whether smowl is enabled
   * @returns True if the tab should be visible, false otherwise
   */
  protected shouldShowTab(
    tabId: string,
    permissions: EditorPermissions,
    examEnabled: boolean,
    smowlEnabled: boolean
  ): boolean {
    // Override in subclasses for specific logic
    return true;
  }
}

/**
 * Strategy for editing sections (folders)
 */
export class SectionEditorStrategy extends BaseEditorStrategy {
  /**
   * Check if a tab should be visible based on permissions and state
   * @param tabId - Id of the tab
   * @param permissions - Permissions for the editor
   * @param examEnabled - Whether exam is enabled
   * @returns True if the tab should be visible, false otherwise
   */
  protected shouldShowTab(
    tabId: string,
    permissions: EditorPermissions,
    examEnabled: boolean
  ): boolean {
    // Custom logic for sections
    switch (tabId) {
      case "content":
        // Content tab is visible when exam is not enabled
        return true;

      default:
        return true;
    }
  }

  /**
   * Get tabs for the section editor
   * @param examEnabled - Whether exam is enabled
   * @param smowlEnabled - Whether smowl is enabled
   * @param permissions - Permissions for the editor
   * @param t - Localization function
   * @returns Tabs for the section editor
   */
  getTabs(
    examEnabled: boolean,
    smowlEnabled: boolean,
    permissions: EditorPermissions,
    t: TFunction
  ): EditorTab[] {
    const tabs: EditorTab[] = [
      {
        id: "content",
        name: t("labels.content", { ns: "materials" }),
        // eslint-disable-next-line jsdoc/require-jsdoc
        component: (
          <SectionContentTab
            editorPermissions={permissions}
            examEnabled={examEnabled}
          />
        ),
        stateManagement: "redux",
        visible: true,
      },
    ];

    return tabs;
  }
}

/**
 * Strategy for editing sections (folders)
 */
export class ExamSectionEditorStrategy extends BaseEditorStrategy {
  /**
   * Check if a tab should be visible based on permissions and state
   * @param tabId - Id of the tab
   * @param permissions - Permissions for the editor
   * @param examEnabled - Whether exam is enabled
   * @param smowlEnabled - Whether smowl is enabled
   * @returns True if the tab should be visible, false otherwise
   */
  protected shouldShowTab(
    tabId: string,
    permissions: EditorPermissions,
    examEnabled: boolean,
    smowlEnabled = false
  ): boolean {
    // Custom logic for sections
    switch (tabId) {
      case "content":
      case "exam-attendees":
      case "exam-categories":
        // Only show exam tabs
        return true;

      case "smowl":
        // Smowl tab is only visible if smowlEnabled is true
        return smowlEnabled;

      default:
        return true;
    }
  }

  /**
   * Get tabs for the section editor
   * @param examEnabled - Whether exam is enabled
   * @param smowlEnabled - Whether smowl is enabled
   * @param permissions - Permissions for the editor
   * @param t - Localization function
   * @returns Tabs for the section editor
   */
  getTabs(
    examEnabled: boolean,
    smowlEnabled: boolean,
    permissions: EditorPermissions,
    t: TFunction
  ): EditorTab[] {
    const tabs: EditorTab[] = [
      {
        id: "content",
        name: t("labels.examSettings", { ns: "exams" }),
        // eslint-disable-next-line jsdoc/require-jsdoc
        component: (
          <ExamSettingsTab
            editorPermissions={permissions}
            examEnabled={examEnabled}
          />
        ),
        stateManagement: "redux",
        visible: true,
      },
    ];

    if (this.shouldShowTab("exam-categories", permissions, examEnabled)) {
      tabs.push({
        id: "exam-categories",
        name: t("labels.examCategories", { ns: "exams" }),
        component: (
          <ExamCategoriesTab
            editorPermissions={permissions}
            examEnabled={examEnabled}
          />
        ),
        stateManagement: "redux",
        visible: true,
      });
    }

    if (
      this.shouldShowTab("exam-smowl", permissions, examEnabled, smowlEnabled)
    ) {
      tabs.push({
        id: "exam-smowl",
        name: "Smowl Integration",
        component: (
          <ExamSmowlIntegrationTab
            editorPermissions={permissions}
            examEnabled={examEnabled}
          />
        ),
        stateManagement: "redux",
        visible: true,
      });
    }

    if (this.shouldShowTab("exam-attendees", permissions, examEnabled)) {
      tabs.push({
        id: "exam-attendees",
        name: t("labels.examParticipants", { ns: "exams" }),
        component: (
          <ExamAttendeesTab
            editorPermissions={permissions}
            examEnabled={examEnabled}
          />
        ),
        stateManagement: "redux",
        visible: true,
      });
    }

    return tabs;
  }
}

/**
 * Strategy for editing material pages
 */
export class MaterialPageEditorStrategy extends BaseEditorStrategy {
  /**
   * Check if a tab should be visible based on permissions and state
   * @param tabId - Id of the tab
   * @param permissions - Permissions for the editor
   * @param examEnabled - Whether exam is enabled
   * @returns True if the tab should be visible, false otherwise
   */
  protected shouldShowTab(
    tabId: string,
    permissions: EditorPermissions,
    examEnabled: boolean
  ): boolean {
    // Custom logic for material pages
    switch (tabId) {
      case "metadata":
        // Metadata tab is only visible if canSetLicense or canSetProducers is true
        return permissions.canSetLicense || permissions.canSetProducers;

      case "attachments":
        // Attachments tab is only visible if canAddAttachments is true
        return permissions.canAddAttachments;

      default:
        return true;
    }
  }

  /**
   * Get tabs for the material page editor
   * @param examEnabled - Whether exam is enabled
   * @param smowlEnabled - Whether smowl is enabled
   * @param permissions - Permissions for the editor
   * @param t - Localization function
   * @param locationPage - Location page
   * @returns Tabs for the material page editor
   */
  getTabs(
    examEnabled: boolean,
    smowlEnabled: boolean,
    permissions: EditorPermissions,
    t: TFunction,
    locationPage?: PageLocation
  ): EditorTab[] {
    const tabs: EditorTab[] = [
      {
        id: "content",
        name: t("labels.content", { ns: "materials" }),
        // eslint-disable-next-line jsdoc/require-jsdoc
        component: (
          <MaterialContentTab
            editorPermissions={permissions}
            examEnabled={examEnabled}
            locationPage={locationPage}
          />
        ),
        stateManagement: "redux",
        visible: true,
      },
    ];

    // Material-specific tabs
    if (this.shouldShowTab("metadata", permissions, examEnabled)) {
      tabs.push({
        id: "metadata",
        name: t("labels.metadata", { ns: "materials" }),
        // eslint-disable-next-line jsdoc/require-jsdoc
        component: (
          <MetadataTab
            editorPermissions={permissions}
            examEnabled={examEnabled}
          />
        ),
        stateManagement: "redux",
        visible: true,
      });
    }

    if (this.shouldShowTab("attachments", permissions, examEnabled)) {
      tabs.push({
        id: "attachments",
        name: t("labels.attachments", { ns: "materials" }),
        // eslint-disable-next-line jsdoc/require-jsdoc
        component: (
          <AttachmentsTab
            editorPermissions={permissions}
            examEnabled={examEnabled}
          />
        ),
        stateManagement: "redux",
        visible: true,
      });
    }

    return tabs;
  }
}

/**
 * Factory function to get the appropriate editor strategy
 * @param entityType - Type of the entity
 * @param hasExam - Whether exam is enabled
 * @returns Appropriate editor strategy
 */
export const getEditorStrategy = (
  entityType: "section" | "material",
  hasExam: boolean
): EditorStrategy => {
  if (entityType === "section") {
    return hasExam
      ? new ExamSectionEditorStrategy()
      : new SectionEditorStrategy();
  } else {
    return new MaterialPageEditorStrategy();
  }
};
