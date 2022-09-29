/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import WorkspaceNavbar from "~/components/base/workspace/navbar";
import Application from "./body/application";
import Aside from "./body/aside";
import * as React from "react";
import "~/sass/elements/panel.scss";
import "~/sass/elements/footer.scss";

/**
 * WorkspaceJournalBodyProps
 */
interface WorkspaceJournalBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceJournalBody
 */
export default class WorkspaceJournalBody extends React.Component<
  WorkspaceJournalBodyProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceJournalBodyProps) {
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
          activeTrail="journal"
          workspaceUrl={this.props.workspaceUrl}
        />
        <Application aside={aside} />
      </div>
    );
  }
}
