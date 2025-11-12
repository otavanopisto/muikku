import * as React from "react";
import { StudyPlannerNoteWithIdentifier } from "~/reducers/hops";
import PlannerPeriodNote from "./planner-period-note";

/**
 * PlannerPlannedList props
 */
interface PlannerNotesListProps {
  disabled: boolean;
  notes: StudyPlannerNoteWithIdentifier[];
  //   selectedCoursesIds: string[];
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
  const { disabled, notes } = props;

  return (
    <ul className="study-planner__planned-list">
      {notes.map((note) => (
        // const isSelected = selectedCoursesIds.some(
        //   (courseIdentifier) => courseIdentifier === course.identifier
        // );

        // const courseActivity = studyActivity.find(
        //   (sa) =>
        //     sa.courseNumber === course.courseNumber &&
        //     sa.subject === course.subjectCode
        // );

        // const originalInfo = originalPlannedCourses.find(
        //   (c) => c.identifier === course.identifier
        // );

        // const hasChanges = originalInfo
        //   ? !_.isEqual(originalInfo, course)
        //   : true;

        <li key={note.identifier} className="study-planner__planned-list-item">
          <PlannerPeriodNote
            key={note.identifier}
            disabled={disabled}
            note={note}
            selected={false}
            hasChanges={false}
            onNoteChange={(note, action) => {
              console.log("onNoteChange", note, action);
            }}
            onSelectNote={(note) => {
              console.log("onSelectNote", note);
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default PlannerNotesList;
