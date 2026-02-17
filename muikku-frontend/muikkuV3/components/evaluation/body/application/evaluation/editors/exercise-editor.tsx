import * as React from "react";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import { StatusType } from "~/reducers/base/status";
import SessionStateComponent from "~/components/general/session-state-component";
import CKEditor from "~/components/general/ckeditor";
import Button from "~/components/general/button";
import { Action, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions/index";
import Recorder from "~/components/general/voice-recorder/recorder";
import { StateType } from "reducers";
import { displayNotification } from "~/actions/base/notifications";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import {
  UpdateCurrentStudentEvaluationCompositeRepliesData,
  updateCurrentStudentCompositeRepliesData,
} from "~/actions/main-function/evaluation/evaluationActions";
import WarningDialog from "../../../../dialogs/close-warning";
import {
  AssessmentWithAudio,
  AudioAssessment,
  EvaluationAssessmentRequest,
  CreateWorkspaceNodeAssessmentRequest,
  MaterialCompositeReply,
  WorkspaceMaterial,
  NodeEvaluation,
  UpdateWorkspaceNodeAssessmentRequest,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { withTranslation, WithTranslation } from "react-i18next";
import PromptDialog from "~/components/general/prompt-dialog";
import notificationActions from "~/actions/base/notifications";

/**
 * ExerciseEditorProps
 */
interface ExerciseEditorProps extends WithTranslation {
  selectedAssessment: EvaluationAssessmentRequest;
  materialEvaluation?: NodeEvaluation;
  materialAssignment: WorkspaceMaterial;
  compositeReplies: MaterialCompositeReply;
  evaluations: EvaluationState;
  status: StatusType;
  updateMaterialEvaluationData: (
    assessmentWithAudio: AssessmentWithAudio
  ) => void;
  /**
   * Handles changes whether recording is happening or not
   */
  onIsRecordingChange?: (isRecording: boolean) => void;
  isRecording: boolean;
  onDeleteEvaluation?: () => void;
  updateCurrentStudentCompositeRepliesData: UpdateCurrentStudentEvaluationCompositeRepliesData;
  displayNotification: DisplayNotificationTriggerType;
  editorLabel?: string;
  modifiers?: string[];
  onClose?: () => void;
}

/**
 * ExerciseEditorState
 */
interface ExerciseEditorState {
  literalEvaluation: string;
  audioAssessments: AudioAssessment[];
  draftId: string;
  locked: boolean;
  showAudioAssessmentWarningOnClose: boolean;
}

/**
 * ExerciseEditor
 */
class ExerciseEditor extends SessionStateComponent<
  ExerciseEditorProps,
  ExerciseEditorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ExerciseEditorProps) {
    super(props, `exercise-editor`);

    const { compositeReplies, selectedAssessment, materialAssignment } = props;

    const { userEntityId } = selectedAssessment;

    const draftId = `${userEntityId}-${materialAssignment.id}`;

    this.state = {
      ...this.getRecoverStoredState(
        {
          literalEvaluation:
            compositeReplies && compositeReplies.evaluationInfo
              ? compositeReplies.evaluationInfo.text
              : "",

          draftId,
        },
        draftId
      ),
      audioAssessments:
        compositeReplies?.evaluationInfo &&
        compositeReplies?.evaluationInfo.audioAssessments &&
        compositeReplies?.evaluationInfo.audioAssessments !== null
          ? compositeReplies.evaluationInfo.audioAssessments
          : [],
      locked: false,
      showAudioAssessmentWarningOnClose: false,
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
        },
        this.state.draftId
      ),
      audioAssessments:
        compositeReplies?.evaluationInfo &&
        compositeReplies?.evaluationInfo.audioAssessments &&
        compositeReplies?.evaluationInfo.audioAssessments !== null
          ? compositeReplies.evaluationInfo.audioAssessments
          : [],
      showAudioAssessmentWarningOnClose: false,
    });
  };

  /**
   * saveAssignmentEvaluationGradeToServer
   * @param data data
   * @param data.workspaceEntityId workspaceEntityId
   * @param data.userEntityId userEntityId
   * @param data.workspaceMaterialId workspaceMaterialId
   * @param data.dataToSave dataToSave
   * @param data.materialId materialId
   * @param data.edit edit
   */
  saveAssignmentEvaluationGradeToServer = async (data: {
    workspaceEntityId: number;
    userEntityId: number;
    workspaceMaterialId: number;
    dataToSave:
      | CreateWorkspaceNodeAssessmentRequest
      | UpdateWorkspaceNodeAssessmentRequest;
    materialId: number;
    edit: boolean;
  }) => {
    const evaluationApi = MApi.getEvaluationApi();

    const { workspaceEntityId, userEntityId, workspaceMaterialId, dataToSave } =
      data;

    this.setState({
      locked: true,
    });

    try {
      const assessmentWithAudio = data.edit
        ? await evaluationApi.updateWorkspaceNodeAssessment({
            workspaceId: workspaceEntityId,
            userEntityId,
            workspaceNodeId: workspaceMaterialId,
            assessmentId: this.props.compositeReplies.evaluationInfo.id,
            updateWorkspaceNodeAssessmentRequest: {
              ...(dataToSave as UpdateWorkspaceNodeAssessmentRequest),
              ...dataToSave,
            },
          })
        : await evaluationApi.createWorkspaceNodeAssessment({
            workspaceId: workspaceEntityId,
            userEntityId,
            workspaceNodeId: workspaceMaterialId,
            createWorkspaceNodeAssessmentRequest: {
              ...(dataToSave as CreateWorkspaceNodeAssessmentRequest),
            },
          });

      this.props.updateCurrentStudentCompositeRepliesData({
        workspaceId: workspaceEntityId,
        userEntityId: userEntityId,
        workspaceMaterialId: workspaceMaterialId,
      });

      this.props.updateMaterialEvaluationData(assessmentWithAudio);

      this.justClear(
        ["literalEvaluation", "needsSupplementation"],
        this.state.draftId
      );

      // Clears localstorage on success
      this.setState(
        {
          locked: false,
        },
        () => {
          if (this.props.onClose) {
            this.props.onClose();
          }
        }
      );
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      this.props.displayNotification(
        this.props.t("notifications.saveError", {
          ns: "evaluation",
          error: err.message,
          context: "assignmentEvaluation",
        }),
        "error"
      );

      this.setState({
        locked: false,
      });
    }
  };

  /**
   * handleSaveAssignment
   * @param e e
   */
  handleSaveAssignment = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const { compositeReplies, selectedAssessment } = this.props;
    const { workspaceEntityId, userEntityId } = selectedAssessment;

    /**
     * Backend endpoint is different for normal grade evalution and supplementation
     */

    this.saveAssignmentEvaluationGradeToServer({
      workspaceEntityId: workspaceEntityId,
      userEntityId: userEntityId,
      workspaceMaterialId: this.props.materialAssignment.id,
      dataToSave: {
        identifier: compositeReplies?.evaluationInfo
          ? compositeReplies.evaluationInfo.id.toString()
          : undefined,
        evaluationType: "GRADED",
        assessorIdentifier: this.props.status.userSchoolDataIdentifier,
        gradingScaleIdentifier: null,
        gradeIdentifier: null,
        verbalAssessment: this.state.literalEvaluation,
        assessmentDate: new Date().getTime(),
        audioAssessments: this.state.audioAssessments,
      },
      materialId: this.props.materialAssignment.materialId,
      edit: !!compositeReplies?.evaluationInfo,
    });
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
        },
        this.state.draftId
      );
    } else {
      this.setStateAndClear(
        {
          literalEvaluation: "",
        },
        this.state.draftId
      );
    }
  };

  /**
   * handleCKEditorChange
   * @param e e
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
   * handleAudioAssessmentChange
   * @param audioAssessments audioAssessments
   */
  handleAudioAssessmentChange = (audioAssessments: AudioAssessment[]) => {
    this.setState({
      audioAssessments: audioAssessments,
      showAudioAssessmentWarningOnClose: true,
    });
  };

  /**
   * deleteAssignmentEvaluation
   * Deletes the assignment evaluation from server
   */
  deleteAssignmentEvaluation = async () => {
    const evaluationApi = MApi.getEvaluationApi();

    this.setState({
      locked: true,
    });

    const { t } = this.props;

    const { workspaceEntityId, userEntityId } = this.props.selectedAssessment;

    try {
      await evaluationApi.deleteWorkspaceNodeAssessment({
        workspaceId: workspaceEntityId,
        userEntityId: userEntityId,
        workspaceNodeId: this.props.materialAssignment.id,
        assessmentId: this.props.compositeReplies.evaluationInfo.id,
      });
      notificationActions.displayNotification(
        t("notifications.removeSuccess", {
          context: "assignmentEvaluation",
          ns: "evaluation",
        }),
        "success"
      );

      this.props.updateCurrentStudentCompositeRepliesData({
        workspaceId: workspaceEntityId,
        userEntityId: userEntityId,
        workspaceMaterialId: this.props.materialAssignment.id,
      });

      this.setState(
        {
          locked: false,
        },
        () => {
          if (this.props.onClose) {
            this.props.onClose();
          }
        }
      );
      this.props.onDeleteEvaluation && this.props.onDeleteEvaluation();
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      notificationActions.displayNotification(
        t("notifications.removeError", {
          context: "assignmentEvaluation",
          ns: "evaluation",
          error: err.message,
        }),
        "error"
      );

      this.setState({
        locked: false,
      });
    }
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;
    const removeEvaluation = (
      <span
        dangerouslySetInnerHTML={{
          __html: t("content.removing", {
            ns: "evaluation",
            context: "assignmentEvaluation",
            assignmentTitle: this.props.materialAssignment.title || "",
          }),
        }}
      ></span>
    );
    return (
      <div className="form" role="form">
        <div className="form__row">
          <div className="form-element">
            {this.props.editorLabel && <label>{this.props.editorLabel}</label>}

            <CKEditor onChange={this.handleCKEditorChange}>
              {this.state.literalEvaluation}
            </CKEditor>
          </div>
        </div>
        <div className="form__row">
          <div className="form-element">
            <label htmlFor="assignmentEvaluationGrade">
              {this.props.t("labels.verbalEvaluation", {
                ns: "evaluation",
              })}
            </label>
            <Recorder
              onIsRecordingChange={this.props.onIsRecordingChange}
              onChange={this.handleAudioAssessmentChange}
              values={this.state.audioAssessments}
            />
          </div>
        </div>

        <div className="form__buttons form__buttons--evaluation">
          <Button
            buttonModifiers="dialog-execute"
            onClick={this.handleSaveAssignment}
            disabled={this.state.locked || this.props.isRecording}
          >
            {this.props.t("actions.save")}
          </Button>
          {this.state.showAudioAssessmentWarningOnClose ? (
            <WarningDialog onContinueClick={this.props.onClose}>
              <Button
                buttonModifiers="dialog-cancel"
                disabled={this.state.locked || this.props.isRecording}
              >
                {this.props.t("actions.cancel")}
              </Button>
            </WarningDialog>
          ) : (
            <Button
              onClick={this.props.onClose}
              buttonModifiers="dialog-cancel"
              disabled={this.state.locked || this.props.isRecording}
            >
              {this.props.t("actions.cancel")}
            </Button>
          )}

          {this.recovered && (
            <Button
              buttonModifiers="dialog-clear"
              onClick={this.handleDeleteEditorDraft}
              disabled={this.state.locked || this.props.isRecording}
            >
              {this.props.t("actions.remove", { context: "draft" })}
            </Button>
          )}
          {this.props.materialEvaluation && (
            <PromptDialog
              title={t("labels.remove", {
                ns: "evaluation",
                context: "assignmentEvaluation",
              })}
              content={removeEvaluation}
              onExecute={this.deleteAssignmentEvaluation}
            >
              <Button
                buttonModifiers="dialog-delete"
                disabled={this.state.locked || this.props.isRecording}
              >
                {t("actions.remove", { context: "evaluation" })}
              </Button>
            </PromptDialog>
          )}
        </div>

        {this.props.isRecording && (
          <div className="form__row form__row--evaluation-warning">
            <div className="recording-warning">
              {this.props.t("content.isRecording", { ns: "evaluation" })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { updateCurrentStudentCompositeRepliesData, displayNotification },
    dispatch
  );
}

export default withTranslation([
  "evaluation",
  "workspace",
  "materials",
  "common",
])(connect(mapStateToProps, mapDispatchToProps)(ExerciseEditor));
