import * as React from "react";
import { StatusType } from "~/reducers/base/status";
import SessionStateComponent from "~/components/general/session-state-component";
import CKEditor from "~/components/general/ckeditor";
import Button from "~/components/general/button";
import { Action, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { StateType } from "reducers";
import { displayNotification } from "~/actions/base/notifications";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import {
  UpdateCurrentStudentEvaluationCompositeRepliesData,
  updateCurrentStudentCompositeRepliesData,
} from "~/actions/main-function/evaluation/evaluationActions";
import {
  EvaluationAssessmentRequest,
  CreateWorkspaceNodeAssessmentRequest,
  MaterialCompositeReply,
  WorkspaceMaterial,
  UpdateWorkspaceNodeAssessmentRequest,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { withTranslation, WithTranslation } from "react-i18next";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { localize } from "~/locales/i18n";

/**
 * ExamAssignmentEditorProps
 */
interface ExamAssignmentEditorProps extends WithTranslation {
  selectedAssessment: EvaluationAssessmentRequest;
  materialAssignment: WorkspaceMaterial;
  compositeReply: MaterialCompositeReply;
  status: StatusType;
  updateCurrentStudentCompositeRepliesData: UpdateCurrentStudentEvaluationCompositeRepliesData;
  displayNotification: DisplayNotificationTriggerType;
  editorLabel?: string;
  modifiers?: string[];
  onClose?: () => void;
}

/**
 * ExamAssignmentEditorState
 */
interface ExamAssignmentEditorState {
  literalEvaluation: string;
  draftId: string;
  locked: boolean;
  points: number;
}

/**
 * ExamAssignmentEditor
 */
class ExamAssignmentEditor extends SessionStateComponent<
  ExamAssignmentEditorProps,
  ExamAssignmentEditorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ExamAssignmentEditorProps) {
    super(props, `exam-assignment-editor`);

    const { compositeReply, selectedAssessment, materialAssignment } = props;

    const { userEntityId } = selectedAssessment;

    const draftId = `${userEntityId}-${materialAssignment.id}`;

    this.state = {
      ...this.getRecoverStoredState(
        {
          literalEvaluation:
            compositeReply && compositeReply.evaluationInfo
              ? compositeReply.evaluationInfo.text
              : "",
          points:
            compositeReply && compositeReply.evaluationInfo
              ? compositeReply.evaluationInfo.points
              : 0,

          draftId,
        },
        draftId
      ),
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    const { compositeReply } = this.props;

    this.setState({
      ...this.getRecoverStoredState(
        {
          literalEvaluation:
            compositeReply && compositeReply.evaluationInfo
              ? compositeReply.evaluationInfo.text
              : "",
        },
        this.state.draftId
      ),
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
      data.edit
        ? await evaluationApi.updateWorkspaceNodeAssessment({
            workspaceId: workspaceEntityId,
            userEntityId,
            workspaceNodeId: workspaceMaterialId,
            assessmentId: this.props.compositeReply.evaluationInfo.id,
            updateWorkspaceNodeAssessmentRequest: {
              ...(dataToSave as UpdateWorkspaceNodeAssessmentRequest),
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

      this.justClear(["literalEvaluation", "points"], this.state.draftId);

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
    const { compositeReply, selectedAssessment } = this.props;
    const { workspaceEntityId, userEntityId } = selectedAssessment;

    /**
     * Backend endpoint is different for normal grade evalution and supplementation
     */

    this.saveAssignmentEvaluationGradeToServer({
      workspaceEntityId: workspaceEntityId,
      userEntityId: userEntityId,
      workspaceMaterialId: this.props.materialAssignment.id,
      dataToSave: {
        identifier: compositeReply.evaluationInfo
          ? compositeReply.evaluationInfo.id.toString()
          : undefined,
        evaluationType: "POINTS",
        assessorIdentifier: this.props.status.userSchoolDataIdentifier,
        gradingScaleIdentifier: null,
        gradeIdentifier: null,
        points: this.state.points,
        verbalAssessment: this.state.literalEvaluation,
        assessmentDate: new Date().getTime(),
        audioAssessments: [],
      },
      materialId: this.props.materialAssignment.materialId,
      edit: !!compositeReply.evaluationInfo,
    });
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    const { compositeReply } = this.props;

    if (compositeReply.evaluationInfo && compositeReply.evaluationInfo.date) {
      this.setStateAndClear(
        {
          literalEvaluation: compositeReply.evaluationInfo.text,
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
   * handlePointsValueChange
   * @param values NumericFormat values object
   */
  handlePointsValueChange = (values: NumberFormatValues) => {
    this.setStateAndStore(
      {
        points: values.floatValue,
      },
      this.state.draftId
    );
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

            <CKEditor onChange={this.handleCKEditorChange}>
              {this.state.literalEvaluation}
            </CKEditor>
          </div>
        </div>

        <div className="form__row">
          <fieldset className="form__fieldset">
            <legend className="form__legend">
              {t("labels.points", { ns: "workspace" })}
            </legend>

            <div className="form__fieldset-content form__fieldset-content--horizontal">
              <NumericFormat
                id="assignmentEvaluationPoints"
                className="form-element__input form-element__input--content-centered"
                value={this.state.points}
                decimalScale={2}
                size={2}
                decimalSeparator=","
                allowNegative={false}
                onValueChange={this.handlePointsValueChange}
              />

              {this.props.materialAssignment.maxPoints && (
                <>
                  <span className="form-element__divider">/</span>
                  <span className="form-element__description-chip">
                    {localize.number(this.props.materialAssignment.maxPoints)}
                  </span>
                </>
              )}
            </div>
          </fieldset>
        </div>

        <div className="form__buttons form__buttons--evaluation">
          <Button
            buttonModifiers="dialog-execute"
            onClick={this.handleSaveAssignment}
            disabled={this.state.locked}
          >
            {t("actions.save")}
          </Button>
          <Button
            onClick={this.props.onClose}
            buttonModifiers="dialog-cancel"
            disabled={this.state.locked}
          >
            {t("actions.cancel")}
          </Button>

          {this.recovered && (
            <Button
              buttonModifiers="dialog-clear"
              onClick={this.handleDeleteEditorDraft}
              disabled={this.state.locked}
            >
              {t("actions.remove", { context: "draft" })}
            </Button>
          )}
        </div>
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

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ExamAssignmentEditor)
);
