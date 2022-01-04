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

import "~/sass/elements/panel.scss";
import "~/sass/elements/footer.scss";

interface WorkspaceHomeBodyProps {
  workspaceUrl: string;
}

interface WorkspaceHomeBodyState {}

export default class WorkspaceHomeBody extends React.Component<
  WorkspaceHomeBodyProps,
  WorkspaceHomeBodyState
> {
  constructor(props: WorkspaceHomeBodyProps) {
    super(props);

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
  }
  onOpenNavigation() {
    (this.refs.content as any).getWrappedInstance().refresh();
  }
  render() {
    return (
      <div>
        <WorkspaceNavbar
          activeTrail="index"
          workspaceUrl={this.props.workspaceUrl}
        />
        <ScreenContainer viewModifiers="workspace">
          <MaterialEditor locationPage="Home" />
          <WorkspaceHomeHeader />
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
  }
}
