import * as React from "react";
import { MuikkuEvent } from "~/generated/client";

/**
 * AbsencesSummaryProps
 */
interface AbsencesSummaryProps {
  absences: MuikkuEvent[];
}

const AbsencesSummary = (props: AbsencesSummaryProps) => {
  const { absences } = props;

  const absencesWithFeedbackCount = absences.filter((absence) =>
    absence.properties?.find((property) => property.name === "ABSENCE_REASON")
  ).length;

  const absencesWithoutFeedbackCount =
    absences.length - absencesWithFeedbackCount;

  return (
    <div className="application-sub-panel__meta">
      <h3>Absences Summary</h3>
      <div className="application-sub-panel__meta-items">
        <div className="application-sub-panel__meta-item">
          Total absences:{" "}
          <span className="label label--total">{absences.length}</span>
        </div>
        <div className="application-sub-panel__meta-item">
          Absences with feedback:{" "}
          <span className="label label--feedback">
            {absencesWithFeedbackCount}
          </span>
        </div>
        <div className="application-sub-panel__meta-item">
          Absences without feedback:{" "}
          <span className="label label--no-feedback">
            {absencesWithoutFeedbackCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AbsencesSummary;
