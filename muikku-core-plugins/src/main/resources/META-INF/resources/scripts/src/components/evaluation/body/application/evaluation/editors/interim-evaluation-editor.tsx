import * as React from "react";
import CKEditor from "~/components/general/ckeditor";
import "~/sass/elements/evaluation.scss";
import SessionStateComponent from "~/components/general/session-state-component";
import { Action, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { StateType } from "~/reducers/index";
import { AnyActionType } from "~/actions/index";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import {
  UpdateCurrentStudentEvaluationCompositeRepliesData,
  updateCurrentStudentCompositeRepliesData,
  LoadEvaluationAssessmentEvent,
  loadEvaluationAssessmentEventsFromServer,
  UpdateNeedsReloadEvaluationRequests,
  updateNeedsReloadEvaluationRequests,
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/form.scss";
import Recorder from "~/components/general/voice-recorder/recorder";
import AnimateHeight from "react-animate-height";
import { CKEditorConfig } from "../evaluation";
import notificationActions from "~/actions/base/notifications";
import WarningDialog from "../../../../dialogs/close-warning";
import { LocaleState } from "~/reducers/base/locales";
import {
  AssessmentWithAudio,
  AudioAssessment,
  EvaluationAssessmentRequest,
  EvaluationGradeScale,
  MaterialEvaluation,
  SaveWorkspaceAssigmentAssessmentRequest,
  MaterialCompositeReply,
  WorkspaceMaterial,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * AssignmentEditorProps
 */
interface InterimEvaluationEditorProps extends WithTranslation {
  selectedAssessment: EvaluationAssessmentRequest;
  materialEvaluation?: MaterialEvaluation;
  materialAssignment: WorkspaceMaterial;
  compositeReplies: MaterialCompositeReply;
  evaluations: EvaluationState;
  status: StatusType;
  locale: LocaleState;
  editorLabel?: string;
  modifiers?: string[];
  isRecording: boolean;
  showAudioAssessmentWarningOnClose: boolean;
  onAudioAssessmentChange: () => void;
  updateMaterialEvaluationData: (
    assessmentWithAudio: AssessmentWithAudio
  ) => void;
  updateCurrentStudentCompositeRepliesData: UpdateCurrentStudentEvaluationCompositeRepliesData;
  loadEvaluationAssessmentEventsFromServer: LoadEvaluationAssessmentEvent;
  updateNeedsReloadEvaluationRequests: UpdateNeedsReloadEvaluationRequests;
  /**
   * Handles changes whether recording is happening or not
   */
  onIsRecordingChange?: (isRecording: boolean) => void;
  onClose?: () => void;
  onAssigmentSave?: (materialId: number) => void;
}

/**
 * AssignmentEditorState
 */
interface InterimEvaluationEditorState {
  literalEvaluation: string;
  assignmentEvaluationType: string;
  audioAssessments: AudioAssessment[];
  grade: string;
  draftId: string;
  locked: boolean;
  activeGradeSystems: EvaluationGradeScale[];
}

/**
 * AssignmentEditor
 */
class InterimEvaluationEditor extends SessionStateComponent<
  InterimEvaluationEditorProps,
  InterimEvaluationEditorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: InterimEvaluationEditorProps) {
    super(props, `intermin-evaluation-editor`);

    const { compositeReplies, selectedAssessment } = props;

    const draftId = `${selectedAssessment.userEntityId}-${props.materialAssignment.id}`;

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
        compositeReplies.evaluationInfo &&
        compositeReplies.evaluationInfo.audioAssessments &&
        compositeReplies.evaluationInfo.audioAssessments !== null
          ? compositeReplies.evaluationInfo.audioAssessments
          : [],
      locked: false,
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
        compositeReplies.evaluationInfo &&
        compositeReplies.evaluationInfo.audioAssessments &&
        compositeReplies.evaluationInfo.audioAssessments !== null
          ? compositeReplies.evaluationInfo.audioAssessments
          : [],
    });
  };

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   * @param prevState prevState
   */
  componentDidUpdate = (
    prevProps: InterimEvaluationEditorProps,
    prevState: InterimEvaluationEditorState
  ) => {
    if (
      this.state.audioAssessments.length !== prevState.audioAssessments.length
    ) {
      this.props.onAudioAssessmentChange();
    }
  };

  /**
   * saveAssignmentEvaluationGradeToServer
   * @param data data
   * @param data.workspaceEntityId workspaceEntityId
   * @param data.userEntityId userEntityId
   * @param data.workspaceMaterialId workspaceMaterialId
   * @param data.dataToSave data ToSave
   * @param data.materialId materialId
   */
  saveAssignmentEvaluationGradeToServer = async (data: {
    workspaceEntityId: number;
    userEntityId: number;
    workspaceMaterialId: number;
    dataToSave: SaveWorkspaceAssigmentAssessmentRequest;
    materialId: number;
  }) => {
    const evaluationApi = MApi.getEvaluationApi();

    this.setState({
      locked: true,
    });

    const { t } = this.props;

    const { workspaceEntityId, userEntityId, workspaceMaterialId, dataToSave } =
      data;

    try {
      const assessmentWithAudio =
        await evaluationApi.saveWorkspaceAssigmentAssessment({
          workspaceId: workspaceEntityId,
          userEntityId: userEntityId,
          workspaceMaterialId: workspaceMaterialId,
          saveWorkspaceAssigmentAssessmentRequest: {
            ...dataToSave,
          },
        });

      this.props.updateCurrentStudentCompositeRepliesData({
        workspaceId: workspaceEntityId,
        userEntityId: userEntityId,
        workspaceMaterialId: workspaceMaterialId,
      });

      this.props.loadEvaluationAssessmentEventsFromServer({
        assessment: this.props.selectedAssessment,
      });

      this.props.updateMaterialEvaluationData(assessmentWithAudio);

      this.props.updateNeedsReloadEvaluationRequests({ value: true });

      if (this.props.onAssigmentSave) {
        this.props.onAssigmentSave(this.props.materialAssignment.materialId);
      }

      // Clears localstorage on success
      this.justClear(
        ["literalEvaluation", "assignmentEvaluationType", "grade"],
        this.state.draftId
      );

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

      notificationActions.displayNotification(
        t("notifications.saveError", {
          ns: "evaluation",
          context: "assignmentEvaluation",
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
   * handleSaveAssignment
   * @param e e
   */
  handleSaveAssignment = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    /* const { evaluationGradeSystem } = this.props.evaluations; */
    const { workspaceEntityId, userEntityId } = this.props.selectedAssessment;

    /**
     * Backend endpoint is different for normal grade evalution and supplementation
     */
    await this.saveAssignmentEvaluationGradeToServer({
      workspaceEntityId: workspaceEntityId,
      userEntityId: userEntityId,
      workspaceMaterialId: this.props.materialAssignment.id,
      dataToSave: {
        assessorIdentifier: this.props.status.userSchoolDataIdentifier,
        verbalAssessment: this.state.literalEvaluation,
        assessmentDate: new Date().getTime(),
        audioAssessments: this.state.audioAssessments,
        evaluationType: "GRADED",
      },
      materialId: this.props.materialAssignment.materialId,
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
    });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    return (
      <div className="form" role="form">
        <div className="form__row">
          <div className="form-element">
            {this.props.editorLabel && <label>{this.props.editorLabel}</label>}

            <CKEditor
              onChange={this.handleCKEditorChange}
              configuration={CKEditorConfig(this.props.locale.current)}
            >
              {this.state.literalEvaluation}
            </CKEditor>
          </div>
        </div>

        <div className="form__row">
          <div className="form-element">
            <AnimateHeight
              height={
                this.state.assignmentEvaluationType !== "INCOMPLETE"
                  ? "auto"
                  : 0
              }
            >
              <label htmlFor="assignmentEvaluationGrade">
                {t("labels.interimEvaluation", {
                  ns: "evaluation",
                  context: "verbal",
                })}
              </label>
              <Recorder
                onIsRecordingChange={this.props.onIsRecordingChange}
                onChange={this.handleAudioAssessmentChange}
                values={this.state.audioAssessments}
              />
            </AnimateHeight>
          </div>
        </div>

        <div className="form__buttons form__buttons--evaluation">
          <Button
            buttonModifiers="dialog-execute"
            onClick={this.handleSaveAssignment}
            disabled={this.state.locked || this.props.isRecording}
          >
            {t("actions.save")}
          </Button>
          {this.props.showAudioAssessmentWarningOnClose ? (
            <WarningDialog onContinueClick={this.props.onClose}>
              <Button
                buttonModifiers="dialog-cancel"
                disabled={this.state.locked || this.props.isRecording}
              >
                {t("actions.cancel")}
              </Button>
            </WarningDialog>
          ) : (
            <Button
              onClick={this.props.onClose}
              disabled={this.state.locked || this.props.isRecording}
              buttonModifiers="dialog-cancel"
            >
              {t("actions.cancel")}
            </Button>
          )}

          {this.recovered && (
            <Button
              buttonModifiers="dialog-clear"
              disabled={this.state.locked || this.props.isRecording}
              onClick={this.handleDeleteEditorDraft}
            >
              {t("actions.remove", { context: "draft" })}
            </Button>
          )}
        </div>

        {this.props.isRecording && (
          <div className="evaluation-modal__evaluate-drawer-row evaluation-modal__evaluate-drawer-row--recording-warning">
            <div className="recording-warning">
              {t("content.isRecording", { ns: "evaluation" })}
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
    locale: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      updateCurrentStudentCompositeRepliesData,
      loadEvaluationAssessmentEventsFromServer,
      updateNeedsReloadEvaluationRequests,
    },
    dispatch
  );
}

export default withTranslation(["evaluation", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(InterimEvaluationEditor)
);
