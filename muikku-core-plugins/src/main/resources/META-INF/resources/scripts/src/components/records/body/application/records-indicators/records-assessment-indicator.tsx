import * as React from "react";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
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
  i18nOLD: i18nType;
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
  const { i18nOLD, assessment, isCombinationWorkspace } = props;

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
              date: i18nOLD.time.format(assessment.date),
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
    const status = i18nOLD.text.get(
      assessment.state === "incomplete"
        ? t("labels.incomplete", {
            ns: "workspace",
          })
        : t("labels.failed", {
            ns: "workspace",
          })
    );

    return (
      <Dropdown
        openByHover
        content={
          <span>
            {t("labels.evaluablesDone", {
              ns: "studies",
              date: i18nOLD.time.format(assessment.date),
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
                    date: i18nOLD.time.format(assessment.date),
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordsAssessmentIndicator);
