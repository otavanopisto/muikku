import * as React from "react";
import { useTranslation } from "react-i18next";
import { MatriculationEligibilityStatus } from "~/generated/client";

/**
 * MatriculationEligibilityRowProps
 */
interface MatriculationEligiblityRowProps {
  /**
   * Shows if the subject is eligible or not badge
   */
  eligibility: MatriculationEligibilityStatus;
  /**
   * Label for the subject
   */
  label?: string;
  /**
   * Description for the eligibility
   */
  description: string;
}

/**
 * MatriculationEligibilityRow
 * @param props props
 */
const MatriculationEligibilityRow = (
  props: MatriculationEligiblityRowProps
) => {
  const { eligibility, label, description } = props;

  const { t } = useTranslation(["hops", "studies", "common"]);

  return (
    <div className="application-sub-panel__summary-item application-sub-panel__summary-item--subject-eligibility">
      <div
        className={`application-sub-panel__summary-item-state application-sub-panel__summary-item-state--${
          eligibility == "ELIGIBLE" ? "eligible" : "not-eligible"
        }`}
      >
        {eligibility === "ELIGIBLE" ? t("labels.yes") : t("labels.no")}
      </div>

      {label && (
        <div className="application-sub-panel__summary-item-label">{label}</div>
      )}

      <div
        className="application-sub-panel__summary-item-description"
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </div>
  );
};

export default MatriculationEligibilityRow;
