import * as React from "react";
import EvaluationMaterial from "./evaluation-material";
import {
  WorkspaceDataType,
  MaterialContentNodeWithIdAndLogic,
} from "~/reducers/workspaces/index";
import "~/sass/elements/evaluation.scss";
import { AnyActionType } from "~/actions/index";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { ButtonPill } from "~/components/general/button";
import AnimateHeight from "react-animate-height";
import SlideDrawer from "./slide-drawer";
import AssignmentEditor from "./editors/assignment-editor";
import { StateType } from "~/reducers/index";
import {
  UpdateOpenedAssignmentOrExamId,
  updateOpenedAssignmentOrExamId,
  ToggleLockedAssigment,
  toggleLockedAssignment,
} from "~/actions/main-function/evaluation/evaluationActions";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import ExerciseEditor from "./editors/exercise-editor";
import {
  WorkspaceMaterial,
  MaterialCompositeReply,
  AssessmentWithAudio,
  EvaluationAssessmentRequest,
} from "~/generated/client";
import MApi from "~/api/api";
import { WithTranslation, withTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";

/**
 * EvaluationCardProps
 */
interface EvaluationAssessmentAssignmentProps extends WithTranslation {
  workspace: WorkspaceDataType;
  assigment: WorkspaceMaterial;
  open: boolean;
  evaluations: EvaluationState;
  selectedAssessment: EvaluationAssessmentRequest;
  updateOpenedAssignmentOrExamId: UpdateOpenedAssignmentOrExamId;
  toggleLockedAssignment: ToggleLockedAssigment;
  showAsHidden: boolean;
  compositeReply?: MaterialCompositeReply;
  onClickOpen?: (id: number) => void;
  onSave?: (materialId: number) => void;
}

/**
 * EvaluationAssessmentAssignmentState
 */
interface EvaluationAssessmentAssignmentState {
  openContent: boolean;
  openDrawer: boolean;
  materialNode?: MaterialContentNodeWithIdAndLogic;
  isLoading: boolean;
  openAssignmentType?: "EVALUATED" | "EXERCISE";
  isRecording: boolean;
}

/**
 * EvaluationAssessmentAssignment
 */
class EvaluationAssessmentAssignment extends React.Component<
  EvaluationAssessmentAssignmentProps,
  EvaluationAssessmentAssignmentState
> {
  private myRef: HTMLDivElement = undefined;

  /**
   * constructor
   * @param props props
   */
  constructor(props: EvaluationAssessmentAssignmentProps) {
    super(props);

    this.state = {
      openDrawer: false,
      openContent: false,
      isLoading: true,
      materialNode: undefined,
      isRecording: false,
    };
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   * @param prevState prevState
   */
  componentDidUpdate(
    prevProps: EvaluationAssessmentAssignmentProps,
    prevState: EvaluationAssessmentAssignmentState
  ) {
    if (this.props.open !== prevState.openContent) {
      if (this.props.open && prevState.materialNode === undefined) {
        this.loadMaterialData();
      }

      this.setState({
        openContent: this.props.open,
      });
    }
  }

  /**
   * sleep
   * @param m milliseconds
   * @returns Promise
   */
  sleep = (m: number) => new Promise((r) => setTimeout(r, m));

  /**
   * loadMaterialData
   */
  loadMaterialData = async () => {
    const evaluationApi = MApi.getEvaluationApi();
    const materialsApi = MApi.getMaterialsApi();

    const { workspace, assigment, selectedAssessment } = this.props;

    const userEntityId = selectedAssessment.userEntityId;

    this.setState({
      isLoading: true,
    });

    const sleep = await this.sleep(1000);

    const [loadedMaterial] = await Promise.all([
      (async () => {
        const material = await materialsApi.getHtmlMaterial({
          id: assigment.materialId,
        });

        const evaluation = await evaluationApi.getWorkspaceNodeEvaluation({
          workspaceId: workspace.id,
          workspaceNodeId: assigment.id,
          userEntityId,
        });

        const loadedMaterial = Object.assign(
          {},
          {
            ...material,
            evaluation: evaluation,
            assignment: this.props.assigment,
            path: this.props.assigment.path,
            contentHiddenForUser: false,
          }
        ) as MaterialContentNodeWithIdAndLogic;

        return loadedMaterial;
      })(),
      sleep,
    ]);

    this.setState({
      isLoading: false,
      materialNode: loadedMaterial,
    });
  };

  /**
   * Removes evaluation from material node in state, which is used when deleting evaluation from editor
   */
  removeEvaluationFromState = () => {
    const updatedMaterial: MaterialContentNodeWithIdAndLogic = {
      ...this.state.materialNode,
      evaluation: null,
    };
    this.setState({
      materialNode: updatedMaterial,
    });
  };

  /**
   * updateMaterialEvaluationData
   * @param  assessmentWithAudio assessmentWithAudio
   */
  updateMaterialEvaluationData = (assessmentWithAudio: AssessmentWithAudio) => {
    /**
     * Get initial values that needs to be updated
     */
    const updatedMaterial: MaterialContentNodeWithIdAndLogic = {
      ...this.state.materialNode,
    };

    let gradeId = null;
    let gradeDataSource = null;

    let gradeScaleId = null;
    let gradeScaleDataSource = null;

    if (assessmentWithAudio.gradeIdentifier !== null) {
      /**
       * gradeId and source are included in same string, so splittin is required
       */
      const gradeIdentifierSplitted =
        assessmentWithAudio.gradeIdentifier.split("-");

      gradeId = gradeIdentifierSplitted[1];
      gradeDataSource = gradeIdentifierSplitted[0];
    }
    if (assessmentWithAudio.gradingScaleIdentifier !== null) {
      /**
       * gradeScaleId and source are included in same string, so splittin is required
       */
      const gradeScaleIdentifierSplitted =
        assessmentWithAudio.gradingScaleIdentifier.split("-");

      gradeScaleId = gradeScaleIdentifierSplitted[1];

      gradeScaleDataSource = gradeScaleIdentifierSplitted[0];
    }

    /**
     * Updates founded evaluation items with new values
     */
    updatedMaterial.evaluation = {
      ...this.state.materialNode.evaluation,
      evaluated: assessmentWithAudio.assessmentDate,
      verbalAssessment: assessmentWithAudio.verbalAssessment,
      gradeIdentifier: gradeId,
      gradeSchoolDataSource: gradeDataSource,
      gradingScaleIdentifier: gradeScaleId,
      gradingScaleSchoolDataSource: gradeScaleDataSource,
      passed: assessmentWithAudio.passing,
    };

    this.setState({
      materialNode: updatedMaterial,
    });
  };

  /**
   * toggleOpened
   */
  handleOpenMaterialContent = () => {
    const { openContent } = this.state;

    if (this.props.onClickOpen) {
      this.props.onClickOpen(this.props.assigment.id);
    }

    this.setState({ openContent: !openContent });
  };

  /**
   * handleCloseSlideDrawer
   */
  handleCloseSlideDrawer = () => {
    this.props.updateOpenedAssignmentOrExamId({
      assignmentOrExamId: undefined,
    });

    this.setState({
      openDrawer: false,
      openAssignmentType: undefined,
    });
  };

  /**
   * handleToggleLockedAssignment
   * @param action action
   */
  handleToggleLockedAssignment = (action: "lock" | "unlock") => () => {
    this.props.toggleLockedAssignment({
      action,
      workspaceMaterialId: this.props.assigment.id,
    });
  };

  /**
   * handleOpenSlideDrawer
   * @param assignmentId assignmentId
   * @param assignmentType assignmentType
   */
  handleOpenSlideDrawer =
    (assignmentId: number, assignmentType: "EVALUATED" | "EXERCISE") => () => {
      if (this.props.evaluations.openedAssigmentOrExamId !== assignmentId) {
        this.props.updateOpenedAssignmentOrExamId({
          assignmentOrExamId: assignmentId,
        });
      }

      if (this.state.materialNode === undefined) {
        this.loadMaterialData();
      }

      this.setState(
        {
          openDrawer: true,
          openAssignmentType: assignmentType,
        },
        () => this.handleExecuteScrollToElement()
      );
    };

  /**
   * handleExecuteScrollToElement
   */
  handleExecuteScrollToElement = () => {
    window.dispatchEvent(new Event("resize"));
    if (this.props.evaluations.openedAssigmentOrExamId) {
      setTimeout(() => {
        this.myRef.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }
    this.myRef.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * assignmentTypeClass
   * @returns string
   */
  materialTypeClass = () => {
    if (this.props.assigment.assignmentType === "EVALUATED") {
      return "assignment";
    }
    return "exercise";
  };

  /**
   * assignmentFunctionClass
   * @param compositeReply compositeReply
   * @returns Assignment function button class
   */
  assignmentFunctionClass = (compositeReply?: MaterialCompositeReply) => {
    if (compositeReply) {
      const { evaluationInfo } = compositeReply;

      if (evaluationInfo) {
        switch (evaluationInfo.type) {
          case "FAILED":
            return "state-FAILED";

          case "INCOMPLETE":
            if (compositeReply.state === "SUBMITTED") {
              return "state-SUPPLEMENTED";
            }
            return "state-INCOMPLETE";

          default:
            return "state-EVALUATED";
        }
      } else {
        switch (compositeReply.state) {
          case "WITHDRAWN":
            return "state-WITHDRAWN";
          case "ANSWERED":
            return "state-ANSWERED";
          case "SUBMITTED":
            return "state-SUBMITTED";
          default:
            return "state-UNANSWERED";
        }
      }
    } else {
      return "state-UNANSWERED";
    }
  };

  /**
   * assigmentGradeClass
   * @param compositeReply compositeReply
   * @returns classMod
   */
  assigmentGradeClass = (compositeReply?: MaterialCompositeReply) => {
    if (compositeReply) {
      const { evaluationInfo } = compositeReply;

      if (evaluationInfo) {
        switch (evaluationInfo.type) {
          case "FAILED":
            return "state-FAILED";

          case "INCOMPLETE":
            if (compositeReply.state === "SUBMITTED") {
              return "state-SUPPLEMENTED";
            }
            return "state-INCOMPLETE";

          default:
            return "state-EVALUATED";
        }
      }
    }
  };

  /**
   * renderAssignmentStatus
   * @param compositeReply compositeReply
   * @returns JSX.Element
   */
  renderAssignmentMeta = (compositeReply?: MaterialCompositeReply) => {
    const { t } = this.props;

    if (compositeReply) {
      const { evaluationInfo } = compositeReply;

      // Checking if assigments is submitted at all.
      // Its date string
      const hasSubmitted = compositeReply.submitted;

      // Checking if its evaluated with grade
      const evaluatedWithGrade = evaluationInfo && evaluationInfo.grade;

      // Needs supplementation
      const needsSupplementation =
        evaluationInfo && evaluationInfo.type === "INCOMPLETE";

      // If evaluation is given as supplementation request and student
      // cancels and makes changes to answers and submits again
      const supplementationDone =
        compositeReply.state === "SUBMITTED" && needsSupplementation;

      // Evaluation date if evaluated
      const evaluationDate = evaluationInfo && evaluationInfo.date;

      // Grade class mod
      const assignmentGradeClassMod = this.assigmentGradeClass(compositeReply);

      const assignmentFunctionClassMod =
        this.assignmentFunctionClass(compositeReply);
      // Points and max points object
      const pointsAndMaxPoints = {
        points: this.props.compositeReply.evaluationInfo?.points,
        maxPoints: this.props.assigment.maxPoints,
        show: this.props.compositeReply.evaluationInfo?.points !== undefined,
      };

      /**
       * Gets assignment state label based on composite reply state
       * @returns string
       */
      const getAssignmentStateLabel = (): string => {
        switch (compositeReply.state) {
          case "UNANSWERED":
            return t("labels.notDone", { ns: "evaluation" });
          case "WITHDRAWN":
            return t("labels.withdrawnAssignment", { ns: "evaluation" });
          case "SUBMITTED":
            return t("labels.done", { ns: "evaluation" });
          case "ANSWERED":
            return t("labels.notSubmitted", { ns: "evaluation" });
          case "PASSED":
          case "FAILED":
          case "INCOMPLETE":
            return hasSubmitted
              ? t("labels.done", { ns: "evaluation" })
              : t("labels.notSubmitted", { ns: "evaluation" });
          default:
            return t("labels.notDone", { ns: "evaluation" });
        }
      };

      return (
        <div className="evaluation-modal__item-meta">
          <div className="evaluation-modal__item-meta">
            <div
              className={` evaluation-modal__item-meta-item ${assignmentFunctionClassMod}`}
            >
              <span className="evaluation-modal__item-meta-item-label">
                {getAssignmentStateLabel()}
              </span>
              {hasSubmitted && compositeReply.state !== "WITHDRAWN" && (
                <span className="evaluation-modal__item-meta-item-data">
                  {localize.date(hasSubmitted)}
                </span>
              )}
            </div>
          </div>

          {evaluationDate && (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.evaluated", { ns: "workspace" })}
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {localize.date(evaluationDate)}
              </span>
            </div>
          )}

          {evaluatedWithGrade && (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.grade", { ns: "workspace" })}
              </span>
              <span
                className={`evaluation-modal__item-meta-item-data evaluation-modal__item-meta-item-data--grade ${assignmentGradeClassMod}`}
              >
                {evaluationInfo.grade}
              </span>
            </div>
          )}

          {pointsAndMaxPoints.show && (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.points", { ns: "workspace" })}
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {!pointsAndMaxPoints.maxPoints
                  ? localize.number(pointsAndMaxPoints.points)
                  : `${localize.number(
                      pointsAndMaxPoints.points
                    )} / ${localize.number(pointsAndMaxPoints.maxPoints)}`}
              </span>
            </div>
          )}

          {needsSupplementation && !supplementationDone && (
            <div className="evaluation-modal__item-meta-item">
              <span
                className={`evaluation-modal__item-meta-item-data evaluation-modal__item-meta-item-data--grade ${assignmentGradeClassMod}`}
              >
                {t("labels.incomplete", { ns: "materials" })}
              </span>
            </div>
          )}

          {supplementationDone && (
            <div className="evaluation-modal__item-meta-item">
              <span
                className={`evaluation-modal__item-meta-item-data evaluation-modal__item-meta-item-data--grade ${assignmentGradeClassMod}`}
              >
                {t("labels.supplemented", { ns: "evaluation" })}
              </span>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="evaluation-modal__item-meta">
          <div className="evaluation-modal__item-meta-item">
            <span className="evaluation-modal__item-meta-item-data">
              {t("labels.notDone", { ns: "evaluation" })}
            </span>
          </div>
        </div>
      );
    }
  };
  /**
   * Handles is recoding on change
   * @param isRecording isRecording
   */
  handleIsRecordingChange = (isRecording: boolean) => {
    this.setState({ isRecording });
  };

  /**
   * render
   */
  render() {
    const { compositeReply, showAsHidden, t } = this.props;
    const materialTypeClass = this.materialTypeClass();

    let contentOpen: string | number = 0;

    if (
      this.state.openContent ||
      (this.state.openDrawer &&
        this.props.evaluations.openedAssigmentOrExamId ===
          this.props.assigment.id)
    ) {
      /**
       * Open invidual material content or if hitting evaluation button then that corresponding
       * content and dialog together
       */
      contentOpen = "auto";
    }

    const evaluatedFunctionClassMod =
      this.assignmentFunctionClass(compositeReply);
    let evaluationTitleClassMod = "";

    if (
      this.state.openDrawer &&
      this.props.evaluations.openedAssigmentOrExamId === this.props.assigment.id
    ) {
      /**
       * Assigning class mod to evaluation material title if corresponding dialog is open
       */
      evaluationTitleClassMod = "active-dialog";
    }

    const materialPageType =
      this.props.assigment.assignmentType === "EVALUATED"
        ? "assignment"
        : "exercise";

    // Show lock button if assignment is evaluated
    // and its state is one of the following in the list
    // or if compositeReply is completely undefined, meaning that student
    // has not submitted the assignment yet
    const showLockButton =
      this.props.assigment.assignmentType === "EVALUATED" &&
      ((this.props.compositeReply &&
        ["UNANSWERED", "WITHDRAWN", "SUBMITTED", "ANSWERED"].includes(
          this.props.compositeReply.state
        )) ||
        this.props.compositeReply === undefined);

    return (
      <div className={`evaluation-modal__item `}>
        <div
          className={`evaluation-modal__item-header ${evaluatedFunctionClassMod}`}
          ref={(ref) => (this.myRef = ref)}
        >
          <div
            onClick={this.handleOpenMaterialContent}
            className={`evaluation-modal__item-header-title
                        evaluation-modal__item-header-title--${materialTypeClass}
                        ${
                          evaluationTitleClassMod
                            ? "evaluation-modal__item-header-title--" +
                              evaluationTitleClassMod
                            : ""
                        }`}
          >
            {this.props.assigment.title}

            {showAsHidden && (
              <div className="evaluation-modal__item-hidden">
                {t("notifications.hiddenError", {
                  ns: "evaluation",
                  context: materialPageType,
                })}
              </div>
            )}

            {this.renderAssignmentMeta(compositeReply)}
          </div>
          <div className="evaluation-modal__item-functions">
            {showLockButton && (
              <ButtonPill
                aria-label={t("actions.evaluateAssignment", {
                  ns: "evaluation",
                })}
                onClick={this.handleToggleLockedAssignment(
                  (
                    this.props.evaluations.evaluationCurrentStudentAssigments
                      .data?.idListOfLockedAssigments || []
                  ).includes(this.props.assigment.id)
                    ? "unlock"
                    : "lock"
                )}
                buttonModifiers={
                  (
                    this.props.evaluations.evaluationCurrentStudentAssigments
                      .data?.idListOfLockedAssigments || []
                  ).includes(this.props.assigment.id)
                    ? "assignment-locked"
                    : "assignment-unlocked"
                }
                icon={
                  (
                    this.props.evaluations.evaluationCurrentStudentAssigments
                      .data?.idListOfLockedAssigments || []
                  ).includes(this.props.assigment.id)
                    ? "lock"
                    : "lock-open"
                }
              />
            )}

            {(this.props.assigment.assignmentType === "EXERCISE" ||
              this.props.assigment.assignmentType === "EVALUATED") && (
              <ButtonPill
                aria-label={t("actions.evaluateAssignment", {
                  ns: "evaluation",
                })}
                onClick={this.handleOpenSlideDrawer(
                  this.props.assigment.id,
                  this.props.assigment.assignmentType
                )}
                buttonModifiers={["evaluate"]}
                icon="evaluate"
              />
            )}
          </div>
        </div>
        <SlideDrawer
          title={this.props.assigment.title}
          closeIconModifiers={["evaluation"]}
          modifiers={
            this.props.assigment.assignmentType === "EVALUATED"
              ? ["assignment"]
              : ["exercise"]
          }
          show={
            this.state.openDrawer &&
            this.props.evaluations.openedAssigmentOrExamId ===
              this.props.assigment.id
          }
          disableClose={this.state.isRecording}
          onClose={this.handleCloseSlideDrawer}
        >
          {this.state.isLoading ? (
            <div className="loader-empty" />
          ) : this.state.materialNode ? (
            this.props.assigment.assignmentType === "EVALUATED" ? (
              <AssignmentEditor
                selectedAssessment={this.props.selectedAssessment}
                editorLabel={t("labels.literalEvaluation", {
                  ns: "evaluation",
                  context: "assignment",
                })}
                materialEvaluation={this.state.materialNode.evaluation}
                materialAssignment={this.state.materialNode.assignment}
                compositeReplies={compositeReply}
                isRecording={this.state.isRecording}
                onDeleteEvaluation={this.removeEvaluationFromState}
                onIsRecordingChange={this.handleIsRecordingChange}
                updateMaterialEvaluationData={this.updateMaterialEvaluationData}
                onClose={this.handleCloseSlideDrawer}
              />
            ) : (
              <ExerciseEditor
                selectedAssessment={this.props.selectedAssessment}
                editorLabel={t("labels.literalEvaluation", {
                  ns: "evaluation",
                  context: "assignment",
                })}
                materialEvaluation={this.state.materialNode.evaluation}
                materialAssignment={this.state.materialNode.assignment}
                isRecording={this.state.isRecording}
                onIsRecordingChange={this.handleIsRecordingChange}
                onDeleteEvaluation={this.removeEvaluationFromState}
                compositeReplies={compositeReply}
                updateMaterialEvaluationData={this.updateMaterialEvaluationData}
                onClose={this.handleCloseSlideDrawer}
              />
            )
          ) : null}
        </SlideDrawer>

        <AnimateHeight duration={400} height={contentOpen}>
          {this.state.isLoading ? (
            <div className="loader-empty" />
          ) : (
            this.props.workspace &&
            this.state.materialNode && (
              <EvaluationMaterial
                material={this.state.materialNode}
                workspace={this.props.workspace}
                compositeReply={compositeReply}
                userEntityId={this.props.selectedAssessment.userEntityId}
              />
            )
          )}
        </AnimateHeight>
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
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      updateOpenedAssignmentOrExamId,
      toggleLockedAssignment,
    },
    dispatch
  );
}

export default withTranslation([
  "evaluation",
  "workspace",
  "materials",
  "common",
])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationAssessmentAssignment)
);
