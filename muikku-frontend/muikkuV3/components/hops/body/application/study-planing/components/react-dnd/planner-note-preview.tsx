import * as React from "react";
import { StudyPlannerNoteWithIdentifier } from "~/reducers/hops";
import { PlannerCardContent, PlannerCardHeader } from "../planner-card";
import { PlannerCard } from "../planner-card";

/**
 * PlannerPeriodCourseCardPreviewProps
 */
interface PlannerNotePreviewProps {
  note: StudyPlannerNoteWithIdentifier;
}

/**
 * Planner course preview card. For dnd
 * @param props props
 */
const PlannerNotePreview: React.FC<PlannerNotePreviewProps> = (props) => {
  const { note } = props;

  return (
    <PlannerCard modifiers={["planned-course-card", "preview"]}>
      <PlannerCardHeader modifiers={["planned-course-card"]}>
        <span className="study-planner__course-name">
          <b>{`${note.title}`}</b>
        </span>
      </PlannerCardHeader>

      <PlannerCardContent modifiers={["planned-course-card"]}>
        {note.content}
      </PlannerCardContent>
    </PlannerCard>
  );
};

export default PlannerNotePreview;
