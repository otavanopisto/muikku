import WorkspaceNavbar from "~/components/base/workspace/navbar";
import ScreenContainer from "~/components/general/screen-container";
import Users from "./users";

import * as React from "react";

interface WorkspaceUsersBodyProps {
  workspaceUrl: string;
}

interface WorkspaceUsersBodyState {}

export default class WorkspaceUsersBody extends React.Component<
  WorkspaceUsersBodyProps,
  WorkspaceUsersBodyState
> {
  constructor(props: WorkspaceUsersBodyProps) {
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
          activeTrail="users"
          workspaceUrl={this.props.workspaceUrl}
        />
        <Users />
      </div>
    );
  }
}
