import * as React from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Course } from "~/@types/shared";

/**
 * PlannerSidebarCourse props
 */
interface PlannerSidebarCourseProps {
  course: Course;
  subjectCode: string;
  onClick?: () => void;
}

/**
 * PlannerSidebarCourse component
 * @param props props
 */
const PlannerSidebarCourse: React.FC<PlannerSidebarCourseProps> = (props) => {
  const { course, subjectCode, onClick } = props;

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "new-course-card",
      item: {
        info: { ...course, subjectCode },
        type: "new-course-card",
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  const type = course.mandatory ? "mandatory" : "optional";

  return (
    <div
      className={`planner-sidebar-course ${isDragging ? "is-dragging" : ""}`}
      onClick={onClick}
      ref={drag}
    >
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

export default PlannerSidebarCourse;
