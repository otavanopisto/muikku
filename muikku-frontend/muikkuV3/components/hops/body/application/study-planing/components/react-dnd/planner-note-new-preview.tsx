import * as React from "react";
import { PlannerCard, PlannerCardHeader } from "../planner-card";
import { useTranslation } from "react-i18next";

/**
 * PlannerNoteNewPreview props
 */
interface PlannerNoteNewPreviewProps {}

/**
 * PlannerCourseTrayItemPreview component
 * @param props props
 */
const PlannerNoteNewPreview: React.FC<PlannerNoteNewPreviewProps> = (props) => {
  const { t } = useTranslation(["common"]);

  return (
    <PlannerCard modifiers={["preview", "note"]}>
      <PlannerCardHeader modifiers={["course-tray-item"]}>
        <span className="study-planner__card-icon icon-note-add"></span>
        <span className="study-planner__card-title">
          {t("actions.addNote", {
            ns: "hops_new",
          })}
        </span>
      </PlannerCardHeader>
    </PlannerCard>
  );
};

export default PlannerNoteNewPreview;
