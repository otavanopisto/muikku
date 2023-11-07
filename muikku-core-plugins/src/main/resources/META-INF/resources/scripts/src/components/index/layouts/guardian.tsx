import * as React from "react";
import AnnouncementsPanel from "./panels/announcements-panel";
import StudentsPanel from "./panels/students-panel";
/**
 * GuardianComponentProps
 */
// interface GuardianComponentProps {}

/**
 * GuardianComponent
 * @returns JSX.Element
 */
const GuardianComponent: React.FC = () => (
  <>
    <StudentsPanel />
    <AnnouncementsPanel />
  </>
);

export default GuardianComponent;
