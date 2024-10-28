import * as React from "react";
import CKEditor from "~/components/general/ckeditor";
import "~/sass/elements/evaluation.scss";
import SessionStateComponent from "~/components/general/session-state-component";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
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
import {
  AssessmentWithAudio,
  AudioAssessment,
  EvaluationAssessmentRequest,
  EvaluationGradeScale,
  EvaluationType,
  MaterialEvaluation,
  SaveWorkspaceAssigmentAssessmentRequest,
  UpdateWorkspaceAssigmentAssessmentRequest,
  MaterialCompositeReply,
  WorkspaceMaterial,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { NumberFormatValues, NumericFormat } from "react-number-format";

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
  evaluationType: EvaluationType;
  records: RecordValue[];
  grade: string;
  draftId: string;
  locked: boolean;
  activeGradeSystems: EvaluationGradeScale[];
  showAudioAssessmentWarningOnClose: boolean;
  points: number; // Changed from string to number
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

    const {
      materialEvaluation,
      compositeReplies,
      selectedAssessment,
      materialAssignment,
    } = props;
    // Draft id is used to save the state of the editor
    const draftId = `${selectedAssessment.userEntityId}-${materialAssignment.id}`;

    const { evaluationGradeSystem } = props.evaluations;
    const { evaluationInfo } = compositeReplies;

    const activeGradeSystems = evaluationGradeSystem.filter(
      (gSystem) => gSystem.active
    );

    // Default values
    let grade = `${activeGradeSystems[0].grades[0].dataSource}-${activeGradeSystems[0].grades[0].id}`;
    let points = 0;
    let literalEvaluation = "";
    let evaluationType: EvaluationType = "GRADED";
    let records: RecordValue[] = [];

    // If we have existing evaluation
    if (materialEvaluation && evaluationInfo) {
      // If evaluation type is graded
      if (evaluationInfo.evaluationType === "GRADED") {
        evaluationType = "GRADED";
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
      }
      // If evaluation type is points
      else if (evaluationInfo.evaluationType === "POINTS") {
        evaluationType = "POINTS";
        // points is old evaluation value
        points = evaluationInfo.points;
      }
      // If evaluation type is supplementation request
      else if (evaluationInfo.evaluationType === "SUPPLEMENTATIONREQUEST") {
        evaluationType = "SUPPLEMENTATIONREQUEST";
      }

      // literalEvaluation is old evaluation value
      literalEvaluation = evaluationInfo.text;

      if (
        evaluationInfo.audioAssessments &&
        evaluationInfo.audioAssessments !== null
      ) {
        records = audioAssessmentsToRecords(evaluationInfo.audioAssessments);
      }
    }

    this.state = {
      ...this.getRecoverStoredState(
        {
          literalEvaluation,
          evaluationType,
          grade,
          draftId,
          points,
        },
        draftId
      ),
      records,
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
    const { evaluationInfo } = compositeReplies;
    const { activeGradeSystems } = this.state;

    // Default values
    let grade = `${activeGradeSystems[0].grades[0].dataSource}-${activeGradeSystems[0].grades[0].id}`;
    let points = 0;
    let literalEvaluation = "";
    let evaluationType: EvaluationType = "GRADED";
    let records: RecordValue[] = [];

    if (materialEvaluation && evaluationInfo) {
      // If evaluation type is graded
      if (evaluationInfo.evaluationType === "GRADED") {
        evaluationType = "GRADED";
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
      }
      // If evaluation type is points
      else if (evaluationInfo.evaluationType === "POINTS") {
        evaluationType = "POINTS";
        // points is old evaluation value
        points = evaluationInfo.points;
      }
      // If evaluation type is supplementation request
      else if (evaluationInfo.evaluationType === "SUPPLEMENTATIONREQUEST") {
        evaluationType = "SUPPLEMENTATIONREQUEST";
      }

      literalEvaluation = evaluationInfo.text;

      if (
        evaluationInfo.audioAssessments &&
        evaluationInfo.audioAssessments !== null
      ) {
        records = audioAssessmentsToRecords(evaluationInfo.audioAssessments);
      }
    }

    this.setState({
      ...this.getRecoverStoredState(
        {
          literalEvaluation,
          evaluationType,
          grade,
          points,
        },
        this.state.draftId
      ),
      records,
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
        ["literalEvaluation", "evaluationType", "grade", "points"],
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

    const gradeIdentifier: string | null = grade;
    let gradingScaleIdentifier: string | null = null;

    if (this.state.evaluationType === "GRADED") {
      gradingScaleIdentifier = `${usedGradeSystem.dataSource}-${usedGradeSystem.id}`;
    }

    const audioAssessments = this.state.records.map(
      (audio) =>
        ({
          id: audio.id,
          name: audio.name,
          contentType: audio.contentType,
        } as AudioAssessment)
    );

    await this.saveAssignmentEvaluationGradeToServer({
      workspaceEntityId: workspaceEntityId,
      userEntityId: userEntityId,
      workspaceMaterialId: this.props.materialAssignment.id,
      dataToSave: {
        identifier: compositeReplies.evaluationInfo
          ? compositeReplies.evaluationInfo.id.toString()
          : undefined,
        evaluationType: this.state.evaluationType,
        assessorIdentifier: this.props.status.userSchoolDataIdentifier,
        gradingScaleIdentifier,
        gradeIdentifier,
        verbalAssessment: this.state.literalEvaluation,
        assessmentDate: new Date().getTime(),
        audioAssessments: audioAssessments,
        points: this.state.points,
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
            evaluationInfo.evaluationType === "SUPPLEMENTATIONREQUEST" ||
            evaluationInfo.evaluationType === "POINTS"
              ? `${activeGradeSystems[0].dataSource}-${activeGradeSystems[0].grades[0].id}`
              : `${materialEvaluation.gradeSchoolDataSource}-${materialEvaluation.gradeIdentifier}`,
          evaluationType: evaluationInfo.evaluationType,
        },
        this.state.draftId
      );
    } else {
      this.setStateAndClear(
        {
          literalEvaluation: "",
          grade: `${activeGradeSystems[0].dataSource}-${activeGradeSystems[0].grades[0].id}`,
          evaluationType: "GRADED",
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
        evaluationType: e.target.value as EvaluationType,
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
   * handlePointsValueChange
   * @param values NumericFormat values object
   */
  handlePointsValueChange = (values: NumberFormatValues) => {
    this.setStateAndStore(
      {
        points: values.floatValue || 0,
      },
      this.state.draftId
    );
  };

  /**
   * isAllowedPoints
   * @param values NumberFormatValues
   */
  isAllowedPoints = (values: NumberFormatValues) => {
    const maxPoints = this.props.materialAssignment.maxPoints;
    if (!maxPoints) {
      return true;
    }
    return values.floatValue <= maxPoints;
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
                  name="evaluationType"
                  value="GRADED"
                  checked={this.state.evaluationType === "GRADED"}
                  onChange={this.handleAssignmentEvaluationChange}
                />
                <label htmlFor="assignmentEvaluationTypeGRADED">
                  {t("labels.grade", { ns: "workspace" })}
                </label>
              </div>
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  id="assignmentEvaluationTypePOINTS"
                  type="radio"
                  name="evaluationType"
                  value="POINTS"
                  checked={this.state.evaluationType === "POINTS"}
                  onChange={this.handleAssignmentEvaluationChange}
                />
                <label htmlFor="assignmentEvaluationTypePOINTS">Pisteet</label>
              </div>
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  id="assignmentEvaluationTypeINCOMPLETE"
                  type="radio"
                  name="evaluationType"
                  value="SUPPLEMENTATIONREQUEST"
                  checked={
                    this.state.evaluationType === "SUPPLEMENTATIONREQUEST"
                  }
                  onChange={this.handleAssignmentEvaluationChange}
                />
                <label htmlFor="assignmentEvaluationTypeINCOMPLETE">
                  {t("labels.incomplete", { ns: "materials" })}
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Show grade form element if evaluationType is GRADED */}
        {this.state.evaluationType === "GRADED" && (
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
                >
                  {renderGradingOptions}
                </select>
              </div>
            </div>
          </div>
        )}
        {/* Show points form element if evaluationType is POINTS */}
        {this.state.evaluationType === "POINTS" && (
          <div className="form__row">
            <div className="form-element">
              <label htmlFor="assignmentEvaluationPoints">Pisteet</label>

              <div className="evaluation-modal__evaluate-drawer-row-data">
                <NumericFormat
                  id="assignmentEvaluationPoints"
                  className="form-element__input"
                  value={this.state.points}
                  decimalScale={2}
                  decimalSeparator=","
                  allowNegative={false}
                  onValueChange={this.handlePointsValueChange}
                  isAllowed={this.isAllowedPoints}
                />
                {this.props.materialAssignment.maxPoints && (
                  <>
                    <span className="form-element__input-addon">/</span>
                    <input
                      type="text"
                      className="form-element__input"
                      value={this.props.materialAssignment.maxPoints}
                      readOnly
                      disabled
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
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
