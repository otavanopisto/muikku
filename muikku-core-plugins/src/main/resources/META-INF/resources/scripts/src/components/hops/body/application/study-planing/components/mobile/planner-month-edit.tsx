import Dialog from "~/components/general/dialog";
import React, { useState } from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";
import {
  isUnplannedCourse,
  PlannedCourseWithIdentifier,
  SelectedCourse,
} from "~/reducers/hops";
import PlannerCourseTray from "../planner-course-tray";
import { CurriculumConfig } from "~/util/curriculum-config";
import { Course } from "~/@types/shared";
import { DndProvider, useDragDropManager } from "react-dnd";

/**
 * Props for the EditHopsEventDescriptionDialog component
 */
interface PlannerMonthEditDialogProps {
  timeContext: Date;
  onConfirm: (selectedCourses: SelectedCourse[]) => void;
  children?: React.ReactElement;
  plannedCourses: PlannedCourseWithIdentifier[];
  currentSelection: PlannedCourseWithIdentifier[];
  curriculumConfig: CurriculumConfig;
}

/**
 * A dialog component for editing the description of a HOPS event
 * @param props - The component props
 * @returns A React functional component
 */
const PlannerMonthEditDialog: React.FC<PlannerMonthEditDialogProps> = (
  props
) => {
  const {
    onConfirm,
    children,
    curriculumConfig,
    plannedCourses,
    timeContext,
    currentSelection,
  } = props;

  const manager = useDragDropManager();

  const [selectedCourses, setSelectedCourses] =
    useState<SelectedCourse[]>(currentSelection);

  const { t } = useTranslation(["hops_new", "common"]);

  /**
   * Handles the save button click
   * @param closePortal - Function to close the dialog
   * @returns Click event handler
   */
  const handleConfirmClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onConfirm(selectedCourses);
      closePortal();
    };

  /**
   * Handles the cancel button click
   * @param closePortal - Function to close the dialog
   * @returns Click event handler
   */
  const handleCancelClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      closePortal();
    };

  /**
   * Handles course click
   * @param course course
   */
  const handleCourseClick = (course: Course & { subjectCode: string }) => {
    const index = selectedCourses.findIndex(
      (c) =>
        isUnplannedCourse(c) &&
        c.subjectCode === course.subjectCode &&
        c.courseNumber === course.courseNumber
    );

    const updatedSelectedCourses = [...selectedCourses];

    if (index !== -1) {
      updatedSelectedCourses.splice(index, 1);
    } else {
      updatedSelectedCourses.push(course);
    }

    setSelectedCourses(updatedSelectedCourses);
  };

  /**
   * Handles the dialog open
   */
  const handleOnDialogOpen = () => {
    setSelectedCourses(currentSelection);
  };

  const currentSelectionIdentifiers = currentSelection.map(
    (course) => course.identifier
  );

  const plannedCoursesWithoutCurrentSelection = plannedCourses.filter(
    (course) => !currentSelectionIdentifiers.includes(course.identifier)
  );

  /**
   * Renders the dialog content
   * @returns The dialog content
   */
  const dialogContent = () => (
    <DndProvider manager={manager}>
      <PlannerCourseTray
        plannedCourses={plannedCoursesWithoutCurrentSelection}
        curriculumConfig={curriculumConfig}
        selectedCourses={selectedCourses}
        onCourseClick={handleCourseClick}
        isSelected={(course) =>
          selectedCourses.some(
            (c) =>
              c.subjectCode === course.subjectCode &&
              c.courseNumber === course.courseNumber
          )
        }
      />
    </DndProvider>
  );

  /**
   * Renders the dialog footer
   * @param closePortal - Function to close the dialog
   * @returns The dialog footer
   */
  const footer = (closePortal: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "fatal"]}
        onClick={handleConfirmClick(closePortal)}
      >
        {t("actions.continue", { ns: "hops_new" })}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={handleCancelClick(closePortal)}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="confirm-remove-answer-dialog"
      disableScroll={true}
      title={`Ajankohta ${timeContext.toLocaleDateString("fi-FI", {
        month: "long",
        year: "numeric",
      })}`}
      content={dialogContent}
      footer={footer}
      closeOnOverlayClick={false}
      onOpen={handleOnDialogOpen}
    >
      {children}
    </Dialog>
  );
};

export default PlannerMonthEditDialog;
