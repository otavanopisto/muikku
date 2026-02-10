import Dialog from "~/components/general/dialog";
import React, { useMemo, useState } from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import PlannerCourseTray from "../planner-course-tray";
import { DndProvider, useDragDropManager } from "react-dnd";
import PlannerAddNote from "../planner-add-note";
import { updateSelectedPlanItem } from "~/actions/main-function/hops";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { CourseMatrixModuleEnriched } from "~/@types/course-matrix";

/**
 * Props for the EditHopsEventDescriptionDialog component
 */
interface PlannerMonthEditDialogProps {
  title: string;
  disabled: boolean;
  onConfirm: (selectedMonthItemIds: string[]) => void;
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
  const { onConfirm, children, plannedCourses, currentSelection, title } =
    props;

  const manager = useDragDropManager();

  const { selectedPlanItemIds } = useSelector(
    (state: StateType) => state.hopsNew.hopsEditing
  );

  const [selectedMonthItems, setSelectedMonthItems] = useState<
    (
      | PlannedCourseWithIdentifier
      | (CourseMatrixModuleEnriched & { subjectCode: string })
    )[]
  >(currentSelection.map((course) => course));

  const { t } = useTranslation(["hops_new", "common"]);

  const hasChanges = useMemo(
    () =>
      selectedMonthItems.length !== currentSelection.length ||
      selectedMonthItems.some(
        (selected) =>
          !currentSelection.some(
            (current) => current.identifier === selected.identifier
          )
      ),
    [selectedMonthItems, currentSelection]
  );

  const dispatch = useDispatch();

  /**
   * Handles activate new note
   */
  const handleActivateNewNote = () => {
    dispatch(updateSelectedPlanItem({ planItemIdentifier: "new-note-card" }));
  };

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
        if (selectedPlanItemIds.includes("new-note-card")) {
          onConfirm([
            ...selectedMonthItems.map((item) => item.identifier),
            "new-note-card",
          ]);
        } else {
          onConfirm(selectedMonthItems.map((item) => item.identifier));
        }
      }
      setSelectedMonthItems([]);
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
  const handleCourseClick = (
    course: CourseMatrixModuleEnriched & { subjectCode: string }
  ) => {
    const index = selectedMonthItems.findIndex(
      (selected) =>
        selected.subjectCode === course.subjectCode &&
        selected.courseNumber === course.courseNumber
    );

    const updatedSelectedPlanItemIds = [...selectedMonthItems];

    if (index !== -1) {
      updatedSelectedPlanItemIds.splice(index, 1);
    } else {
      updatedSelectedPlanItemIds.push(course);
    }

    setSelectedMonthItems(updatedSelectedPlanItemIds);
  };

  /**
   * Handles the dialog open
   */
  const handleOnDialogOpen = () => {
    setSelectedMonthItems(currentSelection);
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
      <PlannerAddNote
        disabled={false}
        activated={selectedPlanItemIds.includes("new-note-card")}
        onActivateNewNote={handleActivateNewNote}
      />
      <PlannerCourseTray
        plannedCourses={plannedCoursesWithoutCurrentSelection}
        onCourseClick={handleCourseClick}
        isCourseSelected={(course) =>
          selectedMonthItems.some(
            (selected) =>
              selected.subjectCode === course.subjectCode &&
              selected.courseNumber === course.courseNumber
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
      title={title}
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
