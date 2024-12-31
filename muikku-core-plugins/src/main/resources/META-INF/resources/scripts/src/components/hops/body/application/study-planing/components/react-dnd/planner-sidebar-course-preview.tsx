import * as React from "react";
import { Course } from "~/@types/shared";
import {
  PlannerCard,
  PlannerCardContent,
  PlannerCardHeader,
  PlannerCardLabel,
} from "../planner-card";

/**
 * PlannerSidebarCoursePreview props
 */
interface PlannerSidebarCoursePreviewProps {
  course: Course;
  subjectCode: string;
}

/**
 * PlannerSidebarCoursePreview component
 * @param props props
 */
const PlannerSidebarCoursePreview: React.FC<
  PlannerSidebarCoursePreviewProps
> = (props) => {
  const { course, subjectCode } = props;

  const type = course.mandatory ? "mandatory" : "optional";

  return (
    <PlannerCard modifiers={["sidebar-course-card", "preview"]}>
      <PlannerCardHeader modifiers={["sidebar-course-card"]}>
        <span className="planner-sidebar-course__code">{`${subjectCode} ${course.courseNumber}. `}</span>
        <span className="planner-sidebar-course__name">{course.name}</span>
      </PlannerCardHeader>

      <PlannerCardContent modifiers={["planned-course-card"]}>
        <PlannerCardLabel modifiers={[type]}>
          {type === "mandatory" ? "PAKOLLINEN" : "VALINNAINEN"}
        </PlannerCardLabel>
        <PlannerCardLabel modifiers={["course-length"]}>
          {course.length} op
        </PlannerCardLabel>
      </PlannerCardContent>
    </PlannerCard>
  );
};

export default PlannerSidebarCoursePreview;
