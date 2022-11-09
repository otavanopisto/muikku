import * as React from "react";
import EvaluationMaterial from "./evaluation-material";
import {
  AssessmentRequest,
  AssignmentEvaluationSaveReturn,
} from "~/@types/evaluation";
import {
  WorkspaceType,
  MaterialContentNodeType,
  MaterialAssignmentType,
  MaterialCompositeRepliesType,
  MaterialEvaluationType,
  AssignmentType,
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
import { StateType } from "~/reducers/index";
import { i18nType } from "~/reducers/base/i18n";
import {
  UpdateOpenedAssignmentEvaluationId,
  updateOpenedAssignmentEvaluation,
} from "~/actions/main-function/evaluation/evaluationActions";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import promisify from "~/util/promisify";
import InterimEvaluationEditor from "./editors/interim-evaluation-editor";
import { WorkspaceInterimEvaluationRequest } from "../../../../../reducers/workspaces/index";

/**
 * EvaluationCardProps
 */
interface EvaluationAssessmentInterminEvaluationRequestProps {
  workspace: WorkspaceType;
  assigment: MaterialAssignmentType;
  open: boolean;
  i18n: i18nType;
  evaluations: EvaluationState;
  selectedAssessment: AssessmentRequest;
  updateOpenedAssignmentEvaluation: UpdateOpenedAssignmentEvaluationId;
  showAsHidden: boolean;
  compositeReply?: MaterialCompositeRepliesType;
  onClickOpen?: (id: number) => void;
  onSave?: (materialId: number) => void;
}

/**
 * EvaluationAssessmentInterminEvaluationRequestState
 */
interface EvaluationAssessmentInterminEvaluationRequestState {
  openContent: boolean;
  openDrawer: boolean;
  materialNode?: MaterialContentNodeType;
  interminEvaluationRequest?: WorkspaceInterimEvaluationRequest;
  isLoading: boolean;
  openAssignmentType?: AssignmentType;
  showCloseEditorWarning: boolean;
  isRecording: boolean;
}

/**
 * EvaluationAssessmentAssignment
 */
class EvaluationAssessmentInterminEvaluationRequest extends React.Component<
  EvaluationAssessmentInterminEvaluationRequestProps,
  EvaluationAssessmentInterminEvaluationRequestState
> {
  private myRef: HTMLDivElement = undefined;

  /**
   * constructor
   * @param props props
   */
  constructor(props: EvaluationAssessmentInterminEvaluationRequestProps) {
    super(props);

    this.state = {
      openDrawer: false,
      openContent: false,
      isLoading: true,
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
    prevProps: EvaluationAssessmentInterminEvaluationRequestProps,
    prevState: EvaluationAssessmentInterminEvaluationRequestState
  ) {
    if (this.props.open !== prevState.openContent) {
      if (this.props.open && prevState.materialNode === undefined) {
        this.loadMaterialRelatedData();
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
   * Loads all needed material related data
   */
  loadMaterialRelatedData = async () => {
    this.setState({
      isLoading: true,
    });

    const sleep = await this.sleep(1000);

    const [data] = await Promise.all([
      (async () => ({
        materialNodeData: await this.loadMaterialContentNodeData(),
        interminEvaluationRequestData:
          await this.loadInterminEvaluationRequestRequestData(),
      }))(),
      sleep,
    ]);

    this.setState({
      materialNode: data.materialNodeData,
      interminEvaluationRequest: data.interminEvaluationRequestData,
      isLoading: false,
    });
  };

  /**
   * Loads material content node data with evaluation and bundles it with
   * assignment data and path from props
   */
  loadMaterialContentNodeData = async () => {
    const { workspace, assigment, selectedAssessment } = this.props;

    const userEntityId = selectedAssessment.userEntityId;

    const [loadedMaterial] = await Promise.all([
      (async () => {
        const material = (await promisify(
          mApi().materials.html.read(assigment.materialId),
          "callback"
        )()) as MaterialContentNodeType;

        const evaluation = (await promisify(
          mApi().evaluation.workspaces.materials.evaluations.read(
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
    ]);

    return loadedMaterial;
  };

  /**
   * Loads intermin evaluation request data for material use
   * If api call fails, returns undefined meaning that there is no
   * intermin evaluation request for material
   */
  loadInterminEvaluationRequestRequestData = async () => {
    const { assigment } = this.props;

    try {
      const interminEvaluationRequest = (await promisify(
        mApi().evaluation.workspaceMaterial.interimEvaluationRequest.read(
          assigment.id,
          {
            userEntityId: this.props.selectedAssessment.userEntityId,
          }
        ),
        "callback"
      )()) as WorkspaceInterimEvaluationRequest;

      return interminEvaluationRequest;
    } catch (error) {
      return undefined;
    }
  };

  /**
   * Update material evaluation data to state after editing it
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

    /**
     * Updates founded evaluation items with new values
     */
    updatedMaterial.evaluation = {
      ...this.state.materialNode.evaluation,
      evaluated: assigmentSaveReturn.assessmentDate,
      verbalAssessment: assigmentSaveReturn.verbalAssessment,
      gradeIdentifier: null,
      gradeSchoolDataSource: null,
      gradingScaleIdentifier: null,
      gradingScaleSchoolDataSource: null,
      passed: assigmentSaveReturn.passing,
    };

    this.setState({
      materialNode: updatedMaterial,
    });
  };

  /**
   * Toggles open material content drawer
   */
  handleOpenMaterialContent = () => {
    const { openContent } = this.state;

    if (this.props.onClickOpen) {
      this.props.onClickOpen(this.props.assigment.id);
    }

    this.setState({ openContent: !openContent });
  };

  /**
   * Closes slide drawer
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
   * Opens slide drawer
   * @param assignmentId assignmentId
   * @param assignmentType assignmentType
   */
  handleOpenSlideDrawer =
    (assignmentId: number, assignmentType: AssignmentType) => () => {
      if (
        this.props.evaluations.openedAssignmentEvaluationId !== assignmentId
      ) {
        this.props.updateOpenedAssignmentEvaluation({ assignmentId });
      }

      if (this.state.materialNode === undefined) {
        this.loadMaterialRelatedData();
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
   * Scrolls to opened element
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
   * Handles audo assessment change
   */
  handleAudioAssessmentChange = () => {
    this.setState({
      showCloseEditorWarning: true,
    });
  };

  /**
   * assignmentFunctionClass
   * @param compositeReply compositeReply
   * @returns Assignment function button class
   */
  assignmentFunctionClass = (compositeReply?: MaterialCompositeRepliesType) =>
    compositeReply &&
    compositeReply.evaluationInfo &&
    compositeReply.evaluationInfo.date &&
    "state-EVALUATED";

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
       * Evaluation date if evaluated
       */
      const evaluationDate = evaluationInfo && evaluationInfo.date;

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

    return (
      <div className={`evaluation-modal__item `}>
        <div
          className={`evaluation-modal__item-header ${
            evaluatedFunctionClassMod ? evaluatedFunctionClassMod : ""
          }`}
          ref={(ref) => (this.myRef = ref)}
        >
          <div
            onClick={this.handleOpenMaterialContent}
            className={`evaluation-modal__item-header-title
                        evaluation-modal__item-header-title--interim-evaluation
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
                  `plugin.evaluation.evaluationModal.interimEvaluationHiddenButAnswered`
                )}
              </div>
            )}

            {this.renderAssignmentMeta(compositeReply)}
          </div>
          <div className="evaluation-modal__item-functions">
            {this.props.assigment.assignmentType === "INTERIM_EVALUATION" ? (
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
          closeIconModifiers={["evaluation", "interim-evaluation-drawer-close"]}
          modifiers={["interim-evaluation"]}
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
            <InterimEvaluationEditor
              selectedAssessment={this.props.selectedAssessment}
              onAudioAssessmentChange={this.handleAudioAssessmentChange}
              showAudioAssessmentWarningOnClose={
                this.state.showCloseEditorWarning
              }
              editorLabel={this.props.i18n.text.get(
                "plugin.evaluation.assignmentEvaluationDialog.interimLiteralAssessment"
              )}
              materialEvaluation={this.state.materialNode.evaluation}
              materialAssignment={this.state.materialNode.assignment}
              compositeReplies={compositeReply}
              isRecording={this.state.isRecording}
              onIsRecordingChange={this.handleIsRecordingChange}
              updateMaterialEvaluationData={this.updateMaterialEvaluationData}
              onClose={this.handleCloseSlideDrawer}
            />
          ) : null}
        </SlideDrawer>

        <AnimateHeight duration={400} height={contentOpen}>
          {this.state.isLoading ? (
            <div className="loader-empty" />
          ) : this.props.workspace && this.state.materialNode ? (
            <EvaluationMaterial
              material={this.state.materialNode}
              workspace={{
                ...this.props.workspace,
                interimEvaluationRequests: this.state
                  .interminEvaluationRequest && [
                  this.state.interminEvaluationRequest,
                ],
              }}
              compositeReply={compositeReply}
              userEntityId={this.props.selectedAssessment.userEntityId}
            />
          ) : null}

          {/* {!this.state.isLoading && this.state.interminEvaluationRequest && (
            <span
              className="material-page__ckeditor-replacement material-page__ckeditor-replacement--readonly"
              dangerouslySetInnerHTML={{
                __html: this.state.interminEvaluationRequest.requestText,
              }}
            />
          )} */}
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
)(EvaluationAssessmentInterminEvaluationRequest);
