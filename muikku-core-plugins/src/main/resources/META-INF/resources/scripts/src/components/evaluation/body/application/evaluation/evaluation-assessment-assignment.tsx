import * as React from "react";
import EvaluationMaterial from "./evaluation-material";
import SlideDrawer from "./slide-drawer";
import { EvaluationGradeSystem } from "../../../../../@types/evaluation";
import {
  WorkspaceType,
  MaterialContentNodeType,
} from "../../../../../reducers/workspaces/index";
import "~/sass/elements/evaluation.scss";

/**
 * EvaluationCardProps
 */
interface EvaluationAssessmentAssignmentProps {
  workspace: WorkspaceType;
  material: MaterialContentNodeType;
  gradeSystem: EvaluationGradeSystem;
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
      <div className="assignment-wrapper material-container">
        <div className="assignment-content">
          <div className="page-content">
            {this.props.material && this.props.workspace && (
              <EvaluationMaterial
                workspace={this.props.workspace}
                material={this.props.material}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default EvaluationAssessmentAssignment;
