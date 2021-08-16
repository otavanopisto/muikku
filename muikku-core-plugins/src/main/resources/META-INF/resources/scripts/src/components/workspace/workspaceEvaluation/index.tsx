import WorkspaceNavbar from "~/components/base/workspace/navbar";
import ScreenContainer from "~/components/general/screen-container";

import * as React from "react";
import Application from "~/components/evaluation/body/application";

/**
 * WorkspaceDiscussionBodyProps
 */
interface WorkspaceEvaluationBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceDiscussionBodyState
 */
interface WorkspaceEvaluationBodyState {}

/**
 * WorkspaceDiscussionBody
 */
export default class WorkspaceEvaluationBody extends React.Component<
  WorkspaceEvaluationBodyProps,
  WorkspaceEvaluationBodyState
> {
  /**
   * Constructor method
   * @param props
   */
  constructor(props: WorkspaceEvaluationBodyProps) {
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
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div>
        <WorkspaceNavbar
          activeTrail="workspace-evaluation"
          workspaceUrl={this.props.workspaceUrl}
        />
        <Application />
      </div>
    );
  }
}
