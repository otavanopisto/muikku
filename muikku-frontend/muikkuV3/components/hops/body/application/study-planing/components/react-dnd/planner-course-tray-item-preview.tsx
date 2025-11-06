import * as React from "react";
import { useSelector } from "react-redux";
import { Course } from "~/@types/shared";
import { StateType } from "~/reducers";
import {
  PlannerCard,
  PlannerCardContent,
  PlannerCardHeader,
  PlannerCardLabel,
} from "../planner-card";

/**
 * PlannerCourseTrayItemPreview props
 */
interface PlannerCourseTrayItemPreviewProps {
  course: Course;
  subjectCode: string;
}

/**
 * PlannerCourseTrayItemPreview component
 * @param props props
 */
const PlannerCourseTrayItemPreview: React.FC<
  PlannerCourseTrayItemPreviewProps
> = (props) => {
  const { course, subjectCode } = props;

  const curriculumConfig = useSelector(
    (state: StateType) => state.hopsNew.hopsCurriculumConfig
  );

  const typeModifiers = course.mandatory ? ["mandatory"] : ["optional"];

  return (
    <div className="study-planner__course-tray-item">
      <PlannerCard
        modifiers={["course-tray-item", "preview"]}
        innerContainerModifiers={typeModifiers}
      >
        <PlannerCardHeader modifiers={["course-tray-item"]}>
          <span className="planner-course-tray-item__name">
            <b>{`${subjectCode} ${course.courseNumber}. `}</b>
            {`${course.name}, ${curriculumConfig.strategy.getCourseDisplayedLength(course)}`}
          </span>
        </PlannerCardHeader>

        <PlannerCardContent modifiers={["planned-course-card"]}>
          <div className="study-planner__course-labels">
            <PlannerCardLabel modifiers={typeModifiers}>
              {course.mandatory ? "PAKOLLINEN" : "VALINNAINEN"}
            </PlannerCardLabel>
          </div>
        </PlannerCardContent>
      </PlannerCard>
    </div>
  );
};

export default PlannerCourseTrayItemPreview;
