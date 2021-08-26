import * as React from "react";
import { MaterialContentNodeType, WorkspaceType } from "~/reducers/workspaces";
import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import {
  ApplicationListItemBody,
} from "~/components/general/application-list";
import AnimateHeight from "react-animate-height";
import "~/sass/elements/evaluation.scss";
import { MaterialLoaderCorrectAnswerCounter } from "~/components/base/material-loader/correct-answer-counter";
import * as moment from "moment";
import { StateType } from "~/reducers/index";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import SlideDrawer from "./slide-drawer";
import {
  MaterialCompositeRepliesType
} from "~/reducers/workspaces/index";
import AssignmentEditor from "./editors/assignment-editor";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import {
  UpdateOpenedAssignmentEvaluationId,
  updateOpenedAssignmentEvaluation,
} from "~/actions/main-function/evaluation/evaluationActions";

/**
 * EvaluationMaterialProps
 */
export interface EvaluationMaterialProps {
  i18n: i18nType;
  material: MaterialContentNodeType;
  workspace: WorkspaceType;
  evaluation: EvaluationState;
  updateOpenedAssignmentEvaluation: UpdateOpenedAssignmentEvaluationId;
}

/**
 * EvaluationMaterialState
 */
interface EvaluationMaterialState {
  height: number | string;
  openContent: boolean;
  openDrawer: boolean;
}

/**
 * EvaluationMaterial
 */
export class EvaluationMaterial extends React.Component<
  EvaluationMaterialProps,
  EvaluationMaterialState
> {
  private myRef: HTMLDivElement = undefined;

  /**
   * constructor
   * @param props
   */
  constructor(props: EvaluationMaterialProps) {
    super(props);

    this.state = {
      height: 0,
      openDrawer: false,
      openContent: false,
    };
  }

  /**
   * componentWillReceiveProps
   * @param nextProps
   */
  componentWillReceiveProps(nextProps: EvaluationMaterialProps) {
    if (
      nextProps.material.assignment.id !== this.props.material.assignment.id
    ) {
      this.setState({
        height: 0,
      });
    }
  }

  /**
   * createHtmlMarkup
   * This should sanitize html
   * @param htmlString string that contains html
   */
  createHtmlMarkup = (htmlString: string) => {
    return {
      __html: htmlString,
    };
  };

  /**
   * toggleOpened
   */
  handleOpenMaterialContent = () => {
    const { openContent } = this.state;

    this.setState({ openContent: !openContent });
  };

  /**
   * handleCloseSlideDrawer
   */
  handleCloseSlideDrawer = () => {
    this.props.updateOpenedAssignmentEvaluation({ assignmentId: undefined });

    this.setState({
      openDrawer: false,
    });
  };

  /**
   * handleOpenSlideDrawer
   */
  handleOpenSlideDrawer =
    (assignmentId: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (this.props.evaluation.openedAssignmentEvaluationId !== assignmentId) {
        this.props.updateOpenedAssignmentEvaluation({ assignmentId });
      }

      this.setState(
        {
          openDrawer: true,
        },
        () => this.handleExecuteScrollToElement()
      );
    };

  /**
   * handleExecuteScrollToElement
   */
  handleExecuteScrollToElement = () => {
    this.myRef.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * assignmentTypeClass
   * @returns string
   */
  materialTypeClass = () => {
    if (this.props.material.assignment.assignmentType === "EVALUATED") {
      return "assignment";
    }
    return "exercise";
  };

  /**
   * assigmentGradeClass
   * @param state
   * @returns classMod
   */
  assigmentGradeClass = (
    compositeRepliesFromProps?: MaterialCompositeRepliesType
  ) => {
    if (compositeRepliesFromProps) {
      const { evaluationInfo } = compositeRepliesFromProps;

      if (evaluationInfo && evaluationInfo.type !== "INCOMPLETE") {
        return "state-EVALUATED";
      } else if (
        compositeRepliesFromProps.state === "SUBMITTED" &&
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
   * @returns JSX.Element
   */
   renderAssignmentMeta = (
    compositeRepliesInState?: MaterialCompositeRepliesType,
    compositeRepliesFromProps?: MaterialCompositeRepliesType
  ) => {
    if (compositeRepliesInState && compositeRepliesFromProps) {
      const { evaluationInfo } = compositeRepliesFromProps;

      /**
       * Checking if assigments is submitted at all.
       * Its date string
       */
      const hasSubmitted =
        compositeRepliesInState && compositeRepliesInState.submitted;

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
        compositeRepliesFromProps.state === "SUBMITTED" && needsSupplementation;

      /**
       * Evaluation date if evaluated
       */
      const evaluationDate = evaluationInfo && evaluationInfo.date;

      /**
       * Grade class mod
       */
      const assignmentGradeClassMod = this.assigmentGradeClass(
        compositeRepliesFromProps
      );

      return (
        <div className="evaluation-modal__material-meta">
          {hasSubmitted === null ||
          (hasSubmitted !== null &&
            compositeRepliesInState.state === "WITHDRAWN") ? (
            <div className="evaluation-modal__material-meta-item">
              <span className="evaluation-modal__material-meta-item-data">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentNotDoneLabel"
                )}
              </span>
            </div>
          ) : (
            hasSubmitted && (
              <div className="evaluation-modal__material-meta-item">
                <span className="evaluation-modal__material-meta-item-label">
                  {this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.assignmentDoneLabel"
                  )}
                </span>
                <span className="evaluation-modal__material-meta-item-data">
                  {moment(hasSubmitted).format("l")}
                </span>
              </div>
            )
          )}

          {evaluationDate && (
            <div className="evaluation-modal__material-meta-item">
              <span className="evaluation-modal__material-meta-item-label">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentEvaluatedLabel"
                )}
              </span>
              <span className="evaluation-modal__material-meta-item-data">
                {moment(evaluationDate).format("l")}
              </span>
            </div>
          )}

          {evaluatedWithGrade && (
            <div className="evaluation-modal__material-meta-item">
              <span className="evaluation-modal__material-meta-item-label">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentGradeLabel"
                )}
              </span>
              <span className={`evaluation-modal__material-meta-item-data evaluation-modal__material-meta-item-data--grade ${assignmentGradeClassMod}`}>
                {evaluationInfo.grade}
              </span>
            </div>
          )}

          {needsSupplementation && !supplementationDone && (
            <div className="evaluation-modal__material-meta-item">
              <span className={`evaluation-modal__material-meta-item-data evaluation-modal__material-meta-item-data--grade ${assignmentGradeClassMod}`}>
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentEvaluatedIncompleteLabel"
                )}
              </span>
            </div>
          )}

          {supplementationDone && (
            <div className="evaluation-modal__material-meta-item">
              <span className={`evaluation-modal__material-meta-item-data evaluation-modal__material-meta-item-data--grade ${assignmentGradeClassMod}`}>
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
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const materialTypeClass = this.materialTypeClass();
    const compositeReply =
      this.props.evaluation.evaluationCompositeReplies.data &&
      this.props.evaluation.evaluationCompositeReplies.data.find(
        (item) => item.workspaceMaterialId === this.props.material.assignment.id
      );

    return (
      <>
        <div
          key={this.props.material.id}
          className={`evaluation-modal__material ${
            this.props.material.evaluation ? "" : "state-NO-ASSESSMENT"
          }`}
        >
          <MaterialLoader
            material={this.props.material}
            workspace={this.props.workspace}
            readOnly
            loadCompositeReplies
            answersVisible
            modifiers="evaluation-material-page"
            usedAs={"evaluationTool"}
            compositeReplies={compositeReply}
            userEntityId={
              this.props.evaluation.evaluationSelectedAssessmentId.userEntityId
            }
          >
            {(props, state, stateConfiguration) => {
              let evaluatedFunctionClassMod = "";
              let evaluationTitleClassMod = "";

              let contentOpen: string | number = 0;

              /**
               * Evaluation function class mod
               */
              if (
                props.compositeReplies &&
                props.compositeReplies.evaluationInfo &&
                props.compositeReplies.evaluationInfo.date &&
                (this.props.material.evaluation ||
                  (props.compositeReplies.evaluationInfo &&
                    props.compositeReplies.evaluationInfo.type ===
                      "INCOMPLETE"))
              ) {
                if (
                  props.compositeReplies.evaluationInfo &&
                  props.compositeReplies.evaluationInfo.grade
                ) {
                  evaluatedFunctionClassMod = "evaluated-graded";
                } else if (
                  props.compositeReplies.state === "SUBMITTED" &&
                  props.compositeReplies.evaluationInfo.type === "INCOMPLETE"
                ) {
                  evaluatedFunctionClassMod = "supplemented";
                } else {
                  evaluatedFunctionClassMod = "evaluated";
                }
              }

              if (
                this.state.openDrawer &&
                this.props.evaluation.openedAssignmentEvaluationId ===
                  props.material.assignment.id
              ) {
                /**
                 * Assigning class mod to evaluation material title if corresponding dialog is open
                 */
                evaluationTitleClassMod = "active-dialog";
              }

              if (
                this.state.openContent ||
                (this.state.openDrawer &&
                  this.props.evaluation.openedAssignmentEvaluationId ===
                    props.material.assignment.id)
              ) {
                /**
                 * Open invidual material content or if hitting evaluation button then that corresponding
                 * content and dialog together
                 */
                contentOpen = "auto";
              }

              return (
                <div>
                  <div className="evaluation-modal__material-header">
                    <div
                      ref={(ref) => (this.myRef = ref)}
                      onClick={this.handleOpenMaterialContent}
                      className={`evaluation-modal__material-header-title
                        evaluation-modal__material-header-title--${materialTypeClass}
                        ${evaluationTitleClassMod ?
                          "evaluation-modal__material-header-title--" + evaluationTitleClassMod
                          : ""}`}
                    >{this.props.material.assignment.title}

                      {this.renderAssignmentMeta(
                        state.compositeRepliesInState,
                        props.compositeReplies
                      )}
                    </div>
                    <div className="evaluation-modal__material-functions">
                      {props.material.assignment.assignmentType ===
                      "EVALUATED" ? (
                        state.compositeRepliesInState.state !==
                          "UNANSWERED" &&
                        state.compositeRepliesInState.state !== "WITHDRAWN" &&
                        state.compositeRepliesInState.submitted ? (
                          <div
                            onClick={this.handleOpenSlideDrawer(
                              props.material.assignment.id
                            )}
                            className={`assignment-evaluate-button icon-evaluate ${evaluatedFunctionClassMod}`}
                            title={this.props.i18n.text.get(
                              "plugin.evaluation.evaluationModal.evaluateAssignmentButtonTitle"
                            )}
                          />
                        ) : null
                      ) : (
                        state.compositeRepliesInState &&
                        state.compositeRepliesInState.submitted && (
                          <div
                            className="exercise-done-indicator icon-checkmark"
                            title={this.props.i18n.text.get(
                              "plugin.evaluation.evaluationModal.exerciseDoneIndicatorTitle"
                            )}
                          ></div>
                        )
                      )}
                    </div>

                    <SlideDrawer
                      title={this.props.material.assignment.title}
                      modifiers={["literal"]}
                      show={
                        this.state.openDrawer &&
                        this.props.evaluation.openedAssignmentEvaluationId ===
                          props.material.assignment.id
                      }
                      onClose={this.handleCloseSlideDrawer}
                    >
                      <AssignmentEditor
                        editorLabel={this.props.i18n.text.get(
                          "plugin.evaluation.evaluationModal.workspaceEvaluationForm.literalAssessmentLabel"
                        )}
                        materialEvaluation={props.material.evaluation}
                        materialAssignment={props.material.assignment}
                        compositeReplies={props.compositeReplies}
                        onClose={this.handleCloseSlideDrawer}
                      />
                    </SlideDrawer>
                  </div>

                  <AnimateHeight duration={400} height={contentOpen}>
                    {props.compositeReplies &&
                      props.compositeReplies.evaluationInfo &&
                      props.compositeReplies.evaluationInfo.text && (
                        <div className="assignment-literal-evaluation-wrapper">
                          <div className="assignment-literal-evaluation-label">
                            {this.props.i18n.text.get(
                              "plugin.evaluation.evaluationModal.assignmentLiteralEvaluationLabel"
                            )}
                          </div>
                          <div
                            className="assignment-literal-evaluation"
                            dangerouslySetInnerHTML={this.createHtmlMarkup(
                              props.compositeReplies.evaluationInfo.text
                            )}
                          />
                        </div>
                      )}
                    <ApplicationListItemBody modifiers="evaluation-assignment">
                      <MaterialLoaderContent
                        {...props}
                        {...state}
                        stateConfiguration={stateConfiguration}
                      />

                      <MaterialLoaderCorrectAnswerCounter
                        {...props}
                        {...state}
                      />
                    </ApplicationListItemBody>
                  </AnimateHeight>
                </div>
              );
            }}
          </MaterialLoader>
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
    evaluation: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ updateOpenedAssignmentEvaluation }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationMaterial);
