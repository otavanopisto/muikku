import WorkspaceNavbar from "~/components/base/workspace/navbar";
import ScreenContainer from "~/components/general/screen-container";
import PermissionsByUsergroups from "./byUsergroups";

import * as React from "react";

interface WorkspacePermissionsBodyProps {
  workspaceUrl: string;
}

interface WorkspacePermissionsBodyState {}

export default class WorkspacePermissionsBody extends React.Component<
  WorkspacePermissionsBodyProps,
  WorkspacePermissionsBodyState
> {
  constructor(props: WorkspacePermissionsBodyProps) {
    super(props);
  }
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
