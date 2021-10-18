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
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/form-elements.scss";
import { LocaleListType } from "~/reducers/base/locales";
import { CKEditorConfig } from "../evaluation";
import mApi from "~/lib/mApi";
import notificationActions from "~/actions/base/notifications";
import {
  AssignmentEvaluationGradeRequest,
  AssignmentEvaluationSaveReturn,
  AssignmentEvaluationSupplementationRequest,
} from "~/@types/evaluation";
import promisify from "~/util/promisify";

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
  locale: LocaleListType;
  editorLabel?: string;
  modifiers?: string[];
  updateMaterialEvaluationData: (
    assigmentSaveReturn: AssignmentEvaluationSaveReturn
  ) => void;
  updateCurrentStudentCompositeRepliesData: UpdateCurrentStudentEvaluationCompositeRepliesData;
  onClose?: () => void;
  onAssigmentSave?: (materialId: number) => void;
}

/**
 * AssignmentEditorState
 */
interface AssignmentEditorState {
  literalEvaluation: string;
  assignmentEvaluationType: string;
  grade: string;
  draftId: string;
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

    const { materialEvaluation, compositeReplies } = props;
    const { evaluationGradeSystem, evaluationSelectedAssessmentId } =
      props.evaluations;

    const defaultGrade = `${evaluationGradeSystem[0].grades[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`;

    const grade = materialEvaluation
      ? `${materialEvaluation.gradeSchoolDataSource}-${materialEvaluation.gradeIdentifier}`
      : compositeReplies.state === "INCOMPLETE"
      ? ""
      : defaultGrade;

    let draftId = `${evaluationSelectedAssessmentId.userEntityId}-${props.materialAssignment.id}`;

    this.state = this.getRecoverStoredState(
      {
        literalEvaluation:
          compositeReplies && compositeReplies.evaluationInfo
            ? compositeReplies.evaluationInfo.text
            : "",
        assignmentEvaluationType:
          compositeReplies &&
          compositeReplies.evaluationInfo &&
          compositeReplies.evaluationInfo.type === "INCOMPLETE"
            ? "INCOMPLETE"
            : "GRADED",
        grade: grade,
        draftId,
      },
      draftId
    );
  }

  /**
   * getUsedGradingScaleByGradeId
   * @param gradeId
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

    const defaultGrade = `${evaluationGradeSystem[0].grades[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`;

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
            compositeReplies &&
            compositeReplies.evaluationInfo &&
            compositeReplies.evaluationInfo.type === "INCOMPLETE"
              ? "INCOMPLETE"
              : "GRADED",
          grade: grade,
        },
        this.state.draftId
      )
    );
  };

  /**
   * saveAssignmentEvaluationGradeToServer
   */
  saveAssignmentEvaluationGradeToServer = async (data: {
    workspaceEntityId: number;
    userEntityId: number;
    workspaceMaterialId: number;
    dataToSave: AssignmentEvaluationGradeRequest;
    materialId: number;
    defaultGrade: string;
  }) => {
    const {
      workspaceEntityId,
      userEntityId,
      workspaceMaterialId,
      dataToSave,
      defaultGrade,
    } = data;

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

        this.props.updateMaterialEvaluationData(data);

        this.setStateAndClear(
          {
            literalEvaluation: "",
            grade: defaultGrade,
            assignmentEvaluationType: "GRADED",
          },
          this.state.draftId
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
    }
  };

  /**
   * saveAssignmentEvaluationSupplementationToServer
   * @param data
   */
  saveAssignmentEvaluationSupplementationToServer = async (data: {
    workspaceEntityId: number;
    userEntityId: number;
    workspaceMaterialId: number;
    dataToSave: AssignmentEvaluationSupplementationRequest;
    materialId: number;
    defaultGrade: string;
  }) => {
    const {
      workspaceEntityId,
      userEntityId,
      workspaceMaterialId,
      dataToSave,
      defaultGrade,
    } = data;
    try {
      await promisify(
        mApi().evaluation.workspace.user.workspacematerial.supplementationrequest.create(
          workspaceEntityId,
          userEntityId,
          workspaceMaterialId,
          {
            ...dataToSave,
          }
        ),
        "callback"
      )().then(async () => {
        await mApi().workspace.workspaces.compositeReplies.cacheClear();

        /**
         * Compositereplies needs to be updated by loading new values from server, just for
         * so data is surely right and updated correctly. So loading updated compositeReply and append it to compositereplies list
         */

        this.props.updateCurrentStudentCompositeRepliesData({
          workspaceId: workspaceEntityId,
          userEntityId: userEntityId,
          workspaceMaterialId: workspaceMaterialId,
        });

        this.setStateAndClear(
          {
            literalEvaluation: "",
            grade: defaultGrade,
            assignmentEvaluationType: "INCOMPLETE",
          },
          this.state.draftId
        );
      });
    } catch (error) {
      notificationActions.displayNotification(
        this.props.i18n.text.get(
          "plugin.evaluation.notifications.saveAssigmentSupplementation.error",
          error.message
        ),
        "error"
      );
    }
  };

  /**
   * handleSaveAssignment
   * @param e
   */
  handleSaveAssignment = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const { evaluationGradeSystem } = this.props.evaluations;
    const { grade } = this.state;

    const usedGradeSystem = this.getUsedGradingScaleByGradeId(grade);
    const defaultGrade = `${evaluationGradeSystem[0].grades[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`;

    if (this.state.assignmentEvaluationType === "GRADED") {
      const gradingScaleIdentifier = `${usedGradeSystem.dataSource}-${usedGradeSystem.id}`;
      if (this.props.onAssigmentSave) {
        this.props.onAssigmentSave(this.props.materialAssignment.materialId);
      }

      if (this.props.onClose) {
        this.props.onClose();
      }
      await this.saveAssignmentEvaluationGradeToServer({
        workspaceEntityId:
          this.props.evaluations.evaluationSelectedAssessmentId
            .workspaceEntityId,
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
        materialId: this.props.materialAssignment.materialId,
        defaultGrade,
      });
    } else if (this.state.assignmentEvaluationType === "INCOMPLETE") {
      if (this.props.onAssigmentSave) {
        this.props.onAssigmentSave(this.props.materialAssignment.materialId);
      }

      if (this.props.onClose) {
        this.props.onClose();
      }

      this.saveAssignmentEvaluationSupplementationToServer({
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
        materialId: this.props.materialAssignment.materialId,
        defaultGrade,
      });
    }
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    const { compositeReplies, materialEvaluation } = this.props;
    const { evaluationGradeSystem } = this.props.evaluations;

    if (
      compositeReplies.evaluationInfo &&
      compositeReplies.evaluationInfo.date
    ) {
      this.setStateAndClear(
        {
          literalEvaluation: compositeReplies.evaluationInfo.text,
          grade:
            compositeReplies.evaluationInfo.type === "INCOMPLETE"
              ? `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`
              : `${materialEvaluation.gradeSchoolDataSource}-${materialEvaluation.gradeIdentifier}`,
          assignmentEvaluationType:
            compositeReplies.evaluationInfo.type === "INCOMPLETE"
              ? "INCOMPLETE"
              : "GRADED",
        },
        this.state.draftId
      );
    } else {
      this.setStateAndClear(
        {
          literalEvaluation: "",
          grade: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
          assignmentEvaluationType: "GRADED",
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
    const { evaluationGradeSystem } = this.props.evaluations;

    const defaultGrade = `${evaluationGradeSystem[0].grades[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`;

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
   * @param e
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
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const renderGradingOptions =
      this.props.evaluations.evaluationGradeSystem.map((gScale) => {
        return (
          <optgroup
            key={`${gScale.dataSource}-${gScale.id}`}
            label={gScale.name}
          >
            {gScale.grades.map((grade) => {
              return (
                <option
                  key={grade.id}
                  value={`${gScale.dataSource}-${grade.id}`}
                >
                  {grade.name}
                </option>
              );
            })}
          </optgroup>
        );
      });

    return (
      <>
        <div className="evaluation-modal__evaluate-drawer-row form-element">
          {this.props.editorLabel && (
            <label className="evaluation-modal__evaluate-drawer-row-label">
              {this.props.editorLabel}
            </label>
          )}

          <CKEditor
            onChange={this.handleCKEditorChange}
            configuration={CKEditorConfig(this.props.locale.current)}
          >
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
                id="assignmentEvaluationTypeGRADED"
                type="radio"
                name="assignmentEvaluationType"
                value="GRADED"
                checked={this.state.assignmentEvaluationType === "GRADED"}
                onChange={this.handleAssignmentEvaluationChange}
              />
              <label htmlFor="assignmentEvaluationTypeGRADED">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentGradeLabel"
                )}
              </label>
            </div>
            <div className="evaluation-modal__evaluate-drawer-row-item">
              <input
                id="assignmentEvaluationTypeINCOMPLETE"
                type="radio"
                name="assignmentEvaluationType"
                value="INCOMPLETE"
                checked={this.state.assignmentEvaluationType === "INCOMPLETE"}
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
          <label
            htmlFor="assignmentEvaluationGrade"
            className="evaluation-modal__evaluate-drawer-row-label"
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.assignmentGradeLabel"
            )}
          </label>
          <div className="evaluation-modal__evaluate-drawer-row-data">
            <select
              id="assignmentEvaluationGrade"
              className="form-element__select form-element__select--evaluation"
              value={this.state.grade}
              onChange={this.handleSelectGradeChange}
              disabled={this.state.assignmentEvaluationType === "INCOMPLETE"}
            >
              {renderGradingOptions}
            </select>
          </div>
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
    locale: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      updateCurrentStudentCompositeRepliesData,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentEditor);
