import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { StatusType } from "~/reducers/base/status";
import AnnouncementsPanel from "./panels/announcements-panel";
import LastMessagesPanel from "./panels/latest-messages-panel";
import WorkspacesPanel from "./panels/workspaces-panel";
import DependantsPanel from "./panels/dependants-panel";

/**
 * TeacherComponentProps
 */
interface StaffComponentProps {
  status: StatusType;
}

/**
 * StaffComponent
 * @param props StaffComponentProps
 * @returns React.JSX.Element
 */
const StaffComponent: React.FC<StaffComponentProps> = (props) => {
  const { status } = props;
  const isGuardian = status.roles.includes("STUDENT_PARENT");

  return (
    <>
      {isGuardian ? (
        <div className="panel-group panel-group--dependants">
          <DependantsPanel />
        </div>
      ) : (
        <>
          <div className="panel-group panel-group--studies">
            <WorkspacesPanel />
          </div>
          <div className="panel-group panel-group--info">
            <LastMessagesPanel />
          </div>
        </>
      )}
      <AnnouncementsPanel overflow={true} />
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

export default connect(mapStateToProps)(StaffComponent);
