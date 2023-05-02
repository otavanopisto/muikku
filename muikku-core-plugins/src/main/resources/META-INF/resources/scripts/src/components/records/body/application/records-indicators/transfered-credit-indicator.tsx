import * as React from "react";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { getShortenGradeExtension, shortenGrade } from "~/util/modifiers";
import { RecordWorkspaceActivity } from "~/reducers/main-function/records";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";

/**
 * TransfereCreditValueIndicatorProps
 */
interface TransfereCreditIndicatorProps {
  transferCredit: RecordWorkspaceActivity;
  i18nOLD: i18nType;
}

/**
 * Creates indicator for transferecredit
 * @param props Component props
 * @returns JSX.Element
 */
const TransfereCreditIndicator: React.FC<TransfereCreditIndicatorProps> = (
  props
) => {
  const { i18nOLD, transferCredit } = props;

  const { t } = useTranslation(["studies", "common"]);

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
          {t("content.transferCreditsDate", {
            ns: "studies",
            date: i18nOLD.time.format(assessment.date),
          }) + getShortenGradeExtension(assessment.grade)}
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
)(TransfereCreditIndicator);
