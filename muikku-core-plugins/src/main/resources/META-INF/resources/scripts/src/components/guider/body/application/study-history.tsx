import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { GuiderType } from "~/reducers/main-function/guider";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
/**
 * StudyHistory props
 */
interface StudyHistoryProps {
  i18n: i18nType;
  guider: GuiderType;
  status: StatusType;
}

/**
 *StudyHistory component
 * @param props StudyHistoryProps
 * @returns JSX.Element
 */
const StudyHistory: React.FC<StudyHistoryProps> = (props) => {
  const { i18n, guider, status } = props;

  return <div>Huhhahhei ja opintohistoria minut vei</div>;
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider,
    status: state.status,
  };
}

export default connect(mapStateToProps)(StudyHistory);
