import * as React from "react";
import MobilePlannerPeriodCourse from "./mobile/planner-period-course";
import DesktopPlannerPeriodCourse from "./desktop/planner-period-course";
import { BasePlannerPeriodCourseProps } from "./planner-period-course-base";
import { useMediaQuery } from "usehooks-ts";

/**
 * PlannerPeriodCourseProps
 */
interface PlannerPeriodCourseProps
  extends Omit<
    BasePlannerPeriodCourseProps,
    "isDragging" | "renderSpecifyContent" | "renderDeleteWarning"
  > {}

/**
 * Planner period course component
 * @param props props
 */
const PlannerPeriodCourse: React.FC<PlannerPeriodCourseProps> = (props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <MobilePlannerPeriodCourse {...props} />
  ) : (
    <DesktopPlannerPeriodCourse {...props} />
  );
};

export default PlannerPeriodCourse;
