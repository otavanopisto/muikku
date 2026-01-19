import * as React from "react";
import { localize } from "~/locales/i18n";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import {
  StudyActivityItem,
  WorkspaceAssessmentState,
} from "~/generated/client";

/**
 * AssessmentRequestIndicatorProps
 */
interface AssessmentRequestIndicatorNewProps {
  studyActivityItem: StudyActivityItem;
}

/**
 * Creates assessment request indicator if assessmentState is following
 * @param props component props
 * @returns JSX.Element
 */
export const AssessmentRequestIndicatorNew: React.FC<
  AssessmentRequestIndicatorNewProps
> = (props) => {
  const { studyActivityItem } = props;

  const { t } = useTranslation(["studies", "common"]);

  if (studyActivityItem.state === "PENDING") {
    return (
      <Dropdown
        openByHover
        content={
          <span>
            {t("content.sent", {
              ns: "studies",
              context: "evaluationRequest",
              date: localize.date(studyActivityItem.date),
            })}
          </span>
        }
      >
        <span className="application-list__indicator-badge application-list__indicator-badge--evaluation-request icon-assessment-pending" />
      </Dropdown>
    );
  } else if (studyActivityItem.state === "INTERIM_EVALUATION_REQUEST") {
    return (
      <Dropdown
        openByHover
        content={
          <span>
            {t("content.sent", {
              ns: "studies",
              context: "interimEvaluationRequest",
              date: localize.date(studyActivityItem.date),
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

export default AssessmentRequestIndicatorNew;
