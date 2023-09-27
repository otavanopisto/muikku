/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Application from "~/components/announcements/body/application";
import Aside from "~/components/announcements/body/aside";

/**
 * WorkspaceAnnouncementsBodyProps
 */
interface WorkspaceAnnouncementsBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceAnnouncementsBody
 */
export default class WorkspaceAnnouncementsBody extends React.Component<
  WorkspaceAnnouncementsBodyProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceAnnouncementsBodyProps) {
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
    const aside = <Aside />;
    return (
      <div>
        <WorkspaceNavbar
          navigation={aside}
          activeTrail="workspace-announcements"
          workspaceUrl={this.props.workspaceUrl}
        />
        <Application aside={aside} />
      </div>
    );
  }
}
