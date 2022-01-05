import WorkspaceNavbar from "~/components/base/workspace/navbar";
import ManagementPanel from "./body/management";

import * as React from "react";

interface WorkspaceManagementBodyProps {
  workspaceUrl: string;
}

interface WorkspaceManagementBodyState {}

export default class WorkspaceManagementBody extends React.Component<
  WorkspaceManagementBodyProps,
  WorkspaceManagementBodyState
> {
  render() {
    return (
      <div>
        <WorkspaceNavbar
          activeTrail="workspace-management"
          workspaceUrl={this.props.workspaceUrl}
        />
        <ManagementPanel />
      </div>
    );
  }
}
