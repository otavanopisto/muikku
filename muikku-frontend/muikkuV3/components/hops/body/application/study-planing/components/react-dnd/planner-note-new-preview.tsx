import * as React from "react";
import { PlannerCard, PlannerCardHeader } from "../planner-card";

/**
 * PlannerNoteNewPreview props
 */
interface PlannerNoteNewPreviewProps {}

/**
 * PlannerCourseTrayItemPreview component
 * @param props props
 */
const PlannerNoteNewPreview: React.FC<PlannerNoteNewPreviewProps> = (props) => (
  <PlannerCard modifiers={["note-new-card", "preview"]}>
    <PlannerCardHeader modifiers={["course-tray-item"]}>
      <span className="planner-course-tray-item__name">
        <b>{`Uusi muistiinpano`}</b>
      </span>
    </PlannerCardHeader>
  </PlannerCard>
);

export default PlannerNoteNewPreview;
