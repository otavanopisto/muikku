import * as React from "react";
import { MuikkuEvent } from "~/generated/client";
import { useTranslation } from "react-i18next";
/**
 * AbsencesSummaryProps
 */
interface AbsencesSummaryProps {
  absences: MuikkuEvent[];
}

/**
 * Absences summary component
 * @param props AbsencesSummaryProps
 * @returns JSX.Element
 */
const AbsencesSummary = (props: AbsencesSummaryProps) => {
  const { absences } = props;
  const { t } = useTranslation();
  const absencesWithFeedbackCount = absences.filter(
    (absence) => absence.solved === true
  ).length;

  const absencesWithoutFeedbackCount =
    absences.length - absencesWithFeedbackCount;

  return (
    <div className="application-sub-panel__meta">
      <h3>{t("labels.absencesSummary", { ns: "events" })}</h3>
      <div className="application-sub-panel__meta-items">
        <div className="application-sub-panel__meta-item">
          {t("labels.totalAbsences", { ns: "events" })}:
          <span className="label label--total">{absences.length}</span>
        </div>
        <div className="application-sub-panel__meta-item">
          {t("labels.absencesWithFeedback", { ns: "events" })}:
          <span className="label label--feedback">
            {absencesWithFeedbackCount}
          </span>
        </div>
        <div className="application-sub-panel__meta-item">
          {t("labels.absencesWithoutFeedback", { ns: "events" })}:{" "}
          <span className="label label--no-feedback">
            {absencesWithoutFeedbackCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AbsencesSummary;
