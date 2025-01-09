import * as React from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Course } from "~/@types/shared";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import {
  PlannerCard,
  PlannerCardContent,
  PlannerCardHeader,
  PlannerCardLabel,
} from "./planner-card";

/**
 * PlannerSidebarCourse props
 */
interface PlannerSidebarCourseProps {
  course: Course;
  subjectCode: string;
  plannedCourse?: PlannedCourseWithIdentifier;
  selected: boolean;
  curriculumConfig: CurriculumConfig;
  onSelectCourse: (course: Course & { subjectCode: string }) => void;
}

/**
 * PlannerSidebarCourse component
 * @param props props
 */
const PlannerSidebarCourse: React.FC<PlannerSidebarCourseProps> = (props) => {
  const {
    course,
    subjectCode,
    plannedCourse,
    onSelectCourse,
    selected,
    curriculumConfig,
  } = props;

  const isDisabled = plannedCourse !== undefined;

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
      // eslint-disable-next-line jsdoc/require-jsdoc
      canDrag: !isDisabled,
    }),
    [isDisabled]
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  /**
   * Handles course select
   */
  const handleSelectCourse = () => {
    onSelectCourse({ ...course, subjectCode });
  };

  const modifiers = [];

  isDragging && modifiers.push("is-dragging");
  selected && modifiers.push("selected");

  isDisabled && modifiers.push("disabled");

  const type = course.mandatory ? "mandatory" : "optional";

  return (
    <PlannerCard
      modifiers={modifiers}
      innerContainerModifiers={[type]}
      onClick={!isDisabled ? handleSelectCourse : undefined}
      ref={drag}
    >
      <PlannerCardHeader modifiers={["sidebar-course-card"]}>
        <span className="planner-sidebar-course__code">
          {`${subjectCode} ${course.courseNumber}. `}
        </span>
        <span className="planner-sidebar-course__name">{course.name}</span>
      </PlannerCardHeader>

      <PlannerCardContent modifiers={["planned-course-card"]}>
        <PlannerCardLabel modifiers={[type]}>
          {type === "mandatory" ? "PAKOLLINEN" : "VALINNAINEN"}
        </PlannerCardLabel>
        <PlannerCardLabel modifiers={["course-length"]}>
          {curriculumConfig.strategy.getCourseDisplayedLength(course)}
        </PlannerCardLabel>

        {plannedCourse && (
          <PlannerCardLabel modifiers={["already-planned"]}>
            Suunnitelmassa
          </PlannerCardLabel>
        )}
      </PlannerCardContent>
    </PlannerCard>
  );
};

export default PlannerSidebarCourse;
