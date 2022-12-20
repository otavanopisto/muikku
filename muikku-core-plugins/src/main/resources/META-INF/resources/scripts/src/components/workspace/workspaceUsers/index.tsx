/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import WorkspaceNavbar from "~/components/base/workspace/navbar";
import Users from "./users";
import * as React from "react";

/**
 * WorkspaceUsersBodyProps
 */
interface WorkspaceUsersBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceUsersBody
 */
export default class WorkspaceUsersBody extends React.Component<
  WorkspaceUsersBodyProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceUsersBodyProps) {
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
          activeTrail="users"
          workspaceUrl={this.props.workspaceUrl}
        />
        <Users />
      </div>
    );
  }
}
