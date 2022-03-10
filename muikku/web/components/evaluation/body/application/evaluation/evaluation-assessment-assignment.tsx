import * as React from "react";
import EvaluationMaterial from "./evaluation-material";
import { AssignmentEvaluationSaveReturn } from "~/@types/evaluation";
import {
  WorkspaceType,
  MaterialContentNodeType,
  MaterialAssignmentType,
  MaterialCompositeRepliesType,
  MaterialEvaluationType,
} from "~/reducers/workspaces/index";
import "~/sass/elements/evaluation.scss";
import { AnyActionType } from "~/actions/index";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as moment from "moment";
import { ButtonPill } from "~/components/general/button";
import AnimateHeight from "react-animate-height";
import mApi from "~/lib/mApi";
import SlideDrawer from "./slide-drawer";
import AssignmentEditor from "./editors/assignment-editor";
import { StateType } from "~/reducers/index";
import { i18nType } from "~/reducers/base/i18n";
import {
  UpdateOpenedAssignmentEvaluationId,
  updateOpenedAssignmentEvaluation,
} from "~/actions/main-function/evaluation/evaluationActions";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import promisify from "~/util/promisify";
import ExcerciseEditor from "./editors/excercise-editor";
import RecordingsList from "~/components/general/voice-recorder/recordings-list";
import { RecordValue } from "~/@types/recorder";

/**
 * EvaluationCardProps
 */
interface EvaluationAssessmentAssignmentProps {
  workspace: WorkspaceType;
  assigment: MaterialAssignmentType;
  open: boolean;
  i18n: i18nType;
  evaluations: EvaluationState;
  updateOpenedAssignmentEvaluation: UpdateOpenedAssignmentEvaluationId;
  showAsHidden: boolean;
  compositeReply?: MaterialCompositeRepliesType;
  onClickOpen?: (id: number) => void;
  onSave?: (materialId: number) => void;
}

/**
 * EvaluationAssessmentAssignmentState
 */
interface EvaluationAssessmentAssignmentState {
  openContent: boolean;
  openDrawer: boolean;
  materialNode?: MaterialContentNodeType;
  isLoading: boolean;
  openAssignmentType?: "EVALUATED" | "EXERCISE";
  showCloseEditorWarning: boolean;
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
      isLoading: false,
      materialNode: undefined,
      showCloseEditorWarning: false,
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
    const { workspace, assigment, evaluations } = this.props;

    const userEntityId =
      evaluations.evaluationSelectedAssessmentId.userEntityId;

    this.setState({
      isLoading: true,
    });

    const sleep = await this.sleep(1000);

    const [loadedMaterial] = await Promise.all([
      (async () => {
        const material = (await promisify(
          mApi().materials.html.read(assigment.materialId),
          "callback"
        )()) as MaterialContentNodeType;

        const evaluation = (await promisify(
          mApi().workspace.workspaces.materials.evaluations.read(
            workspace.id,
            assigment.id,
            {
              userEntityId,
            }
          ),
          "callback"
        )()) as MaterialEvaluationType[];

        const loadedMaterial: MaterialContentNodeType = Object.assign(
          material,
          {
            evaluation: evaluation[0],
            assignment: this.props.assigment,
            path: this.props.assigment.path,
          }
        );

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
   * updateMaterialEvaluationData
   * @param  assigmentSaveReturn assigmentSaveReturn
   */
  updateMaterialEvaluationData = (
    assigmentSaveReturn: AssignmentEvaluationSaveReturn
  ) => {
    /**
     * Get initial values that needs to be updated
     */
    const updatedMaterial: MaterialContentNodeType = {
      ...this.state.materialNode,
    };

    let gradeId = null;
    let gradeDataSource = null;

    let gradeScaleId = null;
    let gradeScaleDataSource = null;

    if (assigmentSaveReturn.gradeIdentifier !== null) {
      /**
       * gradeId and source are included in same string, so splittin is required
       */
      const gradeIdentifierSplitted =
        assigmentSaveReturn.gradeIdentifier.split("-");

      gradeId = gradeIdentifierSplitted[1];
      gradeDataSource = gradeIdentifierSplitted[0];
    }
    if (assigmentSaveReturn.gradingScaleIdentifier !== null) {
      /**
       * gradeScaleId and source are included in same string, so splittin is required
       */
      const gradeScaleIdentifierSplitted =
        assigmentSaveReturn.gradingScaleIdentifier.split("-");

      gradeScaleId = gradeScaleIdentifierSplitted[1];

      gradeScaleDataSource = gradeScaleIdentifierSplitted[0];
    }

    /**
     * Updates founded evaluation items with new values
     */
    updatedMaterial.evaluation = {
      ...this.state.materialNode.evaluation,
      evaluated: assigmentSaveReturn.assessmentDate,
      verbalAssessment: assigmentSaveReturn.verbalAssessment,
      gradeIdentifier: gradeId,
      gradeSchoolDataSource: gradeDataSource,
      gradingScaleIdentifier: gradeScaleId,
      gradingScaleSchoolDataSource: gradeScaleDataSource,
      passed: assigmentSaveReturn.passing,
    };

    this.setState({
      materialNode: updatedMaterial,
    });
  };

  /**
   * createHtmlMarkup
   * This should sanitize html
   * @param htmlString string that contains html
   */
  createHtmlMarkup = (htmlString: string) => ({
    __html: htmlString,
  });

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
    this.props.updateOpenedAssignmentEvaluation({ assignmentId: undefined });

    this.setState({
      openDrawer: false,
      openAssignmentType: undefined,
      showCloseEditorWarning: false,
    });
  };

  /**
   * handleOpenSlideDrawer
   * @param assignmentId assignmentId
   * @param assignmentType assignmentType
   */
  handleOpenSlideDrawer =
    (assignmentId: number, assignmentType: "EVALUATED" | "EXERCISE") => () => {
      if (
        this.props.evaluations.openedAssignmentEvaluationId !== assignmentId
      ) {
        this.props.updateOpenedAssignmentEvaluation({ assignmentId });
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
    if (this.props.evaluations.openedAssignmentEvaluationId) {
      setTimeout(() => {
        this.myRef.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }
    this.myRef.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * handleAudioAssessmentChange
   */
  handleAudioAssessmentChange = () => {
    this.setState({
      showCloseEditorWarning: true,
    });
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
  assignmentFunctionClass = (compositeReply?: MaterialCompositeRepliesType) => {
    if (
      compositeReply &&
      compositeReply.evaluationInfo &&
      compositeReply.evaluationInfo.date
    ) {
      if (
        (compositeReply.evaluationInfo &&
          compositeReply.evaluationInfo.grade) ||
        (compositeReply.evaluationInfo &&
          this.props.assigment.assignmentType === "EXERCISE" &&
          compositeReply.evaluationInfo.type === "PASSED")
      ) {
        // Evaluated if graded or if assignment type is excercise and info type returns PASSED
        return "state-EVALUATED";
      } else if (
        compositeReply.state === "SUBMITTED" &&
        compositeReply.evaluationInfo.type === "INCOMPLETE"
      ) {
        // Supplemented as in use to be incomplete but user has submitted it again
        return "state-SUPPLEMENTED";
      } else {
        // Incomplete
        return "state-INCOMPLETE";
      }
    }
  };

  /**
   * assigmentGradeClass
   * @param compositeReply compositeReply
   * @returns classMod
   */
  assigmentGradeClass = (compositeReply?: MaterialCompositeRepliesType) => {
    if (compositeReply) {
      const { evaluationInfo } = compositeReply;

      if (evaluationInfo && evaluationInfo.type !== "INCOMPLETE") {
        return "state-EVALUATED";
      } else if (
        compositeReply.state === "SUBMITTED" &&
        evaluationInfo &&
        evaluationInfo.type === "INCOMPLETE"
      ) {
        return "state-SUPPLEMENTED";
      }
      return "state-INCOMPLETE";
    }
  };

  /**
   * renderAssignmentStatus
   * @param compositeReply compositeReply
   * @returns JSX.Element
   */
  renderAssignmentMeta = (compositeReply?: MaterialCompositeRepliesType) => {
    if (compositeReply) {
      const { evaluationInfo } = compositeReply;

      /**
       * Checking if assigments is submitted at all.
       * Its date string
       */
      const hasSubmitted = compositeReply.submitted;

      /**
       * Checking if its evaluated with grade
       */
      const evaluatedWithGrade = evaluationInfo && evaluationInfo.grade;

      /**
       * Needs supplementation
       */
      const needsSupplementation =
        evaluationInfo && evaluationInfo.type === "INCOMPLETE";

      /**
       * If evaluation is given as supplementation request and student
       * cancels and makes changes to answers and submits again
       */
      const supplementationDone =
        compositeReply.state === "SUBMITTED" && needsSupplementation;

      /**
       * Evaluation date if evaluated
       */
      const evaluationDate = evaluationInfo && evaluationInfo.date;

      /**
       * Grade class mod
       */
      const assignmentGradeClassMod = this.assigmentGradeClass(compositeReply);

      return (
        <div className="evaluation-modal__item-meta">
          {hasSubmitted === null ||
          (hasSubmitted !== null && compositeReply.state === "WITHDRAWN") ? (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-data">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentNotDoneLabel"
                )}
              </span>
            </div>
          ) : (
            hasSubmitted && (
              <div className="evaluation-modal__item-meta-item">
                <span className="evaluation-modal__item-meta-item-label">
                  {this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.assignmentDoneLabel"
                  )}
                </span>
                <span className="evaluation-modal__item-meta-item-data">
                  {moment(hasSubmitted).format("l")}
                </span>
              </div>
            )
          )}

          {evaluationDate && (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentEvaluatedLabel"
                )}
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {moment(evaluationDate).format("l")}
              </span>
            </div>
          )}

          {evaluatedWithGrade && (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentGradeLabel"
                )}
              </span>
              <span
                className={`evaluation-modal__item-meta-item-data evaluation-modal__item-meta-item-data--grade ${assignmentGradeClassMod}`}
              >
                {evaluationInfo.grade}
              </span>
            </div>
          )}

          {needsSupplementation && !supplementationDone && (
            <div className="evaluation-modal__item-meta-item">
              <span
                className={`evaluation-modal__item-meta-item-data evaluation-modal__item-meta-item-data--grade ${assignmentGradeClassMod}`}
              >
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentEvaluatedIncompleteLabel"
                )}
              </span>
            </div>
          )}

          {supplementationDone && (
            <div className="evaluation-modal__item-meta-item">
              <span
                className={`evaluation-modal__item-meta-item-data evaluation-modal__item-meta-item-data--grade ${assignmentGradeClassMod}`}
              >
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentEvaluatedIncompleteDoneLabel"
                )}
              </span>
            </div>
          )}
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
    const { compositeReply, showAsHidden } = this.props;
    const materialTypeClass = this.materialTypeClass();

    const recordings =
      compositeReply &&
      compositeReply.evaluationInfo &&
      compositeReply.evaluationInfo.audioAssessments.map(
        (aAssessment) =>
          ({
            ...aAssessment,
            url: `/rest/workspace/materialevaluationaudioassessment/${aAssessment.id}`,
          } as RecordValue)
      );

    let contentOpen: string | number = 0;

    if (
      this.state.openContent ||
      (this.state.openDrawer &&
        this.props.evaluations.openedAssignmentEvaluationId ===
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
      this.props.evaluations.openedAssignmentEvaluationId ===
        this.props.assigment.id
    ) {
      /**
       * Assigning class mod to evaluation material title if corresponding dialog is open
       */
      evaluationTitleClassMod = "active-dialog";
    }

    const materialPageType =
      this.props.assigment.assignmentType === "EVALUATED"
        ? "assignment"
        : "excercise";

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
                {this.props.i18n.text.get(
                  `plugin.evaluation.evaluationModal.${materialPageType}HiddenButAnswered`
                )}
              </div>
            )}

            {this.renderAssignmentMeta(compositeReply)}
          </div>
          <div className="evaluation-modal__item-functions">
            {this.props.assigment.assignmentType === "EVALUATED" ||
            this.props.assigment.assignmentType === "EXERCISE" ? (
              compositeReply &&
              compositeReply.state !== "UNANSWERED" &&
              compositeReply.state !== "WITHDRAWN" ? (
                <ButtonPill
                  aria-label={this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.evaluateAssignmentButtonTitle"
                  )}
                  onClick={this.handleOpenSlideDrawer(
                    this.props.assigment.id,
                    this.props.assigment.assignmentType
                  )}
                  buttonModifiers={["evaluate"]}
                  icon="evaluate"
                />
              ) : null
            ) : null}
          </div>
        </div>
        <SlideDrawer
          showWarning={this.state.showCloseEditorWarning}
          title={this.props.assigment.title}
          closeIconModifiers={
            this.props.assigment.assignmentType === "EVALUATED"
              ? ["evaluation", "assignment-drawer-close"]
              : ["evaluation", "excercise-drawer-close"]
          }
          modifiers={
            this.props.assigment.assignmentType === "EVALUATED"
              ? ["assignment"]
              : ["excercise"]
          }
          show={
            this.state.openDrawer &&
            this.props.evaluations.openedAssignmentEvaluationId ===
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
                onAudioAssessmentChange={this.handleAudioAssessmentChange}
                showAudioAssessmentWarningOnClose={
                  this.state.showCloseEditorWarning
                }
                editorLabel={this.props.i18n.text.get(
                  "plugin.evaluation.assignmentEvaluationDialog.literalAssessment"
                )}
                materialEvaluation={this.state.materialNode.evaluation}
                materialAssignment={this.state.materialNode.assignment}
                compositeReplies={compositeReply}
                isRecording={this.state.isRecording}
                onIsRecordingChange={this.handleIsRecordingChange}
                updateMaterialEvaluationData={this.updateMaterialEvaluationData}
                onClose={this.handleCloseSlideDrawer}
              />
            ) : (
              <ExcerciseEditor
                onAudioAssessmentChange={this.handleAudioAssessmentChange}
                showAudioAssessmentWarningOnClose={
                  this.state.showCloseEditorWarning
                }
                editorLabel={this.props.i18n.text.get(
                  "plugin.evaluation.assignmentEvaluationDialog.literalAssessment"
                )}
                materialEvaluation={this.state.materialNode.evaluation}
                materialAssignment={this.state.materialNode.assignment}
                isRecording={this.state.isRecording}
                onIsRecordingChange={this.handleIsRecordingChange}
                compositeReplies={compositeReply}
                updateMaterialEvaluationData={this.updateMaterialEvaluationData}
                onClose={this.handleCloseSlideDrawer}
              />
            )
          ) : null}
        </SlideDrawer>

        <AnimateHeight duration={400} height={contentOpen}>
          {compositeReply &&
          compositeReply.evaluationInfo &&
          (compositeReply.evaluationInfo.text || recordings.length > 0) ? (
            <>
              {compositeReply.evaluationInfo.text ? (
                <div className="evaluation-modal__item-literal-assessment">
                  <div className="evaluation-modal__item-literal-assessment-label">
                    {this.props.i18n.text.get(
                      "plugin.evaluation.evaluationModal.assignmentLiteralEvaluationLabel"
                    )}
                  </div>

                  <div
                    className="evaluation-modal__item-literal-assessment-data rich-text rich-text--evaluation-literal"
                    dangerouslySetInnerHTML={this.createHtmlMarkup(
                      compositeReply.evaluationInfo.text
                    )}
                  />
                </div>
              ) : null}

              {recordings.length > 0 ? (
                <div className="evaluation-modal__item-verbal-assessment">
                  <div className="evaluation-modal__item-verbal-assessment-label">
                    {this.props.i18n.text.get(
                      "plugin.evaluation.evaluationModal.audioAssessments"
                    )}
                  </div>
                  <div className="voice-container">
                    <RecordingsList records={recordings} noDeleteFunctions />
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
          {this.state.isLoading ? (
            <div className="loader-empty" />
          ) : this.props.workspace && this.state.materialNode ? (
            <EvaluationMaterial
              material={this.state.materialNode}
              workspace={this.props.workspace}
              compositeReply={compositeReply}
              userEntityId={
                this.props.evaluations.evaluationSelectedAssessmentId
                  .userEntityId
              }
            />
          ) : null}
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
    i18n: state.i18n,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ updateOpenedAssignmentEvaluation }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationAssessmentAssignment);
