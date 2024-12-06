import * as React from "react";

interface CourseItemProps {
  code: string;
  name: string;
  credits: number;
  type: "mandatory" | "optional";
  onClick?: () => void;
}

const CourseItem: React.FC<CourseItemProps> = ({
  code,
  name,
  credits,
  type,
  onClick,
}) => (
  <div className="hops-planner__course-item" onClick={onClick}>
    <span className="hops-planner__course-code">{code}</span>
    <span className="hops-planner__course-name">{name}</span>
    <span className="hops-planner__course-credits">{credits} op</span>
    <span
      className={`hops-planner__course-type hops-planner__course-type--${type}`}
    >
      {type === "mandatory" ? "PAKOLLINEN" : "VALINNAINEN"}
    </span>
  </div>
);

export default CourseItem;
