import WorkspaceNavbar from "~/components/base/workspace/navbar";

import * as React from "react";
import Application from "~/components/discussion/body/application";

interface WorkspaceDiscussionBodyProps {
  workspaceUrl: string;
}

interface WorkspaceDiscussionBodyState {}

export default class WorkspaceDiscussionBody extends React.Component<
  WorkspaceDiscussionBodyProps,
  WorkspaceDiscussionBodyState
> {
  constructor(props: WorkspaceDiscussionBodyProps) {
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
          activeTrail="workspace-discussions"
          workspaceUrl={this.props.workspaceUrl}
        />
        <Application />
      </div>
    );
  }
}
