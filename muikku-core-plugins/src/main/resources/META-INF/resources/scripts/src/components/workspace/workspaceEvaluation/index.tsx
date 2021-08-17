import WorkspaceNavbar from "~/components/base/workspace/navbar";
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
