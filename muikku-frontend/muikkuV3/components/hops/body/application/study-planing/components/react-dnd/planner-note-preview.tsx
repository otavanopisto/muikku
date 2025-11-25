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
    <PlannerCard modifiers={["preview", "note"]}>
      <PlannerCardHeader>
        <span className="study-planner__card-icon icon-note-add"></span>
        <span className="study-planner__card-title">
          <b>{`${note.title}`}</b>
        </span>
      </PlannerCardHeader>

      <PlannerCardContent>{note.content}</PlannerCardContent>
    </PlannerCard>
  );
};

export default PlannerNotePreview;
