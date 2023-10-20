import * as React from "react";
import AnnouncementsPanel from "./panels/announcements-panel";
import LastMessagesPanel from "./panels/latest-messages-panel";
import WallPanel from "./panels/wall-panel";
import WorkspacesPanel from "./panels/workspaces-panel";

/**
 * TeacherComponentProps
 */
interface TeacherComponentProps {}

const TeacherComponent: React.FC<TeacherComponentProps> = () => (
  <div>
    <div className="panel-group panel-group--studies">
      <WorkspacesPanel />
    </div>
    <div className="panel-group panel-group--info">
      <WallPanel />
      <LastMessagesPanel />
    </div>
    <AnnouncementsPanel overflow={true} />
  </div>
);

export default TeacherComponent;
