import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { GuiderType } from "~/reducers/main-function/guider";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import Workspaces from "./workspaces";
import MainChart from "~/components/general/graph/main-chart";

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

  const studentWorkspaces = (
    <Workspaces workspaces={guider.currentStudent.pastWorkspaces} />
  );

  if (
    !props.guider.currentStudent.pastWorkspaces ||
    !props.guider.currentStudent.activityLogs
  ) {
    return null;
  }
  return (
    <>
      <div className="application-sub-panel application-sub-panel--student-data-secondary">
        <h3 className="application-sub-panel__header">
          {i18n.text.get("plugin.guider.user.details.workspaces")}
        </h3>
        <div className="application-sub-panel__body">{studentWorkspaces}</div>
      </div>
      <div className="application-sub-panel">
        <div className="application-sub-panel__header">
          {i18n.text.get("plugin.guider.user.details.statistics")}
        </div>
        {guider.currentStudent.activityLogs &&
        guider.currentStudent.pastWorkspaces ? (
          <MainChart
            workspaces={guider.currentStudent.pastWorkspaces}
            activityLogs={guider.currentStudent.activityLogs}
          />
        ) : null}
      </div>
    </>
  );
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
