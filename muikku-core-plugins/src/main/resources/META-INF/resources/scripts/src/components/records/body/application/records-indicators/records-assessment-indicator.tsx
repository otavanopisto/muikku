import * as React from "react";
import { StateType } from "~/reducers";
import { localizeTime } from "~/locales/i18n";
import { Assessment } from "~/reducers/workspaces";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { getShortenGradeExtension, shortenGrade } from "~/util/modifiers";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";

/**
 * AssessmentProps
 */
interface RecordsAssessmentIndicatorProps {
  assessment?: Assessment;
  isCombinationWorkspace: boolean;
}

/**
 * Creates component that shows assessment
 * @param props Component props
 * @returns JSX.Element
 */
const RecordsAssessmentIndicator: React.FC<RecordsAssessmentIndicatorProps> = (
  props
) => {
  const { assessment, isCombinationWorkspace } = props;

  const { t } = useTranslation(["studies", "common"]);

  if (!assessment) {
    return null;
  }

  // We can have situation where course module has PASSED assessment and also it's state is INCOMPLETE
  // as it has been evaluated as incomplete after evaluated as PASSED
  if (assessment.grade && assessment.state !== "incomplete") {
    return (
      <Dropdown
        openByHover
        content={
          <span>
            {t("labels.evaluablesDone", {
              ns: "studies",
              date: localizeTime.date(assessment.date),
            }) + getShortenGradeExtension(assessment.grade)}
          </span>
        }
      >
        <span
          className={`application-list__indicator-badge application-list__indicator-badge--course ${
            assessment.passingGrade ? "state-PASSED" : "state-FAILED"
          }`}
        >
          {shortenGrade(assessment.grade)}
        </span>
      </Dropdown>
    );
  } else if (assessment.state === "incomplete") {
    const status =
      assessment.state === "incomplete"
        ? t("labels.incomplete", {
            ns: "workspace",
          })
        : t("labels.failed", {
            ns: "workspace",
          });
    return (
      <Dropdown
        openByHover
        content={
          <span>
            {t("labels.evaluablesDone", {
              ns: "studies",
              date: localizeTime.date(assessment.date),
            }) +
              " - " +
              status}
          </span>
        }
      >
        <span
          className={`application-list__indicator-badge application-list__indicator-badge--course ${
            assessment.state === "incomplete"
              ? "state-INCOMPLETE"
              : "state-FAILED"
          }`}
        >
          {status[0].toLocaleUpperCase()}
        </span>
      </Dropdown>
    );
  } else {
    if (isCombinationWorkspace) {
      return (
        <Dropdown
          openByHover
          content={
            <span>
              {assessment.grade
                ? t("labels.evaluablesDone", {
                    ns: "studies",
                    date: localizeTime.date(assessment.date),
                  }) + getShortenGradeExtension(assessment.grade)
                : t("content.notEvaluated", {
                    ns: "studies",
                  })}
            </span>
          }
        >
          <span
            className={`application-list__indicator-badge application-list__indicator-badge--course ${
              assessment.state === "unassessed" ? "state-UNASSESSED" : ""
            }`}
          >
            -
          </span>
        </Dropdown>
      );
    }
  }

  return null;
};

export default RecordsAssessmentIndicator;
