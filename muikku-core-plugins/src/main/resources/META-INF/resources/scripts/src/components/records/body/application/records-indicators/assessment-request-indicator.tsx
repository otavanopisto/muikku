import * as React from "react";
import { localize } from "~/locales/i18n";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import { WorkspaceAssessmentState } from "~/generated/client";

/**
 * AssessmentRequestIndicatorProps
 */
interface AssessmentRequestIndicatorProps {
  assessment: WorkspaceAssessmentState;
}

/**
 * Creates assessment request indicator if assessmentState is following
 * @param props component props
 * @returns JSX.Element
 */
export const AssessmentRequestIndicator: React.FC<
  AssessmentRequestIndicatorProps
> = (props) => {
  const { assessment } = props;

  const { t } = useTranslation(["studies", "common"]);

  if (
    assessment.state === "pending" ||
    assessment.state === "pending_pass" ||
    assessment.state === "pending_fail"
  ) {
    return (
      <Dropdown
        openByHover
        content={
          <span>
            {t("content.sent", {
              ns: "studies",
              context: "evaluationRequest",
              date: localize.date(assessment.date),
            })}
          </span>
        }
      >
        <span className="application-list__indicator-badge application-list__indicator-badge--evaluation-request icon-assessment-pending" />
      </Dropdown>
    );
  } else if (assessment.state === "interim_evaluation_request") {
    return (
      <Dropdown
        openByHover
        content={
          <span>
            {t("content.sent", {
              ns: "studies",
              context: "interimEvaluationRequest",
              date: localize.date(assessment.date),
            })}
          </span>
        }
      >
        <span className="application-list__indicator-badge application-list__indicator-badge--interim-evaluation-request icon-assessment-pending" />
      </Dropdown>
    );
  }
  return null;
};

export default AssessmentRequestIndicator;
