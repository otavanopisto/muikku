import WorkspaceNavbar from "~/components/base/workspace/navbar";
import ManagementPanel from "./body/management";
import * as React from "react";

/**
 * WorkspaceManagementBodyProps
 */
interface WorkspaceManagementBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceManagementBodyState
 */
interface WorkspaceManagementBodyState {}

/**
 * WorkspaceManagementBody
 */
export default class WorkspaceManagementBody extends React.Component<
  WorkspaceManagementBodyProps,
  WorkspaceManagementBodyState
> {
  /**
   * render
   */
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
