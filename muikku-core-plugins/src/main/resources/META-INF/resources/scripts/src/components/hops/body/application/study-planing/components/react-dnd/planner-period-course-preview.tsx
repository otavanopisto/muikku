import * as React from "react";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { StateType } from "~/reducers";
import { useSelector } from "react-redux";
import {
  PlannerCardContent,
  PlannerCardHeader,
  PlannerCardLabel,
} from "../planner-card";

import { PlannerCard } from "../planner-card";
import { localize } from "~/locales/i18n";

/**
 * PlannerPeriodCourseCardPreviewProps
 */
interface PlannerPeriodCourseCardPreviewProps {
  course: PlannedCourseWithIdentifier;
}

/**
 * Planner course preview card. For dnd
 * @param props props
 */
const PlannerPeriodCourseCardPreview: React.FC<
  PlannerPeriodCourseCardPreviewProps
> = (props) => {
  const { course } = props;

  const curriculumConfig = useSelector(
    (state: StateType) => state.hopsNew.hopsCurriculumConfig
  );

  const startDate = new Date(course.startDate);

  // Calculate the end date of the course from the start date and duration
  const calculatedEndDate = course.duration
    ? new Date(startDate.getTime() + course.duration)
    : null;

  // Set the inner container modifiers based on the course's mandatory status
  // creates a distinction between mandatory and optional courses
  const innerContainerModifiers = course.mandatory
    ? ["mandatory"]
    : ["optional"];

  return (
    <PlannerCard
      modifiers={["planned-course-card", "preview"]}
      innerContainerModifiers={innerContainerModifiers}
    >
      <PlannerCardHeader modifiers={["planned-course-card"]}>
        <span className="study-planner__course-name">
          <b>{`${course.subjectCode} ${course.courseNumber}. `}</b>
          {`${course.name}, ${curriculumConfig.strategy.getCourseDisplayedLength(course)}`}
        </span>
      </PlannerCardHeader>

      <PlannerCardContent modifiers={["planned-course-card"]}>
        <div className="study-planner__course-labels">
          <PlannerCardLabel
            modifiers={[course.mandatory ? "mandatory" : "optional"]}
          >
            {course.mandatory ? "PAKOLLINEN" : "VALINNAINEN"}
          </PlannerCardLabel>
        </div>
        <div className="study-planner__course-dates">
          {calculatedEndDate ? (
            <>
              {localize.date(startDate)} - {localize.date(calculatedEndDate)}
            </>
          ) : (
            localize.date(startDate)
          )}
        </div>
      </PlannerCardContent>
    </PlannerCard>
  );
};

export default PlannerPeriodCourseCardPreview;
