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
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/form.scss";
import Recorder from "~/components/general/voice-recorder/recorder";
import { LocaleState } from "~/reducers/base/locales";
import { CKEditorConfig } from "../evaluation";
import notificationActions from "~/actions/base/notifications";
import WarningDialog from "../../../../dialogs/close-warning";
import { WithTranslation, withTranslation } from "react-i18next";
import { RecordValue } from "~/@types/recorder";
import { MaterialCompositeReply, WorkspaceMaterial } from "~/generated/client";
import {
  AssessmentWithAudio,
  AudioAssessment,
  EvaluationAssessmentRequest,
  EvaluationGradeScale,
  EvaluationType,
  MaterialEvaluation,
  SaveWorkspaceAssigmentAssessmentRequest,
  UpdateWorkspaceAssigmentAssessmentRequest,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";

/**
 * AssignmentEditorProps
 */
interface AssignmentEditorProps extends WithTranslation {
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
  updateMaterialEvaluationData: (
    assignmentWithAudio: AssessmentWithAudio
  ) => void;
  updateCurrentStudentCompositeRepliesData: UpdateCurrentStudentEvaluationCompositeRepliesData;
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
interface AssignmentEditorState {
  literalEvaluation: string;
  assignmentEvaluationType: string;
  records: RecordValue[];
  grade: string;
  draftId: string;
  locked: boolean;
  activeGradeSystems: EvaluationGradeScale[];
  showAudioAssessmentWarningOnClose: boolean;
}

/**
 * audioAssessmentsToRecords
 * @param audioAssessments audioAssessments
 */
const audioAssessmentsToRecords = (
  audioAssessments: AudioAssessment[]
): RecordValue[] =>
  audioAssessments.map((audioAssessment) => ({
    id: audioAssessment.id,
    name: audioAssessment.name,
    contentType: audioAssessment.contentType,
    url: `/rest/workspace/materialevaluationaudioassessment/${audioAssessment.id}`,
  }));

/**
 * AssignmentEditor
 */
class AssignmentEditor extends SessionStateComponent<
  AssignmentEditorProps,
  AssignmentEditorState
> {
  private unknownGradeSystemIsUsed: EvaluationGradeScale;

  /**
   * constructor
   * @param props props
   */
  constructor(props: AssignmentEditorProps) {
    super(props, `assignment-editor`);

    const { materialEvaluation, compositeReplies, selectedAssessment } = props;
    const { evaluationGradeSystem } = props.evaluations;

    const activeGradeSystems = evaluationGradeSystem.filter(
      (gSystem) => gSystem.active
    );

    let grade = `${activeGradeSystems[0].grades[0].dataSource}-${activeGradeSystems[0].grades[0].id}`;

    // If we have existing evaluation
    if (materialEvaluation) {
      // grade is old evaluation value
      grade = `${materialEvaluation.gradeSchoolDataSource}-${materialEvaluation.gradeIdentifier}`;

      // Find what gradeSystem is selected when editing existing
      const usedGradeSystem = evaluationGradeSystem.find(
        (gSystem) => gSystem.id === materialEvaluation.gradeIdentifier
      );

      // Check if grade system is not active, then we are using unknownGradeSystem
      if (usedGradeSystem && !usedGradeSystem.active) {
        this.unknownGradeSystemIsUsed = usedGradeSystem;
      }
    } else if (compositeReplies.state === "INCOMPLETE") {
      grade = "";
    }

    const draftId = `${selectedAssessment.userEntityId}-${props.materialAssignment.id}`;

    const { evaluationInfo } = compositeReplies;

    this.state = {
      ...this.getRecoverStoredState(
        {
          literalEvaluation: evaluationInfo ? evaluationInfo.text : "",
          assignmentEvaluationType:
            evaluationInfo && evaluationInfo.type === "INCOMPLETE"
              ? "INCOMPLETE"
              : "GRADED",
          grade: grade,
          draftId,
        },
        draftId
      ),
      records:
        evaluationInfo &&
        evaluationInfo.audioAssessments &&
        evaluationInfo.audioAssessments !== null
          ? audioAssessmentsToRecords(evaluationInfo.audioAssessments)
          : [],
      locked: false,
      activeGradeSystems,
      showAudioAssessmentWarningOnClose: false,
    };
  }

  /**
   * getUsedGradingScaleByGradeId
   * @param gradeId gradeId
   * @returns used grade system by gradeId
   */
  getUsedGradingScaleByGradeId = (gradeId: string) => {
    const { evaluationGradeSystem } = this.props.evaluations;

    for (let i = 0; i < evaluationGradeSystem.length; i++) {
      const gradeSystem = evaluationGradeSystem[i];

      for (let j = 0; j < gradeSystem.grades.length; j++) {
        const grade = gradeSystem.grades[j];

        if (grade.id === gradeId.split("-")[1]) {
          return gradeSystem;
        }
      }
    }
  };

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    const { materialEvaluation, compositeReplies } = this.props;
    const { evaluationGradeSystem } = this.props.evaluations;
    const { activeGradeSystems } = this.state;

    let grade = `${activeGradeSystems[0].grades[0].dataSource}-${activeGradeSystems[0].grades[0].id}`;

    // If we have existing evaluation
    if (materialEvaluation) {
      // grade is old evaluation value
      grade = `${materialEvaluation.gradeSchoolDataSource}-${materialEvaluation.gradeIdentifier}`;

      // Find what gradeSystem is selected when editing existing
      const usedGradeSystem = evaluationGradeSystem.find(
        (gSystem) => gSystem.id === materialEvaluation.gradeIdentifier
      );

      // Check if grade system is not active, then we are using unknownGradeSystem
      if (usedGradeSystem && !usedGradeSystem.active) {
        this.unknownGradeSystemIsUsed = usedGradeSystem;
      }
    } else if (compositeReplies.state === "INCOMPLETE") {
      grade = "";
    }

    const { evaluationInfo } = compositeReplies;

    this.setState({
      ...this.getRecoverStoredState(
        {
          literalEvaluation: evaluationInfo ? evaluationInfo.text : "",
          assignmentEvaluationType:
            evaluationInfo && evaluationInfo.type === "INCOMPLETE"
              ? "INCOMPLETE"
              : "GRADED",
          grade: grade,
        },
        this.state.draftId
      ),
      records:
        evaluationInfo &&
        evaluationInfo.audioAssessments &&
        evaluationInfo.audioAssessments !== null
          ? audioAssessmentsToRecords(evaluationInfo.audioAssessments)
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
   * @param data.dataToSave data ToSave
   * @param data.materialId materialId
   * @param data.defaultGrade defaultGrade
   * @param data.edit edit
   */
  saveAssignmentEvaluationGradeToServer = async (data: {
    workspaceEntityId: number;
    userEntityId: number;
    workspaceMaterialId: number;
    dataToSave:
      | SaveWorkspaceAssigmentAssessmentRequest
      | UpdateWorkspaceAssigmentAssessmentRequest;
    materialId: number;
    defaultGrade: string;
    edit: boolean;
  }) => {
    const evaluationApi = MApi.getEvaluationApi();

    this.setState({
      locked: true,
    });

    const { t } = this.props;

    const { workspaceEntityId, userEntityId, workspaceMaterialId, dataToSave } =
      data;

    try {
      const assessmentWithAudio = data.edit
        ? await evaluationApi.updateWorkspaceAssigmentAssessment({
            workspaceId: workspaceEntityId,
            userEntityId: userEntityId,
            workspaceMaterialId: workspaceMaterialId,
            assessmentId: this.props.compositeReplies.evaluationInfo.id,
            updateWorkspaceAssigmentAssessmentRequest: {
              ...(dataToSave as UpdateWorkspaceAssigmentAssessmentRequest),
            },
          })
        : await evaluationApi.saveWorkspaceAssigmentAssessment({
            workspaceId: workspaceEntityId,
            userEntityId: userEntityId,
            workspaceMaterialId: workspaceMaterialId,
            saveWorkspaceAssigmentAssessmentRequest: {
              ...(dataToSave as SaveWorkspaceAssigmentAssessmentRequest),
            },
          });

      this.props.updateCurrentStudentCompositeRepliesData({
        workspaceId: workspaceEntityId,
        userEntityId: userEntityId,
        workspaceMaterialId: workspaceMaterialId,
      });

      this.props.updateMaterialEvaluationData(assessmentWithAudio);

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
   * handleSaveAssignment
   * @param e e
   */
  handleSaveAssignment = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const { compositeReplies } = this.props;
    const { grade, activeGradeSystems } = this.state;
    const { workspaceEntityId, userEntityId } = this.props.selectedAssessment;

    const usedGradeSystem = this.getUsedGradingScaleByGradeId(grade);
    const defaultGrade = `${activeGradeSystems[0].grades[0].dataSource}-${activeGradeSystems[0].grades[0].id}`;

    let gradingScaleIdentifier =
      this.state.assignmentEvaluationType === "GRADED"
        ? `${usedGradeSystem.dataSource}-${usedGradeSystem.id}`
        : null;

    let evaluationType: EvaluationType =
      this.state.assignmentEvaluationType === "GRADED"
        ? "ASSESSMENT"
        : "SUPPLEMENTATIONREQUEST";

    if (this.state.assignmentEvaluationType === "INCOMPLETE") {
      gradingScaleIdentifier = null;
      evaluationType = "SUPPLEMENTATIONREQUEST";
    }

    const audioAssessments = this.state.records.map(
      (audio) =>
        ({
          id: audio.id,
          name: audio.name,
          contentType: audio.contentType,
        }) as AudioAssessment
    );

    await this.saveAssignmentEvaluationGradeToServer({
      workspaceEntityId: workspaceEntityId,
      userEntityId: userEntityId,
      workspaceMaterialId: this.props.materialAssignment.id,
      dataToSave: {
        identifier: compositeReplies.evaluationInfo
          ? compositeReplies.evaluationInfo.id.toString()
          : undefined,
        evaluationType,
        assessorIdentifier: this.props.status.userSchoolDataIdentifier,
        gradingScaleIdentifier,
        gradeIdentifier: this.state.grade,
        verbalAssessment: this.state.literalEvaluation,
        assessmentDate: new Date().getTime(),
        audioAssessments: audioAssessments,
      },
      materialId: this.props.materialAssignment.materialId,
      defaultGrade,
      edit: !!compositeReplies.evaluationInfo,
    });
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    const { compositeReplies, materialEvaluation } = this.props;
    const { activeGradeSystems } = this.state;

    const { evaluationInfo } = compositeReplies;

    if (evaluationInfo && evaluationInfo.date) {
      this.setStateAndClear(
        {
          literalEvaluation: evaluationInfo.text,
          grade:
            evaluationInfo.type === "INCOMPLETE"
              ? `${activeGradeSystems[0].dataSource}-${activeGradeSystems[0].grades[0].id}`
              : `${materialEvaluation.gradeSchoolDataSource}-${materialEvaluation.gradeIdentifier}`,
          assignmentEvaluationType:
            evaluationInfo.type === "INCOMPLETE" ? "INCOMPLETE" : "GRADED",
        },
        this.state.draftId
      );
    } else {
      this.setStateAndClear(
        {
          literalEvaluation: "",
          grade: `${activeGradeSystems[0].dataSource}-${activeGradeSystems[0].grades[0].id}`,
          assignmentEvaluationType: "GRADED",
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
   * handleAssignmentEvaluationChange
   * @param e e
   */
  handleAssignmentEvaluationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { activeGradeSystems } = this.state;

    const defaultGrade = `${activeGradeSystems[0].grades[0].dataSource}-${activeGradeSystems[0].grades[0].id}`;

    this.setStateAndStore(
      {
        assignmentEvaluationType: e.target.value,
        grade: defaultGrade,
      },
      this.state.draftId
    );
  };

  /**
   * handleSelectGradeChange
   * @param e e
   */
  handleSelectGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore(
      {
        grade: e.currentTarget.value,
      },
      this.state.draftId
    );
  };

  /**
   * handleAudioAssessmentChange
   * @param records records
   */
  handleAudioAssessmentChange = (records: RecordValue[]) => {
    this.setState({
      records: records,
      showAudioAssessmentWarningOnClose: true,
    });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    const renderGradingOptions = this.state.activeGradeSystems.map((gScale) => (
      <optgroup key={`${gScale.dataSource}-${gScale.id}`} label={gScale.name}>
        {gScale.grades.map((grade) => (
          <option key={grade.id} value={`${gScale.dataSource}-${grade.id}`}>
            {grade.name}
          </option>
        ))}
      </optgroup>
    ));

    // IF evaluation uses some unknown grade system that is not normally showed, then we add it to options also
    if (this.unknownGradeSystemIsUsed) {
      const missingOption = (
        <optgroup
          key={`${this.unknownGradeSystemIsUsed.dataSource}-${this.unknownGradeSystemIsUsed.id}`}
          label={this.unknownGradeSystemIsUsed.name}
        >
          {this.unknownGradeSystemIsUsed.grades.map((grade) => (
            <option
              key={grade.id}
              value={`${this.unknownGradeSystemIsUsed.dataSource}-${grade.id}`}
            >
              {grade.name}
            </option>
          ))}
        </optgroup>
      );

      renderGradingOptions.push(missingOption);
    }

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
            <label htmlFor="assignmentEvaluationGrade">
              {t("labels.verbalEvaluation", { ns: "evaluation" })}
            </label>

            <Recorder
              onIsRecordingChange={this.props.onIsRecordingChange}
              onChange={this.handleAudioAssessmentChange}
              values={this.state.records}
            />
          </div>
        </div>
        <div className="form__row">
          <fieldset className="form__fieldset">
            <legend className="form__legend">{t("labels.evaluation")}</legend>
            <div className="form__fieldset-content form__fieldset-content--horizontal">
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  id="assignmentEvaluationTypeGRADED"
                  type="radio"
                  name="assignmentEvaluationType"
                  value="GRADED"
                  checked={this.state.assignmentEvaluationType === "GRADED"}
                  onChange={this.handleAssignmentEvaluationChange}
                />
                <label htmlFor="assignmentEvaluationTypeGRADED">
                  {t("labels.grade", { ns: "workspace" })}
                </label>
              </div>
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  id="assignmentEvaluationTypeINCOMPLETE"
                  type="radio"
                  name="assignmentEvaluationType"
                  value="INCOMPLETE"
                  checked={this.state.assignmentEvaluationType === "INCOMPLETE"}
                  onChange={this.handleAssignmentEvaluationChange}
                />
                <label htmlFor="assignmentEvaluationTypeINCOMPLETE">
                  {t("labels.incomplete", { ns: "materials" })}
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="form__row">
          <div className="form-element">
            <label htmlFor="assignmentEvaluationGrade">
              {t("labels.grade", { ns: "workspace" })}
            </label>

            <div className="evaluation-modal__evaluate-drawer-row-data">
              <select
                id="assignmentEvaluationGrade"
                className="form-element__select"
                value={this.state.grade}
                onChange={this.handleSelectGradeChange}
                disabled={this.state.assignmentEvaluationType === "INCOMPLETE"}
              >
                {renderGradingOptions}
              </select>
            </div>
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
          {this.state.showAudioAssessmentWarningOnClose ? (
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
    },
    dispatch
  );
}

export default withTranslation([
  "evaluation",
  "workspace",
  "materials",
  "common",
])(connect(mapStateToProps, mapDispatchToProps)(AssignmentEditor));
