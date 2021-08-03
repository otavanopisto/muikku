import * as React from "react";
import CKEditor from "~/components/general/ckeditor";
import { EvaluationGradeSystem } from "../../../../../@types/evaluation";
import "~/sass/elements/evaluation.scss";
import SessionStateComponent from "../../../../general/session-state-component";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { StateType } from "../../../../../reducers/index";
import { AnyActionType } from "../../../../../actions/index";
import { EvaluationState } from "../../../../../reducers/main-function/evaluation/index";
import {
  MaterialAssignmentType,
  MaterialEvaluationType,
} from "../../../../../reducers/workspaces/index";
import { MaterialCompositeRepliesType } from "../../../../../reducers/workspaces/index";
import Button from "~/components/general/button";

/**
 * AssignmentEditorProps
 */
interface AssignmentEditorProps {
  materialEvaluation?: MaterialEvaluationType;
  materialAssignment: MaterialAssignmentType;
  compositeReplies: MaterialCompositeRepliesType;
  evaluations: EvaluationState;
  editorLabel?: string;
  modifiers?: string[];
  onClose?: () => void;
}

/**
 * AssignmentEditorState
 */
interface AssignmentEditorState {
  literalEvaluation: string;
  assignmentEvaluationType: string;
  grade: string;
  assignmentId: number;
}

/**
 * AssignmentEditor
 */
class AssignmentEditor extends SessionStateComponent<
  AssignmentEditorProps,
  AssignmentEditorState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: AssignmentEditorProps) {
    super(props, `assignment-editor`);

    this.state = this.getRecoverStoredState(
      {
        literalEvaluation: "",
        assignmentEvaluationType: "GRADED",
        grade: "notselected",
        assignmentId: props.materialAssignment.id,
      },
      props.materialAssignment.id
    );
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    const { materialEvaluation, compositeReplies } = this.props;

    const grade = materialEvaluation
      ? `${materialEvaluation.gradeSchoolDataSource}-${materialEvaluation.gradeIdentifier}`
      : "";

    this.setState(
      this.getRecoverStoredState(
        {
          literalEvaluation: materialEvaluation
            ? materialEvaluation.verbalAssessment
            : "",
          assignmentEvaluationType:
            compositeReplies.state === "INCOMPLETE" ? "INCOMPLETE" : "GRADED",
          grade,
        },
        this.state.assignmentId
      )
    );
  };

  handleSaveAssignment = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    this.props.onClose();
  };

  /**
   * handleCKEditorChange
   * @param e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore(
      {
        literalEvaluation: e,
      },
      this.state.assignmentId
    );
  };

  /**
   * handleAssignmentEvaluationChange
   * @param e
   */
  handleAssignmentEvaluationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value === "INCOMPLETE") {
      this.setStateAndStore(
        {
          grade: "notselected",
        },
        this.state.assignmentId
      );
    }

    this.setStateAndStore(
      {
        assignmentEvaluationType: e.target.value,
      },
      this.state.assignmentId
    );
  };

  /**
   * handleSelectGradeChange
   * @param e
   */
  handleSelectGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore(
      {
        grade: e.currentTarget.value,
      },
      this.state.assignmentId
    );
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <>
        <div className="editor">
          <label className="drawer-editor-label">
            Opintojakson sanallinen arviointi
          </label>

          <CKEditor onChange={this.handleCKEditorChange}>
            {this.state.literalEvaluation}
          </CKEditor>
        </div>

        <div className="evaluation-modal-evaluate-form-row--radios">
          <label className="evaluation__label">Arviointi</label>
          <div className="evaluation-input-radio-row">
            <div className="evaluation-input-radio">
              <input
                type="radio"
                name="assignmentEvaluationType"
                value="GRADED"
                checked={this.state.assignmentEvaluationType === "GRADED"}
                onChange={this.handleAssignmentEvaluationChange}
              />
              <span>Arvosana</span>
            </div>
            <div className="evaluation-input-radio">
              <input
                type="radio"
                name="assignmentEvaluationType"
                value="INCOMPLETE"
                checked={this.state.assignmentEvaluationType === "INCOMPLETE"}
                onChange={this.handleAssignmentEvaluationChange}
              />
              <span>Täydennettävä</span>
            </div>
          </div>
        </div>
        <div className="evaluation-modal-evaluate-form-row--grade">
          <label className="evaluation__label">Arvosana</label>
          <select
            className="evaluation__select--grade"
            value={this.state.grade}
            onChange={this.handleSelectGradeChange}
            disabled={this.state.assignmentEvaluationType === "INCOMPLETE"}
          >
            <option value="notselected">Ei valittu</option>
            <optgroup
              label={this.props.evaluations.evaluationGradeSystem[0].name}
            >
              {this.props.evaluations.evaluationGradeSystem[0].grades.map(
                (item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                )
              )}
            </optgroup>
          </select>
        </div>

        <div className="evaluation-modal-evaluate-form-row--buttons">
          <Button
            className={`eval-modal-evaluate-button eval-modal-evaluate-button--literal`}
            onClick={this.handleSaveAssignment}
          >
            Tallenna
          </Button>
          <Button
            onClick={this.props.onClose}
            className="eval-modal-evaluate-button button-cancel"
          >
            Peruuta
          </Button>
        </div>
      </>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentEditor);
