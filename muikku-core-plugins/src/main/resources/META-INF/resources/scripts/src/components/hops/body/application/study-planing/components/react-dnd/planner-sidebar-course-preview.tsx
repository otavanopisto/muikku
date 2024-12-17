import * as React from "react";
import { Course } from "~/@types/shared";

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
    <div className="planner-sidebar-course planner-sidebar-course--preview">
      <div className="planner-sidebar-course__header">
        <span className="planner-sidebar-course__code">{subjectCode}</span>
        <span className="planner-sidebar-course__name">
          {course.name}, {course.length} op
        </span>
      </div>

      <div className="planner-sidebar-course__content">
        <span
          className={`planner-sidebar-course__type planner-sidebar-course__type--${type}`}
        >
          {type === "mandatory" ? "PAKOLLINEN" : "VALINNAINEN"}
        </span>
      </div>
    </div>
  );
};

export default PlannerSidebarCoursePreview;
