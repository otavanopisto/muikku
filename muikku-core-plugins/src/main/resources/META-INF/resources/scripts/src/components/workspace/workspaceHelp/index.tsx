/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Help from "./help";
import MaterialEditor from "~/components/base/material-editor";
import TableOfContentsComponent from "./content";

/**
 * WorkspaceHelpBodyProps
 */
interface WorkspaceHelpBodyProps {
  workspaceUrl: string;
  onActiveNodeIdChange: (newId: number) => any;
}

/**
 * WorkspaceHelpBodyState
 */
interface WorkspaceHelpBodyState {}

/**
 * WorkspaceHelpBody
 */
export default class WorkspaceHelpBody extends React.Component<
  WorkspaceHelpBodyProps,
  WorkspaceHelpBodyState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceHelpBodyProps) {
    super(props);

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
  }

  /**
   * onOpenNavigation
   */
  onOpenNavigation() {
    (this.refs.content as any).getWrappedInstance().refresh();
  }

  /**
   * render
   */
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
          ref="guides"
          onActiveNodeIdChange={this.props.onActiveNodeIdChange}
        />
      </div>
    );
  }
}
