import * as React from "react";
import { Course } from "~/@types/shared";

/**
 * CourseItem props
 */
interface CourseItemProps {
  course: Course;
  subjectCode: string;
  onClick?: () => void;
}

/**
 * CourseItem component
 * @param props props
 */
const CourseItem: React.FC<CourseItemProps> = (props) => {
  const { course, subjectCode, onClick } = props;

  const type = course.mandatory ? "mandatory" : "optional";

  return (
    <div className="hops-planner__course-item" onClick={onClick}>
      <div className="hops-planner_course-item-header">
        <span className="hops-planner__course-code">{subjectCode}</span>
        <span className="hops-planner__course-name">
          {course.name}, {course.length} op
        </span>
      </div>

      <div className="hops-planner__course-item-content">
        <span
          className={`hops-planner__course-type hops-planner__course-type--${type}`}
        >
          {type === "mandatory" ? "PAKOLLINEN" : "VALINNAINEN"}
        </span>
      </div>
    </div>
  );
};

export default CourseItem;
