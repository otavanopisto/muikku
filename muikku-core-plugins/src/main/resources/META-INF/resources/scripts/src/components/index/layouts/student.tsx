import * as React from "react";
import AnnouncementsPanel from "./panels/announcements-panel";
import LastMessagesPanel from "./panels/latest-messages-panel";
import WallPanel from "./panels/wall-panel";
import StudiesPanel from "./panels/studies-panel";
import StudiesEnded from "./panels/studies-ended";

/**
 * StudentComponentProps
 */
interface StudentComponentProps {
  studiesEnded: boolean;
}

const StudentComponent: React.FC<StudentComponentProps> = (props) => {
  const { studiesEnded } = props;
  if (studiesEnded) {
    return <StudiesEnded />;
  } else {
    return (
      <>
        <div className="panel-group panel-group--studies">
          <StudiesPanel />
        </div>
        <div className="panel-group panel-group--info">
          <WallPanel />
          <LastMessagesPanel />
        </div>
        <AnnouncementsPanel overflow={true} />
      </>
    );
  }
};

export default StudentComponent;
