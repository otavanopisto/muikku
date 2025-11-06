import * as React from "react";
import { CourseChangeAction } from "~/reducers/hops";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { StudentStudyActivity } from "~/generated/client";
import { CurriculumConfig } from "~/util/curriculum-config";
import PlannerPeriodCourseCard from "./planner-period-course";
import _ from "lodash";

/**
 * PlannerPlannedList props
 */
interface PlannerPlannedListProps {
  disabled: boolean;
  courses: PlannedCourseWithIdentifier[];
  selectedCoursesIds: string[];
  originalPlannedCourses: PlannedCourseWithIdentifier[];
  studyActivity: StudentStudyActivity[];
  curriculumConfig: CurriculumConfig;
  onCourseChange: (
    course: PlannedCourseWithIdentifier,
    action: CourseChangeAction
  ) => void;
  onSelectCourse: (course: PlannedCourseWithIdentifier) => void;
}

/**
 * PlannerPlannedList component to handle the rendering of course cards
 * @param props props
 */
const PlannerPlannedList = (props: PlannerPlannedListProps) => {
  const {
    disabled,
    courses,
    selectedCoursesIds,
    originalPlannedCourses,
    studyActivity,
    curriculumConfig,
    onCourseChange,
    onSelectCourse,
  } = props;

  return (
    <ul className="study-planner__planned-list">
      {courses.map((course) => {
        const isSelected = selectedCoursesIds.some(
          (courseIdentifier) => courseIdentifier === course.identifier
        );

        const courseActivity = studyActivity.find(
          (sa) =>
            sa.courseNumber === course.courseNumber &&
            sa.subject === course.subjectCode
        );

        const originalInfo = originalPlannedCourses.find(
          (c) => c.identifier === course.identifier
        );

        const hasChanges = originalInfo
          ? !_.isEqual(originalInfo, course)
          : true;

        const isGraded = courseActivity && courseActivity.status === "GRADED";

        return (
          <li
            key={course.identifier}
            className="study-planner__planned-list-item"
          >
            <PlannerPeriodCourseCard
              key={course.identifier}
              disabled={disabled || isGraded}
              course={course}
              selected={isSelected}
              hasChanges={hasChanges}
              curriculumConfig={curriculumConfig}
              studyActivity={courseActivity}
              onCourseChange={onCourseChange}
              onSelectCourse={onSelectCourse}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default PlannerPlannedList;
