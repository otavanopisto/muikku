import * as React from "react";
import { useMediaQuery } from "usehooks-ts";
import MobilePlannerPeriodNote from "./mobile/planner-period-note";
import DesktopPlannerPeriodNote from "./desktop/planner-period-note";
import { BasePlannerPeriodNoteProps } from "./planner-period-note-base";
/**
 * PlannerPeriodCourseProps
 */
interface PlannerPeriodNoteProps
  extends Omit<
    BasePlannerPeriodNoteProps,
    "isDragging" | "renderSpecifyContent" | "renderDeleteWarning"
  > {}

/**
 * Planner period course component
 * @param props props
 */
const PlannerPeriodNote: React.FC<PlannerPeriodNoteProps> = (props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <MobilePlannerPeriodNote {...props} />
  ) : (
    <DesktopPlannerPeriodNote {...props} />
  );
};

export default PlannerPeriodNote;
