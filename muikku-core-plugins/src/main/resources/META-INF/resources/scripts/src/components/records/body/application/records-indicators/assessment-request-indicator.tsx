import * as React from "react";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
import { Assessment } from "~/reducers/workspaces";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";

/**
 * AssessmentRequestIndicatorProps
 */
interface AssessmentRequestIndicatorProps {
  assessment: Assessment;
  i18nOLD: i18nType;
}

/**
 * Creates assessment request indicator if assessmentState is following
 * @param props component props
 * @returns JSX.Element
 */
export const AssessmentRequestIndicator: React.FC<
  AssessmentRequestIndicatorProps
> = (props) => {
  const { assessment, i18nOLD } = props;

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
              defaultValue: `Evaluation request sent on ${i18nOLD.time.format(
                assessment.date
              )}`,
              date: i18nOLD.time.format(assessment.date),
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
              defaultValue: `Interim evaluation request sent on ${i18nOLD.time.format(
                assessment.date
              )}`,
              date: i18nOLD.time.format(assessment.date),
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
)(AssessmentRequestIndicator);
