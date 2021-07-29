import * as React from "react";
import { connect, Dispatch } from "react-redux";
import CKEditor from "~/components/general/ckeditor";
import { StateType } from "../../../../../reducers/index";
import { AnyActionType } from "../../../../../actions/index";
import { StatusType } from "../../../../../reducers/base/status";
import { EvaluationState } from "../../../../../reducers/main-function/evaluation/index";
import { bindActionCreators } from "redux";
import {
  UpdateWorkspaceEvaluation,
  updateWorkspaceEvaluationToServer,
} from "../../../../../actions/main-function/evaluation/evaluationActions";
import SessionStateComponent from "~/components/general/session-state-component";
import { cleanWorkspaceAndSupplementationDrafts } from "../../../dialogs/delete";

/**
 * WorkspaceEditorProps
 */
interface WorkspaceEditorProps {
  status: StatusType;
  evaluations: EvaluationState;
  type?: "new" | "edit";
  editorLabel?: string;
  onClose?: () => void;
  updateWorkspaceEvaluationToServer: UpdateWorkspaceEvaluation;
}

/**
 * WorkspaceEditorState
 */
interface WorkspaceEditorState {
  literalEvaluation: string;
  grade: string;
  eventId: string;
}

/**
 * WorkspaceEditor
 * @param param0
 * @returns
 */
class WorkspaceEditor extends SessionStateComponent<
  WorkspaceEditorProps,
  WorkspaceEditorState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: WorkspaceEditorProps) {
    /**
     * This is wierd one, setting namespace and identificated type for it from props...
     */
    super(props, `workspace-editor-${props.type ? props.type : "new"}`);

    const { evaluationAssessmentEvents } = props.evaluations;

    const latestIndex = evaluationAssessmentEvents.length - 1;

    const eventId = evaluationAssessmentEvents[latestIndex].identifier;

    this.state = this.getRecoverStoredState(
      {
        literalEvaluation: "",
        grade: "notselected",
        eventId,
      },
      eventId
    );
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    const { evaluationAssessmentEvents, evaluationGradeSystem } =
      this.props.evaluations;
    const latestIndex = evaluationAssessmentEvents.length - 1;

    if (this.props.type === "edit") {
      this.setState(
        this.getRecoverStoredState(
          {
            literalEvaluation: evaluationAssessmentEvents[latestIndex].text,
            grade: `${evaluationGradeSystem[0].dataSource}-${evaluationAssessmentEvents[latestIndex].grade}`,
          },
          this.state.eventId
        )
      );
    } else {
      this.setState(
        this.getRecoverStoredState(
          {
            literalEvaluation: "",
            grade: "notselected",
          },
          this.state.eventId
        )
      );
    }
  };

  /**
   * handleCKEditorChange
   * @param e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ literalEvaluation: e }, this.state.eventId);
  };

  /**
   * handleSelectGradeChange
   * @param e
   */
  handleSelectGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore({ grade: e.target.value }, this.state.eventId);
  };

  /**
   * handleEvaluationSave
   * @param e
   */
  handleEvaluationSave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { evaluations, type = "new", status, onClose } = this.props;
    const { evaluationGradeSystem, evaluationAssessmentEvents } = evaluations;
    const { literalEvaluation, grade } = this.state;

    if (type === "new") {
      this.props.updateWorkspaceEvaluationToServer({
        type: "new",
        workspaceEvaluation: {
          assessorIdentifier: status.userSchoolDataIdentifier,
          gradingScaleIdentifier: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
          gradeIdentifier: grade,
          verbalAssessment: literalEvaluation,
          assessmentDate: new Date().getTime().toString(),
        },
        onSuccess: () => {
          cleanWorkspaceAndSupplementationDrafts(this.state.eventId);
          this.setStateAndClear(
            {
              literalEvaluation: "",
              grade: "notselected",
            },
            this.state.eventId
          );
          onClose();
        },
        onFail: () => onClose(),
      });
    } else {
      /**
       * Latest assessments event index whom identifier we want to get
       */
      const latestIndex = evaluationAssessmentEvents.length - 1;

      this.props.updateWorkspaceEvaluationToServer({
        type: "edit",
        workspaceEvaluation: {
          identifier: evaluationAssessmentEvents[latestIndex].identifier,
          assessorIdentifier: status.userSchoolDataIdentifier,
          gradingScaleIdentifier: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
          gradeIdentifier: grade,
          verbalAssessment: literalEvaluation,
          assessmentDate: new Date().getTime().toString(),
        },
        onSuccess: () => {
          cleanWorkspaceAndSupplementationDrafts(this.state.eventId);

          this.setStateAndClear(
            {
              literalEvaluation: "",
              grade: "notselected",
            },
            this.state.eventId
          );
          onClose();
        },
        onFail: () => onClose(),
      });
    }
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    if (this.props.type === "edit") {
      const { evaluationAssessmentEvents, evaluationGradeSystem } =
        this.props.evaluations;
      const latestIndex = evaluationAssessmentEvents.length - 1;

      this.setStateAndClear({
        literalEvaluation: evaluationAssessmentEvents[latestIndex].text,
        grade: `${evaluationGradeSystem[0].dataSource}-${evaluationAssessmentEvents[latestIndex].grade}`,
      });
    } else {
      this.setStateAndClear(
        {
          literalEvaluation: "",
          grade: "notselected",
        },
        this.state.eventId
      );
    }
  };

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

        <div className="evaluation-modal-evaluate-form-row--grade">
          <label className="evaluation__label">Arvosana</label>
          <select
            className="evaluation__select--grade"
            onChange={this.handleSelectGradeChange}
            value={this.state.grade}
          >
            <option value="notselected">Ei valittu</option>
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
          <div
            className={`eval-modal-evaluate-button eval-modal-evaluate-button--workspace`}
            onClick={this.handleEvaluationSave}
          >
            Tallenna
          </div>
          <div
            onClick={this.props.onClose}
            className="eval-modal-evaluate-button button-cancel"
          >
            Peruuta
          </div>
          {this.recovered && (
            <div
              className="eval-modal-evaluate-button button-delete-draft"
              onClick={this.handleDeleteEditorDraft}
            >
              Poista luonnos
            </div>
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
  return bindActionCreators({ updateWorkspaceEvaluationToServer }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceEditor);
