import * as React from "react";
import {
  StudyPlanChangeAction,
  StudyPlannerNoteWithIdentifier,
} from "~/reducers/hops";
import PlannerPeriodNote from "./planner-period-note";
import _ from "lodash";

/**
 * PlannerPlannedList props
 */
interface PlannerNotesListProps {
  disabled: boolean;
  notes: StudyPlannerNoteWithIdentifier[];
  originalNotes: StudyPlannerNoteWithIdentifier[];
  onNoteChange: (
    note: StudyPlannerNoteWithIdentifier,
    action: StudyPlanChangeAction
  ) => void;
  //   selectedPlanItemIds: string[];
  //   originalPlannedCourses: PlannedCourseWithIdentifier[];
  //   studyActivity: StudentStudyActivity[];
  //   onCourseChange: (
  //     course: PlannedCourseWithIdentifier,
  //     action: StudyPlanChangeAction
  //   ) => void;
  //   onSelectCourse: (course: PlannedCourseWithIdentifier) => void;
}

/**
 * PlannerPlannedList component to handle the rendering of course cards
 * @param props props
 */
const PlannerNotesList = (props: PlannerNotesListProps) => {
  const { disabled, notes, originalNotes, onNoteChange } = props;

  return (
    <ul className="study-planner__planned-list">
      {notes.map((note) => {
        // const isSelected = selectedPlanItemIds.some(
        //   (courseIdentifier) => courseIdentifier === course.identifier
        // );

        const originalInfo = originalNotes.find(
          (n) => n.identifier === note.identifier
        );

        const hasChanges = originalInfo ? !_.isEqual(originalInfo, note) : true;

        return (
          <li
            key={note.identifier}
            className="study-planner__planned-list-item"
          >
            <PlannerPeriodNote
              key={note.identifier}
              disabled={disabled}
              note={note}
              selected={false}
              hasChanges={hasChanges}
              onNoteChange={onNoteChange}
              onSelectNote={(note) => {
                console.log("onSelectNote", note);
              }}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default PlannerNotesList;
