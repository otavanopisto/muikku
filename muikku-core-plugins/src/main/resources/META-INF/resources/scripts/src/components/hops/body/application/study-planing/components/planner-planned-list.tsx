import * as React from "react";
import { CourseChangeAction } from "~/reducers/hops";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { StudentStudyActivity } from "~/generated/client";
import { CurriculumConfig } from "~/util/curriculum-config";
import PlannerPeriodCourseCard from "./planner-period-course";
import _ from "lodash";
import { AnimatePresence, motion } from "framer-motion";

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
    <ul>
      <AnimatePresence initial={false}>
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

          return (
            <motion.li
              key={course.identifier}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              style={{ width: "100%" }}
              layout="position"
            >
              <PlannerPeriodCourseCard
                disabled={disabled}
                key={course.identifier}
                course={course}
                selected={isSelected}
                hasChanges={hasChanges}
                curriculumConfig={curriculumConfig}
                studyActivity={courseActivity}
                onCourseChange={onCourseChange}
                onSelectCourse={onSelectCourse}
              />
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
};

export default PlannerPlannedList;
