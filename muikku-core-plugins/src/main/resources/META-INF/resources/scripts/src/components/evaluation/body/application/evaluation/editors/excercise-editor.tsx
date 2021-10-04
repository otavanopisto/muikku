import * as React from "react";
import CKEditor from "~/components/general/ckeditor";
import "~/sass/elements/evaluation.scss";
import SessionStateComponent from "~/components/general/session-state-component";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers/index";
import { AnyActionType } from "~/actions/index";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import {
  MaterialAssignmentType,
  MaterialEvaluationType,
} from "~/reducers/workspaces/index";
import { MaterialCompositeRepliesType } from "~/reducers/workspaces/index";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import { i18nType } from "~/reducers/base/i18n";
import {
  SaveEvaluationAssignmentSupplementation,
  saveAssignmentEvaluationSupplementationToServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import {
  SaveEvaluationAssignmentGradeEvaluation,
  saveAssignmentEvaluationGradeToServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/form-elements.scss";
import Recorder from "~/components/general/voice-recorder/recorder";
import { AudioAssessment } from "../../../../../../@types/evaluation";
import AnimateHeight from "react-animate-height";

/**
 * AssignmentEditorProps
 */
interface AssignmentEditorProps {
  i18n: i18nType;
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
  needsSupplementation: boolean;
  audioAssessments: AudioAssessment[];
  draftId: string;
}

/**
 * AssignmentEditor
 */
class ExcerciseEditor extends SessionStateComponent<
  AssignmentEditorProps,
  AssignmentEditorState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: AssignmentEditorProps) {
    super(props, `excercise-editor`);

    const { compositeReplies } = props;
    const { evaluationSelectedAssessmentId } = props.evaluations;

    let draftId = `${evaluationSelectedAssessmentId.userEntityId}-${props.materialAssignment.id}`;

    this.state = {
      ...this.getRecoverStoredState(
        {
          literalEvaluation:
            compositeReplies && compositeReplies.evaluationInfo
              ? compositeReplies.evaluationInfo.text
              : "",
          needsSupplementation:
            compositeReplies &&
            compositeReplies.evaluationInfo &&
            compositeReplies.evaluationInfo.type === "INCOMPLETE",

          draftId,
        },
        draftId
      ),
      audioAssessments:
        compositeReplies.evaluationInfo &&
        compositeReplies.evaluationInfo.audioAssessments &&
        compositeReplies.evaluationInfo.audioAssessments !== null
          ? compositeReplies.evaluationInfo.audioAssessments
          : [],
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    const { compositeReplies } = this.props;

    this.setState({
      ...this.getRecoverStoredState(
        {
          literalEvaluation:
            compositeReplies && compositeReplies.evaluationInfo
              ? compositeReplies.evaluationInfo.text
              : "",
          needsSupplementation:
            compositeReplies &&
            compositeReplies.evaluationInfo &&
            compositeReplies.evaluationInfo.type === "INCOMPLETE",
        },
        this.state.draftId
      ),
      audioAssessments:
        compositeReplies.evaluationInfo &&
        compositeReplies.evaluationInfo.audioAssessments &&
        compositeReplies.evaluationInfo.audioAssessments !== null
          ? compositeReplies.evaluationInfo.audioAssessments
          : [],
    });
  };

  /**
   * handleSaveAssignment
   * @param e
   */
  handleSaveAssignment = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    /**
     * Backend endpoint is different for normal grade evalution and supplementation
     */
    if (!this.state.needsSupplementation) {
      this.props.onClose();
      this.props.saveAssignmentEvaluationGradeToServer({
        workspaceEntityId:
          this.props.evaluations.evaluationSelectedAssessmentId
            .workspaceEntityId,
        userEntityId:
          this.props.evaluations.evaluationSelectedAssessmentId.userEntityId,
        workspaceMaterialId: this.props.materialAssignment.id,
        dataToSave: {
          assessorIdentifier: this.props.status.userSchoolDataIdentifier,
          gradingScaleIdentifier: null,
          gradeIdentifier: null,
          verbalAssessment: this.state.literalEvaluation,
          assessmentDate: new Date().getTime(),
          audioAssessments: this.state.audioAssessments,
        },
        onSuccess: () => {
          this.setStateAndClear(
            {
              literalEvaluation: "",
              needsSupplementation: false,
              audioAssessments: [],
            },
            this.state.draftId
          );
        },
        onFail: () => this.props.onClose(),
      });
    } else {
      this.props.onClose();

      this.props.saveAssignmentEvaluationSupplementationToServer({
        workspaceEntityId:
          this.props.evaluations.evaluationSelectedAssessmentId
            .workspaceEntityId,
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
              needsSupplementation: true,
              audioAssessments: [],
            },
            this.state.draftId
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
    const { compositeReplies } = this.props;

    if (
      compositeReplies.evaluationInfo &&
      compositeReplies.evaluationInfo.date
    ) {
      this.setStateAndClear(
        {
          literalEvaluation: compositeReplies.evaluationInfo.text,
          needsSupplementation:
            compositeReplies.evaluationInfo.type === "INCOMPLETE",
        },
        this.state.draftId
      );
    } else {
      this.setStateAndClear(
        {
          literalEvaluation: "",
          needsSupplementation: false,
        },
        this.state.draftId
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
      this.state.draftId
    );
  };

  /**
   * handleAssignmentEvaluationChange
   * @param e
   */
  handleAssignmentEvaluationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setStateAndStore(
      {
        needsSupplementation: e.target.checked,
      },
      this.state.draftId
    );
  };

  /**
   * handleAudioAssessmentChange
   * @param audioAssessments
   */
  handleAudioAssessmentChange = (audioAssessments: AudioAssessment[]) => {
    this.setState({
      audioAssessments: audioAssessments,
    });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <>
        <div className="evaluation-modal__evaluate-drawer-row form-element">
          {this.props.editorLabel && (
            <label className="evaluation-modal__evaluate-drawer-row-label">
              {this.props.editorLabel}
            </label>
          )}

          <CKEditor onChange={this.handleCKEditorChange}>
            {this.state.literalEvaluation}
          </CKEditor>
        </div>

        <div className="evaluation-modal__evaluate-drawer-row form-element">
          <label className="evaluation-modal__evaluate-drawer-row-label">
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.assignmentEvaluationForm.assessmentEvaluateLabel"
            )}
          </label>
          <div className="evaluation-modal__evaluate-drawer-row-data">
            <div className="evaluation-modal__evaluate-drawer-row-item">
              <input
                id="assignmentEvaluationTypeINCOMPLETE"
                type="checkbox"
                name="assignmentEvaluationType"
                value="INCOMPLETE"
                checked={this.state.needsSupplementation}
                onChange={this.handleAssignmentEvaluationChange}
              />
              <label htmlFor="assignmentEvaluationTypeINCOMPLETE">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentEvaluatedIncompleteLabel"
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="evaluation-modal__evaluate-drawer-row  form-element">
          <AnimateHeight height={!this.state.needsSupplementation ? "auto" : 0}>
            <label
              htmlFor="assignmentEvaluationGrade"
              className="evaluation-modal__evaluate-drawer-row-label"
            >
              {this.props.i18n.text.get(
                "plugin.evaluation.evaluationModal.audioAssessments"
              )}
            </label>
            <div className="recorder-container">
              <Recorder
                onChange={this.handleAudioAssessmentChange}
                values={this.state.audioAssessments}
              />
            </div>
          </AnimateHeight>
        </div>

        <div className="evaluation-modal__evaluate-drawer-row evaluation-modal__evaluate-drawer-row--buttons">
          <Button
            buttonModifiers="evaluate-assignment"
            onClick={this.handleSaveAssignment}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.saveButtonLabel"
            )}
          </Button>
          <Button
            onClick={this.props.onClose}
            buttonModifiers="evaluate-cancel"
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.cancelButtonLabel"
            )}
          </Button>
          {this.recovered && (
            <Button
              buttonModifiers="evaluate-remove-draft"
              onClick={this.handleDeleteEditorDraft}
            >
              {this.props.i18n.text.get(
                "plugin.evaluation.evaluationModal.workspaceEvaluationForm.deleteDraftButtonLabel"
              )}
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
    i18n: state.i18n,
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

export default connect(mapStateToProps, mapDispatchToProps)(ExcerciseEditor);
