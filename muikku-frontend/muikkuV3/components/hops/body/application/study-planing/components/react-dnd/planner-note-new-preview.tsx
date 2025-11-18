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
  <PlannerCard modifiers={["preview", "note"]}>
    <PlannerCardHeader modifiers={["course-tray-item"]}>
      <span className="study-planner__card-icon icon-note-add"></span>
      <span className="study-planner__card-title">
        Jonkiinlainen lokalisointi tässä pitäis olla että jos koska kun nääs...
      </span>
    </PlannerCardHeader>
  </PlannerCard>
);

export default PlannerNoteNewPreview;
