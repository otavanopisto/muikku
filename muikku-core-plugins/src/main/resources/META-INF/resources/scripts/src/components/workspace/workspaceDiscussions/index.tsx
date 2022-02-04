/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Application from "~/components/discussion/body/application";

/**
 * WorkspaceDiscussionBodyProps
 */
interface WorkspaceDiscussionBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceDiscussionBody
 */
export default class WorkspaceDiscussionBody extends React.Component<
  WorkspaceDiscussionBodyProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: WorkspaceDiscussionBodyProps) {
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
