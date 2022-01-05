import WorkspaceNavbar from "~/components/base/workspace/navbar";

import * as React from "react";

import Help from "./help";
import MaterialEditor from "~/components/base/material-editor";
import TableOfContentsComponent from "./content";

interface WorkspaceHelpBodyProps {
  workspaceUrl: string;
  onActiveNodeIdChange: (newId: number) => any;
}

interface WorkspaceHelpBodyState {}

export default class WorkspaceHelpBody extends React.Component<
  WorkspaceHelpBodyProps,
  WorkspaceHelpBodyState
> {
  constructor(props: WorkspaceHelpBodyProps) {
    super(props);

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
  }
  onOpenNavigation() {
    (this.refs.content as any).getWrappedInstance().refresh();
  }
  render() {
    const navigationComponent = <TableOfContentsComponent ref="content" />;
    return (
      <div>
        <WorkspaceNavbar
          activeTrail="help"
          workspaceUrl={this.props.workspaceUrl}
        />
        <MaterialEditor locationPage="Help" />
        <Help
          onOpenNavigation={this.onOpenNavigation}
          navigation={navigationComponent}
          ref="materials"
          onActiveNodeIdChange={this.props.onActiveNodeIdChange}
        />
      </div>
    );
  }
}
