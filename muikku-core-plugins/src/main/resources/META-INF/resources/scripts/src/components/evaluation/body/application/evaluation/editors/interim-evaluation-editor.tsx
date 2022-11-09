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
  UpdateCurrentStudentEvaluationCompositeRepliesData,
  updateCurrentStudentCompositeRepliesData,
  LoadEvaluationAssessmentEvent,
  loadEvaluationAssessmentEventsFromServer,
  UpdateNeedsReloadEvaluationRequests,
  updateNeedsReloadEvaluationRequests,
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/form.scss";
import Recorder from "~/components/general/voice-recorder/recorder";
import {
  AssessmentRequest,
  AssignmentInterminEvaluationRequest,
  AudioAssessment,
  EvaluationGradeSystem,
} from "~/@types/evaluation";
import AnimateHeight from "react-animate-height";
import { LocaleListType } from "~/reducers/base/locales";
import { CKEditorConfig } from "../evaluation";
import mApi from "~/lib/mApi";
import notificationActions from "~/actions/base/notifications";
import { AssignmentEvaluationSaveReturn } from "~/@types/evaluation";
import promisify from "~/util/promisify";
import WarningDialog from "../../../../dialogs/close-warning";

/**
 * AssignmentEditorProps
 */
interface InterimEvaluationEditorProps {
  i18n: i18nType;
  selectedAssessment: AssessmentRequest;
  materialEvaluation?: MaterialEvaluationType;
  materialAssignment: MaterialAssignmentType;
  compositeReplies: MaterialCompositeRepliesType;
  evaluations: EvaluationState;
  status: StatusType;
  locale: LocaleListType;
  editorLabel?: string;
  modifiers?: string[];
  isRecording: boolean;
  showAudioAssessmentWarningOnClose: boolean;
  onAudioAssessmentChange: () => void;
  updateMaterialEvaluationData: (
    assigmentSaveReturn: AssignmentEvaluationSaveReturn
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
  activeGradeSystems: EvaluationGradeSystem[];
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
    dataToSave: AssignmentInterminEvaluationRequest;
    materialId: number;
  }) => {
    this.setState({
      locked: true,
    });

    const { workspaceEntityId, userEntityId, workspaceMaterialId, dataToSave } =
      data;

    try {
      await promisify(
        mApi().evaluation.workspace.user.workspacematerial.assessment.create(
          workspaceEntityId,
          userEntityId,
          workspaceMaterialId,
          {
            ...dataToSave,
          }
        ),
        "callback"
      )().then(async (data: AssignmentEvaluationSaveReturn) => {
        await mApi().workspace.workspaces.compositeReplies.cacheClear();

        this.props.updateCurrentStudentCompositeRepliesData({
          workspaceId: workspaceEntityId,
          userEntityId: userEntityId,
          workspaceMaterialId: workspaceMaterialId,
        });

        this.props.loadEvaluationAssessmentEventsFromServer({
          assessment: this.props.selectedAssessment,
        });

        this.props.updateMaterialEvaluationData(data);

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
      });
    } catch (error) {
      notificationActions.displayNotification(
        this.props.i18n.text.get(
          "plugin.evaluation.notifications.saveAssigmentGrade.error",
          error.message
        ),
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
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.interminEvaluationAudioAssessments"
                )}
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
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.saveButtonLabel"
            )}
          </Button>
          {this.props.showAudioAssessmentWarningOnClose ? (
            <WarningDialog onContinueClick={this.props.onClose}>
              <Button
                buttonModifiers="dialog-cancel"
                disabled={this.state.locked || this.props.isRecording}
              >
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.workspaceEvaluationForm.cancelButtonLabel"
                )}
              </Button>
            </WarningDialog>
          ) : (
            <Button
              onClick={this.props.onClose}
              disabled={this.state.locked || this.props.isRecording}
              buttonModifiers="dialog-cancel"
            >
              {this.props.i18n.text.get(
                "plugin.evaluation.evaluationModal.workspaceEvaluationForm.cancelButtonLabel"
              )}
            </Button>
          )}

          {this.recovered && (
            <Button
              buttonModifiers="dialog-clear"
              disabled={this.state.locked || this.props.isRecording}
              onClick={this.handleDeleteEditorDraft}
            >
              {this.props.i18n.text.get(
                "plugin.evaluation.evaluationModal.workspaceEvaluationForm.deleteDraftButtonLabel"
              )}
            </Button>
          )}
        </div>

        {this.props.isRecording && (
          <div className="evaluation-modal__evaluate-drawer-row evaluation-modal__evaluate-drawer-row--recording-warning">
            <div className="recording-warning">
              {this.props.i18n.text.get(
                "plugin.evaluation.evaluationModal.assignmentEvaluationForm.isRecordingWarning"
              )}
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
    i18n: state.i18n,
    status: state.status,
    evaluations: state.evaluations,
    locale: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      updateCurrentStudentCompositeRepliesData,
      loadEvaluationAssessmentEventsFromServer,
      updateNeedsReloadEvaluationRequests,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterimEvaluationEditor);
