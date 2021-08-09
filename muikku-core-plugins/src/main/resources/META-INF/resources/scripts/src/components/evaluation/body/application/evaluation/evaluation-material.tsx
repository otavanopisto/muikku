import * as React from "react";
import { MaterialContentNodeType, WorkspaceType } from "~/reducers/workspaces";
import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
} from "~/components/general/application-list";
import AnimateHeight from "react-animate-height";
import "~/sass/elements/evaluation.scss";
import { MaterialLoaderCorrectAnswerCounter } from "../../../../base/material-loader/correct-answer-counter";
import * as moment from "moment";
import {
  MaterialCompositeRepliesStateType,
  MaterialEvaluationInfo,
} from "../../../../../reducers/workspaces/index";
import { StateType } from "../../../../../reducers/index";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "../../../../../actions/index";
import { EvaluationState } from "../../../../../reducers/main-function/evaluation/index";
import SlideDrawer from "./slide-drawer";
import {
  MaterialCompositeRepliesType,
  MaterialEvaluationType,
} from "../../../../../reducers/workspaces/index";
import AssignmentEditor from "./editors/assignment-editor";
import { bindActionCreators } from "redux";
import { i18nType } from "../../../../../reducers/base/i18n";
import {
  UpdateOpenedAssignmentEvaluationId,
  updateOpenedAssignmentEvaluation,
} from "../../../../../actions/main-function/evaluation/evaluationActions";

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
  assignmentTypeClass = () => {
    if (this.props.material.assignment.assignmentType === "EVALUATED") {
      return "evaluated";
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
        return "grade--evaluated";
      } else if (
        compositeRepliesFromProps.state === "SUBMITTED" &&
        evaluationInfo &&
        evaluationInfo.type === "INCOMPLETE"
      ) {
        return "grade--supplemented";
      }
      return "grade--incomplete";
    }
  };

  /**
   * renderAssignmentStatus
   * @returns JSX.Element
   */
  renderAssignmentStatus = (
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
      const evaluatedGradeClassMod = this.assigmentGradeClass(
        compositeRepliesFromProps
      );

      return (
        <div className="assignment-status">
          {hasSubmitted === null ||
          (hasSubmitted !== null &&
            compositeRepliesInState.state === "WITHDRAWN") ? (
            <div className="assignment-not-done">
              <span className="assignment-not-done-label">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentNotDoneLabel"
                )}
              </span>
            </div>
          ) : (
            hasSubmitted && (
              <div className="assignment-done">
                <span className="assignment-done-label">
                  {this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.assignmentDoneLabel"
                  )}
                </span>
                <span className="assignment-done-data">
                  {moment(hasSubmitted).format("l")}
                </span>
              </div>
            )
          )}

          {evaluationDate && (
            <div className="assignment-evaluated">
              <span className="assignment-evaluated-label">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentEvaluatedLabel"
                )}
              </span>
              <span className="assignment-evaluated-data">
                {moment(evaluationDate).format("l")}
              </span>
            </div>
          )}

          {evaluatedWithGrade && (
            <div className={`assignment-grade ${evaluatedGradeClassMod}`}>
              <span className="assignment-grade-label">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentGradeLabel"
                )}
              </span>
              <span className="assignment-grade-data">
                {evaluationInfo.grade}
              </span>
            </div>
          )}

          {needsSupplementation && !supplementationDone && (
            <div className={`assignment-grade ${evaluatedGradeClassMod}`}>
              <span className="assignment-grade-data">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentEvaluatedIncompleteLabel"
                )}
              </span>
            </div>
          )}

          {supplementationDone && (
            <div className={`assignment-grade ${evaluatedGradeClassMod}`}>
              <span className="assignment-grade-data">
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
    const wrapperClassMod = this.assignmentTypeClass();
    const compositeReply =
      this.props.evaluation.evaluationCompositeReplies.data &&
      this.props.evaluation.evaluationCompositeReplies.data.find(
        (item) => item.workspaceMaterialId === this.props.material.assignment.id
      );

    return (
      <>
        <ApplicationListItem
          key={this.props.material.id}
          className={`application-list__item assignment ${
            this.props.material.evaluation ? "" : "state-NO-ASSESSMENT"
          }`}
        >
          <MaterialLoader
            material={this.props.material}
            workspace={this.props.workspace}
            readOnly
            loadCompositeReplies
            answersVisible
            modifiers="studies-material-page"
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
                  <ApplicationListItemHeader modifiers="evaluation-assignment">
                    <div
                      ref={(ref) => (this.myRef = ref)}
                      className="assignment-title-content"
                    >
                      <div
                        className={`assignment-title-wrapper ${wrapperClassMod}`}
                        onClick={this.handleOpenMaterialContent}
                      >
                        <div
                          className={`assignment-status-title ${evaluationTitleClassMod}`}
                        >
                          <span className="application-list__header-primary assignment-title">
                            {this.props.material.assignment.title}
                          </span>
                        </div>

                        {this.renderAssignmentStatus(
                          state.compositeRepliesInState,
                          props.compositeReplies
                        )}
                      </div>
                      <div className="assignment-functions">
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
                  </ApplicationListItemHeader>

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
        </ApplicationListItem>
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
