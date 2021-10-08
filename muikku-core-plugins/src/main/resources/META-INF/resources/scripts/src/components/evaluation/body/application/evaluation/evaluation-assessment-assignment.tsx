import * as React from "react";
import EvaluationMaterial from "./evaluation-material";
import { EvaluationGradeSystem } from "~/@types/evaluation";
import {
  WorkspaceType,
  MaterialContentNodeType,
} from "~/reducers/workspaces/index";
import "~/sass/elements/evaluation.scss";

/**
 * EvaluationCardProps
 */
interface EvaluationAssessmentAssignmentProps {
  workspace: WorkspaceType;
  material: MaterialContentNodeType;
  open: boolean;
  onClickOpen?: (id: number) => void;
}

/**
 * EvaluationAssessmentAssignmentState
 */
interface EvaluationAssessmentAssignmentState {}
/**
 * EvaluationCard
 * @param props
 */
class EvaluationAssessmentAssignment extends React.Component<
  EvaluationAssessmentAssignmentProps,
  EvaluationAssessmentAssignmentState
> {
  constructor(props: EvaluationAssessmentAssignmentProps) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      this.props.material &&
      this.props.workspace && (
        <EvaluationMaterial
          workspace={this.props.workspace}
          material={this.props.material}
          openContent={this.props.open}
          onClickOpen={this.props.onClickOpen}
        />
      )
    );
  }
}

export default EvaluationAssessmentAssignment;
