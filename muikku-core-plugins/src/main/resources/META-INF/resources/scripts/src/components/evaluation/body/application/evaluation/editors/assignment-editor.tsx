import * as React from "react";
import CKEditor from "~/components/general/ckeditor";
import "~/sass/elements/evaluation.scss";
import SessionStateComponent from "../../../../../general/session-state-component";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { StateType } from "../../../../../../reducers/index";
import { AnyActionType } from "../../../../../../actions/index";
import { EvaluationState } from "../../../../../../reducers/main-function/evaluation/index";
import {
  MaterialAssignmentType,
  MaterialEvaluationType,
} from "../../../../../../reducers/workspaces/index";
import { MaterialCompositeRepliesType } from "../../../../../../reducers/workspaces/index";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import {
  SaveEvaluationAssignmentSupplementation,
  saveAssignmentEvaluationSupplementationToServer,
} from "../../../../../../actions/main-function/evaluation/evaluationActions";
import {
  SaveEvaluationAssignmentGradeEvaluation,
  saveAssignmentEvaluationGradeToServer,
} from "../../../../../../actions/main-function/evaluation/evaluationActions";

/**
 * AssignmentEditorProps
 */
interface AssignmentEditorProps {
  materialEvaluation?: MaterialEvaluationType;
  materialAssignment: MaterialAssignmentType;
  compositeReplies: MaterialCompositeRepliesType;
  evaluations: EvaluationState;
  status: StatusType;
  editorLabel?: string;
  modifiers?: string[];
  saveAssignmentEvaluationGradeToServer: SaveEvaluationAssignmentGradeEvaluation;
  saveAssignmentEvaluationSupplementationToServer: SaveEvaluationAssignmentSupplementation;
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
        grade: "",
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
    const { evaluationGradeSystem } = this.props.evaluations;

    const defaultGrade = `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`;

    const grade = materialEvaluation
      ? `${materialEvaluation.gradeSchoolDataSource}-${materialEvaluation.gradeIdentifier}`
      : compositeReplies.state === "INCOMPLETE"
      ? ""
      : defaultGrade;

    this.setState(
      this.getRecoverStoredState(
        {
          literalEvaluation:
            compositeReplies && compositeReplies.evaluationInfo
              ? compositeReplies.evaluationInfo.text
              : "",
          assignmentEvaluationType:
            compositeReplies.state === "INCOMPLETE" ? "INCOMPLETE" : "GRADED",
          grade: grade,
        },
        this.state.assignmentId
      )
    );
  };

  /**
   * handleSaveAssignment
   * @param e
   */
  handleSaveAssignment = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const { evaluationGradeSystem } = this.props.evaluations;

    const defaultGrade = `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`;

    if (this.state.assignmentEvaluationType === "GRADED") {
      const gradingScaleIdentifier = `${this.props.evaluations.evaluationGradeSystem[0].dataSource}-${this.props.evaluations.evaluationGradeSystem[0].id}`;
      this.props.onClose();

      this.props.saveAssignmentEvaluationGradeToServer({
        workspaceEntityId: this.props.evaluations.selectedWorkspaceId,
        userEntityId:
          this.props.evaluations.evaluationSelectedAssessmentId.userEntityId,
        workspaceMaterialId: this.props.materialAssignment.id,
        dataToSave: {
          assessorIdentifier: this.props.status.userSchoolDataIdentifier,
          gradingScaleIdentifier,
          gradeIdentifier: this.state.grade,
          verbalAssessment: this.state.literalEvaluation,
          assessmentDate: new Date().getTime(),
        },
        onSuccess: () => {
          this.setStateAndClear(
            {
              literalEvaluation: "",
              grade: defaultGrade,
              assignmentEvaluationType: "GRADED",
            },
            this.state.assignmentId
          );

          this.props.onClose();
        },
        onFail: () => this.props.onClose(),
      });
    } else if (this.state.assignmentEvaluationType === "INCOMPLETE") {
      this.props.onClose();

      this.props.saveAssignmentEvaluationSupplementationToServer({
        workspaceEntityId: this.props.evaluations.selectedWorkspaceId,
        userEntityId:
          this.props.evaluations.evaluationSelectedAssessmentId.userEntityId,
        workspaceMaterialId: this.props.materialAssignment.id,
        dataToSave: {
          userEntityId: this.props.status.userId,
          studentEntityId:
            this.props.evaluations.evaluationSelectedAssessmentId.userEntityId,
          workspaceMaterialId: this.props.materialAssignment.id.toString(),
          requestDate: new Date().getTime(),
          requestText: this.state.literalEvaluation,
        },
        onSuccess: () => {
          this.setStateAndClear(
            {
              literalEvaluation: "",
              grade: defaultGrade,
              assignmentEvaluationType: "INCOMPLETE",
            },
            this.state.assignmentId
          );
        },
        onFail: () => this.props.onClose(),
      });
    }
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    const { compositeReplies, materialEvaluation } = this.props;
    const { evaluationGradeSystem } = this.props.evaluations;

    if (compositeReplies.evaluationInfo.date) {
      this.setStateAndClear(
        {
          literalEvaluation: compositeReplies.evaluationInfo.text,
          grade:
            compositeReplies.state === "INCOMPLETE"
              ? `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`
              : `${materialEvaluation.gradingScaleSchoolDataSource}-${materialEvaluation.gradeIdentifier}`,
          assignmentEvaluationType:
            compositeReplies.state === "INCOMPLETE" ? "INCOMPLETE" : "GRADED",
        },
        this.state.assignmentId
      );
    } else {
      this.setStateAndClear(
        {
          literalEvaluation: "",
          grade: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
          assignmentEvaluationType: "GRADED",
        },
        this.state.assignmentId
      );
    }
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
    const { evaluationGradeSystem } = this.props.evaluations;

    const defaultGrade = `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`;

    this.setStateAndStore(
      {
        assignmentEvaluationType: e.target.value,
        grade: defaultGrade,
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
          {this.props.editorLabel && (
            <label className="drawer-editor-label">
              {this.props.editorLabel}
            </label>
          )}

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
            <optgroup
              label={this.props.evaluations.evaluationGradeSystem[0].name}
            >
              {this.props.evaluations.evaluationGradeSystem[0].grades.map(
                (item) => (
                  <option
                    key={item.id}
                    value={`${this.props.evaluations.evaluationGradeSystem[0].dataSource}-${item.id}`}
                  >
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
          {this.recovered && (
            <Button
              className="eval-modal-evaluate-button button-delete-draft"
              onClick={this.handleDeleteEditorDraft}
            >
              Poista luonnos
            </Button>
          )}
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
    status: state.status,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      saveAssignmentEvaluationGradeToServer,
      saveAssignmentEvaluationSupplementationToServer,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentEditor);
