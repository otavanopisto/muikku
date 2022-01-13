import WorkspaceNavbar from "~/components/base/workspace/navbar";
import ScreenContainer from "~/components/general/screen-container";
import PermissionsByUsergroups from "./byUsergroups";
import * as React from "react";

/**
 * WorkspacePermissionsBodyProps
 */
interface WorkspacePermissionsBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspacePermissionsBodyState
 */
interface WorkspacePermissionsBodyState {}

/**
 * WorkspacePermissionsBody
 */
export default class WorkspacePermissionsBody extends React.Component<
  WorkspacePermissionsBodyProps,
  WorkspacePermissionsBodyState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspacePermissionsBodyProps) {
    super(props);
  }

  /**
   * render
   */
  render() {
    return (
      <div>
        <WorkspaceNavbar
          activeTrail="permissions"
          workspaceUrl={this.props.workspaceUrl}
        />
        <ScreenContainer viewModifiers="workspace">
          <PermissionsByUsergroups />
        </ScreenContainer>
      </div>
    );
  }
}
