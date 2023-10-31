import * as React from "react";
import AnnouncementsPanel from "./panels/announcements-panel";
import LastMessagesPanel from "./panels/latest-messages-panel";
import WorkspacesPanel from "./panels/workspaces-panel";

/**
 * TeacherComponentProps
 */
interface TeacherComponentProps {}

const TeacherComponent: React.FC<TeacherComponentProps> = () => (
  <>
    <div className="panel-group panel-group--studies">
      <WorkspacesPanel />
    </div>
    <div className="panel-group panel-group--info">
      <LastMessagesPanel />
    </div>
    <AnnouncementsPanel overflow={true} />
  </>
);

export default TeacherComponent;
