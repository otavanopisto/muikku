/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

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
 */
export default class WorkspaceHomeBody extends React.Component<
  WorkspaceHomeBodyProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceHomeBodyProps) {
    super(props);

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
  }

  /**
   * onOpenNavigation
   */
  onOpenNavigation() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.refs.content as any).getWrappedInstance().refresh();
  }

  /**
   * render
   */
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
  }
}
