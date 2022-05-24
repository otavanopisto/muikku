import * as React from "react";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { getShortenGradeExtension, shortenGrade } from "~/util/modifiers";
import { TransferCreditType } from "~/reducers/main-function/records";
import Dropdown from "~/components/general/dropdown";

/**
 * TransfereCreditValueIndicatorProps
 */
interface TransfereCreditIndicatorProps {
  transferCredit: TransferCreditType;
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

  return (
    <Dropdown
      openByHover
      content={
        <span>
          {i18n.text.get(
            "plugin.records.transferCreditsDate",
            i18n.time.format(transferCredit.date)
          ) + getShortenGradeExtension(transferCredit.grade)}
        </span>
      }
    >
      <span
        className={`application-list__indicator-badge application-list__indicator-badge-course ${
          transferCredit.passed ? "state-PASSED" : "state-FAILED"
        }`}
      >
        {shortenGrade(transferCredit.grade)}
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
