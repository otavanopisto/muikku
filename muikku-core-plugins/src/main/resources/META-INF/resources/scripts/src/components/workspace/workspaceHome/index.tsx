import WorkspaceNavbar from "~/components/base/workspace/navbar";
import ScreenContainer from "~/components/general/screen-container";
import * as React from "react";
import WorkspaceHomeHeader from "./header";
import WorkspaceSignUp from "./signup";
import WorkspaceDescription from "./description";
import WorkspaceTeachers from "./teachers";
import WorkspaceAnnouncements from "./announcements";
import WorkspaceLicense from "./license";
import WorkspaceProducers from "./producers";
import MaterialEditor from "~/components/base/material-editor";
import WorkspaceEvaluation from "./evaluation";
import BeingEvaluated from "./being-evaluated";
import "~/sass/elements/panel.scss";
import "~/sass/elements/footer.scss";

/**
 * WorkspaceHomeBodyProps
 */
interface WorkspaceHomeBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceHomeBody
 * @param props props
 */
const WorkspaceHomeBody = (props: WorkspaceHomeBodyProps) => (
  <div>
    <WorkspaceNavbar activeTrail="index" workspaceUrl={props.workspaceUrl} />
    <ScreenContainer viewModifiers="workspace">
      <MaterialEditor locationPage="Home" />
      <WorkspaceHomeHeader />
      <BeingEvaluated />
      <WorkspaceEvaluation />
      <div className="panel-group panel-group--workspace-main">
        <WorkspaceDescription />
        <div className="panel-group panel-group--workspace-aside">
          <WorkspaceSignUp />
          <WorkspaceTeachers />
          <WorkspaceAnnouncements />
        </div>
      </div>
      <footer className="footer footer--workspace">
        <WorkspaceLicense />
        <WorkspaceProducers />
      </footer>
    </ScreenContainer>
  </div>
);

export default WorkspaceHomeBody;
