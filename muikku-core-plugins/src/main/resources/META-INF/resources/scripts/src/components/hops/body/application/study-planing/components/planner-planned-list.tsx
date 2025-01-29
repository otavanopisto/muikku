import * as React from "react";
import { CourseChangeAction } from "~/reducers/hops";
import { SelectedCourse } from "~/reducers/hops";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { StudentStudyActivity } from "~/generated/client";
import { isPlannedCourseWithIdentifier } from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import PlannerPeriodCourseCard from "./planner-period-course";
import _ from "lodash";

/**
 * PlannerPlannedList props
 */
interface PlannerPlannedListProps {
  courses: PlannedCourseWithIdentifier[];
  selectedCourses: SelectedCourse[];
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
    courses,
    selectedCourses,
    originalPlannedCourses,
    studyActivity,
    curriculumConfig,
    onCourseChange,
    onSelectCourse,
  } = props;

  return (
    <div className="study-planner__month-content">
      {courses.map((course) => {
        const isSelected = selectedCourses.some(
          (c) =>
            isPlannedCourseWithIdentifier(c) &&
            c.identifier === course.identifier
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

        return (
          <PlannerPeriodCourseCard
            key={course.identifier}
            course={course}
            selected={isSelected}
            hasChanges={hasChanges}
            curriculumConfig={curriculumConfig}
            studyActivity={courseActivity}
            onCourseChange={onCourseChange}
            onSelectCourse={onSelectCourse}
          />
        );
      })}
    </div>
  );
};

export default PlannerPlannedList;
