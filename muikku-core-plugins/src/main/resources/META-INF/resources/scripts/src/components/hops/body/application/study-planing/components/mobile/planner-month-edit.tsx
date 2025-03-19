import Dialog from "~/components/general/dialog";
import React, { useMemo, useState } from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";
import { PlannedCourseWithIdentifier, SelectedCourse } from "~/reducers/hops";
import PlannerCourseTray from "../planner-course-tray";
import { Course } from "~/@types/shared";
import { DndProvider, useDragDropManager } from "react-dnd";

/**
 * Props for the EditHopsEventDescriptionDialog component
 */
interface PlannerMonthEditDialogProps {
  disabled: boolean;
  timeContext: Date;
  onConfirm: (selectedCourses: SelectedCourse[]) => void;
  children?: React.ReactElement;
  plannedCourses: PlannedCourseWithIdentifier[];
  currentSelection: PlannedCourseWithIdentifier[];
}

/**
 * A dialog component for editing the description of a HOPS event
 * @param props - The component props
 * @returns A React functional component
 */
const PlannerMonthEditDialog: React.FC<PlannerMonthEditDialogProps> = (
  props
) => {
  const { onConfirm, children, plannedCourses, timeContext, currentSelection } =
    props;

  const manager = useDragDropManager();

  const [selectedCourses, setSelectedCourses] =
    useState<SelectedCourse[]>(currentSelection);

  const { t } = useTranslation(["hops_new", "common"]);

  const hasChanges = useMemo(
    () =>
      selectedCourses.length !== currentSelection.length ||
      selectedCourses.some(
        (selected) =>
          !currentSelection.some(
            (current) =>
              current.subjectCode === selected.subjectCode &&
              current.courseNumber === selected.courseNumber
          )
      ),
    [selectedCourses, currentSelection]
  );

  /**
   * Handles the save button click
   * @param closePortal - Function to close the dialog
   * @returns Click event handler
   */
  const handleConfirmClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      // Only call onConfirm if the selection has actually changed
      if (hasChanges) {
        onConfirm(selectedCourses);
      }
      setSelectedCourses([]);
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
        onCourseClick={handleCourseClick}
        isCourseSelected={(course) =>
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
        buttonModifiers={["standard-ok", "execute"]}
        onClick={handleConfirmClick(closePortal)}
        disabled={!hasChanges}
      >
        {t("actions.save", { ns: "common" })}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={handleCancelClick(closePortal)}
      >
        {t("actions.cancel", {
          ns: "common",
        })}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="study-planner-edit-month"
      disableScroll={true}
      title={`${timeContext.toLocaleDateString("fi-FI", {
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
