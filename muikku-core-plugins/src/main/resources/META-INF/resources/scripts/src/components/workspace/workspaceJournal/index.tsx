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

interface WorkspaceJournalBodyProps {
  workspaceUrl: string;
}

export default class WorkspaceJournalBody extends React.Component<
  WorkspaceJournalBodyProps,
  Record<string, unknown>
> {
  constructor(props: WorkspaceJournalBodyProps) {
    super(props);

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
  }
  onOpenNavigation() {
    (this.refs.content as any).getWrappedInstance().refresh();
  }
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
