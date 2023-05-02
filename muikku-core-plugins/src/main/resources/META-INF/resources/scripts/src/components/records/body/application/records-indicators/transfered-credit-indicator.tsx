import * as React from "react";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { getShortenGradeExtension, shortenGrade } from "~/util/modifiers";
import { RecordWorkspaceActivity } from "~/reducers/main-function/records";
import Dropdown from "~/components/general/dropdown";

/**
 * TransfereCreditValueIndicatorProps
 */
interface TransfereCreditIndicatorProps {
  transferCredit: RecordWorkspaceActivity;
  i18n: i18nType;
}

/**
 * Creates indicator for transferecredit
 * @param props Component props
 * @returns JSX.Element
 */
const TransfereCreditIndicator: React.FC<TransfereCreditIndicatorProps> = (
  props
) => {
  const { i18n, transferCredit } = props;

  // this shouldn't come to this, but just in case
  if (transferCredit === null) {
    return <div className="application-list__header-secondary" />;
  }

  //Transfred credits have only one assessment to describe them
  const assessment = transferCredit.assessmentStates[0];

  return (
    <Dropdown
      openByHover
      content={
        <span>
          {i18n.text.get(
            "plugin.records.transferCreditsDate",
            i18n.time.format(assessment.date)
          ) + getShortenGradeExtension(assessment.grade)}
        </span>
      }
    >
      <span
        className={`application-list__indicator-badge application-list__indicator-badge-course ${
          assessment.passingGrade ? "state-PASSED" : "state-FAILED"
        }`}
      >
        {shortenGrade(assessment.grade)}
      </span>
    </Dropdown>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
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
)(TransfereCreditIndicator);
